/** 원본 `docs/foundation/motion.md` 의 Duration 4종 · Easing 3종 · Animation Patterns · Reduced Motion 표 */

export interface DurationToken {
  token: string;
  value: string;
  usage: string;
}

export const DURATION_TOKENS: DurationToken[] = [
  { token: 'duration-instant', value: '100ms', usage: 'Hover, focus 피드백' },
  { token: 'duration-fast', value: '150ms', usage: '버튼 상태 전환, 색상 변화' },
  { token: 'duration-normal', value: '250ms', usage: '드롭다운 열림/닫힘, 툴팁 등장' },
  { token: 'duration-slow', value: '350ms', usage: '모달 진입, 토스트 슬라이드' },
];

export interface EasingToken {
  token: string;
  curve: string;
  /** cubic-bezier(x1, y1, x2, y2) — SVG 곡선 미리보기용 제어점 */
  bezier: [number, number, number, number];
  usage: string;
}

export const EASING_TOKENS: EasingToken[] = [
  {
    token: 'ease-in-out',
    curve: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bezier: [0.4, 0, 0.2, 1],
    usage: '기본 전환',
  },
  {
    token: 'ease-out',
    curve: 'cubic-bezier(0, 0, 0.2, 1)',
    bezier: [0, 0, 0.2, 1],
    usage: '등장 애니메이션',
  },
  {
    token: 'ease-in',
    curve: 'cubic-bezier(0.4, 0, 1, 1)',
    bezier: [0.4, 0, 1, 1],
    usage: '퇴장 애니메이션',
  },
];

export interface AnimationPattern {
  component: string;
  enter: string;
  exit: string;
  notes: string;
}

export const ANIMATION_PATTERNS: AnimationPattern[] = [
  {
    component: 'Modal',
    enter: 'opacity 0→1 + translateY(8px→0), slow, ease-out',
    exit: 'opacity 1→0 + translateY(0→8px), normal, ease-in',
    notes: 'Overlay 동시 fade',
  },
  {
    component: 'Dropdown',
    enter: 'opacity 0→1 + scaleY(0.96→1), normal, ease-out',
    exit: 'opacity 1→0, fast, ease-in',
    notes: 'transform-origin: 트리거 방향',
  },
  {
    component: 'Toast',
    enter: 'opacity 0→1 + translateY(-12px→0), slow, ease-out',
    exit: 'opacity 1→0, normal',
    notes: 'Auto-dismiss 3초',
  },
  {
    component: 'Tooltip',
    enter: 'opacity 0→1, normal, ease-out',
    exit: 'opacity 1→0, fast',
    notes: '200ms delay 후 표시',
  },
  {
    component: 'Button states',
    enter: 'background-color, fast, ease-in-out',
    exit: '—',
    notes: 'border-color, box-shadow 포함',
  },
  {
    component: 'Page transition',
    enter: '없음 (즉시 렌더링)',
    exit: '—',
    notes: '생산성 도구에서 지연 방지',
  },
];

export interface ReducedMotionRule {
  token: string;
  action: string;
  effect: string;
}

export const REDUCED_MOTION_RULES: ReducedMotionRule[] = [
  { token: 'Duration', action: '모든 duration을 0ms로 강제', effect: '즉시 상태 전환' },
  { token: 'Transform', action: 'translateY, scaleY 등 제거', effect: 'slide-scale 모션 비활성화' },
  { token: 'Opacity', action: '전환만 유지', effect: 'fade in/out 그대로 작동' },
  { token: 'Auto-dismiss', action: '타이머 유지, 애니메이션 없이 제거', effect: '토스트 3초 후 즉시 사라짐' },
];
