/** Tabs 스펙 — 원본 `docs/components/tabs.md` */

/** Design 탭 실물 견본의 항목 형태 — Tabs items props 로 그대로 렌더한다 */
export interface TabsSampleItem {
  value: string;
  label: string;
  disabled?: boolean;
}

/** 실물 견본 — Anatomy 도해(2026-08-19)와 Properties 유형 프리뷰(2026-08-28)가 공유한다
 *  (단일 소스). 값은 기존 Anatomy 도해 견본(홈/피드/알림, 선택=피드) 그대로 — 창작 없음. */
export const TABS_SAMPLE_ITEMS: TabsSampleItem[] = [
  { value: 'home', label: '홈' },
  { value: 'feed', label: '피드' },
  { value: 'alerts', label: '알림' },
];
export const TABS_SAMPLE_DEFAULT = 'feed';

/** State 프리뷰 견본 — Code 탭 데모 값의 재사용·조합(전체·문서 = Variant 데모 items,
 *  보관함 disabled = Disabled 데모). 선택=전체로 두면 Selected(전체)·Enabled(문서)·
 *  Disabled(보관함) 세 상태가 한 번에 보인다 — 창작 없음. */
export const TABS_STATE_SAMPLE_ITEMS: TabsSampleItem[] = [
  { value: 'all', label: '전체' },
  { value: 'doc', label: '문서' },
  { value: 'archive', label: '보관함', disabled: true },
];
export const TABS_STATE_SAMPLE_DEFAULT = 'all';

export const TABS_VARIANT_USAGE = {
  do: [
    '페이지 최상단 메인 네비게이션에는 Primary 사용',
    '섹션 내 서브 카테고리 전환에는 Secondary 사용',
    '탭이 2개 이상일 경우 서로 다른 Variant 조합',
  ],
  dont: [
    '같은 계층에 Primary와 Secondary 혼용 금지',
    '탭을 드롭다운·필터 대체재로 오용 금지',
    '페이지 간 라우팅에는 네비게이션 사용',
  ],
} as const;

/** 탭 대신 다른 컴포넌트를 써야 하는 상황 — 플랫폼 무관 결정 표 */
export const TABS_ALTERNATIVES = [
  { situation: '옵션이 2–4개이고 즉시 필터링', alternative: 'Segment Control' },
  { situation: '항목이 많거나 동적으로 변함', alternative: 'Select' },
  { situation: '다른 페이지로 이동', alternative: 'Navigation / Link' },
] as const;

export const TABLIST_SPEC = [
  { prop: 'height (medium)', value: '44px', desc: '기본 높이' },
  { prop: 'height (small)', value: '40px', desc: '소형 높이' },
  { prop: 'indicator-height', value: '2px', desc: '선택 탭 하단 강조선' },
  { prop: 'divider-height', value: '1px', desc: '탭바 하단 구분선' },
  { prop: 'indicator-transition', value: 'duration-fast (150ms)', desc: 'Indicator 슬라이드 전환' },
] as const;

/**
 * ⚠️ 원본 표의 토큰명 중 `--color-label-subtle`·`--color-label-disable` 은 tokens.css 에
 * **실존하지 않는다.** PDS 자체 정리본(skill/references/components.md)이 이를 오타로 보고
 * `--color-label-alternative`·`--color-label-assistive` 로 교정해 두었다.
 * 문서는 원본 표기를 보이되 교정값을 함께 밝힌다 — 값을 조용히 바꾸면 Figma 원본과 어긋난다.
 */
export const TAB_ITEM_SPEC = [
  {
    prop: 'label color',
    state: 'Enabled',
    primary: '--color-label-subtle',
    secondary: '--color-label-subtle',
  },
  {
    prop: 'label color',
    state: 'Selected',
    primary: '--color-accent-normal',
    secondary: '--color-label-normal',
  },
  {
    prop: 'label color',
    state: 'Disabled',
    primary: '--color-label-disable',
    secondary: '--color-label-disable',
  },
  {
    prop: 'indicator color',
    state: 'Selected',
    primary: '--color-accent-normal',
    secondary: '--color-label-normal',
  },
  { prop: 'font-weight', state: 'Selected', primary: '700 (Bold)', secondary: '700 (Bold)' },
  { prop: 'padding-x (medium)', state: '—', primary: 'spacing-md (20px)', secondary: 'spacing-md (20px)' },
  { prop: 'padding-x (small)', state: '—', primary: 'spacing-sm (16px)', secondary: 'spacing-sm (16px)' },
] as const;

/** 실존하지 않는 토큰명 → 교정값 (skill/references/components.md 기준) */
export const TAB_TOKEN_CORRECTIONS = [
  { wrong: '--color-label-subtle', right: '--color-label-alternative' },
  { wrong: '--color-label-disable', right: '--color-label-assistive' },
] as const;

/** Anatomy — 2026-08-13 신설. 같은 페이지 Specification 값에서만 유도(창작 없음) */
export const TABS_ANATOMY = [
  { n: '01', title: 'Tab Item', desc: '레이블 단위. 선택 시 굵기 700, 색이 variant 별 선택색으로 바뀌어요' },
  { n: '02', title: 'Indicator', desc: '선택 탭 하단 2px 강조선. duration-fast(150ms)로 슬라이드해요' },
  { n: '03', title: 'Divider', desc: '탭바 하단 1px 구분선. 탭 영역과 콘텐츠를 나눠요' },
] as const;
