/** Select 스펙 — 원본 `docs/components/select.md` */

export const SELECT_ANATOMY = [
  {
    n: '01',
    title: 'Container',
    desc: '트리거 영역 전체. 상태(default/open/filled/disabled)에 따라 border 색상이 변경됨',
  },
  {
    n: '02',
    title: 'Placeholder / Value',
    desc: '선택 전에는 Placeholder, 선택 후에는 선택된 값 텍스트를 표시',
  },
  { n: '03', title: 'Chevron Icon', desc: '닫힘 시 아래 방향, 열림 시 위 방향으로 전환' },
] as const;

/** 프리뷰 공용 견본 — Design 탭 Anatomy 견본과 같은 값(단일 소스, 창작 없음).
 *  value 'a'(문서)가 Filled·Size 프리뷰의 선택 표본 */
export const SELECT_SAMPLE = {
  placeholder: '옵션을 선택하세요',
  options: [
    { value: 'a', label: '문서' },
    { value: 'b', label: '스프레드시트' },
    { value: 'c', label: '프레젠테이션' },
  ],
} as const;

/** State 프리뷰의 실물 구성 — Design 탭이 그대로 Select props 로 렌더한다 */
export interface SelectStatePreview {
  value?: string;
  disabled?: boolean;
}

/** preview 는 2026-08-28 디자인팀장 검토("여기도 프리뷰 필요") 반영분.
 *  Open 만 null — open 은 패키지 내부 상태라(prop 미제공) 정적 렌더가 불가능하고,
 *  실물 아닌 재현은 두지 않는다. 열린 실물은 Code 탭에서 트리거를 눌러 본다. */
export const SELECT_STATES: readonly {
  state: string;
  border: string;
  token: string;
  desc: string;
  preview: SelectStatePreview | null;
}[] = [
  { state: 'Default', border: '#e8ebed', token: '--color-line-neutral', desc: '닫힘, 미선택', preview: {} },
  {
    state: 'Open',
    border: '#1d7ff9',
    token: '--color-accent-normal',
    desc: '메뉴 노출 중, chevron 위 방향',
    preview: null,
  },
  { state: 'Filled', border: '#e8ebed', token: '--color-line-neutral', desc: '값 선택 완료, 닫힘', preview: { value: 'a' } },
  {
    state: 'Disabled',
    border: '#e8ebed',
    token: '--color-line-neutral',
    desc: '비활성화, 배경·radius는 Default와 동일, 텍스트·아이콘만 opacity: 40%',
    preview: { disabled: true },
  },
];

export const SELECT_SIZES = [
  { prop: 'height', lg: '52px', md: '38px', sm: '26px' },
  { prop: 'padding', lg: '0 8px 0 12px', md: '0 8px 0 12px', sm: '0 8px 0 4px' },
  { prop: 'font-size', lg: '14px', md: '13px', sm: '13px' },
  { prop: 'border-radius', lg: '8px', md: '8px', sm: '6px' },
  { prop: 'chevron', lg: '24×24px', md: '18×18px', sm: '14×14px' },
] as const;

export const SELECT_USAGE = {
  do: [
    '5개 이상의 옵션 선택 시 Dropdown 사용',
    '선택된 값은 trigger 텍스트에 반영',
    '메뉴 리스트는 Context & Menu Item 컴포넌트 사용',
    'trigger 너비에 맞게 메뉴 너비 일치',
  ],
  dont: [
    '2–4개 옵션은 Segment Control 사용 권장',
    '메뉴 내 복잡한 UI 삽입 금지',
    'Disabled 상태에서 tooltip 없이 단순 비활성화 금지',
  ],
} as const;

export const SELECT_TRIGGER_SPEC = [
  { prop: 'height (lg)', value: '52px', desc: '' },
  { prop: 'height (md)', value: '38px', desc: '' },
  { prop: 'padding (lg)', value: '0 8px 0 12px', desc: 'left 12px / right 8px' },
  { prop: 'padding (md)', value: '0 8px 0 12px', desc: 'left 12px / right 8px' },
  { prop: 'padding (sm)', value: '0 8px 0 4px', desc: 'left 4px / right 8px' },
  { prop: 'border-radius (lg)', value: '8px', desc: '' },
  { prop: 'border-radius (md)', value: '8px', desc: '' },
  { prop: 'border-radius (sm)', value: '6px', desc: '' },
  { prop: 'border (default)', value: '1px solid --color-line-neutral (#e8ebed)', desc: '' },
  { prop: 'border (open)', value: '1px solid --color-accent-normal (#1d7ff9)', desc: '' },
  { prop: 'background', value: '--color-background-base (#ffffff)', desc: '' },
  { prop: 'placeholder color', value: '--color-label-assistive (#9ea4aa)', desc: '' },
  { prop: 'value color', value: '--color-label-normal (#26282b)', desc: '' },
  { prop: 'font-size (lg)', value: '14px (font-size/sm)', desc: '' },
  { prop: 'font-size (md/sm)', value: '13px (font-size/xs)', desc: '' },
  { prop: 'chevron (lg)', value: '24×24px', desc: 'Open 시 위 방향' },
  { prop: 'chevron (md)', value: '18×18px', desc: '' },
  { prop: 'chevron (sm)', value: '14×14px', desc: '' },
  { prop: 'disabled opacity (text/icon)', value: '40%', desc: '배경·border-radius는 Default와 동일' },
] as const;

export const SELECT_MENU_SPEC = [
  { prop: 'offset (trigger 기준)', value: '4px', desc: 'trigger 하단에서 4px 간격' },
  { prop: 'width', value: 'trigger 동일', desc: '' },
  { prop: 'border-radius', value: '8px', desc: '' },
  { prop: 'box-shadow', value: '0 2px 6px rgba(0,0,0,0.06)', desc: 'shadow/shadow-md' },
  { prop: '내부 아이템', value: '→ Context & Menu Item 스펙 참조', desc: '' },
] as const;
