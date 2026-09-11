/**
 * PDS 토큰 — 컴포넌트가 쓰는 CSS 변수 참조.
 *
 * 값은 정본 DESIGN.md 에서 생성된 `tokens.generated.ts` 가 갖는다(직접 수정 금지).
 * 이 파일은 컴포넌트가 쓰는 이름만 골라 재수출하고, **정본에 대응 토큰이 없는
 * 값**만 여기서 리터럴로 메운다 — 그런 값이 남아 있다는 사실 자체가 드러나야
 * 나중에 토큰이 생겼을 때 교체할 수 있다.
 */
import { color as generated, radius as generatedRadius, typography, shadow as generatedShadow, duration as generatedDuration, ease as generatedEase } from './tokens.generated.js';

export const color = {
  accentNormal: generated.accentNormal,
  accentStrong: generated.accentStrong,
  aiNormal: generated.aiNormal,
  aiStrong: generated.aiStrong,
  aiHover: generated.aiHover,
  fillNormal: generated.fillNormal,
  fillNeutral: generated.fillNeutral,
  fillStrong: generated.fillStrong,
  lineNeutral: generated.lineNeutral,
  lineNormal: generated.lineNormal,
  backgroundBase: generated.backgroundBase,
  layerSurface: generated.layerSurface,
  labelNormal: generated.labelNormal,
  labelNeutral: generated.labelNeutral,
  labelInverse: generated.labelInverse,
  labelAlternative: generated.labelAlternative,
  layerOverlay: generated.layerOverlay,
  labelAssistive: generated.labelAssistive,
  stateError: generated.stateError,
  staticWhite: generated.staticWhite,
  actionNormal: generated.actionNormal,
  actionStrong: generated.actionStrong,
  interactionHover: generated.interactionHover,
  interactionPressed: generated.interactionPressed,

  /**
   * 정본 tokens 에 대응 항목이 없는 값 — 디자인 문서에만 존재한다.
   * 토큰이 생기면 generated 참조로 교체할 것.
   */
  /**
   * Sub 버튼 면 — 원시 팔레트를 직접 보던 값이라 다크에서 그대로 밝은 판이 남았다(2026-09-02).
   * 라이트 값이 같은 format-word 쌍으로 옮겨 테마 전환을 얻는다: 라이트는 기존과 동일하고
   * 다크는 짙은 남색(#0b3263 / #0f4588)이 된다.
   * ⚠️ 이름은 포맷 앱 색이지만 **값을 공유하는 것이 의도**다(2026-09-02 디자인 결정 — 토큰
   * 신설 없이 진행). 포맷 Word 색을 바꿀 일이 생기면 Sub 버튼도 같이 바뀌니 확인할 것.
   */
  subFill: 'var(--color-format-word-hover, #d9eaff)',
  subFillHover: 'var(--color-format-word-pressed, #bbd8fd)',
  /** Toast success — 정본에 범용 success 토큰이 없다(포맷 색은 맥락 전용이라 못 빌린다) */
  toastSuccess: 'var(--color-state-success, #51b41b)',
  labelDisabled: 'var(--color-label-disabled, #aeafb0)', // 문서상 --label/disabled
} as const;

export const radius = {
  xxs: generatedRadius.xxs,
  xs: generatedRadius.xs,
  sm: generatedRadius.sm,
  md: generatedRadius.md,
  lg: generatedRadius.lg,
  xl: generatedRadius.xl,
  full: generatedRadius.full,
} as const;

/**
 * 그림자 — elevation 4티어(sm·md·lg·xl). 티어 밖 형태(popup 의 popover, segment 의 outlined,
 * toggle 의 inset)는 컴포넌트 리터럴로 정의된다.
 */
export const shadow = {
  sm: generatedShadow.sm,
  md: generatedShadow.md,
  lg: generatedShadow.lg,
  xl: generatedShadow.xl,
} as const;

/**
 * 모션 — duration 4단 + easing 3종.
 * ⚠️ JS 타이머(setTimeout)와 짝이 되는 값은 var() 문자열을 못 쓴다 —
 * tooltip 의 FADE_IN/OUT 처럼 CSS·JS 가 같은 숫자를 공유해야 하는 곳은
 * 숫자 리터럴을 유지하고 주석으로 토큰 대응만 남긴다.
 */
export const motion = {
  durationInstant: generatedDuration.instant,
  durationFast: generatedDuration.fast,
  durationNormal: generatedDuration.normal,
  durationSlow: generatedDuration.slow,
  easeInOut: generatedEase.inOut,
  easeOut: generatedEase.out,
  easeIn: generatedEase.in,
} as const;

export const font = {
  // 정본에 단일 font-family 토큰이 없고 typography role 별로만 있다 — 본문 기준을 쓴다
  family: typography.body2FontFamily,

  /** 역할별 크기 — Figma 의 font-size/{lg,md,sm,xs} 와 1:1 대응한다 */
  heading4Size: typography.heading4FontSize,
  body1Size: typography.body1FontSize,
  body2Size: typography.body2FontSize,
  body3Size: typography.body3FontSize,
  caption1Size: typography.caption1FontSize,
} as const;
