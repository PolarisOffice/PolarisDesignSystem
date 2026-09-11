'use client';

import { useState } from 'react';

import { color, radius } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { IconButtonProps, IconButtonSize } from './types.js';

/**
 * PDS docs/components — 레이블 없는 아이콘 전용 버튼.
 *
 * **반드시 tooltip 을 동반**하고 파괴적 액션에는 쓰지 않는다(레이블 있는 버튼을 쓴다).
 */
const SIZES: Record<IconButtonSize, { box: number; glyph: number }> = {
  40: { box: 40, glyph: 20 },
  32: { box: 32, glyph: 18 },
  28: { box: 28, glyph: 16 },
};

/** 아이콘을 안 넘겼을 때의 자리표시 — 문서 예제가 모양만 볼 때 쓴다 */
function Placeholder({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <circle cx="10" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

function IconButtonBase({ icon, size = 40, disabled, style, ...rest }: IconButtonProps) {
  const [hover, setHover] = useState(false);
  const s = SIZES[size] ?? SIZES[40];

  const face: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: s.box,
    height: s.box,
    padding: 0,
    border: 'none',
    borderRadius: radius.md,
    background: hover && !disabled ? color.interactionHover : 'transparent',
    color: color.labelNeutral,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 120ms ease-out',
    ...(disabled ? { opacity: 0.4 } : null),
    ...style,
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={face}
      {...rest}
    >
      {icon && typeof icon !== 'string' ? icon : <Placeholder size={s.glyph} />}
    </button>
  );
}

export const IconButton = withSupported(IconButtonBase, { size: [40, 32, 28], acceptsChildren: false });
