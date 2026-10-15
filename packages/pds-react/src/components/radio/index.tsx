'use client';

import { Children, cloneElement, isValidElement, useState } from 'react';

import { color, font, motion } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { RadioGroupProps, RadioProps } from './types.js';

/**
 * PDS Figma `Component/Action → radio-btn` 실측.
 *
 * md 는 21px 링(두께 2px) 안에 지름 8px 점 · 히트 영역 32. 2026-09-01 디자이너 피드백으로 7.9 → 8.
 * sm 은 16px 링 안에 지름 6px 점 · 히트 영역 24 — Checkbox sm 과 같은 축(표처럼 14px 글자 옆, Figma Size=16).
 *
 * 점은 CSS 박스가 아니라 svg circle 로 그린다 — 링 안쪽 폭이 17px(홀수)라 8px 점을 flex 로 가운데
 * 놓으면 4.5px 반픽셀 오프셋이 생겨 한쪽으로 치우쳐 보인다. svg 는 중심 좌표(10.5)를 기준으로
 * 대칭 안티에일리어싱하므로 어느 배율에서도 정중앙.
 */
const SIZES = {
  md: { hit: 32, box: 21, dot: 8 },
  sm: { hit: 24, box: 16, dot: 6 },
} as const;
const BORDER = 2;
/**
 * 링 오른쪽 끝에서 레이블까지의 거리(2026-10-12 디자인 결정 — md·sm 같다, Checkbox 와 같은 값).
 * 링(21)이 히트 영역(32) 한가운데면 양옆이 5.5 라 거리가 정수로 안 떨어진다 — 링을 왼쪽 5 에 놓고
 * (오른쪽 6) 나머지를 gap 으로 채워 어느 배율에서도 정확히 8 이 되게 한다. (이전 값은 gap 10)
 */
const LABEL_DISTANCE = 8;

function RadioBase({
  checked = false,
  onChange,
  disabled = false,
  tone = 'brand',
  size = 'md',
  label,
  name,
  value,
  className,
}: RadioProps) {
  const tint = tone === 'ai' ? color.aiNormal : color.accentNormal;
  const { hit, box, dot } = SIZES[size];
  const insetLeft = Math.floor((hit - box) / 2);
  const insetRight = hit - box - insetLeft;

  return (
    <label
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: label ? LABEL_DISTANCE - insetRight : 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        userSelect: 'none',
      }}
    >
      <span
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: insetLeft,
          width: hit,
          height: hit,
          flexShrink: 0,
        }}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.currentTarget.checked)}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
        <span
          aria-hidden="true"
          style={{
            boxSizing: 'border-box',
            position: 'relative',
            display: 'block',
            width: box,
            height: box,
            borderRadius: '50%',
            border: `${BORDER}px solid ${checked ? tint : color.lineNormal}`,
            transition: `border-color ${motion.durationFast} ${motion.easeOut}`,
            flexShrink: 0,
          }}
        >
          {checked && (
            <svg
              width={box}
              height={box}
              viewBox={`0 0 ${box} ${box}`}
              focusable="false"
              style={{ position: 'absolute', top: -BORDER, left: -BORDER, display: 'block' }}
            >
              <circle cx={box / 2} cy={box / 2} r={dot / 2} fill={tint} />
            </svg>
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

export const Radio = withSupported(RadioBase, {
  tone: ['brand', 'ai'],
  size: ['md', 'sm'],
  acceptsChildren: false,
});

/**
 * 라디오 묶음. 자식 `<Radio>` 에 name·선택 상태·tone 을 내려준다 —
 * 낱개로 쓰면 name 을 손으로 맞춰야 하고, 빠뜨리면 서로 다른 그룹이 되어
 * 둘 다 선택되는 사고가 난다.
 *
 * 제어(value)·비제어(defaultValue) 둘 다 받는다.
 */
export function RadioGroup({
  children,
  name,
  value,
  defaultValue,
  onChange,
  tone,
  size,
  disabled = false,
  inline = false,
  className,
}: RadioGroupProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;

  return (
    <div
      className={className}
      role="radiogroup"
      style={{ display: 'flex', flexDirection: inline ? 'row' : 'column', gap: inline ? 16 : 4 }}
    >
      {Children.map(children, (child) => {
        if (!isValidElement<RadioProps>(child)) return child;
        const v = child.props.value;
        return cloneElement(child, {
          name,
          tone: child.props.tone ?? tone,
          size: child.props.size ?? size,
          disabled: child.props.disabled ?? disabled,
          checked: v !== undefined && v === current,
          onChange: () => {
            if (v === undefined) return;
            if (value === undefined) setInner(v);
            onChange?.(v);
          },
        });
      })}
    </div>
  );
}
