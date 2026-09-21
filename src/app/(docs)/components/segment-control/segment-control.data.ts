/** Segment Control 스펙 — 원본 `docs/components/segment-control.md` */

/** Case·Anatomy 프리뷰의 실물 구성 — Design 탭이 그대로 SegmentControl props 로 렌더한다 */
export interface SegCaseSampleItem {
  value: string;
  label: string;
  /** Pill 전용 개수 배지 */
  count?: number;
}

export interface SegCaseSample {
  variant: (typeof SEG_VARIANTS)[number];
  items: SegCaseSampleItem[];
  defaultValue: string;
}

/** Pill 견본 — Anatomy 도해(2026-08-19)와 Case 01 프리뷰가 공유한다(단일 소스).
 *  Count Badge 가 Pill 전용이라 세 파트가 전부 보이는 유일한 변형이다. */
export const SEG_PILL_SAMPLE_ITEMS: SegCaseSampleItem[] = [
  { value: 'all', label: '전체', count: 24 },
  { value: 'active', label: '진행 중', count: 8 },
  { value: 'done', label: '완료', count: 16 },
];

/** 원본 `## Case` 3가지 구성.
 *  sample 은 2026-08-28 프리뷰 반영분(toggle 패턴) — 값은 창작 없이 기존 견본에서만 가져왔다:
 *  01 = Anatomy 도해 견본 재사용, 02 = desc 의 "리스트/그리드/캘린더", 03 = Code 탭 Variant
 *  데모 견본(전체/최신/인기) 재사용. */
export const SEG_CASES: readonly { n: string; title: string; desc: string; sample: SegCaseSample }[] = [
  {
    n: '01',
    title: 'Pill (필터링)',
    desc: '카테고리·상태로 걸러낼 때. Count badge 로 결과 수를 보여줘요.',
    sample: { variant: 'pill', items: SEG_PILL_SAMPLE_ITEMS, defaultValue: 'all' },
  },
  {
    n: '02',
    title: 'Filled (뷰 전환)',
    desc: '리스트/그리드/캘린더처럼 표시 방식을 전환하는 주요 컨트롤.',
    sample: {
      variant: 'filled',
      items: [
        { value: 'list', label: '리스트' },
        { value: 'grid', label: '그리드' },
        { value: 'calendar', label: '캘린더' },
      ],
      defaultValue: 'list',
    },
  },
  {
    n: '03',
    title: 'Outlined (서브 컨트롤)',
    desc: '카드나 툴바 안처럼 배경이 이미 채워진 영역의 2차 컨트롤.',
    sample: {
      variant: 'outlined',
      items: [
        { value: 'all', label: '전체' },
        { value: 'new', label: '최신' },
        { value: 'hot', label: '인기' },
      ],
      defaultValue: 'all',
    },
  },
];

/** 언제 Segment Control 이고 언제 Tabs 인가 — DO/DON'T 가 아니라 컴포넌트 선택 기준이다 */
export const SEG_VS_TABS = {
  do: [
    '카테고리·상태 필터링',
    '리스트/그리드/캘린더 뷰 전환',
    '옵션 2~5개',
    '선택 결과가 같은 화면에 바로 반영될 때',
  ],
  dont: [
    '페이지·섹션 이동(네비게이션 몫)',
    '선택마다 URL 이 바뀌는 라우팅',
    '옵션 6개 이상',
    '탭마다 전혀 다른 콘텐츠로 이동',
  ],
} as const;

export const SEG_CONTAINER = [
  { prop: 'height (MD)', filled: '44px', pill: '— (auto)' },
  { prop: 'height (SM)', filled: '36px', pill: '— (auto)' },
  { prop: 'border-radius', filled: 'radius-md (10px)', pill: 'radius-full (999px)' },
  { prop: 'padding (container)', filled: '3px', pill: '0' },
  { prop: 'gap', filled: '2px', pill: '4px' },
  { prop: 'background', filled: '--color-bg-layer1', pill: 'transparent' },
] as const;

export const SEG_ITEM = [
  { prop: 'background', state: 'Selected', filled: '--color-accent-normal', outlined: '--color-bg-white' },
  { prop: 'background', state: 'Enabled', filled: 'transparent', outlined: 'transparent' },
  { prop: 'color', state: 'Selected', filled: '--color-label-inverse', outlined: '--color-label-normal' },
  { prop: 'color', state: 'Enabled', filled: '--color-label-subtle', outlined: '--color-label-subtle' },
  { prop: 'box-shadow', state: 'Selected', filled: 'none', outlined: 'shadow-sm' },
  { prop: 'border-radius', state: '—', filled: 'radius-sm (8px)', outlined: 'radius-sm (8px)' },
] as const;

export const SEG_COUNT_BADGE = [
  { prop: 'background', selected: 'rgba(255,255,255,0.28)', enabled: '--color-bg-layer2' },
  { prop: 'color', selected: '--color-label-inverse', enabled: '--color-label-subtle' },
  { prop: 'font-size', selected: '11px', enabled: '11px' },
  { prop: 'padding', selected: '2px 8px', enabled: '2px 8px' },
  { prop: 'border-radius', selected: 'radius-full (999px)', enabled: 'radius-full (999px)' },
] as const;

/**
 * ⚠️ tabs 페이지와 같은 문제 — `--color-label-subtle` 은 tokens.css 에 실존하지 않는다.
 * PDS 정리본이 `--color-label-alternative` 로 교정해 두었다.
 * 원본 표기는 유지하고 교정값을 함께 밝힌다.
 */
export const SEG_TOKEN_CORRECTIONS = [
  { wrong: '--color-label-subtle', right: '--color-label-alternative' },
] as const;

export const SEG_VARIANTS = ['pill', 'filled', 'outlined'] as const;

/** Anatomy — 2026-08-13 신설. 같은 페이지 Specification 값에서만 유도(창작 없음) */
export const SEG_ANATOMY = [
  { n: '01', title: 'Container', desc: 'Filled/Outlined 는 패딩 3px·radius-md 상자, Pill 은 배경 없이 항목만' },
  { n: '02', title: 'Segment Item', desc: '선택 단위. 선택되면 배경·글자색이 바뀌고 radius-sm(8px)' },
  { n: '03', title: 'Count Badge', desc: 'Pill 전용. 결과 수를 표시하는 radius-full 배지' },
] as const;
