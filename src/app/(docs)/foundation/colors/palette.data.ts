/** Primitive 팔레트 — Figma Variables 내보내기(Mode 1.tokens.json, 2026-08-28) 전량 134값.
 * 구 41스와치(축약판)를 피그마 정본 단계(05–90)로 전면 교체 — 검토 피드백 "팔레트 컬러가
 * 다 안들어가 있음" 반영. cssVar 는 tokens.css 실존 변수명, refs 는 그 원시값을 참조하는
 * semantic 토큰(자동 도출·검증됨). 값 갱신 시 tokens.css primitive 블록과 함께 바꿀 것. */

export interface PaletteSwatch {
  /** 단계 라벨 (05–90, White/Black 등) */
  step: string;
  /** 칩 배경 hex — 콘텐츠 그 자체라 리터럴 유지 (다크에서도 그대로) */
  hex: string;
  /** tokens.css 의 primitive 변수명 */
  cssVar: string;
  /** 이 원시값을 참조하는 semantic 토큰 CSS 변수 (없으면 빈 배열) */
  refs: string[];
  /** #ffffff 만 라인 (2026-08-28 칩 라인 규칙) */
  bordered?: boolean;
}

export interface PaletteFamily {
  title: string;
  swatches: PaletteSwatch[];
}

export const PALETTE_FAMILIES: PaletteFamily[] = [
  {
    title: 'Base',
    swatches: [
      { step: 'Black', hex: '#000000', cssVar: '--primitive-black', refs: ['--color-static-black', '--color-action-normal'] },
      { step: 'White', hex: '#ffffff', cssVar: '--primitive-white', refs: ['--color-static-white', '--color-label-inverse', '--color-background-base', '--color-layer-surface', '--color-action-normal'], bordered: true },
    ],
  },
  {
    title: 'Gray',
    swatches: [
      { step: '10', hex: '#f7f8f9', cssVar: '--primitive-gray-10', refs: ['--color-fill-neutral'] },
      { step: '20', hex: '#f2f4f6', cssVar: '--primitive-gray-20', refs: ['--color-interaction-hover', '--color-fill-normal', '--color-action-strong'] },
      { step: '30', hex: '#e8ebed', cssVar: '--primitive-gray-30', refs: ['--color-interaction-pressed', '--color-line-neutral', '--color-fill-strong'] },
      { step: '40', hex: '#c9cdd2', cssVar: '--primitive-gray-40', refs: ['--color-line-normal'] },
      { step: '50', hex: '#b3b8bd', cssVar: '--primitive-gray-50', refs: ['--color-line-strong'] },
      { step: '60', hex: '#9ea4aa', cssVar: '--primitive-gray-60', refs: ['--color-label-assistive'] },
      { step: '70', hex: '#72787f', cssVar: '--primitive-gray-70', refs: ['--color-label-alternative'] },
      { step: '80', hex: '#454c53', cssVar: '--primitive-gray-80', refs: ['--color-action-strong', '--color-label-neutral'] },
      { step: '90', hex: '#26282b', cssVar: '--primitive-gray-90', refs: ['--color-label-normal'] },
    ],
  },
  {
    title: 'PO Dark Blue',
    swatches: [
      { step: '05', hex: '#e5ecf8', cssVar: '--primitive-po-dark-blue-05', refs: [] },
      { step: '10', hex: '#d1dff7', cssVar: '--primitive-po-dark-blue-10', refs: [] },
      { step: '20', hex: '#b2c7ea', cssVar: '--primitive-po-dark-blue-20', refs: [] },
      { step: '30', hex: '#7fa2dc', cssVar: '--primitive-po-dark-blue-30', refs: [] },
      { step: '40', hex: '#4c7dce', cssVar: '--primitive-po-dark-blue-40', refs: [] },
      { step: '50', hex: '#0046b9', cssVar: '--primitive-po-dark-blue-50', refs: ['--color-plan-pro'] },
      { step: '60', hex: '#003b9d', cssVar: '--primitive-po-dark-blue-60', refs: [] },
      { step: '70', hex: '#003081', cssVar: '--primitive-po-dark-blue-70', refs: [] },
      { step: '80', hex: '#002665', cssVar: '--primitive-po-dark-blue-80', refs: [] },
      { step: '90', hex: '#001c4a', cssVar: '--primitive-po-dark-blue-90', refs: [] },
    ],
  },
  {
    title: 'PO Blue',
    swatches: [
      { step: '05', hex: '#e8f2fe', cssVar: '--primitive-po-blue-05', refs: [] },
      { step: '10', hex: '#d9eaff', cssVar: '--primitive-po-blue-10', refs: ['--color-format-word-hover', '--color-format-word-hover-adaptive'] },
      { step: '20', hex: '#bbd8fd', cssVar: '--primitive-po-blue-20', refs: ['--color-format-word-pressed', '--color-format-word-pressed-adaptive'] },
      { step: '30', hex: '#8ebffc', cssVar: '--primitive-po-blue-30', refs: [] },
      { step: '40', hex: '#60a5fa', cssVar: '--primitive-po-blue-40', refs: ['--color-accent-neutral', '--color-accent-strong', '--color-link-strong'] },
      { step: '50', hex: '#1d7ff9', cssVar: '--primitive-po-blue-50', refs: ['--color-accent-normal', '--color-format-word', '--color-plan-smart', '--color-link-normal'] },
      { step: '60', hex: '#186cd3', cssVar: '--primitive-po-blue-60', refs: [] },
      { step: '70', hex: '#1458ad', cssVar: '--primitive-po-blue-70', refs: ['--color-accent-strong', '--color-link-strong', '--color-accent-neutral'] },
      { step: '80', hex: '#0f4588', cssVar: '--primitive-po-blue-80', refs: [] },
      { step: '90', hex: '#0b3263', cssVar: '--primitive-po-blue-90', refs: [] },
    ],
  },
  {
    title: 'PO Green',
    swatches: [
      { step: '05', hex: '#edf7e8', cssVar: '--primitive-po-green-05', refs: [] },
      { step: '10', hex: '#dcf1d1', cssVar: '--primitive-po-green-10', refs: ['--color-format-sheet-hover', '--color-format-sheet-hover-adaptive'] },
      { step: '20', hex: '#cae8ba', cssVar: '--primitive-po-green-20', refs: ['--color-format-sheet-pressed', '--color-format-sheet-pressed-adaptive'] },
      { step: '30', hex: '#a8d98d', cssVar: '--primitive-po-green-30', refs: [] },
      { step: '40', hex: '#85ca5f', cssVar: '--primitive-po-green-40', refs: [] },
      { step: '50', hex: '#51b41b', cssVar: '--primitive-po-green-50', refs: ['--color-format-sheet'] },
      { step: '60', hex: '#449916', cssVar: '--primitive-po-green-60', refs: ['--color-plan-basic'] },
      { step: '70', hex: '#387d12', cssVar: '--primitive-po-green-70', refs: [] },
      { step: '80', hex: '#2c620e', cssVar: '--primitive-po-green-80', refs: [] },
      { step: '90', hex: '#20480a', cssVar: '--primitive-po-green-90', refs: [] },
    ],
  },
  {
    title: 'PO Orange',
    swatches: [
      { step: '05', hex: '#fef3e5', cssVar: '--primitive-po-orange-05', refs: [] },
      { step: '10', hex: '#fde5c8', cssVar: '--primitive-po-orange-10', refs: ['--color-format-slide-hover', '--color-format-slide-hover-adaptive'] },
      { step: '20', hex: '#fedbb2', cssVar: '--primitive-po-orange-20', refs: ['--color-format-slide-pressed', '--color-format-slide-pressed-adaptive'] },
      { step: '30', hex: '#fec47f', cssVar: '--primitive-po-orange-30', refs: [] },
      { step: '40', hex: '#fdac4c', cssVar: '--primitive-po-orange-40', refs: [] },
      { step: '50', hex: '#fd8900', cssVar: '--primitive-po-orange-50', refs: ['--color-format-slide'] },
      { step: '60', hex: '#d77400', cssVar: '--primitive-po-orange-60', refs: ['--color-plan-orange'] },
      { step: '70', hex: '#b05f00', cssVar: '--primitive-po-orange-70', refs: [] },
      { step: '80', hex: '#8a4b00', cssVar: '--primitive-po-orange-80', refs: [] },
      { step: '90', hex: '#653600', cssVar: '--primitive-po-orange-90', refs: [] },
    ],
  },
  {
    title: 'PO Red',
    swatches: [
      { step: '05', hex: '#feeeee', cssVar: '--primitive-po-red-05', refs: [] },
      { step: '10', hex: '#ffe3e3', cssVar: '--primitive-po-red-10', refs: ['--color-format-pdf-hover', '--color-format-pdf-hover-adaptive'] },
      { step: '20', hex: '#fdcece', cssVar: '--primitive-po-red-20', refs: ['--color-format-pdf-pressed', '--color-format-pdf-pressed-adaptive'] },
      { step: '30', hex: '#fcadad', cssVar: '--primitive-po-red-30', refs: [] },
      { step: '40', hex: '#fa8c8c', cssVar: '--primitive-po-red-40', refs: [] },
      { step: '50', hex: '#f95c5c', cssVar: '--primitive-po-red-50', refs: ['--color-format-pdf', '--color-state-error'] },
      { step: '60', hex: '#d34e4e', cssVar: '--primitive-po-red-60', refs: [] },
      { step: '70', hex: '#ad4040', cssVar: '--primitive-po-red-70', refs: [] },
      { step: '80', hex: '#883232', cssVar: '--primitive-po-red-80', refs: [] },
      { step: '90', hex: '#632424', cssVar: '--primitive-po-red-90', refs: [] },
    ],
  },
  {
    title: 'PO AI Purple',
    swatches: [
      { step: '05', hex: '#f5f1fd', cssVar: '--primitive-po-ai-purple-05', refs: ['--color-ai-hover'] },
      { step: '10', hex: '#ede5fe', cssVar: '--primitive-po-ai-purple-10', refs: [] },
      { step: '20', hex: '#e0d1ff', cssVar: '--primitive-po-ai-purple-20', refs: ['--color-ai-pressed'] },
      { step: '30', hex: '#c6a9ff', cssVar: '--primitive-po-ai-purple-30', refs: [] },
      { step: '40', hex: '#9d75ec', cssVar: '--primitive-po-ai-purple-40', refs: [] },
      { step: '50', hex: '#6f3ad0', cssVar: '--primitive-po-ai-purple-50', refs: ['--color-plan-ai', '--color-ai-normal'] },
      { step: '60', hex: '#602bc1', cssVar: '--primitive-po-ai-purple-60', refs: [] },
      { step: '70', hex: '#511bb2', cssVar: '--primitive-po-ai-purple-70', refs: ['--color-ai-strong', '--color-ai-pressed'] },
      { step: '80', hex: '#3e0f8d', cssVar: '--primitive-po-ai-purple-80', refs: [] },
      { step: '90', hex: '#20075c', cssVar: '--primitive-po-ai-purple-90', refs: [] },
    ],
  },
  {
    title: 'Sky Blue',
    swatches: [
      { step: '05', hex: '#e9f7fd', cssVar: '--primitive-sky-blue-05', refs: [] },
      { step: '10', hex: '#d6f0fe', cssVar: '--primitive-sky-blue-10', refs: [] },
      { step: '20', hex: '#bfe7fb', cssVar: '--primitive-sky-blue-20', refs: [] },
      { step: '30', hex: '#95d7f9', cssVar: '--primitive-sky-blue-30', refs: [] },
      { step: '40', hex: '#6ac7f7', cssVar: '--primitive-sky-blue-40', refs: [] },
      { step: '50', hex: '#2baff4', cssVar: '--primitive-sky-blue-50', refs: ['--color-plan-business'] },
      { step: '60', hex: '#2494cf', cssVar: '--primitive-sky-blue-60', refs: [] },
      { step: '70', hex: '#1e7aaa', cssVar: '--primitive-sky-blue-70', refs: [] },
      { step: '80', hex: '#176085', cssVar: '--primitive-sky-blue-80', refs: [] },
      { step: '90', hex: '#114661', cssVar: '--primitive-sky-blue-90', refs: [] },
    ],
  },
  {
    title: 'Blue',
    swatches: [
      { step: '05', hex: '#edeefc', cssVar: '--primitive-blue-05', refs: [] },
      { step: '10', hex: '#dee0ff', cssVar: '--primitive-blue-10', refs: [] },
      { step: '20', hex: '#c9cdf7', cssVar: '--primitive-blue-20', refs: [] },
      { step: '30', hex: '#a5adf2', cssVar: '--primitive-blue-30', refs: [] },
      { step: '40', hex: '#818cec', cssVar: '--primitive-blue-40', refs: [] },
      { step: '50', hex: '#4c5be5', cssVar: '--primitive-blue-50', refs: [] },
      { step: '60', hex: '#404dc2', cssVar: '--primitive-blue-60', refs: [] },
      { step: '70', hex: '#353f9f', cssVar: '--primitive-blue-70', refs: [] },
      { step: '80', hex: '#29317d', cssVar: '--primitive-blue-80', refs: [] },
      { step: '90', hex: '#1e245b', cssVar: '--primitive-blue-90', refs: [] },
    ],
  },
  {
    title: 'Violet',
    swatches: [
      { step: '05', hex: '#eeecf9', cssVar: '--primitive-violet-05', refs: [] },
      { step: '10', hex: '#e0daf8', cssVar: '--primitive-violet-10', refs: [] },
      { step: '20', hex: '#cec7ed', cssVar: '--primitive-violet-20', refs: [] },
      { step: '30', hex: '#ada3e2', cssVar: '--primitive-violet-30', refs: [] },
      { step: '40', hex: '#8c7ed7', cssVar: '--primitive-violet-40', refs: [] },
      { step: '50', hex: '#5c47c6', cssVar: '--primitive-violet-50', refs: [] },
      { step: '60', hex: '#4e3ca8', cssVar: '--primitive-violet-60', refs: [] },
      { step: '70', hex: '#40318a', cssVar: '--primitive-violet-70', refs: [] },
      { step: '80', hex: '#32266c', cssVar: '--primitive-violet-80', refs: [] },
      { step: '90', hex: '#241c4f', cssVar: '--primitive-violet-90', refs: [] },
    ],
  },
  {
    title: 'Yellow',
    swatches: [
      { step: '05', hex: '#fffaeb', cssVar: '--primitive-yellow-05', refs: [] },
      { step: '10', hex: '#fcefca', cssVar: '--primitive-yellow-10', refs: ['--color-format-note-hover', '--color-format-note-hover-adaptive'] },
      { step: '20', hex: '#fae6af', cssVar: '--primitive-yellow-20', refs: ['--color-format-note-pressed', '--color-format-note-pressed-adaptive'] },
      { step: '30', hex: '#fcda7b', cssVar: '--primitive-yellow-30', refs: [] },
      { step: '40', hex: '#f8c22e', cssVar: '--primitive-yellow-40', refs: [] },
      { step: '50', hex: '#f2b50b', cssVar: '--primitive-yellow-50', refs: ['--color-format-note'] },
      { step: '60', hex: '#d79e00', cssVar: '--primitive-yellow-60', refs: [] },
      { step: '70', hex: '#b08100', cssVar: '--primitive-yellow-70', refs: [] },
      { step: '80', hex: '#8a6500', cssVar: '--primitive-yellow-80', refs: [] },
      { step: '90', hex: '#654a00', cssVar: '--primitive-yellow-90', refs: [] },
    ],
  },
  {
    title: 'Cyan',
    swatches: [
      { step: '05', hex: '#e6f9fd', cssVar: '--primitive-cyan-05', refs: [] },
      { step: '10', hex: '#d2f4fa', cssVar: '--primitive-cyan-10', refs: ['--color-format-image-hover', '--color-format-image-hover-adaptive'] },
      { step: '20', hex: '#abebf6', cssVar: '--primitive-cyan-20', refs: ['--color-format-image-pressed', '--color-format-image-pressed-adaptive'] },
      { step: '30', hex: '#66daf2', cssVar: '--primitive-cyan-30', refs: [] },
      { step: '40', hex: '#33cded', cssVar: '--primitive-cyan-40', refs: [] },
      { step: '50', hex: '#00badb', cssVar: '--primitive-cyan-50', refs: ['--color-format-image'] },
      { step: '60', hex: '#0095b1', cssVar: '--primitive-cyan-60', refs: [] },
      { step: '70', hex: '#00758e', cssVar: '--primitive-cyan-70', refs: [] },
      { step: '80', hex: '#005c70', cssVar: '--primitive-cyan-80', refs: [] },
      { step: '90', hex: '#003f4d', cssVar: '--primitive-cyan-90', refs: [] },
    ],
  },
  {
    title: 'Etc',
    swatches: [
      { step: 'Neutral warm gray', hex: '#f0f0f0', cssVar: '--primitive-etc-neutral-warm-gray', refs: [] },
      { step: 'Red', hex: '#fb4949', cssVar: '--primitive-etc-red', refs: ['--color-state-new'] },
    ],
  },
  {
    title: 'Darkmode Gray',
    swatches: [
      { step: '10', hex: '#d8d8d8', cssVar: '--primitive-darkmode-gray-10', refs: [] },
      { step: '20', hex: '#9e9e9e', cssVar: '--primitive-darkmode-gray-20', refs: [] },
      { step: '30', hex: '#797979', cssVar: '--primitive-darkmode-gray-30', refs: [] },
      { step: '40', hex: '#6b6b6b', cssVar: '--primitive-darkmode-gray-40', refs: [] },
      { step: '50', hex: '#595959', cssVar: '--primitive-darkmode-gray-50', refs: [] },
      { step: '55', hex: '#4a4a4a', cssVar: '--primitive-darkmode-gray-55', refs: [] },
      { step: '60', hex: '#3b3b3b', cssVar: '--primitive-darkmode-gray-60', refs: [] },
      { step: '70', hex: '#2d2d2d', cssVar: '--primitive-darkmode-gray-70', refs: [] },
      { step: '80', hex: '#282828', cssVar: '--primitive-darkmode-gray-80', refs: [] },
      { step: '90', hex: '#232323', cssVar: '--primitive-darkmode-gray-90', refs: [] },
      { step: '95', hex: '#1c1c1c', cssVar: '--primitive-darkmode-gray-95', refs: [] },
    ],
  },
];
