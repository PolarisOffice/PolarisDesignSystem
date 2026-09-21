/** Table 스펙 — 원본 `docs/components/table.md` */

import type { TableColumn } from '@polarisoffice/pds-react';

/** 실물 견본 — Anatomy 도해(2026-08-19)와 Case 프리뷰(2026-08-28)가 공유한다(단일 소스).
 *  값은 기존 Anatomy 도해 견본 그대로 — 창작 없음. */
export interface TableSampleRow {
  name: string;
  role: string;
  status: string;
}

export const TABLE_SAMPLE_COLUMNS: TableColumn<TableSampleRow>[] = [
  { key: 'name', header: '이름' },
  { key: 'role', header: '역할' },
  { key: 'status', header: '상태' },
];

export const TABLE_SAMPLE_ROWS: TableSampleRow[] = [
  { name: '김하늘', role: '디자이너', status: '재직' },
  { name: '이도윤', role: '개발자', status: '재직' },
  { name: '박서연', role: '기획자', status: '휴직' },
];

export const TABLE_ANATOMY = [
  { n: '01', title: 'Container', desc: '테이블 전체. 둥근 모서리와 외곽선' },
  { n: '02', title: 'Header Row', desc: '열 제목. 배경색으로 데이터 행과 구분' },
  { n: '03', title: 'Row', desc: '데이터 한 건' },
  { n: '04', title: 'Row Divider', desc: '행 사이 경계선' },
  { n: '05', title: 'Cell', desc: '행과 열이 만나는 칸' },
] as const;

export const TABLE_SPEC = [
  { prop: 'border-radius', value: '16px', desc: 'Container' },
  { prop: 'border', value: '1px solid --color-line-neutral', desc: 'Container 외곽선' },
  { prop: 'header background', value: '--color-background-alternative', desc: 'Header row 배경' },
  { prop: 'header font-size', value: '16px (font-size-md)', desc: 'font-weight: 500' },
  { prop: 'header color', value: '--color-label-neutral', desc: '' },
  { prop: 'cell padding', value: '16px 24px', desc: '최소값 유지' },
  { prop: 'cell font-size', value: '16px (font-size-md)', desc: 'font-weight: 500' },
  { prop: 'cell color', value: '--color-label-normal', desc: '' },
  { prop: 'row divider', value: '1px solid --color-line-neutral', desc: '행 구분선' },
  { prop: 'col divider', value: '1px solid --color-line-neutral', desc: '열 구분선 (옵션)' },
] as const;

export const TABLE_USAGE = {
  do: [
    '열 너비는 콘텐츠 길이에 맞게',
    '열 구분선은 필요할 때만',
    '헤더는 항상 포함',
    'Cell padding 최소 24/16',
  ],
  dont: ['좁은 화면(모바일)에 복잡한 테이블', '열 구분선 남용'],
} as const;
