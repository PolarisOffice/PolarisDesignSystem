/** 원본 `docs/foundation/grid.md` 의 용어 카드 3개와 Breakpoints 표 (.bp-table) */

export interface GridTerm {
  title: string;
  desc: string;
}

export const GRID_TERMS: GridTerm[] = [
  {
    title: 'Columns',
    desc: '페이지를 동일한 수직 섹션으로 나누고 콘텐츠를 구성하는 데 사용해요.',
  },
  {
    title: 'Gutters',
    desc: 'Column 사이의 간격이며 일관된 방식으로 콘텐츠를 구분해요.',
  },
  {
    title: 'Margin',
    desc: '그리드의 바깥쪽 가장자리를 정의하고, 콘텐츠가 보이는 영역 밖으로 넘쳐흐르는 것을 막아요.',
  },
];

export interface BreakpointRow {
  token: string;
  viewport: string;
  /** 강조 표기(.bp-val) 대상 */
  columns: string;
  gutters: string;
  margins: string;
}

export const BREAKPOINTS: BreakpointRow[] = [
  { token: 'mobile', viewport: '360–767px', columns: '4', gutters: '12px', margins: '16px' },
  { token: 'tablet-vertical', viewport: '768–1023px', columns: '8', gutters: '16px', margins: '24px' },
  { token: 'tablet-horizontal', viewport: '1024–1279px', columns: '12', gutters: '16px', margins: '24px' },
  { token: 'desktop', viewport: '1280+px', columns: '12', gutters: '16px', margins: '24px' },
];

/** 다이어그램 SVG 의 12개 column 막대 x 좌표 (col≈49, gutter=8, margin=36) */
export const SVG_COL_XS = [36, 93, 150, 207, 264, 321, 378, 435, 492, 549, 606, 663];
