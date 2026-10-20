'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { color, font } from '../../tokens.js';
import { Tooltip } from '../tooltip/index.js';

import type { CSSProperties, ReactNode } from 'react';
import type { TableAlign, TableColumn } from './types.js';

/**
 * 셀 padding 은 최소 24/12 를 지키고, 그 이상은 콘텐츠 길이를 보고 정한다.
 * 화면 너비가 충분하지 않으면(모바일) 표 자체를 쓰지 않는다.
 *
 * 1.2.1: 세로 padding 16 → 12, 머리글 13px(body3, header.tsx). 실제 목록 화면에서 행이 너무 높았다 — Figma Table Cell 과 같은 값.
 */
export const CELL_PAD_X = 24;
export const CELL_PAD_Y = 12;
/** 선택 열 — 왼쪽 padding 24 + 체크박스(sm) 히트 영역 24 */
export const SELECT_COL_WIDTH = 48;

export const cellBase: CSSProperties = {
  boxSizing: 'border-box',
  padding: `${CELL_PAD_Y}px ${CELL_PAD_X}px`,
  fontFamily: font.family,
  // 14px(body2). 1.1.0 까지 16px(body1)이었다 — 칸이 많은 표에서 글자가 커 보여 1.2.0 에서 낮췄다
  fontSize: font.body2Size,
  fontWeight: 500,
  lineHeight: 1.5,
};

/** 화면엔 숨기고 스크린 리더엔 읽힌다 */
export const srOnly: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const LINE = `1px solid ${color.lineNeutral}`;

/**
 * 셀의 선. sticky 셀은 collapse 테두리가 셀을 따라 움직이지 않아(표가 원래 자리에 그린다)
 * 같은 선을 inset box-shadow 로 그린다. right 는 고정 열의 오른쪽 경계로, 항상 그림자다.
 * extra(키보드 포커스 링 등)는 선보다 위에 깔린다.
 */
export function edges(
  sticky: boolean,
  e: { bottom?: boolean; left?: boolean; right?: boolean },
  extra: string[] = [],
): CSSProperties {
  const shadows = [...extra];
  if (sticky && e.bottom) shadows.push(`inset 0 -1px 0 ${color.lineNeutral}`);
  if (sticky && e.left) shadows.push(`inset 1px 0 0 ${color.lineNeutral}`);
  if (e.right) shadows.push(`inset -1px 0 0 ${color.lineNeutral}`);
  return {
    borderBottom: !sticky && e.bottom ? LINE : 'none',
    ...(!sticky && e.left ? { borderLeft: LINE } : null),
    ...(shadows.length ? { boxShadow: shadows.join(', ') } : null),
  };
}

export const alignOf = <Row,>(c: TableColumn<Row>): TableAlign => c.align ?? (c.numeric ? 'right' : 'center');

export const justifyOf = (a: TableAlign) => (a === 'left' ? 'flex-start' : a === 'right' ? 'flex-end' : 'center');

/** 헤더 문구 등에서 aria 이름으로 쓸 문자열만 꺼낸다 */
export const textOf = (n: ReactNode): string | undefined =>
  typeof n === 'string' || typeof n === 'number' ? String(n) : undefined;

/** matchMedia 한 줄 — SSR·첫 렌더는 false 로 시작한다 */
export function useMedia(query: string): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return match;
}

export type Lines = number | 'all';

/**
 * 줄바꿈은 어절 단위(keep-all)로 하고, 긴 URL·ID 처럼 끊을 곳이 없는 것만 글자 단위로 끊는다.
 * anywhere 는 쓰지 않는다 — 열이 글자 한 개 폭까지 줄어들 수 있게 되어 가로 스크롤이 생기지 않는다.
 */
function clampStyle(lines: Lines, numeric: boolean): CSSProperties {
  if (numeric) return { whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' };
  const wrap: CSSProperties = { wordBreak: 'keep-all', overflowWrap: 'break-word' };
  if (lines === 'all') return wrap;
  if (lines <= 1) return { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
  return { ...wrap, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: lines, overflow: 'hidden' };
}

/**
 * 셀 내용 래퍼 — 줄 수 제한·min/max 폭을 맡고, 실제로 잘린 글자 셀만 호버하면 전체를 툴팁으로 보여 준다.
 *
 * 잘림 판정은 pointerenter 에서 하고 flushSync 로 바로 반영한다. pointerenter 갱신은 연속 입력
 * 우선순위라 그대로 두면 다음 태스크에 커밋되어, 뒤이어 오는 mouseenter(툴팁의 열기 트리거) 때는
 * 아직 disabled 다 — 첫 호버에 툴팁이 뜨지 않는다. 손가락(touch)은 툴팁을 볼 수 없어 판정하지 않는다.
 * 툴팁은 표의 overflow 에 잘리지 않게 portal 로 띄운다.
 *
 * 툴팁은 글자 내용일 때만 붙인다 — render 결과(링크·배지·버튼)를 툴팁 안에 복제하지 않고(Tooltip
 * 계약), 트리거 span(inline-flex)이 render 결과의 % 폭을 내용 폭으로 바꾸지 않게 그런 셀은 잘라 두기만 한다.
 *
 * 한계: 키보드 포커스로는 툴팁을 열지 않는다(셀이 포커스 대상이 아니다). 줄 수 제한은 CSS 라
 * 스크린 리더는 전체 텍스트를 읽는다. 한 줄 말줄임은 auto 레이아웃에서 열이 내용만큼 넓어지므로
 * maxWidth 나 fixed 레이아웃과 함께일 때만 실제로 잘린다.
 */
export function Clamp({
  lines,
  numeric = false,
  align,
  minWidth,
  maxWidth,
  children,
}: {
  lines: Lines;
  numeric?: boolean;
  align: TableAlign;
  minWidth?: number;
  maxWidth?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cut, setCut] = useState(false);
  const tip = !numeric && lines !== 'all' ? textOf(children) : undefined;

  const body = (
    <div
      ref={ref}
      data-pds-clamp=""
      onPointerEnter={
        tip !== undefined
          ? (e) => {
              const el = ref.current;
              if (!el) return;
              const next =
                e.pointerType !== 'touch' &&
                (lines !== 'all' && lines <= 1 ? el.scrollWidth > el.clientWidth : el.scrollHeight > el.clientHeight);
              if (next !== cut) flushSync(() => setCut(next));
            }
          : undefined
      }
      style={{
        minWidth,
        maxWidth,
        // maxWidth 로 좁아진 블록도 열 정렬을 따른다
        ...(maxWidth !== undefined && {
          marginLeft: align === 'left' ? undefined : 'auto',
          marginRight: align === 'center' ? 'auto' : undefined,
        }),
        ...clampStyle(lines, numeric),
      }}
    >
      {children}
    </div>
  );

  if (tip === undefined) return body;
  return (
    <Tooltip content={tip} portal disabled={!cut}>
      {body}
    </Tooltip>
  );
}

/** 빈 값 — 화면엔 '-', 스크린 리더엔 '값 없음' */
export function EmptyValue() {
  return (
    <>
      <span aria-hidden="true" style={{ color: color.labelAssistive }}>
        -
      </span>
      <span style={srOnly}>값 없음</span>
    </>
  );
}
