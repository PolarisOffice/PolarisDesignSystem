'use client';

import { useEffect, useRef, useState } from 'react';

import { color, font, motion, radius } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { CheckboxProps } from './types.js';

/**
 * PDS Figma `Component/Action → checkbox` 실측.
 * 컨트롤 21×21 은 전 브레이크포인트 공통이고, 32×32 는 히트 영역이다.
 */
const HIT = 32;
const BOX = 21;
/** 2026-08-28 Figma Radius 표 — Checkbox 는 radius-xs(6). 이전 실측 6.8 리터럴을 토큰으로 */
const BOX_RADIUS = radius.xs;
const BORDER = 2;
/**
 * 히트 영역(32)이 박스(21)보다 양옆 5.5px 넓어 그것만으로 레이블이 충분히 떨어진다 —
 * 여기에 gap 을 더하면 벌어져 보인다. 2026-09-01 디자인 결정으로 10 → 0.
 */
const LABEL_GAP = 0;

const boxBase: CSSProperties = {
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: BOX,
  height: BOX,
  borderRadius: BOX_RADIUS,
  flexShrink: 0,
};

function CheckboxBase({
  checked,
  defaultChecked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  tone = 'brand',
  label,
  className,
}: CheckboxProps) {
  const tint = tone === 'ai' ? color.aiNormal : color.accentNormal;
  const inputRef = useRef<HTMLInputElement>(null);
  // 제어(checked)·비제어(defaultChecked) 둘 다 받는다 — 문서 예제는 후자를 쓴다
  const [inner, setInner] = useState(defaultChecked);
  const current = checked !== undefined ? checked : inner;
  const on = indeterminate || current;

  // indeterminate 는 DOM 프로퍼티로만 설정된다(속성이 아니다)
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: label ? LABEL_GAP : 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        userSelect: 'none',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: HIT, height: HIT, flexShrink: 0 }}>
        <input
          ref={inputRef}
          type="checkbox"
          checked={current}
          disabled={disabled}
          onChange={(e) => {
            if (checked === undefined) setInner(e.currentTarget.checked);
            onChange?.(e.currentTarget.checked);
          }}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
        <span
          aria-hidden="true"
          style={{
            ...boxBase,
            // 체크될 때 면·테두리가 같은 박자로 바뀌게 (즉시 튀면 클릭이 거칠게 느껴진다)
            transition: `background-color ${motion.durationFast} ${motion.easeOut}, border-color ${motion.durationFast} ${motion.easeOut}`,
            ...(on
              ? { background: tint }
              : { border: `${BORDER}px solid ${color.lineNormal}` }),
          }}
        >
          {indeterminate ? (
            <span style={{ width: 12, height: 2, borderRadius: 2, background: color.staticWhite }} />
          ) : (
            current && (
              <svg width="11" height="8" viewBox="0 0 11 8" focusable="false">
                <path
                  d="M1 4L4.1 7L10 1"
                  stroke={color.staticWhite}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            )
          )}
        </span>
      </span>
      {label && (
        <span style={{ fontFamily: font.family, fontSize: font.body2Size, lineHeight: 1.5, color: color.labelNormal }}>
          {label}
        </span>
      )}
    </label>
  );
}

export const Checkbox = withSupported(CheckboxBase, {
  tone: ['brand', 'ai'],
  acceptsChildren: false,
});
