/** Chip 스펙 — 정본: Figma Action → Chip(2026-10-13).
 *  md 는 구 Filter Chip(2026-10-08) 실측 그대로(높이 28 · 13/500 · 여백 12, × 쪽 6).
 *  sm 과 아이콘 쪽 여백은 같은 비례로 2026-10-13 에 정했다. 패키지 chip/index.tsx 의 SIZES 와 같은 값이다.
 *  2026-10-14 종류를 둘로 나눴다(조건 칩 · 선택 칩) — 하는 일이 달라 모양도 다르다. 선택 칩은 테두리 + 켜지면 체크. */

/** 종류 — Design 탭 Type 절과 Code 탭이 함께 읽는다. type 은 패키지 prop 값 */
export const CHIP_TYPES = [
  {
    type: 'default',
    name: '조건 칩',
    desc: '걸린 조건이나 값을 보여 줘요. × 로 바로 지울 수 있어요. 눌러도 선택되지 않아요.',
  },
  {
    type: 'select',
    name: '선택 칩',
    desc: '눌러서 켜고 꺼요. 여러 개가 함께 켜질 수 있어요. 켜지면 파란색으로 바뀌고 앞에 체크 표시가 붙어요.',
  },
] as const;

export const CHIP_ANATOMY = [
  { n: '01', title: 'Container', desc: '알약 모양의 면. 조건 칩은 회색 면, 선택 칩은 테두리예요' },
  { n: '02', title: 'Icon (선택)', desc: '라벨 앞 아이콘. 선택 칩은 켜지면 이 자리에 체크 표시가 와요' },
  { n: '03', title: 'Label', desc: '조건이나 항목 이름' },
  { n: '04', title: 'Remove (선택)', desc: '조건 칩을 지우는 × 버튼' },
] as const;

/** 크기 이름과 쓰는 자리 — Design 탭 Size 그림의 이름표, Code 탭 Size 예제가 함께 읽는다 */
export const CHIP_SIZES = [
  { size: 'md', height: '28px', use: '기본' },
  { size: 'sm', height: '24px', use: '표 셀 안처럼 좁은 곳' },
] as const;

/** Design 탭 Case — 그림은 chip.demo.tsx 가 그린다(× 와 누르기는 함수 prop 이라 클라이언트 파일에 둔다) */
export const CHIP_CASES = [
  {
    n: '01',
    id: 'filter',
    title: '걸린 조건 보여 주기',
    desc: '필터를 버튼 안에 모아 두었을 때, 지금 걸린 조건을 조건 칩으로 보여 줘요. × 로 그 조건만 바로 풀어요.',
  },
  {
    n: '02',
    id: 'toggle',
    title: '여러 개 고르기',
    desc: '카테고리나 태그를 여러 개 켜고 끌 때 선택 칩을 써요. 켜진 칩은 파란색에 체크 표시가 붙어요.',
  },
] as const;

export const CHIP_USAGE = {
  do: [
    '걸린 조건은 「팀: 디자인」처럼 무엇의 어떤 값인지 함께 써요',
    '같은 종류의 조건은 칩 하나로 묶어요',
    '한 줄에는 한 종류의 칩만 둬요',
    '한 줄 안에서는 크기를 하나로 맞춰요',
  ],
  dont: [
    '조건 칩을 눌러서 선택되게 쓰지 않아요(선택 칩 몫)',
    '긴 문장을 넣지 않아요',
    '하나만 고르는 전환에 쓰지 않아요(Segment Control 몫)',
    '주요 액션을 칩으로 만들지 않아요(Button 몫)',
  ],
} as const;

/** Chip 과 Badge 를 고르는 기준 — 두 컴포넌트가 실제로 가진 것만 적는다 */
export const CHIP_VS_BADGE = [
  { item: '글자', chip: '작고 가볍게', badge: '크고 굵게' },
  { item: '붙일 수 있는 것', chip: '앞 아이콘, 지우기(×), 체크 표시', badge: '없음' },
  { item: '크기', chip: '두 단계', badge: '하나' },
  { item: '쓰는 자리', chip: '걸린 조건을 보여 주고 지우거나, 여러 개를 골라 켜고 끌 때', badge: '글자만 있는 굵은 태그를 켜고 끌 때' },
] as const;

/* ── Code 탭 Specification ─────────────────────────────── */

export const CHIP_SIZE_SPEC = [
  { prop: 'height', md: '28px', sm: '24px' },
  { prop: 'padding', md: '4px 12px', sm: '4px 10px' },
  { prop: 'padding (아이콘·체크 쪽)', md: '8px', sm: '6px' },
  { prop: 'padding (× 쪽)', md: '6px', sm: '4px' },
  { prop: 'font', md: '13px / 500', sm: '12px / 500' },
  { prop: 'line-height', md: '20px', sm: '16px' },
  { prop: 'icon · check', md: '16×16px', sm: '14×14px' },
  { prop: '× 버튼', md: '18×18px (기호 14)', sm: '16×16px (기호 12)' },
  { prop: 'gap', md: '아이콘 4px · × 2px', sm: '아이콘 4px · × 2px' },
  { prop: 'border-radius', md: '99px', sm: '99px' },
] as const;

export const CHIP_COLOR_SPEC = [
  {
    state: '조건 칩',
    bg: '--color-fill-normal',
    text: '--color-label-neutral',
    border: '없음',
    remove: '--color-label-alternative (hover --color-label-neutral)',
  },
  {
    state: '선택 칩 · 기본',
    bg: '--color-background-base',
    text: '--color-label-neutral',
    border: '1px --color-line-normal (안쪽)',
    remove: '—',
  },
  {
    state: '선택 칩 · 선택됨',
    bg: '#d9eaff (po_blue/10, Badge 선택 배경과 같아요)',
    text: '--color-accent-normal (체크 포함)',
    border: '없음',
    remove: '—',
  },
] as const;
