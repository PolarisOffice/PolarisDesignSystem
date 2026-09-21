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
      '아이콘과 텍스트 사이',
      '배지·아이콘 버튼·테이블 셀 안쪽 여백',
      '버튼 그룹처럼 반복되는 요소 사이, 입력 필드 안쪽 여백',
      '카드 안 제목·설명·액션 사이 세로 간격',
      '드롭다운 버튼과 메뉴 사이',
    ],
  },
  {
    title: 'Medium',
    range: 'spacing-sm ~ spacing-lg · 16–24px',
    items: [
      '버튼 등 큰 요소의 안쪽 여백',
      '아바타·큰 아이콘과 콘텐츠 사이',
      '카드 안 블록 사이 세로 간격',
      '느슨한 목록이나 큰 컴포넌트의 항목 사이',
    ],
  },
  {
    title: 'Large',
    range: 'spacing-xl ~ spacing-4xl · 32–64px',
    items: [
      '페이지 섹션 사이, 헤더와 본문 사이',
      '큰 영역 안 콘텐츠 정렬',
    ],
  },
];
