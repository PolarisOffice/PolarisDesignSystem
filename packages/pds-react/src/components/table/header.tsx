'use client';

import { useEffect, useRef, useState } from 'react';

import { color, font, motion, radius } from '../../tokens.js';
import { SortAscIcon, SortDescIcon, SortIcon } from '../../icons/index.js';
import { CELL_PAD_X, CELL_PAD_Y, Clamp, alignOf, cellBase, edges, justifyOf, textOf } from './cell.js';

import type { TableColumn, TableSortDirection } from './types.js';

const SORT_ICON = 18;
const SORT_GAP = 4;
/** 열 너비 조정 — 경계 좌우 4px 씩의 히트 영역, 키 한 번에 10px(Shift 40px) */
const HANDLE = 8;
const BAR_INSET = 12;
const MIN_W = 80;
const MAX_W = 640;
const STEP = 10;
const STEP_BIG = 40;
/** 끄는 중인 헤더 — 세로선이 옆 칸에 덮이지 않게 맨 위로 */
const DRAG_Z = 1000;

/**
 * 더블클릭 '내용에 맞춤' — 헤더와 지금 그려진 셀들의 내용을 한 줄로 폈을 때의 폭.
 * 셀 안에 복제본을 잠깐 붙여 재므로 글꼴·굵기는 실제와 같다.
 */
function fitWidth(th: HTMLTableCellElement): number {
  const table = th.closest('table');
  const idx = th.cellIndex;
  const cells: HTMLTableCellElement[] = [th];
  for (const row of Array.from(table?.tBodies[0]?.rows ?? [])) {
    const cell = row.cells[idx];
    // 빈 상태 행(colSpan)은 셀이 하나뿐이라 건너뛴다
    if (cell && cell.colSpan === 1) cells.push(cell);
  }
  let max = 0;
  for (const cell of cells) {
    const src = cell.querySelector('[data-pds-clamp]');
    if (!src) continue;
    const probe = src.cloneNode(true) as HTMLElement;
    probe.style.cssText +=
      ';position:absolute;visibility:hidden;display:inline-block;width:auto;min-width:0;max-width:none;white-space:nowrap';
    cell.appendChild(probe);
    max = Math.max(max, probe.getBoundingClientRect().width);
    probe.remove();
  }
  return max + CELL_PAD_X * 2;
}

/**
 * 헤더 셀 — 정렬 버튼과 너비 조정 핸들을 맡는다.
 *
 * 정렬 버튼의 호버·누름 배경은 th 에 칠한다. 버튼에 칠하면 sticky 헤더의 아래 선(inset 그림자)을
 * 버튼 면이 덮는다.
 */
export function HeaderCell<Row>({
  column: c,
  last,
  divider,
  stickyTop,
  stickyLeft,
  boundary,
  z,
  noHover,
  coarse,
  sortDir,
  onSort,
  width,
  absorb,
  onResizeEnd,
}: {
  column: TableColumn<Row>;
  /** 마지막 열 — 핸들이 표 밖으로 나가 가로 스크롤을 만들지 않게 안쪽에 붙인다 */
  last: boolean;
  divider: boolean;
  stickyTop: boolean;
  stickyLeft?: number;
  /** 고정 열의 오른쪽 경계 */
  boundary: boolean;
  /** 쌓임 순서 — 표가 정한다(sticky 헤더는 앞 칸일수록 위) */
  z?: number;
  noHover: boolean;
  coarse: boolean;
  sortDir: TableSortDirection | null;
  /** sortable 열에만 */
  onSort?: () => void;
  /** 지금 열 너비(px)를 알면 — 끌기 시작점 */
  width?: number;
  /**
   * fixed 레이아웃의 마지막 열 — col 폭을 비워 남는 폭을 받는다. 끄는 동안에도 col 에 폭을 쓰지 않는다
   * (쓰면 모든 col 이 폭을 가져 남는 폭이 열마다 나뉘고, 경계가 커서를 따라오지 않는다)
   */
  absorb?: boolean;
  onResizeEnd: (w: number) => void;
}) {
  const thRef = useRef<HTMLTableCellElement>(null);
  const [thHover, setThHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [ring, setRing] = useState(false);

  const [handleHover, setHandleHover] = useState(false);
  const [handleRing, setHandleRing] = useState(false);
  const [measured, setMeasured] = useState<number | null>(null);
  const [dragW, setDragW] = useState<number | null>(null);
  const [tableH, setTableH] = useState(0);
  /** col — 끄는 동안의 폭은 표 전체를 다시 그리지 않고 이 요소에만 직접 쓴다. prev 는 끝나면 되돌릴 원래 값 */
  const drag = useRef<{
    x: number;
    from: number;
    w: number;
    moved: boolean;
    col?: HTMLElement;
    prev: string;
    /** 표 최소 폭(열 폭 합) — 끄는 만큼 같이 늘려야 넓힐 때 가로 스크롤이 생긴다 */
    table?: HTMLElement;
    prevMin: string;
  } | null>(null);

  const align = alignOf(c);
  const sticky = stickyTop || stickyLeft !== undefined;
  const resizable = !!c.resizable && !coarse;
  const min = c.minWidth ?? MIN_W;
  const max = c.maxWidth ?? MAX_W;
  const clampW = (w: number) => Math.round(Math.min(max, Math.max(min, w)));

  // aria-valuenow·시작 폭이 숫자 너비를 모를 때 쓸 실측값
  useEffect(() => {
    const th = thRef.current;
    if (!resizable || !th) return;
    const update = () => setMeasured(th.getBoundingClientRect().width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(th);
    return () => ro.disconnect();
  }, [resizable]);

  const start = () => width ?? measured ?? thRef.current?.getBoundingClientRect().width ?? min;
  const tableHeight = () => thRef.current?.closest('table')?.offsetHeight ?? 0;

  const endDrag = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    setDragW(null);
    // React 가 아는 값으로 되돌린 뒤 확정한다 — 제어형이 바꾸지 않으면 원래 폭으로 돌아간다
    if (d.col) d.col.style.width = d.prev;
    if (d.table) d.table.style.minWidth = d.prevMin;
    if (d.moved) onResizeEnd(d.w);
  };

  const content = (
    <Clamp lines={2} align={align} minWidth={c.minWidth} maxWidth={c.maxWidth}>
      {c.header}
    </Clamp>
  );

  const SortGlyph = sortDir === 'asc' ? SortAscIcon : sortDir === 'desc' ? SortDescIcon : SortIcon;
  const icon = (
    <SortGlyph
      size={SORT_ICON}
      style={{
        flexShrink: 0,
        // 정렬 중이든 아니든 같은 회색 — labelAssistive 는 헤더 배경 위 대비가 3:1 에 못 미친다
        color: color.labelAlternative,
        // 정렬 안 된 열의 아이콘은 호버·키보드 포커스 때만 — 터치 기기는 호버가 없어 늘 보인다
        opacity: sortDir || btnHover || ring || noHover ? 1 : 0,
        transition: `opacity ${motion.durationFast} ${motion.easeOut}`,
      }}
    />
  );

  const dragging = dragW !== null;
  const barColor = handleHover || handleRing ? color.accentNormal : thHover ? color.lineNormal : undefined;

  return (
    <th
      ref={thRef}
      scope="col"
      aria-sort={sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : undefined}
      onMouseEnter={resizable ? () => setThHover(true) : undefined}
      onMouseLeave={resizable ? () => setThHover(false) : undefined}
      style={{
        ...cellBase,
        ...(onSort && { padding: 0 }),
        position: sticky ? 'sticky' : 'relative',
        ...(stickyTop && { top: 0 }),
        ...(stickyLeft !== undefined && { left: stickyLeft }),
        zIndex: dragging ? DRAG_Z : z,
        // 헤더는 회색 단계로 데이터 행과 구분한다
        background: pressed ? color.interactionPressed : btnHover ? color.interactionHover : color.fillNeutral,
        color: sortDir ? color.labelNormal : color.labelNeutral,
        textAlign: align,
        transition: `background-color ${motion.durationInstant} ${motion.easeOut}`,
        ...edges(sticky, { bottom: true, left: divider, right: boundary }),
      }}
    >
      {onSort ? (
        <button
          type="button"
          onClick={onSort}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => {
            setBtnHover(false);
            setPressed(false);
          }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onFocus={(e) => setRing(e.currentTarget.matches(':focus-visible'))}
          onBlur={() => setRing(false)}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: justifyOf(align),
            gap: SORT_GAP,
            width: '100%',
            margin: 0,
            padding: `${CELL_PAD_Y}px ${CELL_PAD_X}px`,
            border: 'none',
            background: 'transparent',
            font: 'inherit',
            color: 'inherit',
            textAlign: align,
            cursor: 'pointer',
            outline: ring ? `2px solid ${color.accentNormal}` : 'none',
            outlineOffset: -2,
          }}
        >
          {/* 오른쪽 정렬 열은 아이콘을 글자 왼쪽에 — 숫자 끝선이 열마다 맞는다 */}
          {align === 'right' && icon}
          {content}
          {align !== 'right' && icon}
        </button>
      ) : (
        content
      )}

      {resizable && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-valuenow={Math.round(dragW ?? width ?? measured ?? min)}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={`${textOf(c.header) ?? ''} 열 너비`.trim()}
          tabIndex={0}
          onMouseEnter={() => setHandleHover(true)}
          onMouseLeave={() => setHandleHover(false)}
          onFocus={(e) => setHandleRing(e.currentTarget.matches(':focus-visible'))}
          onBlur={() => setHandleRing(false)}
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            e.preventDefault(); // 끄는 동안 글자 선택 방지
            e.currentTarget.setPointerCapture(e.pointerId);
            const from = start();
            // colgroup 의 col 은 선택 열까지 th 와 같은 순서다
            const table = thRef.current?.closest('table') ?? undefined;
            const col = absorb
              ? undefined
              : (table?.querySelector('colgroup')?.children[thRef.current!.cellIndex] as HTMLElement | undefined);
            drag.current = {
              x: e.clientX,
              from,
              w: from,
              moved: false,
              col,
              prev: col?.style.width ?? '',
              table,
              prevMin: table?.style.minWidth ?? '',
            };
            setTableH(tableHeight());
            setDragW(from);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            const w = clampW(d.from + e.clientX - d.x);
            if (w === d.w) return;
            d.w = w;
            d.moved = true;
            if (d.col) d.col.style.width = `${w}px`;
            if (d.table && d.prevMin) d.table.style.minWidth = `${parseFloat(d.prevMin) + w - d.from}px`;
            setDragW(w);
            setTableH(tableHeight());
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={() => {
            const th = thRef.current;
            if (th) onResizeEnd(clampW(fitWidth(th) + (onSort ? SORT_ICON + SORT_GAP : 0)));
          }}
          onKeyDown={(e) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            e.preventDefault();
            const step = (e.shiftKey ? STEP_BIG : STEP) * (e.key === 'ArrowLeft' ? -1 : 1);
            onResizeEnd(clampW(start() + step));
          }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: last ? 0 : -HANDLE / 2,
            width: HANDLE,
            zIndex: 1,
            cursor: 'col-resize',
            touchAction: 'none',
            outline: 'none',
          }}
        >
          {!dragging && barColor && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: BAR_INSET,
                bottom: BAR_INSET,
                width: barColor === color.lineNormal ? 1 : 2,
                background: barColor,
                ...(last ? { right: 0 } : { left: '50%', transform: 'translateX(-50%)' }),
              }}
            />
          )}
        </div>
      )}

      {dragging && (
        <>
          {/* 표 높이 전체를 가르는 선 — 셀 경계에 중심을 맞춘다 */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              right: last ? 0 : -1,
              width: 2,
              height: tableH,
              background: color.accentNormal,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              right: 8,
              transform: 'translateY(-50%)',
              padding: '2px 6px',
              borderRadius: radius.xxs,
              background: color.accentNormal,
              color: color.staticWhite,
              fontFamily: font.family,
              fontSize: font.caption1Size,
              fontWeight: 700,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            {dragW}
          </span>
        </>
      )}
    </th>
  );
}
