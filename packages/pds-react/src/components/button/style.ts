import { color, radius } from '../../tokens.js';

import type { CSSProperties } from 'react';
import type { ButtonSize, ButtonVariant } from './types.js';

/** 크기별 치수 — 높이(px)가 곧 size 값 */
export const SIZES: Record<ButtonSize, CSSProperties> = {
  64: { height: 64, padding: '0 32px', fontSize: 18, fontWeight: 700, borderRadius: radius.md },
  54: { height: 54, padding: '0 20px', fontSize: 16, fontWeight: 700, borderRadius: radius.md },
  48: { height: 48, padding: '0 16px', fontSize: 16, fontWeight: 700, borderRadius: radius.md },
  40: { height: 40, padding: '0 12px', fontSize: 14, fontWeight: 500, borderRadius: radius.sm },
  32: { height: 32, padding: '0 10px', fontSize: 14, fontWeight: 500, borderRadius: radius.sm },
  // 24 는 4px(button.md 사이즈 표) — 2026-08-28 스케일 재편으로 4 의 이름이 xs → xxs
  24: { height: 24, padding: '0 8px', fontSize: 13, fontWeight: 500, borderRadius: radius.xxs },
};

/** 아이콘 간격 — 크기에 비례 */
export const GAPS: Record<ButtonSize, number> = {
  64: 8, 54: 8, 48: 6, 40: 6, 32: 4, 24: 4,
};

interface Face {
  base: CSSProperties;
  /** hover 시 덮어쓸 속성만 */
  hover: CSSProperties;
}

const TRANSPARENT: CSSProperties = { backgroundColor: 'transparent' };

/** PDS Variant 표 + 문서의 Ghost 규칙(1px 실선 --line/neutral) */
export const FACES: Record<ButtonVariant, Face> = {
  primary: {
    base: { backgroundColor: color.accentNormal, color: color.staticWhite },
    hover: { backgroundColor: color.accentStrong },
  },
  /**
   * Figma 의 Type=Default — 흰 배경에 얇은 보더. 취소·보조 액션에 쓰며
   * Popup 의 secondary 버튼도 같은 얼굴이다.
   */
  default: {
    base: {
      backgroundColor: color.backgroundBase,
      color: color.labelNormal,
      border: `1px solid ${color.lineNeutral}`,
    },
    hover: { backgroundColor: color.interactionHover },
  },
  ai: {
    base: { backgroundColor: color.aiNormal, color: color.staticWhite },
    hover: { backgroundColor: color.aiStrong },
  },
  sub: {
    /* 글자는 accent-normal 이었는데 옅은 면 위에서 대비가 3.15(다크 3.31)로 본문 기준 4.5 에
       미달했다 — 한 단 진한 accent-strong 으로 올려 라이트 5.67·다크 5.0 을 확보(2026-09-02).
       두 테마에서 명암이 뒤집히는 토큰이라 면과 짝이 유지된다 */
    base: { backgroundColor: color.subFill, color: color.accentStrong },
    hover: { backgroundColor: color.subFillHover },
  },
  gray: {
    base: { backgroundColor: color.fillNormal, color: color.labelNormal },
    hover: { backgroundColor: color.fillStrong },
  },
  black: {
    // 배경 action-normal 은 다크에서 흰색으로 뒤집힌다 — 글자도 같이 뒤집히는
    // label-inverse 여야 짝이 맞는다(static-white 로 두면 흰 배경에 흰 글자).
    base: { backgroundColor: color.actionNormal, color: color.labelInverse },
    hover: { backgroundColor: color.actionStrong },
  },
  delete: {
    base: { backgroundColor: color.stateError, color: color.staticWhite },
    // 디자인은 별도 색이 아니라 같은 배경 위에 검정 20% 를 덮는다
    hover: {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))`,
    },
  },
  ghost: {
    base: { ...TRANSPARENT, color: color.accentNormal, border: `1px solid ${color.lineNeutral}` },
    hover: { backgroundColor: color.interactionHover },
  },
  blackGhost: {
    base: { ...TRANSPARENT, color: color.labelNormal, border: `1px solid ${color.lineNeutral}` },
    hover: { backgroundColor: color.interactionHover },
  },
  deleteGhost: {
    base: { ...TRANSPARENT, color: color.stateError, border: `1px solid ${color.lineNeutral}` },
    hover: { backgroundColor: color.interactionHover },
  },
};

/** 모든 변형 공통 — 비활성 표현은 하나로 통일한다(PDS Specification 의 Disabled 행) */
export const DISABLED: CSSProperties = {
  backgroundColor: color.fillStrong,
  color: color.labelDisabled,
  border: '1px solid transparent',
  cursor: 'not-allowed',
};

