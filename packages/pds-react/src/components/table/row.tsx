'use client';

import { useState } from 'react';

import { color, motion } from '../../tokens.js';
import { Checkbox } from '../checkbox/index.js';
import { CELL_PAD_X, Clamp, EmptyValue, alignOf, cellBase, edges, srOnly } from './cell.js';

import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { TableColumn } from './types.js';

/** 여기서 시작한 클릭은 행 클릭으로 치지 않는다 — 셀 안 컨트롤이 제 일을 하게 */
const ROW_CLICK_IGNORE = 'button,a,input,label,select,textarea,[role="checkbox"],[data-row-click-ignore]';

export interface RowSelect {
  checked: boolean;
  disabled: boolean;
  label: string;
  onChange: (on: boolean) => void;
}

/** 선택 열 셀 — 체크박스 히트 영역(24)이 행 높이를 늘리지 않게 세로 padding 은 0 */
export const selectCellPad = `0 0 0 ${CELL_PAD_X}px`;

const isEmpty = (v: unknown) => v === null || v === undefined || v === '';

/**
 * 데이터 행. 호버·포커스 상태를 행마다 갖고 있어야 표 전체가 다시 그려지지 않는다.
 */
export function BodyRow<Row>({
  row,
  index,
  columns,
  last,
  divider,
  stickyFirst,
  stickyLeft,
  noHover,
  select,
  onRowClick,
}: {
  row: Row;
  index: number;
  columns: Array<TableColumn<Row>>;
  last: boolean;
  divider: boolean;
  stickyFirst: boolean;
  /** 첫 데이터 열의 left — 선택 열이 있으면 그 폭만큼 */
  stickyLeft: number;
  noHover: boolean;
  select?: RowSelect;
  onRowClick?: (row: Row, index: number) => void;
}) {
  const [hover, setHover] = useState(false);
  const [ring, setRing] = useState(false);

  // 선택 면(subFill·subFillHover)은 정본 토큰이 없는 리터럴 폴백이다 — tokens.ts 참고
  const bg = select?.checked
    ? hover
      ? color.subFillHover
      : color.subFill
    : hover
      ? color.interactionHover
      : color.backgroundBase;

  const total = columns.length + (select ? 1 : 0);
  // 키보드 포커스 표시 — tr 에는 링을 못 그려 셀마다 위·아래(+양 끝)를 안쪽 그림자로 잇는다
  const ringOf = (pos: number): string[] => {
    if (!ring) return [];
    const a = color.accentNormal;
    const s = [`inset 0 2px 0 ${a}`, `inset 0 -2px 0 ${a}`];
    if (pos === 0) s.push(`inset 2px 0 0 ${a}`);
    if (pos === total - 1) s.push(`inset -2px 0 0 ${a}`);
    return s;
  };

  const cell = (pos: number, opts: { divider: boolean; left?: number; boundary?: boolean }): CSSProperties => {
    const sticky = opts.left !== undefined;
    return {
      ...cellBase,
      background: bg,
      color: color.labelNormal,
      transition: `background-color ${motion.durationInstant} ${motion.easeOut}`,
      ...(sticky && { position: 'sticky', left: opts.left, zIndex: 1 }),
      // 마지막 행의 아래 선은 컨테이너 보더와 겹친다
      ...edges(sticky, { bottom: !last, left: opts.divider, right: opts.boundary }, ringOf(pos)),
    };
  };

  const interactive = !!onRowClick;
  const offset = select ? 1 : 0;

  return (
    <tr
      tabIndex={interactive ? 0 : undefined}
      onClick={
        interactive
          ? (e: MouseEvent<HTMLTableRowElement>) => {
              const hit = (e.target as Element).closest(ROW_CLICK_IGNORE);
              if (hit && e.currentTarget.contains(hit)) return;
              onRowClick(row, index);
            }
          : undefined
      }
      onKeyDown={
        interactive
          ? (e: KeyboardEvent<HTMLTableRowElement>) => {
              if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return;
              e.preventDefault(); // Space 가 페이지를 내리지 않게
              onRowClick(row, index);
            }
          : undefined
      }
      onMouseEnter={interactive && !noHover ? () => setHover(true) : undefined}
      onMouseLeave={interactive && !noHover ? () => setHover(false) : undefined}
      onFocus={interactive ? (e) => e.target === e.currentTarget && setRing(e.currentTarget.matches(':focus-visible')) : undefined}
      onBlur={interactive ? (e) => e.target === e.currentTarget && setRing(false) : undefined}
      style={{ cursor: interactive ? 'pointer' : undefined, outline: 'none' }}
    >
      {select && (
        <td
          data-row-click-ignore=""
          style={{ ...cell(0, { divider: false, left: stickyFirst ? 0 : undefined }), padding: selectCellPad }}
        >
          <Checkbox
            size="sm"
            checked={select.checked}
            disabled={select.disabled}
            onChange={select.onChange}
            label={<span style={srOnly}>{select.label}</span>}
          />
        </td>
      )}
      {columns.map((c, i) => {
        const value: unknown = c.render ? c.render(row, index) : c.key !== undefined ? row[c.key] : undefined;
        const first = stickyFirst && i === 0;
        return (
          <td
            key={c.id ?? c.key ?? i}
            style={{
              ...cell(i + offset, {
                // 선택 열과 첫 데이터 열 사이엔 긋지 않는다 — 선택 열은 컨트롤 자리다
                divider: divider && i > 0,
                left: first ? stickyLeft : undefined,
                boundary: first,
              }),
              textAlign: alignOf(c),
            }}
          >
            <Clamp
              lines={c.lines ?? 2}
              numeric={c.numeric}
              align={alignOf(c)}
              minWidth={c.minWidth}
              maxWidth={c.maxWidth}
            >
              {!c.render && isEmpty(value) ? <EmptyValue /> : (value as ReactNode)}
            </Clamp>
          </td>
        );
      })}
    </tr>
  );
}
