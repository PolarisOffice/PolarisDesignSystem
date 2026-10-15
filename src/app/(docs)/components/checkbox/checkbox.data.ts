/** Checkbox 스펙 — 정본: Figma checkbox(1097:36806) 2026-08-13 실측,
 * 모양 check(체크형 checkbox 1097:36818) 2026-10-12 실측. 원형 체크(select-btn)는 가이드·패키지에 넣지 않는다.
 * Radio 는 2026-10-12 별도 페이지로 분리(radio/radio.data.ts).
 * 구 md 표(20×20·r4·1.5px·#d1d5db)는 팔레트 미등재 드리프트로 판명돼 Figma 값으로 교정 —
 * 패키지 구현과 이 표가 같은 실측을 본다. */

export const CHECKBOX_ANATOMY = [
  {
    n: '01',
    title: 'Control',
    desc: '모서리가 둥근 네모 박스. 체크형은 면 없이 체크만 그려요.',
  },
  {
    n: '02',
    title: 'Icon',
    desc: '선택 상태 표시. 선택은 체크 아이콘, 부분 선택은 가로 막대',
  },
  {
    n: '03',
    title: 'Label',
    desc: '옵션 설명 텍스트. 박스 오른쪽에 놓여요',
  },
] as const;

/** Case 프리뷰의 실물 구성 한 개 — Design 탭이 그대로 Checkbox props 로 렌더한다 */
export interface CheckboxCaseItem {
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
}

/** Case — 원본 4가지 중 Checkbox 2가지(단독·그룹) + 체크형(check, 2026-10-12).
 *  sample 은 2026-08-28 디자인팀장 검토("여기도 프리뷰 필요") 반영분 — 값은 각 desc 의
 *  상태 열거와 Code 탭 데모 구성에서만 가져왔다(창작 없음). */
export const CHECKBOX_CASES: readonly {
  n: string;
  title: string;
  desc: string;
  /** 단독 상태 나열은 가로, 그룹은 세로(Code 탭 데모와 같은 축) */
  layout: 'row' | 'column';
  /** Checkbox 모양 — 없으면 box */
  variant?: 'check';
  /** 쓰는 자리를 흉내 낸 미리보기 — 있으면 상태 나열 대신 이걸 그린다 (모양 차이는 맥락에서 보여야 읽힌다) */
  context?: { head?: string; rows: readonly { label: string; checked?: boolean }[] };
  sample: readonly CheckboxCaseItem[];
}[] = [
  {
    n: '01',
    title: 'Checkbox 단독',
    desc: '미선택 · 선택됨 · 부분 선택 · 비활성화 네 상태를 가져요.',
    layout: 'row',
    // desc 의 네 상태를 열거 순서 그대로 — 「단독」케이스라 레이블 없음
    sample: [{}, { checked: true }, { indeterminate: true }, { disabled: true }],
  },
  {
    n: '02',
    title: 'Checkbox 그룹',
    desc: '「전체 선택」이 하위 항목을 모두 제어해요. 일부만 선택되면 전체 선택은 부분 선택 상태가 돼요.',
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
    n: '03',
    title: '체크형 · 메뉴에서 켜진 항목 표시',
    desc: '메뉴·드롭다운 안에서 켜진 옵션을 표시할 때 써요. 면이 없어 글자가 주인공인 자리에 가볍게 붙어요. 꺼진 항목은 회색 체크로 남아요.',
    layout: 'column',
    variant: 'check',
    sample: [],
    context: {
      head: '보기',
      rows: [
        { label: '눈금자', checked: true },
        { label: '격자' },
        { label: '편집 기호', checked: true },
      ],
    },
  },
];

/** Checkbox size — Figma 세트 Size=21 / Size=16(box 2026-10-08, check 2026-10-12).
 *  체크·막대 표시는 박스 비율대로 줄어요. radius 는 box 기준 */
export const CHECKBOX_SIZES = [
  { size: 'md', box: '21×21px', hit: '32×32px', radius: '--radius-xs (6px)', use: '기본' },
  { size: 'sm', box: '16×16px', hit: '24×24px', radius: '--radius-xxs (4px)', use: '표처럼 14px 글자 옆' },
] as const;

/** 치수 행은 md 기준이에요. sm 은 위 CHECKBOX_SIZES 표를 따라요 */
export const CHECKBOX_SPEC = [
  { prop: 'size (md)', value: '21×21px', desc: '터치 영역 32×32. sm 은 위 Size 표를 봐요' },
  // 2026-08-28 Radius 스펙 확정 — 구 7px(실측 6.8) → radius-xs 6px 토큰
  { prop: 'border-radius', value: '--radius-xs (6px)', desc: '' },
  { prop: 'border (unchecked)', value: '2px solid --color-line-normal (#c9cdd2)', desc: '' },
  { prop: 'background (checked)', value: '--color-accent-normal (#1d7ff9)', desc: '테두리도 같은 색' },
  { prop: 'accent tone', value: 'brand --color-accent-normal · ai --color-ai-normal', desc: 'Figma purple variant' },
  { prop: 'check icon', value: '11×8px', desc: 'stroke white 2px' },
  { prop: 'indeterminate bar', value: '12×2px', desc: 'white, border-radius 2px' },
  { prop: 'label gap', value: '8px', desc: '박스 오른쪽 끝에서 레이블까지. md·sm 같아요. check 모양도 같은 자리에 레이블이 놓여요' },
  { prop: 'disabled opacity', value: '60%', desc: 'Figma 미정의 (문서 정본 유지)' },
] as const;

/** Checkbox 모양 check 치수 — box 는 위 CHECKBOX_SPEC, 여기는 check 만 다른 점 (md 기준, sm 은 박스 비율대로 줄어요) */
export const CHECKBOX_VARIANT_SPEC = [
  { prop: '면·테두리', value: '없음', desc: '누르는 영역은 그대로 32×32' },
  { prop: 'check icon', value: '14×10.18px', desc: 'box 의 체크보다 커요' },
  { prop: '선택 안 됨', value: '--color-label-assistive (#9ea4aa)', desc: '회색 체크' },
  { prop: '선택됨', value: '--color-accent-normal · ai --color-ai-normal', desc: '' },
  { prop: '부분 선택', value: '선택 색 막대 12×2', desc: '면이 없어 막대를 선택 색으로 그려요' },
] as const;

/** Guidelines — 2026-08-13 신설. 리드 문장·Case 설명·스펙 값의 재서술(창작 없음) */
export const CHECKBOX_GUIDELINES = [
  '여러 항목을 고르는 자리에 써요. 하나만 고를 땐 Radio 를 써요.',
  'Checkbox 는 네모와 체크형 두 모양이 있어요. 모양만 다르고 상태와 동작은 같아요. 어디에 놓이는지로 골라요.',
  '네모(기본): 폼·설정·필터처럼 항목 옆에서 여러 개를 고를 때. 약관 동의처럼 하나만 있을 때도 네모예요.',
  '체크형: 메뉴·드롭다운 안에서 켜진 옵션을 표시할 때. 면이 없어 글자 흐름을 끊지 않아요.',
  '한 목록 안에서는 한 모양만 써요.',
  '「전체 선택」은 Checkbox 그룹으로 해요. 일부만 선택되면 전체 선택은 부분 선택 상태가 돼요.',
  '레이블은 박스 오른쪽에 둬요.',
  'Disabled 는 흐리게 보여요.',
] as const;
