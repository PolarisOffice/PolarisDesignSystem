/** Checkbox & Radio 스펙 — 정본: Figma checkbox(1097:36806)·radio-btn(1097:36798) 2026-08-13 실측.
 * 구 md 표(20×20·r4·1.5px·#d1d5db)는 팔레트 미등재 드리프트로 판명돼 Figma 값으로 교정 —
 * 패키지 구현과 이 표가 같은 실측을 본다. */

export const CHECKBOX_ANATOMY = [
  {
    n: '01',
    title: 'Control',
    desc: '체크박스는 6px 라운드 박스(radius-xs), 라디오는 원형. 21×21px (터치 영역 32×32)',
  },
  {
    n: '02',
    title: 'Icon / Dot',
    desc: '선택 상태 표시. 체크박스는 체크 아이콘, 라디오는 내부 원(dot)',
  },
  {
    n: '03',
    title: 'Label',
    desc: '옵션 설명 텍스트. 컨트롤 오른쪽, gap 0(히트 영역 32 가 간격을 만들어요)',
  },
] as const;

/** Case 프리뷰의 실물 구성 한 개 — Design 탭이 그대로 Checkbox/Radio props 로 렌더한다 */
export interface CheckboxCaseItem {
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
}

/** 원본 `## Case` 4가지 구성.
 *  sample 은 2026-08-28 디자인팀장 검토("여기도 프리뷰 필요") 반영분 — 값은 각 desc 의
 *  상태 열거와 Code 탭 데모 구성에서만 가져왔다(창작 없음). */
export const CHECKBOX_CASES: readonly {
  n: string;
  title: string;
  desc: string;
  /** 프리뷰에 렌더할 실물 종류 */
  control: 'checkbox' | 'radio';
  /** 단독 상태 나열은 가로, 그룹은 세로(Code 탭 데모와 같은 축) */
  layout: 'row' | 'column';
  sample: readonly CheckboxCaseItem[];
}[] = [
  {
    n: '01',
    title: 'Checkbox 단독',
    desc: '미선택 · 선택됨 · 부분 선택(indeterminate) · 비활성화 네 상태를 가져요.',
    control: 'checkbox',
    layout: 'row',
    // desc 의 네 상태를 열거 순서 그대로 — 「단독」케이스라 레이블 없음
    sample: [{}, { checked: true }, { indeterminate: true }, { disabled: true }],
  },
  {
    n: '02',
    title: 'Radio 단독',
    desc: '미선택 · 선택됨 · 비활성화. 라디오에는 부분 선택이 없어요.',
    control: 'radio',
    layout: 'row',
    sample: [{}, { checked: true }, { disabled: true }],
  },
  {
    n: '03',
    title: 'Checkbox 그룹',
    desc: '「전체 선택」이 하위 항목을 모두 제어해요. 일부만 선택되면 전체 선택은 부분 선택 상태가 돼요.',
    control: 'checkbox',
    layout: 'column',
    // Code 탭 그룹 데모의 초기 상태([true, false, false])와 동일 — 일부만 선택돼
    // 「전체 선택」이 부분 선택이 되는 순간(desc 의 서술)을 그대로 보여 준다
    sample: [
      { label: '전체 선택', indeterminate: true },
      { label: '항목 1', checked: true },
      { label: '항목 2' },
      { label: '항목 3' },
    ],
  },
  {
    n: '04',
    title: 'Radio 그룹',
    desc: '그룹 안에서 하나만 선택돼요.',
    control: 'radio',
    layout: 'column',
    // Code 탭 RadioGroup 데모(Basic 선택)와 동일 구성
    sample: [
      { label: 'Basic', checked: true },
      { label: 'Pro' },
      { label: '비활성화', disabled: true },
    ],
  },
];

export const CHECKBOX_SPEC = [
  { prop: 'size', value: '21×21px', desc: '터치 영역 32×32' },
  // 2026-08-28 Radius 스펙 확정 — 구 7px(실측 6.8) → radius-xs 6px 토큰
  { prop: 'border-radius', value: '--radius-xs (6px)', desc: '' },
  { prop: 'border (unchecked)', value: '2px solid --color-line-normal (#c9cdd2)', desc: '' },
  { prop: 'background (checked)', value: '--color-accent-normal (#1d7ff9)', desc: '테두리도 같은 색' },
  { prop: 'accent tone', value: 'brand --color-accent-normal · ai --color-ai-normal', desc: 'Figma purple variant' },
  { prop: 'check icon', value: '11×8px', desc: 'stroke white 2px' },
  { prop: 'indeterminate bar', value: '12×2px', desc: 'white, border-radius 2px' },
  { prop: 'label gap', value: '0', desc: '히트 영역 32×32 가 박스(21)보다 넓어 간격이 생긴다' },
  { prop: 'disabled opacity', value: '60%', desc: 'Figma 미정의 (문서 정본 유지)' },
] as const;

export const RADIO_SPEC = [
  { prop: 'size', value: '21×21px', desc: '터치 영역 32×32' },
  { prop: 'border-radius', value: '50%', desc: '' },
  { prop: 'border (unchecked)', value: '2px solid --color-line-normal (#c9cdd2)', desc: '' },
  { prop: 'border (checked)', value: '2px solid --color-accent-normal', desc: 'ai 톤은 --color-ai-normal' },
  { prop: 'dot size', value: '8×8px', desc: 'filled accent' },
  { prop: 'label gap', value: '0', desc: '히트 영역 32×32 가 박스(21)보다 넓어 간격이 생긴다' },
  { prop: 'disabled opacity', value: '60%', desc: 'Figma 미정의 (문서 정본 유지)' },
] as const;

/** Guidelines — 2026-08-13 신설. 리드 문장·Case 설명·스펙 값의 재서술(창작 없음) */
export const CHECKBOX_GUIDELINES = [
  '다중 선택에는 Checkbox, 단일 선택에는 Radio 를 써요.',
  'Radio 엔 부분 선택이 없어요. 전체 선택 제어는 Checkbox 그룹으로 해요.',
  '레이블은 컨트롤 오른쪽에 붙여요. 히트 영역이 넓어 gap 없이도 간격이 생겨요.',
  'Disabled 는 투명도 60% 예요. 컴포넌트마다 다른 건 의도예요.',
] as const;
