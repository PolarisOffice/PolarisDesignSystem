'use client';

import { useEffect, useRef, useState } from 'react';

import { color, font, motion, radius } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { CheckboxProps } from './types.js';

/**
 * PDS Figma `Component/Action → checkbox` 실측. 모양(variant) 둘은 Figma Check Box 섹션의 세트다 —
 * box = checkbox(1097:36806) · check = checkbox 체크형(1097:36818).
 * 원형 체크(select-btn 1097:36786)는 2026-10-12 넣었다가 같은 날 뺐다 — 라디오와 헷갈려 가이드·패키지에 두지 않기로 했다.
 * md 는 컨트롤 21×21 · 히트 영역 32×32(전 브레이크포인트 공통).
 * sm 은 컨트롤 16×16 · 히트 영역 24×24 — 표처럼 14px 글자 옆에 놓을 때 (Figma Size=16).
 * radius 는 2026-08-28 Figma Radius 표 기준 — md radius-xs(6), sm radius-xxs(4).
 */
const SIZES = {
  md: { hit: 32, box: 21, radius: radius.xs },
  sm: { hit: 24, box: 16, radius: radius.xxs },
} as const;
/** 체크·대시 표시는 md(21) 박스에서 잰 값이다 — sm 은 박스 비율대로 줄인다 */
const MARK_BASE = SIZES.md.box;
const BORDER = 2;
/**
 * 박스 오른쪽 끝에서 레이블까지의 거리(2026-10-12 디자인 결정 — md·sm 같다).
 * 이력: gap 10(박스에서 15.5) → 2026-09-01 gap 0(박스에서 5.5, 너무 좁았다) → 박스 기준 8.
 * 박스(21)가 히트 영역(32) 한가운데면 양옆이 5.5 라 거리가 정수로 안 떨어진다 — 박스를 왼쪽 5 에 놓고
 * (오른쪽 6) 나머지를 gap 으로 채워 어느 배율에서도 정확히 8 이 되게 한다.
 */
const LABEL_DISTANCE = 8;

/**
 * check 모양의 체크 표시 — Figma checkbox 체크형(1097:36818)의 윤곽 path 그대로(14×10.18).
 * box 는 기존 획 체크(11×8, 획 1.8)를 그대로 둔다 — 이미 나간 모양을 바꾸지 않는다.
 */
const CHECK_PATH =
  'M13.6208 2.3541H13.5625C14.1458 1.8342 14.1458 0.9676 13.5625 0.3899C13.0375 -0.13 12.1625 -0.13 11.6375 0.3899L5.1625 6.8601L2.4208 4.1449C1.8375 3.5672 0.9625 3.5672 0.4375 4.1449C-0.1458 4.6649 -0.1458 5.5314 0.4375 6.0513L4.1708 9.7485C4.6958 10.3262 5.5708 10.3262 6.1542 9.7485L13.6208 2.3541Z';
const CHECK_W = 14;
const CHECK_H = 10.18;

function CheckMark({ width, fill }: { width: number; fill: string }) {
  return (
    <svg
      width={width}
      height={(width * CHECK_H) / CHECK_W}
      viewBox={`0 0 ${CHECK_W} ${CHECK_H}`}
      focusable="false"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <path d={CHECK_PATH} fill={fill} />
    </svg>
  );
}

function boxBase(box: number, boxRadius: CSSProperties['borderRadius']): CSSProperties {
  return {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: box,
    height: box,
    borderRadius: boxRadius,
    flexShrink: 0,
  };
}

function CheckboxBase({
  checked,
  defaultChecked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  tone = 'brand',
  size = 'md',
  variant = 'box',
  label,
  className,
}: CheckboxProps) {
  const tint = tone === 'ai' ? color.aiNormal : color.accentNormal;
  const { hit, box, radius: boxRadius } = SIZES[size];
  const k = box / MARK_BASE;
  const insetLeft = Math.floor((hit - box) / 2);
  const insetRight = hit - box - insetLeft;
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
            ...boxBase(box, boxRadius),
            // 체크될 때 면·테두리가 같은 박자로 바뀌게 (즉시 튀면 클릭이 거칠게 느껴진다)
            transition: `background-color ${motion.durationFast} ${motion.easeOut}, border-color ${motion.durationFast} ${motion.easeOut}`,
            // check 모양은 면·테두리 없이 표시만 그린다
            ...(variant === 'check'
              ? null
              : on
                ? { background: tint }
                : { border: `${BORDER}px solid ${color.lineNormal}` }),
          }}
        >
          {indeterminate ? (
            <span
              style={{
                width: 12 * k,
                height: 2 * k,
                borderRadius: 2 * k,
                // check 모양은 면이 없어 막대를 선택 색으로 (Figma 체크형 세트엔 부분 선택이 없다)
                background: variant === 'check' ? tint : color.staticWhite,
              }}
            />
          ) : variant === 'check' ? (
            // 선택 안 됨은 회색 체크(Figma 'disabled' 변형 = label/assistive), 선택되면 선택 색
            <CheckMark width={CHECK_W * k} fill={current ? tint : color.labelAssistive} />
          ) : (
            current && (
              <svg width={11 * k} height={8 * k} viewBox="0 0 11 8" focusable="false">
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
  size: ['md', 'sm'],
  variant: ['box', 'check'],
  acceptsChildren: false,
});
