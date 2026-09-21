/** 원본: PDS `docs/foundation/colors.md` — hex 값은 콘텐츠(브랜드·포맷·플랜 색 자체)라 리터럴 유지 */

export interface RoleChip {
  label: string;
  hex: string;
  /** 스와치는 hex 가 아니라 토큰 var 로 칠한다 — 다크 모드에서 실제 값이 보이게 (Figma 라이트/다크 컬럼과 동일) */
  token: string;
}

export interface RoleCard {
  num: string;
  title: string;
  desc: string;
  chips: RoleChip[];
}

export const ROLE_CARDS: RoleCard[] = [
  {
    num: '01',
    title: 'UI 계층 표현',
    desc: '텍스트 강조도, 배경 깊이, 선 강도를 색으로 나눠 정보 위계를 드러내요.',
    chips: [
      { label: 'label', hex: '#26282b', token: '--color-label-normal' },
      { label: 'fill', hex: '#f2f4f6', token: '--color-fill-normal' },
      { label: 'line', hex: '#c9cdd2', token: '--color-line-normal' },
    ],
  },
  {
    num: '02',
    title: '포맷 앱 아이덴티티',
    desc: '포맷마다 고유 색이 있어 어떤 파일을 다루는지 색만으로 알 수 있어요.',
    chips: [
      { label: 'Word', hex: '#1d7ff9', token: '--color-format-word' },
      { label: 'Sheet', hex: '#51b41b', token: '--color-format-sheet' },
      { label: 'Slide', hex: '#fd8900', token: '--color-format-slide' },
    ],
  },
  {
    num: '03',
    title: 'AI 기능 구분',
    /* 2026-08-28 팀장 재검토 — 구 '서비스 계층 구분'(플랜 등급을 색으로 파악) 서술은 실사용과
       달라 삭제하고, 실제로 색 구분이 필요한 AI 기능 중심으로 교체. 플랜 토큰 정의 자체는
       Roles 탭에 유지된다. */
    desc: '보라색은 AI 기능 전용이에요. 어시스턴트·생성 콘텐츠에 일관되게 쓰고, 장식엔 쓰지 않아요.',
    chips: [
      { label: 'Normal', hex: '#6f3ad0', token: '--color-ai-normal' },
      { label: 'Strong', hex: '#511bb2', token: '--color-ai-strong' },
      { label: 'Hover', hex: '#f5f1fd', token: '--color-ai-hover' },
    ],
  },
];

export type FormatSwatchState = 'Hover' | 'Pressed' | 'Normal';

export interface FormatApp {
  name: string;
  /** 토큰 베이스 — --color-format-{slug}. hover/pressed 와 다크 보정 *-adaptive 2종이 파생된다 */
  token: string;
  swatches: { hex: string; state: FormatSwatchState }[];
}

export const FORMAT_APPS: FormatApp[] = [
  {
    name: 'Word',
    token: '--color-format-word',
    swatches: [
      { hex: '#d9eaff', state: 'Hover' },
      { hex: '#bbd8fd', state: 'Pressed' },
      { hex: '#1d7ff9', state: 'Normal' },
    ],
  },
  {
    name: 'Sheet',
    token: '--color-format-sheet',
    swatches: [
      { hex: '#dcf1d1', state: 'Hover' },
      { hex: '#cae8ba', state: 'Pressed' },
      { hex: '#51b41b', state: 'Normal' },
    ],
  },
  {
    name: 'Slide',
    token: '--color-format-slide',
    swatches: [
      { hex: '#fde5c8', state: 'Hover' },
      { hex: '#fedbb2', state: 'Pressed' },
      { hex: '#fd8900', state: 'Normal' },
    ],
  },
  {
    name: 'PDF',
    token: '--color-format-pdf',
    swatches: [
      { hex: '#ffe3e3', state: 'Hover' },
      { hex: '#fdcece', state: 'Pressed' },
      { hex: '#f95c5c', state: 'Normal' },
    ],
  },
  {
    name: 'Image',
    token: '--color-format-image',
    swatches: [
      { hex: '#d2f4fa', state: 'Hover' },
      { hex: '#abebf6', state: 'Pressed' },
      { hex: '#00badb', state: 'Normal' },
    ],
  },
  {
    name: 'Note',
    token: '--color-format-note',
    swatches: [
      { hex: '#fcefca', state: 'Hover' },
      { hex: '#fae6af', state: 'Pressed' },
      { hex: '#f2b50b', state: 'Normal' },
    ],
  },
];

/**
 * 정본: tokens.css §2 Plan (2026-08-13 재정비).
 * ⚠️ 구 표기 교정: Smart 는 #d77400 이 아니라 po-blue-60(#1d7ff9) — #d77400 은 plan-orange 다.
 * bg 는 10% 알파 합성값(플랜 뱃지 배경) — 팔레트 미등재라 토큰이 hex 직접 기입.
 */
export const PLAN_COLORS: { name: string; token: string; hex: string; bg: string }[] = [
  { name: 'Basic', token: '--color-plan-basic', hex: '#449916', bg: '#009b001a' },
  { name: 'Smart', token: '--color-plan-smart', hex: '#1d7ff9', bg: '#0081ff1a' },
  { name: 'Pro', token: '--color-plan-pro', hex: '#0046b9', bg: '#0047c01a' },
  { name: 'Business', token: '--color-plan-business', hex: '#2baff4', bg: '#00b2fa1a' },
  { name: 'AI', token: '--color-plan-ai', hex: '#6f3ad0', bg: '#7736d81a' },
  { name: 'Orange', token: '--color-plan-orange', hex: '#d77400', bg: '#e66d001a' },
];

/** AI 전용 토큰 4종 — tokens.css §2 AI. Figma Color-Semantic 의 AI 그룹 행 구성 그대로 */
export const AI_TOKENS: { name: string; token: string; hex: string; desc: string }[] = [
  { name: 'Normal', token: '--color-ai-normal', hex: '#6f3ad0', desc: '주요 AI 액션·핵심 요소' },
  { name: 'Strong', token: '--color-ai-strong', hex: '#511bb2', desc: '강조·상호작용 상태' },
  { name: 'Hover', token: '--color-ai-hover', hex: '#f5f1fd', desc: 'hover 배경' },
  { name: 'Pressed', token: '--color-ai-pressed', hex: '#e0d1ff', desc: 'pressed·선택 배경' },
];

export const RELATED_DOCS: { href: string; name: string; desc: string }[] = [
  { href: '/components/button', name: 'Button', desc: '역할 토큰이 실제 컴포넌트에 쓰인 예' },
];
