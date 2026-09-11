'use client';

import { color, font } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { BadgeProps } from './types.js';

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

const base: CSSProperties = {
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${PAD_Y}px ${PAD_X}px`,
  borderRadius: RADIUS,
  border: 'none',
  fontFamily: font.family,
  fontSize: font.body2Size,
  fontWeight: 700,
  lineHeight: 1.5,
  whiteSpace: 'nowrap',
};

function BadgeBase({ children, selected = false, onClick, className }: BadgeProps) {
  const face: CSSProperties = selected
    ? { background: color.subFill, color: color.accentNormal }
    : { background: color.fillNormal, color: color.labelAlternative };

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
 * variant/size 축은 없으므로(선택 여부 하나) 지원 목록도 비운다.
 */
export const Badge = withSupported(BadgeBase, {});
