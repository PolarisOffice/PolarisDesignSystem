'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { color, motion, radius } from '../../tokens.js';
import { withSupported } from '../../supported.js';
import { Checkbox } from '../checkbox/index.js';
import { Skeleton } from '../skeleton/index.js';
import { SELECT_COL_WIDTH, alignOf, cellBase, edges, justifyOf, srOnly, useMedia } from './cell.js';
import { HeaderCell } from './header.js';
import { BodyRow, selectCellPad } from './row.js';

import type { ComponentType, CSSProperties } from 'react';
import type { SupportedProps } from '../../supported.js';
import type { TableProps, TableSortDirection } from './types.js';

export { TableEmpty } from './empty.js';

/**
 * PDS docs/components/table.md + Figma `Component/Contents → Table` 실측.
 *
 * 구조: 바깥 div(테두리·모서리 자르기만) > 스크롤러 div(가로 스크롤, maxHeight 면 세로도) > table.
 * 바깥에서 overflow 로 잘라내기만 하던 예전 구조는 넓은 표의 오른쪽이 보이지 않았다.
 */
const FADE = 24;
const SKELETON_WIDTHS = [70, 50, 80, 60];

function TableBase<Row>({
  columns,
  rows,
  columnDivider = false,
  rowKey,
  className,
  caption,
  'aria-label': ariaLabel,
  layout,
  sort,
  onSortChange,
  sortRequired = false,
  emptyState,
  loading = false,
  skeletonRows = 5,
  maxHeight,
  stickyFirstColumn = false,
  onRowClick,
  selectedKeys,
  onSelectedKeysChange,
  isRowSelectable,
  columnWidths,
  onColumnWidthsChange,
}: TableProps<Row>) {
  // 호버가 없는 기기는 호버 노출(행 호버·정렬 아이콘)을 볼 수 없다. 핸들은 손가락으로 잡기 어려워 굵은 포인터에선 뺀다
  const noHover = useMedia('(hover: none)');
  const coarse = useMedia('(pointer: coarse)');

  const ids = columns.map((c, i) => c.id ?? c.key ?? String(i));
  const keyOf = (row: Row, i: number) => rowKey?.(row, i) ?? String(i);
  const selecting = !!onSelectedKeysChange;
  const stickyTop = maxHeight !== undefined;
  const firstLeft = selecting ? SELECT_COL_WIDTH : 0;
  const hasSortable = columns.some((c) => c.sortable);

  // 개발 모드 경고 — 내용이 바뀔 때만 한 번씩
  const warnings: string[] = [];
  if (process.env.NODE_ENV !== 'production') {
    columns.forEach((c, i) => {
      if (c.id === undefined && c.key === undefined) warnings.push(`${i}번째 열에 id·key 가 없습니다 — render 전용 열은 id 를 주세요.`);
      if (c.resizable && typeof c.width !== 'number')
        warnings.push(`열 "${ids[i]}" 은 resizable 인데 width 가 숫자가 아닙니다 — 시작 폭을 첫 측정값으로 잡습니다.`);
    });
    if (!rowKey && (hasSortable || selecting))
      warnings.push('rowKey 없이 정렬·선택을 쓰면 인덱스가 키가 되어 정렬 뒤 행 상태가 섞입니다.');
    if (hasSortable && sort === undefined)
      warnings.push('sortable 열이 있는데 sort 를 주지 않았습니다 — 정렬 상태는 제어형입니다(정렬 없음은 null).');
  }
  const warnKey = warnings.join('\n');
  useEffect(() => {
    if (warnKey) for (const w of warnKey.split('\n')) console.warn(`[pds] Table: ${w}`);
  }, [warnKey]);

  // 열 너비 — 제어형(columnWidths)이 아니면 내부에 둔다. 끄는 동안의 값은 HeaderCell 이 col 에 직접 쓴다
  // (움직일 때마다 표 전체를 다시 그리면 행이 많을 때 끌기가 끊긴다)
  const [innerWidths, setInnerWidths] = useState<Record<string, number>>({});
  const widths = columnWidths ?? innerWidths;
  const widthOf = (id: string) => widths[id];
  const fixed = (layout ?? (columns.some((c) => c.resizable) ? 'fixed' : 'auto')) === 'fixed';
  // fixed 의 마지막 열은 col 폭을 비워 남는 폭을 받는다(모든 col 이 폭을 가지면 남는 폭이 열마다 나뉜다).
  // 대신 열 폭 합을 표 최소 폭으로 — 마지막 열의 폭은 최솟값으로 쓰인다. % 폭 열은 합에 넣지 않는다.
  const fixedMinWidth = fixed
    ? columns.reduce((sum, c, i) => {
        const w = widthOf(ids[i]) ?? c.width;
        return sum + (typeof w === 'number' ? w : 0);
      }, selecting ? SELECT_COL_WIDTH : 0) || undefined
    : undefined;
  const commitWidth = (id: string, w: number) => {
    const next = { ...widths, [id]: w };
    if (!columnWidths) setInnerWidths(next);
    onColumnWidthsChange?.(next);
  };

  // 정렬 순환: 미정렬 → sortFirst → 반대 → 해제(sortRequired 면 다시 sortFirst)
  const cycleSort = (id: string, first: TableSortDirection) => {
    const cur = sort?.key === id ? sort.direction : null;
    const opposite: TableSortDirection = first === 'asc' ? 'desc' : 'asc';
    const next = cur === null ? first : cur === first ? opposite : sortRequired ? first : null;
    onSortChange?.(next ? { key: id, direction: next } : null);
  };

  // 선택 — 헤더 체크박스는 지금 rows 의 선택 가능한 행만 다룬다(다른 페이지의 키는 그대로 둔다)
  const selected = new Set(selectedKeys ?? []);
  const pageKeys = selecting ? rows.flatMap((r, i) => ((isRowSelectable?.(r) ?? true) ? [keyOf(r, i)] : [])) : [];
  const allOn = pageKeys.length > 0 && pageKeys.every((k) => selected.has(k));
  const someOn = pageKeys.some((k) => selected.has(k));
  const toggleAll = () => {
    const cur = selectedKeys ?? [];
    const page = new Set(pageKeys);
    onSelectedKeysChange?.(allOn ? cur.filter((k) => !page.has(k)) : [...cur, ...pageKeys.filter((k) => !selected.has(k))]);
  };
  const rowLabel = (row: Row) => {
    const first = columns[0]?.key;
    const v = first !== undefined ? row[first] : undefined;
    return typeof v === 'string' && v ? `${v} 선택` : '행 선택';
  };

  /*
   * 가로로 넘칠 때만 스크롤 영역을 키보드로 잡을 수 있게 하고(region + tabIndex),
   * 더 볼 내용이 있는 쪽 가장자리를 흐리게 덮는다.
   */
  const scrollerRef = useRef<HTMLDivElement>(null);
  // 영역 이름은 caption 을 가리킨다 — caption 이 문자열이 아닌 노드여도 이름이 비지 않게
  const captionId = useId();
  const [edge, setEdge] = useState({ overflow: false, left: false, right: false });
  const [regionRing, setRegionRing] = useState(false);
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const overflow = el.scrollWidth > el.clientWidth + 1;
      const left = overflow && el.scrollLeft > 0;
      const right = overflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setEdge((p) => (p.overflow === overflow && p.left === left && p.right === right ? p : { overflow, left, right }));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    el.addEventListener('scroll', update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', update);
    };
  }, []);

  const total = columns.length + (selecting ? 1 : 0);
  /*
   * 헤더 쌓임 순서. sticky 헤더는 칸마다 쌓임 맥락이 생겨 뒤 칸이 앞 칸 너비 핸들의 오른쪽 절반(+4px)을
   * 덮는다 — 앞 칸일수록 위로 쌓고, 고정 열 모서리는 그보다 위(가로 스크롤 때 다른 헤더가 밑으로 지나간다).
   * 본문 고정 열은 1, sticky 아닌 헤더는 쌓임 맥락이 없어 핸들 자신의 z-index 1 로 충분하다.
   */
  const cornerZ = columns.length + 3;
  const headZ = (i: number, corner: boolean) =>
    stickyTop ? (corner ? cornerZ : columns.length + 2 - i) : corner ? 1 : undefined;
  const sticky = (left: number | undefined): CSSProperties =>
    left === undefined ? {} : { position: 'sticky', left, zIndex: 1 };
  const fade = (side: 'left' | 'right'): CSSProperties => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    [side]: 0,
    width: FADE,
    zIndex: 1,
    pointerEvents: 'none',
    background: `linear-gradient(to ${side}, transparent, ${color.backgroundBase})`,
  });

  const skeleton = Array.from({ length: skeletonRows }, (_, r) => {
    const bottom = r < skeletonRows - 1;
    return (
      <tr key={r}>
        {selecting && (
          <td
            style={{
              ...cellBase,
              padding: selectCellPad,
              background: color.backgroundBase,
              ...sticky(stickyFirstColumn ? 0 : undefined),
              ...edges(stickyFirstColumn, { bottom }),
            }}
          />
        )}
        {columns.map((c, i) => {
          const first = stickyFirstColumn && i === 0;
          return (
            <td
              key={ids[i]}
              style={{
                ...cellBase,
                background: color.backgroundBase,
                ...sticky(first ? firstLeft : undefined),
                ...edges(first, { bottom, left: columnDivider && i > 0, right: first }),
              }}
            >
              {/* 실제 행과 높이가 같게 한 줄 높이(1.5em) 상자 안에 둔다 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: justifyOf(alignOf(c)), height: '1.5em' }}>
                <Skeleton shape="text" height={16} width={`${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}%`} />
              </div>
            </td>
          );
        })}
      </tr>
    );
  });

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        border: `1px solid ${color.lineNeutral}`,
        borderRadius: radius.lg,
        overflow: 'hidden',
      }}
    >
      <div
        ref={scrollerRef}
        {...(edge.overflow && {
          role: 'region',
          ...(caption ? { 'aria-labelledby': captionId } : { 'aria-label': ariaLabel }),
          tabIndex: 0,
        })}
        onFocus={(e) => e.target === e.currentTarget && setRegionRing(e.currentTarget.matches(':focus-visible'))}
        onBlur={(e) => e.target === e.currentTarget && setRegionRing(false)}
        style={{
          // 셀들의 z-index 를 이 안에 가둔다 — 가장자리 흐림(z 1)이 고정 헤더 위에 얹히게
          position: 'relative',
          zIndex: 0,
          overflowX: 'auto',
          ...(stickyTop && { overflow: 'auto', maxHeight }),
          outline: regionRing ? `2px solid ${color.accentNormal}` : 'none',
          outlineOffset: -2,
        }}
      >
        <table
          aria-label={caption ? undefined : ariaLabel}
          aria-busy={loading || undefined}
          style={{
            width: '100%',
            // fixed 는 마지막 열이 남는 폭을 받으므로, 열 폭 합을 최소 폭으로 둬야 넘칠 때 가로 스크롤이 생긴다
            minWidth: fixedMinWidth,
            borderCollapse: 'collapse',
            tableLayout: fixed ? 'fixed' : 'auto',
          }}
        >
          {caption && (
            <caption id={captionId} style={srOnly}>
              {caption}
            </caption>
          )}
          <colgroup>
            {selecting && <col style={{ width: SELECT_COL_WIDTH }} />}
            {columns.map((c, i) => (
              <col key={ids[i]} style={{ width: fixed && i === columns.length - 1 ? undefined : (widthOf(ids[i]) ?? c.width) }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {selecting && (
                <th
                  scope="col"
                  style={{
                    ...cellBase,
                    padding: selectCellPad,
                    background: color.fillNeutral,
                    ...(stickyTop || stickyFirstColumn
                      ? {
                          position: 'sticky',
                          ...(stickyTop && { top: 0 }),
                          ...(stickyFirstColumn && { left: 0 }),
                          zIndex: headZ(-1, stickyFirstColumn),
                        }
                      : null),
                    ...edges(stickyTop || stickyFirstColumn, { bottom: true }),
                  }}
                >
                  <Checkbox
                    size="sm"
                    checked={allOn}
                    indeterminate={someOn && !allOn}
                    disabled={pageKeys.length === 0}
                    onChange={toggleAll}
                    label={<span style={srOnly}>전체 선택</span>}
                  />
                </th>
              )}
              {columns.map((c, i) => {
                const id = ids[i];
                const first = stickyFirstColumn && i === 0;
                const w = widthOf(id) ?? (typeof c.width === 'number' ? c.width : undefined);
                return (
                  <HeaderCell
                    key={id}
                    column={c}
                    last={i === columns.length - 1}
                    divider={columnDivider && i > 0}
                    stickyTop={stickyTop}
                    stickyLeft={first ? firstLeft : undefined}
                    boundary={first}
                    z={headZ(i, first)}
                    noHover={noHover}
                    coarse={coarse}
                    sortDir={c.sortable && sort?.key === id ? sort.direction : null}
                    onSort={c.sortable ? () => cycleSort(id, c.sortFirst ?? 'asc') : undefined}
                    width={w}
                    absorb={fixed && i === columns.length - 1}
                    onResizeEnd={(nw) => commitWidth(id, nw)}
                  />
                );
              })}
            </tr>
          </thead>
          <tbody
            style={{
              transition: `opacity ${motion.durationFast} ${motion.easeOut}`,
              // 이미 행이 있으면 지우지 않고 흐리게 — 새 데이터가 올 때까지 조작만 막는다
              ...(loading && rows.length > 0 && { opacity: 0.5, pointerEvents: 'none' }),
            }}
          >
            {rows.length > 0
              ? rows.map((row, r) => {
                  const k = keyOf(row, r);
                  const isOn = selected.has(k);
                  return (
                    <BodyRow
                      key={k}
                      row={row}
                      index={r}
                      columns={columns}
                      last={r === rows.length - 1}
                      divider={columnDivider}
                      stickyFirst={stickyFirstColumn}
                      stickyLeft={firstLeft}
                      noHover={noHover}
                      onRowClick={onRowClick}
                      select={
                        selecting
                          ? {
                              checked: isOn,
                              disabled: !(isRowSelectable?.(row) ?? true),
                              label: rowLabel(row),
                              onChange: (on) => {
                                const cur = selectedKeys ?? [];
                                if (on && !isOn) onSelectedKeysChange?.([...cur, k]);
                                else if (!on) onSelectedKeysChange?.(cur.filter((x) => x !== k));
                              },
                            }
                          : undefined
                      }
                    />
                  );
                })
              : loading
                ? skeleton
                : emptyState !== undefined &&
                  emptyState !== null && (
                    <tr>
                      <td
                        colSpan={total}
                        style={{
                          ...cellBase,
                          padding: '48px 24px',
                          textAlign: 'center',
                          background: color.backgroundBase,
                          color: color.labelNormal,
                        }}
                      >
                        {emptyState}
                      </td>
                    </tr>
                  )}
          </tbody>
        </table>
      </div>
      {/* 고정 열이 있으면 왼쪽 흐림은 고정 열을 덮기만 한다 — 경계선이 그 역할을 한다 */}
      {edge.left && !stickyFirstColumn && <span aria-hidden="true" style={fade('left')} />}
      {edge.right && <span aria-hidden="true" style={fade('right')} />}
    </div>
  );
}

/*
 * withSupported 의 반환형은 제네릭을 잃어 `<Table<Row>>` 처럼 행 타입을 줄 수 없게 된다 —
 * 정적 속성만 붙이고 원래 함수를 내보낸다. 축 값은 문자열 목록이라 'false'·'true' 로 적는다.
 */
withSupported(TableBase as ComponentType<TableProps<unknown>>, {
  acceptsChildren: false,
  columnDivider: ['false', 'true'],
});
export const Table = TableBase as typeof TableBase & { supportedProps?: SupportedProps };
