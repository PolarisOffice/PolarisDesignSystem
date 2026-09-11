/** 정본: tokens.css §5 TYPOGRAPHY (2026-08-13 신 체계 — 스타일별 --typography-* 평탄화 토큰).
 * Font Weight 3행 · 스타일 11단계 · label-button 2종 · 반응형 표. */

export interface FontWeightRow {
  label: string;
  weight: 400 | 500 | 700;
}

export const FONT_WEIGHTS: FontWeightRow[] = [
  { label: 'Pretendard 프리텐다드 Regular 400', weight: 400 },
  { label: 'Pretendard 프리텐다드 Medium 500', weight: 500 },
  { label: 'Pretendard 프리텐다드 Bold 700', weight: 700 },
];

export interface TypeScaleRow {
  name: string;
  /** 견본 텍스트를 실제 이 크기로 렌더한다 (원본 .type-scale 동작) */
  px: number;
  weight: 400 | 700;
  lineHeight: string;
  rem: string;
  /** 토큰 베이스 이름 — -font-family / -font-size / -line-height 3분해로 제공된다 */
  token: string;
}

export const TYPE_SCALE: TypeScaleRow[] = [
  { name: 'Display', token: '--typography-display', px: 40, weight: 700, lineHeight: '140%', rem: '2.5 rem' },
  { name: 'Title', token: '--typography-title', px: 32, weight: 700, lineHeight: '140%', rem: '2.0 rem' },
  { name: 'Heading1', token: '--typography-heading1', px: 28, weight: 700, lineHeight: '140%', rem: '1.75 rem' },
  { name: 'Heading2', token: '--typography-heading2', px: 24, weight: 700, lineHeight: '140%', rem: '1.5 rem' },
  { name: 'Heading3', token: '--typography-heading3', px: 20, weight: 700, lineHeight: '140%', rem: '1.25 rem' },
  { name: 'Heading4', token: '--typography-heading4', px: 18, weight: 700, lineHeight: '140%', rem: '1.125 rem' },
  { name: 'Body1', token: '--typography-body1', px: 16, weight: 400, lineHeight: '150%', rem: '1.0 rem' },
  { name: 'Body2', token: '--typography-body2', px: 14, weight: 400, lineHeight: '150%', rem: '0.875 rem' },
  { name: 'Body3', token: '--typography-body3', px: 13, weight: 400, lineHeight: '150%', rem: '0.8125 rem' },
  { name: 'Caption1', token: '--typography-caption1', px: 12, weight: 400, lineHeight: '130%', rem: '0.75 rem' },
  { name: 'Caption2', token: '--typography-caption2', px: 11, weight: 400, lineHeight: '130%', rem: '0.6875 rem' },
];

export interface ResponsiveStyle {
  name: string;
  /** 스타일명·값 표기 글자 크기(px) — 원본이 행마다 다르게 지정 */
  labelPx: number;
  /** 미지정 행(Body·Caption)은 기본 굵기 */
  labelWeight?: 600 | 700;
  pc: string;
  mobile: string;
}

export const RESPONSIVE_STYLES: ResponsiveStyle[] = [
  { name: 'Display', labelPx: 16, labelWeight: 700, pc: '40px', mobile: '32px' },
  { name: 'Title', labelPx: 15, labelWeight: 700, pc: '32px', mobile: '28px' },
  { name: 'Heading1', labelPx: 14, labelWeight: 700, pc: '28px', mobile: '24px' },
  { name: 'Heading2', labelPx: 13, labelWeight: 600, pc: '24px', mobile: '20px' },
  { name: 'Heading3', labelPx: 13, labelWeight: 600, pc: '20px', mobile: '18px' },
  { name: 'Heading4', labelPx: 13, labelWeight: 600, pc: '18px', mobile: '16px' },
  { name: 'Body1', labelPx: 12, pc: '16px', mobile: '14px' },
  { name: 'Body2', labelPx: 12, pc: '14px', mobile: '13px' },
  { name: 'Body3', labelPx: 12, pc: '13px', mobile: '12px' },
  { name: 'Caption1', labelPx: 12, pc: '12px', mobile: '11px' },
  { name: 'Caption2', labelPx: 12, pc: '11px', mobile: '10px' },
];

/** 버튼 전용 스타일 2종 — tokens.css §5 (weight 포함 유일한 스타일 토큰) */
export interface LabelButtonStyle {
  name: string;
  token: string;
  px: number;
  weight: 500 | 700;
  lineHeight: string;
  usage: string;
}

export const LABEL_BUTTON_STYLES: LabelButtonStyle[] = [
  {
    name: 'Label Button',
    token: '--typography-label-button',
    px: 16,
    weight: 700,
    lineHeight: '140%',
    usage: '기본 버튼 레이블 (Button 48px+ 급)',
  },
  {
    name: 'Label Button SM',
    token: '--typography-label-button-sm',
    px: 14,
    weight: 500,
    lineHeight: '140%',
    usage: '소형 버튼 레이블 (Button 40px 이하)',
  },
];

/**
 * 호환 별칭 대응표 — 2026-08-21 브랜드 › 서체 페이지의 '폰트 사이즈 토큰' 표에서 이관하며 **전체로 확장**.
 * 옛 표는 lg·md·sm·xs 4행뿐이었는데(원본 VitePress 시절의 부분 목록) 정본 tokens.css §7 은 5xl~xxxs
 * 11개 별칭을 전부 신 체계(--typography-*-font-size)에 연결한다. 크기는 TYPE_SCALE·RESPONSIVE_STYLES 와
 * 같은 값을 쓰고, '사용 예' 는 Button 스펙(button.data.ts 사이즈별 fontSize)에서 확인된 행만 채운다.
 */
export interface FontSizeAlias {
  /** 정본 스타일명 (TYPE_SCALE.name 과 동일) */
  style: string;
  /** 구 별칭 — 컴포넌트 코드·문서가 아직 쓰는 이름 */
  legacy: string;
  /** 확인된 사용처 — 없으면 빈 문자열(추정으로 채우지 않는다) */
  usage: string;
}

export const FONT_SIZE_ALIASES: FontSizeAlias[] = [
  { style: 'Display', legacy: '--font-size-5xl', usage: '' },
  { style: 'Title', legacy: '--font-size-4xl', usage: '페이지 제목(h1)' },
  { style: 'Heading1', legacy: '--font-size-3xl', usage: '' },
  { style: 'Heading2', legacy: '--font-size-2xl', usage: '' },
  { style: 'Heading3', legacy: '--font-size-xl', usage: '' },
  { style: 'Heading4', legacy: '--font-size-lg', usage: 'Button 64px' },
  { style: 'Body1', legacy: '--font-size-md', usage: 'Button 48–54px · 본문' },
  { style: 'Body2', legacy: '--font-size-sm', usage: 'Button 32–40px · 보조 텍스트' },
  { style: 'Body3', legacy: '--font-size-xs', usage: 'Button 24px · 캡션' },
  { style: 'Caption1', legacy: '--font-size-xxs', usage: '' },
  { style: 'Caption2', legacy: '--font-size-xxxs', usage: '' },
];
