'use client';

import { useState } from 'react';

import { color, font, motion } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties, FocusEvent } from 'react';
import type { ChipProps, ChipSize } from './types.js';

/** 체크 표시 — × 와 같은 획(1.5, 둥근 끝). 16 격자에 그리고 크기는 아이콘 자리에 맞춘다 */
const CHECK_PATH = 'M3.5 8.2l3 3 6-6.4';

/**
 * PDS Figma `Component/Action → Chip` — 조건을 보여 주거나 고르는 알약 모양 칩.
 *
 * 1.2.0 개발 중 Badge 의 onRemove 옵션(표 툴바의 적용 필터 칩)으로 시작했다가, 발행 전에 독립 컴포넌트로
 * 뗐다(2026-10-13 디자인 결정). 종류는 둘이고 모양이 다르다(2026-10-14) — 성격이 다른 칩이 같은 모양이면
 * 눌리는 칩인지 알 수 없다:
 *  · default(조건 칩) — 걸린 조건·값을 보여 준다. 회색 면. 앞 아이콘(leftIcon)·지우기(onRemove)
 *  · select(선택 칩)  — 눌러서 켜고 끈다. 흰 면에 테두리, 켜지면 파란 면 + 앞에 체크(checkIcon 으로 끌 수 있다)
 * Badge(14px·굵게, 켜고 끄는 태그)는 그대로 남는다.
 *
 * md 는 Figma Filter Chip 실측(높이 28 · 13/500 · 여백 12, × 쪽 6). sm·아이콘 쪽 여백은 같은 비례로 정했다.
 */
const RADIUS = 99;
const PAD_Y = 4;
const ICON_GAP = 4;
const REMOVE_GAP = 2;

const SIZES: Record<
  ChipSize,
  { fontSize: string; line: number; padX: number; padIcon: number; padRemove: number; icon: number; removeBox: number; glyph: number }
> = {
  // 13px × 1.5 = 19.5 면 칩 높이가 27.5 가 된다 — 줄 높이를 px 로 박는다(20 + 8 = 28, 16 + 8 = 24)
  md: { fontSize: font.body3Size, line: 20, padX: 12, padIcon: 8, padRemove: 6, icon: 16, removeBox: 18, glyph: 14 },
  sm: { fontSize: font.caption1Size, line: 16, padX: 10, padIcon: 6, padRemove: 4, icon: 14, removeBox: 16, glyph: 12 },
};

/** 단추 기본 모양을 지운다 — 칩 안의 클릭 영역은 칩 글자 모양을 그대로 잇는다 */
const bare: CSSProperties = {
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'transparent',
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
};

/** 키보드 포커스(:focus-visible)일 때만 링을 그린다 — 마우스 클릭엔 없다 */
function useFocusRing() {
  const [on, setOn] = useState(false);
  return {
    style: { outline: on ? `2px solid ${color.accentNormal}` : 'none', outlineOffset: 1 } as CSSProperties,
    onFocus: (e: FocusEvent<HTMLButtonElement>) => setOn(e.currentTarget.matches(':focus-visible')),
    onBlur: () => setOn(false),
  };
}

function ChipBase({
  children,
  type = 'default',
  size = 'md',
  leftIcon,
  selected = false,
  checkIcon = true,
  onClick,
  onRemove,
  removeLabel,
  className,
}: ChipProps) {
  const s = SIZES[size] ?? SIZES.md;
  const bodyRing = useFocusRing();
  const removeRing = useFocusRing();
  const [removeHover, setRemoveHover] = useState(false);

  const select = type === 'select';
  const on = select && selected;
  // × 는 조건 칩에만 있다 — 선택 칩에 넘겨도 그리지 않는다
  const remove = select ? undefined : onRemove;
  // 켜진 선택 칩은 앞 자리에 체크를 둔다(leftIcon 을 대신한다)
  const lead = on && checkIcon ? (
    <svg width={s.icon} height={s.icon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={CHECK_PATH} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    leftIcon
  );

  const face: CSSProperties = on
    ? { background: color.subFill, color: color.accentNormal }
    : select
      ? // 테두리는 안쪽 그림자로 — border 로 그리면 높이가 2px 늘어난다
        { background: color.backgroundBase, color: color.labelNeutral, boxShadow: `inset 0 0 0 1px ${color.lineNormal}` }
      : { background: color.fillNormal, color: color.labelNeutral };

  const root: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    gap: REMOVE_GAP,
    padding: `${PAD_Y}px ${remove ? s.padRemove : s.padX}px ${PAD_Y}px ${lead ? s.padIcon : s.padX}px`,
    border: 'none',
    borderRadius: RADIUS,
    fontFamily: font.family,
    fontSize: s.fontSize,
    fontWeight: 500,
    lineHeight: `${s.line}px`,
    whiteSpace: 'nowrap',
    ...face,
  };

  const body = (
    <>
      {lead && (
        <span
          aria-hidden="true"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: s.icon, height: s.icon }}
        >
          {lead}
        </span>
      )}
      {children}
    </>
  );
  const bodyBox: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: ICON_GAP };
  // 선택 칩일 때만 눌림 상태를 알린다 — 조건 칩은 눌러도 그냥 버튼이다
  const pressed = select ? selected : undefined;

  if (!remove) {
    if (onClick) {
      return (
        <button
          type="button"
          onClick={onClick}
          aria-pressed={pressed}
          className={className}
          onFocus={bodyRing.onFocus}
          onBlur={bodyRing.onBlur}
          style={{ ...root, gap: ICON_GAP, cursor: 'pointer', ...bodyRing.style }}
        >
          {body}
        </button>
      );
    }
    return (
      <span className={className} style={{ ...root, gap: ICON_GAP }}>
        {body}
      </span>
    );
  }

  // `팀: {team}` 처럼 글자·숫자만 이어 붙인 children 도 이름으로 쓴다 — 칩마다 '해제' 로 같아지지 않게
  const parts = Array.isArray(children) ? children : [children];
  const text = parts.every((p) => typeof p === 'string' || typeof p === 'number') ? parts.join('') : '';
  const label = removeLabel ?? (text ? `${text} 해제` : '해제');
  const removeColor = removeHover ? color.labelNeutral : color.labelAlternative;

  return (
    // button 안에 button 을 둘 수 없다 — 바깥은 span, 본문 클릭 영역은 따로 둔다
    <span className={className} style={root}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          aria-pressed={pressed}
          onFocus={bodyRing.onFocus}
          onBlur={bodyRing.onBlur}
          style={{ ...bare, ...bodyBox, borderRadius: RADIUS, ...bodyRing.style }}
        >
          {body}
        </button>
      ) : (
        <span style={bodyBox}>{body}</span>
      )}
      <button
        type="button"
        aria-label={label}
        // 칩 본문(onClick)이나 바깥 핸들러로 번지지 않게 한다
        onClick={(e) => {
          e.stopPropagation();
          remove();
        }}
        onMouseEnter={() => setRemoveHover(true)}
        onMouseLeave={() => setRemoveHover(false)}
        onFocus={removeRing.onFocus}
        onBlur={removeRing.onBlur}
        style={{
          ...bare,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: s.removeBox,
          height: s.removeBox,
          borderRadius: RADIUS,
          color: removeColor,
          transition: `color ${motion.durationFast} ${motion.easeOut}`,
          ...removeRing.style,
        }}
      >
        <svg width={s.glyph} height={s.glyph} viewBox="0 0 14 14" aria-hidden="true" focusable="false">
          <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}

/** 선택 여부는 상호작용으로 정해지므로 축으로 선언하지 않는다 — 종류와 크기만 */
export const Chip = withSupported(ChipBase, { type: ['default', 'select'], size: ['md', 'sm'] });
