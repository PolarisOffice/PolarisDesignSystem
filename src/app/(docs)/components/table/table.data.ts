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

/** Code 탭 견본 — 정렬·검색·선택·페이지 예제가 공유한다.
 *  table.demo.tsx('use client')가 아니라 여기 두는 이유: 서버 컴포넌트(table.code.tsx)가
 *  'use client' 모듈의 값을 가져오면 실제 배열이 아니라 클라이언트 참조가 온다. */
export interface Member {
  id: string;
  name: string;
  email: string;
  team: string;
  status: '재직' | '휴직';
  joined: string;
}

export const TEAMS = ['디자인', '개발', '기획', '마케팅'];
const NAMES = ['김하늘', '이도윤', '박서연', '최지호', '정유나', '강민준', '조하린', '윤서준', '장예린', '임도현', '한지우', '오세아'];

/** 견본 데이터 — 같은 규칙으로 만들어 매번 같은 값이 나온다 */
export const MEMBERS: Member[] = NAMES.map((name, i) => ({
  id: `m${i + 1}`,
  name,
  email: `member${String(i + 1).padStart(2, '0')}@polarisoffice.com`,
  team: TEAMS[i % TEAMS.length],
  status: i % 5 === 2 ? '휴직' : '재직',
  joined: `2026.${String((i % 9) + 1).padStart(2, '0')}.${String(((i * 7) % 27) + 1).padStart(2, '0')}`,
}));

export const MEMBER_COLUMNS: TableColumn<Member>[] = [
  { key: 'name', header: '이름', width: 120 },
  // 한 줄 말줄임은 열 폭이 정해져야 잘린다 — auto 레이아웃이라 maxWidth(220 - 좌우 여백 48)를 함께 준다
  { key: 'email', header: '이메일', lines: 1, width: 220, maxWidth: 172 },
  { key: 'team', header: '팀', width: 100 },
  { key: 'joined', header: '입사일', numeric: true, width: 120 },
];

/** 긴 텍스트 비교 — 세 열에 같은 문장을 두고 lines 만 바꾼다(Code 탭·Design 탭 공유) */
export type Note = { clamp2: string; clamp1: string; full: string };
const LONG = '다음 분기 디자인 시스템 개편 일정과 표 컴포넌트 개선 범위를 정리했어요. 검토 후 의견을 남겨 주세요.';
export const NOTE_COLUMNS: TableColumn<Note>[] = [
  { key: 'clamp2', header: '기본 (2줄)', width: 200 },
  { key: 'clamp1', header: '1줄', lines: 1, width: 200 },
  { key: 'full', header: '제한 없음', lines: 'all', width: 200 },
];
export const NOTES: Note[] = [{ clamp2: LONG, clamp1: LONG, full: LONG }];

/** 숫자 열 — 금액·날짜는 오른쪽 정렬 + 고정폭 숫자(Code 탭·Design 탭 공유) */
export type Bill = { item: string; qty: string; amount: string; date: string };
export const BILL_COLUMNS: TableColumn<Bill>[] = [
  { key: 'item', header: '항목', align: 'left' },
  { key: 'qty', header: '수량', numeric: true },
  { key: 'amount', header: '금액', numeric: true },
  { key: 'date', header: '결제일', numeric: true },
];
export const BILLS: Bill[] = [
  { item: '팀 요금제', qty: '12', amount: '1,188,000원', date: '2026.09.01' },
  { item: '저장 공간 추가', qty: '3', amount: '29,700원', date: '2026.09.14' },
];

export const TABLE_ANATOMY = [
  { n: '01', title: 'Container', desc: '표 전체. 둥근 모서리와 외곽선' },
  { n: '02', title: 'Header Row', desc: '열 제목. 배경색으로 데이터 행과 구분' },
  { n: '03', title: 'Row', desc: '데이터 한 건' },
  { n: '04', title: 'Row Divider', desc: '행 사이 경계선' },
  { n: '05', title: 'Cell', desc: '행과 열이 만나는 칸' },
  { n: '06', title: 'Sort Icon', desc: '정렬 중인 열에만 늘 보이는 화살표' },
  { n: '07', title: 'Selection', desc: '맨 앞 체크박스 열' },
] as const;

/* 치수·색 — 값은 패키지 소스(table/cell·header·row·index, table-toolbar, pagination) 실측.
   Specification 의 H3 묶음마다 배열 하나 */
export const TABLE_SPEC_CONTAINER = [
  { prop: 'border-radius', value: '16px', desc: 'Container' },
  { prop: 'border', value: '1px solid --color-line-neutral', desc: 'Container 외곽선' },
  { prop: 'cell font-size', value: '14px (font-size-sm)', desc: 'font-weight: 500, line-height: 1.5' },
  { prop: 'cell color', value: '--color-label-normal', desc: '' },
  { prop: 'cell padding', value: '16px 24px', desc: '최소값 유지' },
  { prop: 'row height', value: '약 53px', desc: '16 + 21(14px × 1.5) + 16, 한 줄 기준' },
  { prop: 'row divider', value: '1px solid --color-line-neutral', desc: '행 구분선' },
  { prop: 'col divider', value: '1px solid --color-line-neutral', desc: '열 구분선 (옵션)' },
] as const;

export const TABLE_SPEC_HEADER = [
  { prop: 'header background', value: '--color-fill-neutral', desc: 'Header row 배경' },
  { prop: 'header font-size', value: '14px (font-size-sm)', desc: 'font-weight: 500. 본문과 같은 크기' },
  { prop: 'header color', value: '--color-label-neutral', desc: '정렬 중인 열은 --color-label-normal' },
  { prop: 'sort icon', value: '18px', desc: '--color-label-alternative. 정렬 중인 열만 늘 보이고, 나머지는 호버·포커스 때' },
  { prop: 'sort icon gap', value: '4px', desc: '글자와 아이콘 사이' },
] as const;

export const TABLE_SPEC_SELECTION = [
  { prop: 'selection column', value: '48px', desc: '왼쪽 여백 24 + 체크박스 히트 영역 24' },
  { prop: 'checkbox', value: '16px', desc: 'Checkbox size="sm". 14px 글자 옆이라 기본(21)보다 작게 써요' },
  { prop: 'resize handle', value: '8px', desc: '경계 좌우 4px 씩 히트 영역' },
  { prop: 'resize range', value: '80px ~ 640px', desc: 'minWidth·maxWidth 로 바꿔요. 방향키 한 번 10px(Shift 40px)' },
] as const;

export const TABLE_SPEC_AROUND = [
  { prop: 'toolbar height', value: '40px', desc: '최소 높이. 검색창 sm·Select sm·버튼 32 는 줄 가운데에 놓여요. 일괄 작업 줄도 같은 높이고(버튼 24), 칩 줄은 일괄 작업 중에도 자리를 남겨요' },
  { prop: 'toolbar gap', value: '8px / 12px', desc: '왼쪽 항목 사이 8px, 오른쪽(건수·액션) 사이 12px. 필터 칩 줄은 첫 줄 아래 8px' },
  { prop: 'toolbar to table', value: '12px', desc: '툴바에는 포함되지 않아요. 표와 12px 띄워요' },
  { prop: 'pagination to table', value: '12px', desc: '표 아래. 이전·다음 버튼 32px, 간격 4px' },
] as const;

export const TABLE_SPEC_STATE = [
  { prop: 'empty padding', value: '48px 24px', desc: '제목 14px 700, 설명 13px 400. 버튼은 설명 아래 16px' },
  { prop: 'skeleton rows', value: '5', desc: '첫 로딩 기본 행 수 (skeletonRows)' },
  { prop: 'loading dim', value: 'opacity 0.5', desc: '다시 불러오는 동안 기존 행' },
  { prop: 'scroll fade', value: '24px', desc: '가로로 더 볼 내용이 있는 쪽 가장자리' },
] as const;

/* 판단 기준만 — 설명·수치는 Properties 각 절과 Specification 에 있다 */
export const TABLE_USAGE = {
  do: [
    '헤더는 항상 넣기',
    '글자 열은 왼쪽, 숫자·날짜 열은 오른쪽',
    '검색·필터는 표 위 툴바에',
    '결과가 없어도 헤더는 남기기',
    '긴 텍스트는 2줄 후 말줄임 그대로',
  ],
  dont: [
    '좁은 화면(모바일)에 복잡한 표',
    '열 구분선 남용',
    '표 위 셀렉트로 정렬 대신하기',
    '넘치는 열 잘라내기',
    '빈 상태에 일러스트',
  ],
} as const;
