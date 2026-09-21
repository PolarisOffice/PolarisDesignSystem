'use client';

import { forwardRef, useState } from 'react';

import { font, motion } from '../../tokens.js';
import { withSupported } from '../../supported.js';
import { DISABLED, FACES, GAPS, SIZES } from './style.js';
import { ProgressCircle } from '../progress-circle/index.js';

import type { CSSProperties } from 'react';
import type { ButtonProps, ButtonSize } from './types.js';
import type { ProgressCircleSize } from '../progress-circle/types.js';

/**
 * loading 일 때 아이콘 자리에 들어가는 스피너 크기 —
 * Loading 스펙 Case「버튼 안」이 40 버튼에 ProgressCircle 18 을 쓴다(= 아이콘 슬롯 크기).
 * 큰 버튼은 아이콘이 24 라 24 를 쓴다.
 */
const SPINNER_SIZE: Record<ButtonSize, ProgressCircleSize> = {
  64: 24, 54: 24, 48: 24, 40: 18, 32: 18, 24: 18,
};

const BASE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  border: '1px solid transparent',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  fontFamily: font.family,
  lineHeight: 1.5,
  letterSpacing: 0,
  textDecoration: 'none',
  // easing 'ease' 는 정본 ease 토큰 3종과 다른 값 — 디자이너 확인 전까지 유지
  transition: `background-color ${motion.durationFast} ease, color ${motion.durationFast} ease, filter ${motion.durationFast} ease`,
};

/**
 * PDS Button.
 *
 * 스타일은 인라인 + CSS 변수만 쓴다 — 런타임 스타일 엔진이 없어야
 * 브라우저 내 미리보기(Sandpack)에서 그대로 뜬다.
 */
const ButtonBase = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 48,
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
    disabled = false,
    style,
    children,
    onMouseEnter,
    onMouseLeave,
    onClick,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);
  /*
   * 모르는 variant 를 받아도 죽지 않는다 — 이 컴포넌트는 디자인 가이드가
   * 스펙 맵에서 뽑은 축 이름을 그대로 넘기는 자리에서도 쓰인다. 스펙이
   * 패키지보다 앞서 나가는 일이 정상적으로 있으므로, 화면을 깨뜨리는 대신
   * 기본 얼굴로 떨어지고 개발 중에만 알린다.
   */

  const face = FACES[variant] ?? FACES.primary;
  if (process.env.NODE_ENV !== 'production' && !FACES[variant]) {
    console.warn(`[pds] Button: 알 수 없는 variant "${variant}" — primary 로 대체했습니다.`);
  }
  const sizeStyle = SIZES[size] ?? SIZES[48];
  const gap = GAPS[size] ?? GAPS['48'];
  /** 클릭이 막힌 상태 — 호버 반응도 죽인다 */
  const inactive = disabled || loading;

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={inactive || undefined}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
      // loading 중 클릭은 삼킨다 — disabled 를 안 걸어야 포커스가 유지된다
      onClick={(e) => {
        if (loading) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      style={{
        ...BASE,
        ...sizeStyle,
        gap,
        ...face.base,
        ...(hovered && !inactive ? face.hover : null),
        // 진행 중은 비활성이 아니다 — Loading 스펙 Case「버튼 안」은 버튼 얼굴을 그대로 두고
        // 아이콘 자리만 스피너로 바꾼다. 회색으로 가라앉히는 것은 disabled 뿐이다.
        ...(disabled ? DISABLED : null),
        ...(fullWidth ? { width: '100%' } : null),
        ...style,
      }}
      {...rest}
    >
      {loading ? <ProgressCircle size={SPINNER_SIZE[size] ?? 18} color="currentColor" aria-hidden /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
});

/**
 * 지원 축 — 가이드가 "이 변형을 실물로 그려도 되는가" 를 판정하는 근거.
 * 미지원 값은 가이드가 골격으로 떨어뜨린다.
 */
export const Button = withSupported(ButtonBase, {
  sampleLabel: '버튼', // Figma 견본 문구
  variant: Object.keys(FACES),
  size: Object.keys(SIZES).map(Number),
});
