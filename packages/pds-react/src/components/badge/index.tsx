'use client';

import { color, font } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { BadgeProps, BadgeSize } from './types.js';

/**
 * PDS Figma `Component/Contents → badge` 실측.
 *
 * Selected 배경(#d9eaff)은 디자인에서 `color/po_blue/10` 을 가리킨다. 정본
 * 팔레트에 같은 이름이 없고 hex 가 같은 것은 format-word-hover 뿐인데, 포맷
 * 색은 그 포맷 맥락에서만 쓰는 규칙이라 빌려오지 않고 여기 남긴다.
 */
const PAD_X = 12;
const PAD_Y = 4;
const RADIUS = 99;

// 2026-10-19 sm 추가 — 표 셀에서 14px 배지가 본문(14px)보다 도드라져 12px 이 필요했다
const FONT_SIZE: Record<BadgeSize, string> = { md: font.body2Size, sm: font.caption1Size };
const LINE_HEIGHT: Record<BadgeSize, string> = { md: font.body2LineHeight, sm: font.caption1LineHeight };

const base: CSSProperties = {
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${PAD_Y}px ${PAD_X}px`,
  borderRadius: RADIUS,
  border: 'none',
  fontFamily: font.family,
  fontWeight: 500,
  whiteSpace: 'nowrap',
};

function BadgeBase({ children, selected = false, onClick, size = 'md', className }: BadgeProps) {
  const face: CSSProperties = {
    fontSize: FONT_SIZE[size],
    lineHeight: LINE_HEIGHT[size],
    ...(selected
      ? { background: color.subFill, color: color.accentNormal }
      : { background: color.fillNormal, color: color.labelAlternative }),
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={className}
        style={{ ...base, ...face, cursor: 'pointer' }}
      >
        {children}
      </button>
    );
  }
  return (
    <span className={className} style={{ ...base, ...face }}>
      {children}
    </span>
  );
}

/**
 * 견본은 라벨을 children 으로 넘긴다 — 그대로 받는다.
 * variant 축은 없다(선택 여부 하나). size 는 md·sm.
 */
export const Badge = withSupported(BadgeBase, { size: Object.keys(FONT_SIZE) });
