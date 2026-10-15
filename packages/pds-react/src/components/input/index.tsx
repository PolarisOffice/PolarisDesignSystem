'use client';

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';

import { color, font, radius, motion } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { InputFieldProps, InputFieldSize } from './types.js';

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
const ICON = 18;
const REVEAL = 24;
const GAP = 4;

/**
 * lg 는 Figma 실측(폼 필드). md·sm·xs 는 같은 높이의 Button 과 한 줄에 서도록 맞췄고
 * (md 40 검색, sm 32 표 툴바·촘촘한 화면, xs 28 표 셀 안), 제목을 그리지 않는다.
 * Select 와 같은 4단계다.
 */
const SIZES: Record<
  InputFieldSize,
  { height: number; padX: number; iconGap: number; icon: number; font: string; radius: string; clear: number; clearGlyph: number }
> = {
  lg: { height: 52, padX: 20, iconGap: GAP, icon: 18, font: font.body2Size, radius: radius.sm, clear: 24, clearGlyph: 16 },
  md: { height: 40, padX: 12, iconGap: 8, icon: 18, font: font.body2Size, radius: radius.sm, clear: 24, clearGlyph: 16 },
  sm: { height: 32, padX: 10, iconGap: 6, icon: 16, font: font.body2Size, radius: radius.sm, clear: 20, clearGlyph: 14 },
  xs: { height: 28, padX: 8, iconGap: 6, icon: 16, font: font.body3Size, radius: radius.xs, clear: 20, clearGlyph: 14 },
};

const field: CSSProperties = {
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
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

/** 값 지우기 — 검색창 용도. 우측 자리는 RevealButton 과 같다 */
function ClearButton({ label, onClick, box, glyph }: { label: string; onClick: () => void; box: number; glyph: number }) {
  const [hover, setHover] = useState(false);
  // 키보드로 왔을 때만 링 — 마우스 클릭엔 그리지 않는다
  const [ring, setRing] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      // 누르는 순간 입력이 blur 되면 테두리가 깜빡이고 호출자 onBlur 가 불린다 — 포커스를 입력에 둔 채 누른다
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={(e) => setRing(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => setRing(false)}
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: box,
        height: box,
        padding: 0,
        border: 'none',
        borderRadius: radius.xs,
        background: 'transparent',
        cursor: 'pointer',
        color: hover ? color.labelNeutral : color.labelAssistive,
        outline: ring ? `2px solid ${color.accentNormal}` : 'none',
        transition: `color ${motion.durationFast} ${motion.easeOut}`,
        flexShrink: 0,
      }}
    >
      <svg width={glyph} height={glyph} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
    size = 'lg',
    clearable = false,
    onClear,
    clearLabel = '입력 지우기',
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
    onKeyDown,
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
  const s = SIZES[size] ?? SIZES.lg;
  // lg 밖은 제목 자리가 없다 — 접근성 이름은 aria-label 로 받는다
  const compact = s !== SIZES.lg;
  const title = compact ? undefined : label;

  // 지우기 뒤 포커스를 돌려주려면 내부에서도 input 을 잡아야 한다 — 바깥 ref 와 함께 건다
  const innerRef = useRef<HTMLInputElement | null>(null);
  const setRefs = useCallback(
    (el: HTMLInputElement | null) => {
      innerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );

  // 제어/비제어 어느 쪽이든 "값이 있는가" 를 알아야 제목을 올릴지 정할 수 있다
  const current = value !== undefined ? value : innerValue;
  const filled = String(current ?? '').length > 0;
  // 제목이 필드 안으로 올라오는 조건 — Figma 의 Focus·Done·Error 배치
  const raised = Boolean(title) && (focused || filled || Boolean(error));

  // 우측 자리는 하나 — 비밀번호 토글이 이기고 지우기는 무시한다
  // 제어형인데 onClear 가 없으면 지울 방법이 없다 — 버튼·Esc 를 내주지 않는다(Esc 는 바깥 팝업으로 흘린다)
  const canClear = value === undefined || !!onClear;
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (clearable && showReveal)
      console.warn('[pds] InputField: clearable 과 revealToggle 은 함께 쓸 수 없어 clearable 을 무시했습니다.');
    if (clearable && !canClear)
      console.warn('[pds] InputField: 제어형(value)에서 clearable 을 쓰려면 onClear 로 value 를 비워 주세요 — 지우기 버튼을 숨겼습니다.');
  }, [clearable, showReveal, canClear]);
  const showClear = clearable && canClear && !showReveal && filled && !disabled && !rest.readOnly;

  const clear = () => {
    // 비제어면 직접 비운다. 제어형은 호출자가 onClear 에서 value 를 비운다
    if (value === undefined && innerRef.current) {
      innerRef.current.value = '';
      setInnerValue('');
    }
    onClear?.();
    innerRef.current?.focus();
  };

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
          height: s.height,
          padding: `0 ${s.padX}px`,
          borderRadius: s.radius,
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
              width: s.icon,
              height: s.icon,
              // 패키지 아이콘은 크기를 안 주면 1.25em 이다 — 글자 크기로 자리(18·16)에 맞춘다. size 를 직접 주면 그 값이 이긴다
              fontSize: s.icon / 1.25,
              marginRight: s.iconGap,
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
          {title && (
            <span
              style={{
                display: 'grid',
                gridTemplateRows: raised ? '1fr' : '0fr',
                opacity: raised ? 1 : 0,
                transition: `grid-template-rows ${motion.durationFast} ${motion.easeOut}, opacity ${motion.durationFast} ${motion.easeOut}`,
              }}
            >
              <label htmlFor={inputId} style={{ ...titleStyle, overflow: 'hidden', minHeight: 0 }}>
                {title}
              </label>
            </span>
          )}
          <input
            ref={setRefs}
            id={inputId}
            type={showReveal && revealed ? 'text' : type}
            disabled={disabled}
            value={value}
            defaultValue={value === undefined ? defaultValue : undefined}
            // 제목이 올라오기 전에는 그 자리를 placeholder 가 대신한다.
            // 제목을 placeholder 로 대체하지 않는 것이 규칙이므로, label 이 있으면
            // 비어 있을 때만 label 문구를 보여 준다.
            placeholder={raised ? (placeholder as string | undefined) : ((placeholder ?? title) as string | undefined)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            // lg 밖은 제목을 그리지 않는다 — 문자열 label 은 접근성 이름으로 옮긴다({...rest} 의 aria-label 이 우선)
            aria-label={compact && typeof label === 'string' ? label : undefined}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            onChange={(e) => { if (value === undefined) setInnerValue(e.currentTarget.value); onChange?.(e); }}
            onKeyDown={(e) => {
              onKeyDown?.(e);
              // 값이 있을 때의 Esc 는 "지우기" 다 — 감싼 팝업까지 닫히지 않게 여기서 멈춘다
              if (e.key === 'Escape' && showClear && !e.defaultPrevented) {
                e.preventDefault();
                e.stopPropagation();
                clear();
              }
            }}
            style={{ ...valueStyle, fontSize: s.font }}
            {...rest}
          />
        </span>

        {showReveal && <RevealButton on={revealed} onClick={() => setRevealed((v) => !v)} />}
        {showClear && <ClearButton label={clearLabel} onClick={clear} box={s.clear} glyph={s.clearGlyph} />}
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
export const InputField = withSupported(InputBase, { size: ['lg', 'md', 'sm', 'xs'], acceptsChildren: false });
