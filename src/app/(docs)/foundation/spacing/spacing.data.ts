/** 원본 `docs/foundation/spacing.md` 의 Space token 표와 Usage 3그룹 */

export interface SpaceToken {
  token: string;
  /** 4px 기본 단위의 배수 */
  base: string;
  rem: string;
  px: number;
  /** 견본 크기 — 2px 토큰만 세로로 길게(높이 12) 그려 보이게 한 원본 예외 */
  swatch?: { w: number; h: number };
}

export const SPACE_TOKENS: SpaceToken[] = [
  { token: 'spacing-none', base: '0', rem: '0', px: 0 },
  { token: 'spacing-4xs', base: '0.5', rem: '0.125', px: 2, swatch: { w: 2, h: 12 } },
  { token: 'spacing-3xs', base: '1', rem: '0.25', px: 4, swatch: { w: 4, h: 4 } },
  { token: 'spacing-2xs', base: '2', rem: '0.5', px: 8, swatch: { w: 8, h: 8 } },
  { token: 'spacing-xs', base: '3', rem: '0.75', px: 12, swatch: { w: 12, h: 12 } },
  { token: 'spacing-sm', base: '4', rem: '1', px: 16, swatch: { w: 16, h: 16 } },
  { token: 'spacing-md', base: '5', rem: '1.25', px: 20, swatch: { w: 20, h: 20 } },
  { token: 'spacing-lg', base: '6', rem: '1.5', px: 24, swatch: { w: 24, h: 24 } },
  { token: 'spacing-xl', base: '8', rem: '2', px: 32, swatch: { w: 32, h: 32 } },
  { token: 'spacing-2xl', base: '10', rem: '2.5', px: 40, swatch: { w: 40, h: 40 } },
  { token: 'spacing-3xl', base: '12', rem: '3', px: 48, swatch: { w: 48, h: 48 } },
  { token: 'spacing-4xl', base: '16', rem: '4', px: 64, swatch: { w: 64, h: 64 } },
];

export interface UsageGroup {
  title: string;
  range: string;
  items: string[];
}

export const USAGE_GROUPS: UsageGroup[] = [
  {
    title: 'Small',
    range: 'spacing-none ~ spacing-xs · 0–12px',
    items: [
      '작은 아이콘과 텍스트 사이의 간격',
      '작은 구성 요소(예: 배지, 아이콘 버튼, 테이블 셀)의 컨테이너 패딩',
      '반복되는 요소(예: 버튼 그룹) 사이의 간격, 입력 구성 요소 내 패딩',
      '카드의 요소(예: 제목과 설명, 설명과 작업) 사이의 수직 간격',
      '트리거와 높은 요소 사이의 간격(예: 드롭다운 버튼과 메뉴 사이)',
    ],
  },
  {
    title: 'Medium',
    range: 'spacing-sm ~ spacing-lg · 16–24px',
    items: [
      '더 큰 구성 요소(예: 버튼)의 컨테이너 패딩',
      '아바타/큰 아이콘과 콘텐츠(예: 섹션 메시지) 사이의 공간',
      '카드의 요소 간 수직 간격',
      '덜 조밀하게 포장되거나 더 큰 구성 요소의 항목 간 간격',
    ],
  },
  {
    title: 'Large',
    range: 'spacing-xl ~ spacing-4xl · 32–64px',
    items: [
      '페이지의 콘텐츠 간 간격(즉, 페이지 상단과 헤더 간 간격)',
      '더 큰 콘텐츠 내의 정렬(예: 플래그 내 콘텐츠 정렬)',
    ],
  },
];
