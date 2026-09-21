/** Context & Menu Item 스펙 — 원본 `docs/components/context-menu.md` */

export const MENU_ANATOMY = [
  {
    n: '01',
    title: 'Container (Menu List)',
    desc: '리스트 컨테이너. radius 8px, padding 4px, gap 4px, shadow-md',
  },
  {
    n: '02',
    title: 'Menu Item (Check Icon + Label)',
    desc: '높이 28px. 18×18 체크 아이콘 + 레이블(gap 8px), hover 시 배경 채움',
  },
  { n: '03', title: 'Divider', desc: '그룹을 나누는 1px 선. 필요할 때만' },
] as const;

/** 아이템 구성 케이스 — Figma 1054:24690 Case 밴드 (case1·case2 는 2026-08-21 추가분).
 *  2026-08-28: 텍스트 나열 → 버튼 Hierarchy 형 케이스 블록으로 개편, sample 은 기존
 *  인라인 견본(디자인 탭)을 데이터로 이동한 것(값 동일·창작 없음). */
export interface MenuCaseItem {
  label: string;
  /** true 면 체크 자리 유지(선택 목록) — false/미지정이면 hideCheck 렌더 */
  check?: boolean;
  selected?: boolean;
  submenu?: boolean;
}

export const MENU_CASES: readonly { n: string; title: string; desc: string; sample: readonly MenuCaseItem[] }[] = [
  {
    n: '01',
    title: 'Case 1 · 텍스트 전용',
    desc: '레이블만. 선택 표시가 필요 없는 명령 목록이에요.',
    sample: [
      { label: '새 문서' },
      { label: '열기' },
      { label: '저장' },
    ],
  },
  {
    n: '02',
    title: 'Case 2 · 텍스트 + 우측 체브론',
    desc: '하위 메뉴로 진입하는 항목. 우측에 18×18 체브론을 둬요.',
    sample: [
      { label: '내보내기', submenu: true },
      { label: '공유', submenu: true },
      { label: '최근 문서', submenu: true },
    ],
  },
  {
    n: '03',
    title: 'Case 1+2 · 혼용',
    desc: '하위 메뉴가 있는 항목과 없는 항목이 섞여요. 체브론 유무가 곧 더 들어갈 수 있는지의 신호예요.',
    sample: [
      { label: '이름 바꾸기' },
      { label: '내보내기', submenu: true },
      { label: '삭제' },
    ],
  },
  {
    n: '04',
    title: 'Case 3 · 체크 + 텍스트',
    desc: '현재 값을 표시하는 선택 목록. 거의 단독으로 쓰고, 체크 자리는 항상 남겨 정렬을 지켜요.',
    sample: [
      { label: '자동 저장', check: true, selected: true },
      { label: '맞춤법 검사', check: true },
      { label: '다크 모드', check: true },
    ],
  },
];

/** Multi-column + Scroll 프리뷰 견본 (2026-08-28 디자인 검토 반영 — Design 탭 실물 프리뷰용).
 *  이 절엔 예문이 따로 없어 Demo 탭(ScrollDemo)·Figma 견본과 같은 'Text N' 플레이스홀더를
 *  쓴다(창작 없음). 멀티 컬럼 2열×5행, 스크롤 12개 — 12개는 ScrollDemo 와 동일한 수. */
export const MENU_MULTI_COLUMNS: readonly (readonly string[])[] = [0, 1].map((col) =>
  Array.from({ length: 5 }, (_, i) => `Text ${col * 5 + i + 1}`),
);
export const MENU_SCROLL_ITEMS: readonly string[] = Array.from({ length: 12 }, (_, i) => `Text ${i + 1}`);

export const MENU_USAGE = {
  do: [
    '너비는 부모 기준 fill',
    '항목이 많으면 max-height + 스크롤',
    '그룹 구분이 필요하면 Divider',
    '선택된 항목은 Selected 로 표시',
  ],
  dont: [
    '한 메뉴에 10개 이상(그룹 분리 검토)',
    '아이템 안에 이미지·멀티라인 같은 복잡한 UI',
    '고정 너비(px) 지정',
  ],
} as const;

export const MENU_LIST_SPEC = [
  { prop: 'background', value: '--color-background-base (#ffffff)', desc: '' },
  { prop: 'border-radius', value: '8px', desc: '' },
  { prop: 'box-shadow', value: '0 2px 6px rgba(0,0,0,0.06)', desc: 'shadow/shadow-md' },
  { prop: 'padding', value: '4px', desc: '아이템 간 gap: 4px' },
  { prop: 'width', value: 'fill (부모 기준)', desc: '고정 너비 사용 금지' },
  { prop: 'max-height (scroll)', value: '220px', desc: '초과 시 overflow-y: auto' },
] as const;

/** 상태별로 값이 갈리는 행 + 공통 행이 한 표에 섞여 있다 — 원본 구조 유지 */
export const MENU_ITEM_STATEFUL = [
  {
    prop: 'background',
    default: '#ffffff',
    hover: '--color-interaction-hover (#f2f4f6)',
    selected: '--color-interaction-pressed (#e8ebed)',
  },
  {
    prop: 'color',
    default: '--color-label-neutral (#454c53)',
    hover: '--color-label-neutral (#454c53)',
    selected: '--color-label-normal (#26282b)',
  },
  { prop: 'font-weight', default: '400', hover: '400', selected: '500' },
] as const;

export const MENU_ITEM_COMMON = [
  { prop: 'height', value: '28px' },
  { prop: 'padding', value: '6px' },
  { prop: 'border-radius', value: '6px' },
  { prop: 'font-size', value: '13px (font-size/xs)' },
  { prop: 'check icon size', value: '18×18px' },
  { prop: 'submenu chevron size', value: '18×18px (우측, Case 2)' },
  { prop: 'icon-label gap', value: '8px' },
] as const;
