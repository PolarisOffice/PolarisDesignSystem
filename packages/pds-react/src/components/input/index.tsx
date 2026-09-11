'use client';

import { forwardRef, useId, useState } from 'react';

import { color, font, radius, motion } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { InputFieldProps } from './types.js';

/**
 * PDS Figma `Component/Action → Input Filed` 실측.
 *
 * Status 4종이 하나의 형태에서 파생된다 —
 *   default : placeholder 만. 제목은 아직 안 보인다
 *   Focus   : 제목이 필드 **안 상단**으로 올라오고 값이 아래에 놓인다
 *   Done    : 포커스가 빠져도 값이 있으면 Focus 와 같은 배치를 유지한다
 *   Error   : 배치는 같고 테두리가 오류색, 아래에 아이콘과 문구가 붙는다
 *
 * 값의 출처: 치수·색은 디자인이 정본이다.
 */
const HEIGHT = 52;
const PAD_X = 20;
const ICON = 18;
const REVEAL = 24;
const GAP = 4;

/** 오류 문구 색 — 디자인은 테두리(state/error)와 다른 값을 쓴다 */


const field: CSSProperties = {
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  height: HEIGHT,
  padding: `0 ${PAD_X}px`,
  borderRadius: radius.sm,
  borderWidth: 1,
  borderStyle: 'solid',
  background: color.backgroundBase,
};

const titleStyle: CSSProperties = {
  fontFamily: font.family,
  fontSize: font.caption1Size,
  fontWeight: 400,
  lineHeight: 1.3,
  color: color.labelAssistive,
};

const valueStyle: CSSProperties = {
  width: '100%',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  padding: 0,
  fontFamily: font.family,
  fontSize: font.body2Size,
  fontWeight: 400,
  lineHeight: 1.5,
  color: color.labelNormal,
};

/** 값 가림/보임 — 비밀번호 전용 */
function RevealButton({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={on ? '값 가리기' : '값 보기'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: REVEAL,
        height: REVEAL,
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: color.labelAssistive,
        flexShrink: 0,
      }}
    >
      <svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true" focusable="false">
        <path
          d="M1 8s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="10" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        {!on && <path d="M3 14L17 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
      </svg>
    </button>
  );
}

const InputBase = forwardRef<HTMLInputElement, InputFieldProps>(function Input(
  {
    label,
    error,
    leftIcon,
    revealToggle,
    fullWidth = false,
    disabled = false,
    style,
    id,
    value,
    defaultValue,
    placeholder,
    onFocus,
    onBlur,
    onChange,
    type = 'text',
    // `<input>` 은 void element 라 children 을 못 받는다 — 흘러들어오면 버린다
    children: _children,
    ...rest
  }: InputFieldProps & { children?: React.ReactNode },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  // PDS 규칙: "비밀번호 필드에는 항상 눈 아이콘을 제공한다" — 끄고 싶을 때만 명시적으로 false
  const showReveal = revealToggle ?? type === 'password';
  const [innerValue, setInnerValue] = useState(defaultValue ?? '');

  // 제어/비제어 어느 쪽이든 "값이 있는가" 를 알아야 제목을 올릴지 정할 수 있다
  const current = value !== undefined ? value : innerValue;
  const filled = String(current ?? '').length > 0;
  // 제목이 필드 안으로 올라오는 조건 — Figma 의 Focus·Done·Error 배치
  const raised = Boolean(label) && (focused || filled || Boolean(error));

  const borderColor = error ? color.stateError : focused ? color.accentNormal : color.lineNeutral;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: GAP,
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
    >
      <div
        style={{
          ...field,
          borderColor,
          // 포커스·오류로 테두리색이 바뀔 때 즉시 튀지 않게
          transition: `border-color ${motion.durationFast} ${motion.easeOut}`,
          ...(disabled ? { opacity: 0.35 } : null),
        }}
      >
        {leftIcon && (
          <span
            aria-hidden
            style={{
              display: 'flex',
              alignItems: 'center',
              width: ICON,
              height: ICON,
              marginRight: GAP,
              color: color.labelAssistive,
              flexShrink: 0,
            }}
          >
            {leftIcon}
          </span>
        )}

        <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: '1 0 0', minWidth: 0 }}>
          {/*
            * 제목은 **항상 마운트**하고 펼침만 애니메이션한다. 조건부 마운트로 두면
            * 클릭하는 순간 튀어나와 duration-fast 토큰이 무의미해진다.
            * grid-template-rows 0fr→1fr 은 내용 높이를 모르는 채로 전환할 수 있는
            * 유일한 방법이다(max-height 추정치는 레이블 길이가 바뀌면 어긋난다).
            */}
          {label && (
            <span
              style={{
                display: 'grid',
                gridTemplateRows: raised ? '1fr' : '0fr',
                opacity: raised ? 1 : 0,
                transition: `grid-template-rows ${motion.durationFast} ${motion.easeOut}, opacity ${motion.durationFast} ${motion.easeOut}`,
              }}
            >
              <label htmlFor={inputId} style={{ ...titleStyle, overflow: 'hidden', minHeight: 0 }}>
                {label}
              </label>
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={showReveal && revealed ? 'text' : type}
            disabled={disabled}
            value={value}
            defaultValue={value === undefined ? defaultValue : undefined}
            // 제목이 올라오기 전에는 그 자리를 placeholder 가 대신한다.
            // 제목을 placeholder 로 대체하지 않는 것이 규칙이므로, label 이 있으면
            // 비어 있을 때만 label 문구를 보여 준다.
            placeholder={raised ? (placeholder as string | undefined) : ((placeholder ?? label) as string | undefined)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            onChange={(e) => { if (value === undefined) setInnerValue(e.currentTarget.value); onChange?.(e); }}
            style={valueStyle}
            {...rest}
          />
        </span>

        {showReveal && <RevealButton on={revealed} onClick={() => setRevealed((v) => !v)} />}
      </div>

      {error && (
        <span id={errorId} role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: GAP }}>
          <span aria-hidden style={{ display: 'flex', alignItems: 'center', width: ICON, height: ICON, flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
              <circle cx="8" cy="8" r="8" fill={color.stateError} />
              <path d="M8 4.2V8.9" stroke={color.staticWhite} strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="8" cy="11.4" r="0.95" fill={color.staticWhite} />
            </svg>
          </span>
          <span
            style={{
              fontFamily: font.family,
              fontSize: font.body3Size,
              fontWeight: 400,
              lineHeight: 1.5,
              color: color.stateError,
            }}
          >
            {error}
          </span>
        </span>
      )}
    </div>
  );
});

/**
 * 값·제목은 props 로 받는다. Status 는 상호작용과 error 로 결정되므로
 * 값 목록으로 열거하지 않는다.
 */
export const InputField = withSupported(InputBase, { acceptsChildren: false });
