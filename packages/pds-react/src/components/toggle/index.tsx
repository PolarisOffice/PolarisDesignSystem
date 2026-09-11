'use client';

import { useState } from 'react';

import { color, font } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { ToggleProps, ToggleSize } from './types.js';

/**
 * PDS Figma `Component/Action → Toggle Switch` 실측.
 *
 * md 산문은 MD 52×30 / SM 40×24 로 적었지만 디자인은 35×20 이다 —
 * 치수는 디자인이 정본이라 이쪽을 따랐고, SM 은 같은 비율로 줄였다.
 */
const SIZES: Record<ToggleSize, { w: number; h: number; knob: number; pad: number }> = {
  md: { w: 35, h: 20, knob: 15, pad: 2.5 },
  sm: { w: 28, h: 16, knob: 12, pad: 2 },
};

const SHADOW_OFF = 'inset 1.004px 1.004px 2.008px rgba(0, 0, 0, 0.1)';
const SHADOW_ON = 'inset 0 1.875px 1.875px rgba(0, 0, 0, 0.15)';

function ToggleBase({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  className,
  ...rest
}: ToggleProps) {
  // 제어(checked)·비제어(defaultChecked) 둘 다 받는다
  const [inner, setInner] = useState(defaultChecked);
  const on = checked !== undefined ? checked : inner;
  const s = SIZES[size] ?? SIZES.md;

  const track: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: on ? 'flex-end' : 'flex-start',
    width: s.w,
    height: s.h,
    padding: s.pad,
    border: 'none',
    borderRadius: 99,
    // 꺼짐 트랙 — Figma 가 fill/normal 에 묶었다(2026-08-26 디자이너 반영). 다크 값이
        // 따라오므로 트랙이 #3b3b3b 로 어두워진다.
        background: on ? color.accentNormal : color.fillNormal,
    boxShadow: on ? SHADOW_ON : SHADOW_OFF,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 200ms ease-out',
    flexShrink: 0,
    ...(disabled ? { opacity: 0.38 } : null),
  };

  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={rest['aria-label']}
      disabled={disabled}
      onClick={() => {
        if (checked === undefined) setInner(!on);
        onChange?.(!on);
      }}
      style={track}
    >
      <span
        aria-hidden="true"
        // 손잡이는 accent 트랙(다크에서 안 뒤집힘) 위에 얹히므로 고정 흰색이다.
        // background-base 로 두면 다크에서 손잡이만 어두워진다.
        style={{ width: s.knob, height: s.knob, borderRadius: 99, background: color.staticWhite, flexShrink: 0 }}
      />
    </button>
  );

  // 레이블이 없으면 스위치 하나로 끝난다
  if (!label && !description) return <span className={className}>{control}</span>;

  return (
    <label
      className={className}
      style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {control}
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {label && (
          <span style={{ fontFamily: font.family, fontSize: font.body2Size, lineHeight: 1.5, color: color.labelNormal }}>
            {label}
          </span>
        )}
        {description && (
          <span style={{ fontFamily: font.family, fontSize: font.body3Size, lineHeight: 1.5, color: color.labelAssistive }}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

export const Toggle = withSupported(ToggleBase, { size: ['md', 'sm'], acceptsChildren: false });
