/** Input Field 스펙 — 원본 `docs/components/input.md` (원본 12페이지 중 가장 큰 609줄) */

export const INPUT_ANATOMY = [
  { n: '01', title: 'Container', desc: '테두리와 배경으로 입력 영역을 구분해요' },
  { n: '02', title: 'Title', desc: '입력 후에도 필드를 식별할 수 있게 해줘요' },
  { n: '03', title: 'Left Icon', desc: '입력 유형을 아이콘으로 직관적으로 전달해요' },
  { n: '04', title: 'Right Icon', desc: '비밀번호 표시/숨김 전환에만 사용해요' },
  { n: '05', title: 'Error Message', desc: '유효성 실패 시 원인을 텍스트로 안내해요' },
] as const;

/** Type·Case 프리뷰의 실물 구성 — Design 탭이 그대로 InputField props 로 렌더한다 */
export interface InputSample {
  label?: string;
  placeholder?: string;
  /** 견본 값 — Design 탭이 defaultValue 로 넘긴다(표시 전용) */
  value?: string;
  type?: 'password';
  error?: string;
  /** 패키지 UserIcon 을 leftIcon 으로 — 노드 생성은 Design 탭 몫(데이터는 직렬화 가능하게) */
  userIcon?: boolean;
}

/** `## Type` — 4가지 형태.
 *  sample 은 2026-08-28 디자인팀장 검토("여기도 프리뷰 필요") 반영분 — 값은 같은 페이지의
 *  Code 탭 예제·Anatomy 견본에서만 가져왔다(창작 없음). */
export const INPUT_TYPES: readonly { n: string; title: string; desc: string; sample: InputSample }[] = [
  {
    n: '01',
    title: 'Simple (Placeholder only)',
    desc: '짧은 단일 입력에 써요. 검색창·인라인 필터처럼 레이블 공간이 없는 경우에 적합해요.',
    // Code 탭 Base(Simple) 그대로
    sample: { placeholder: 'placeholder' },
  },
  {
    n: '02',
    title: 'Labeled',
    desc: '입력 후에도 어떤 필드인지 알아야 할 때 써요. 활성화 시 title이 상단에 고정돼 컨텍스트를 유지해줘요.',
    // 값이 있어야 title 고정(desc 의 핵심)이 보인다 — Code 탭 Error 예제의 값 재사용,
    // error 는 빼서 Done 배치만 남긴다. 빈 Labeled 는 Simple 과 픽셀이 같아 견본이 못 된다
    sample: { label: '이메일', value: 'polaris@' },
  },
  {
    n: '03',
    title: 'Visible 아이콘',
    desc: '비밀번호 필드에만 써요. 눈 아이콘을 탭하면 입력값이 노출돼요. 기본 상태는 숨김(eye-off)이에요.',
    // Anatomy 견본 값 재사용(error 없이). 눈 아이콘은 type=password 의 기본 동작
    sample: { label: '비밀번호', type: 'password', value: 'pds1234' },
  },
  {
    n: '04',
    title: '사람 아이콘',
    desc: '이메일·아이디처럼 입력 유형을 아이콘으로 암시할 때 써요. Left Icon은 입력 목적을 직관적으로 전달해요.',
    // Code 탭 Left Icon 예제 그대로
    sample: { label: '아이디', placeholder: '아이디 입력', userIcon: true },
  },
];

/** `## Case` — 상태별 맥락.
 *  sample 규칙은 INPUT_TYPES 와 같다. Active(01)는 focus 가 상호작용 전용이라 실물 그대로는
 *  못 만들고, Button State 그리드 선례(표시용 상태 고정)대로 **테두리만 Active 색으로 고정**한
 *  표시용 렌더를 쓴다(activeBorder — 배치는 값이 있으면 Focus 와 동일하다는 패키지 주석 근거).
 *  캐럿(커서)은 정적 재현이 불가능해 생략. 살아있는 Active 는 Code 탭에서 필드를 클릭해 본다. */
export const INPUT_CASES: readonly {
  n: string;
  title: string;
  desc: string;
  sample: InputSample | null;
  /** 표시용 Active 테두리 고정 (2026-08-28 피드백 — Case 01 프리뷰 누락 보완) */
  activeBorder?: boolean;
}[] = [
  {
    n: '01',
    title: 'Active',
    desc: '사용자가 필드를 탭하거나 클릭한 순간이에요. Border가 Blue로 바뀌고 커서가 나타나요.',
    // Labeled(Type 02) 견본과 같은 값 — 값이 있어야 Focus 와 같은 배치가 된다
    sample: { label: '이메일', value: 'polaris@' },
    activeBorder: true,
  },
  {
    n: '02',
    title: 'Error',
    desc: '유효성 검사에 실패했을 때예요. 빨간 테두리만으론 부족해요. 반드시 Error Message로 무엇이 잘못됐는지 구체적으로 알려줘야 해요.',
    // Code 탭 Error 예제 그대로
    sample: { label: '이메일', value: 'polaris@', error: '이메일 형식이 올바르지 않습니다.' },
  },
  {
    n: '03',
    title: '입력완료 && Focus out',
    desc: '포커스가 빠져나간 후 값이 남아 있는 상태예요. Border는 기본색으로 돌아오지만 입력 값은 유지돼요.',
    // Done 배치 = Type 02(Labeled)와 같은 상태라 같은 견본을 쓴다
    sample: { label: '이메일', value: 'polaris@' },
  },
];

export const INPUT_USAGE = {
  do: [
    '레이블은 입력 필드의 목적을 명확히 설명',
    '에러 발생 시 구체적인 원인을 Error Message로 안내',
    '비밀번호 필드에는 항상 Right Icon(눈 아이콘) 제공',
    '이메일/아이디 필드에는 Left Icon으로 입력 유형 표시',
  ],
  dont: [
    'Placeholder만으로 레이블 대체 금지 (입력 시 맥락 사라짐)',
    '에러 상태에서 에러 메시지 없이 빨간 테두리만 표시 금지',
    '불필요한 아이콘 중복 사용 금지',
    'Disabled 상태에서 에러 상태 혼용 금지',
  ],
} as const;

export const INPUT_CONTAINER = [
  { prop: 'height', value: '52px', desc: 'simple · labeled 공통' },
  { prop: 'border-radius', value: '8px', desc: '' },
  { prop: 'border-width', value: '1px', desc: '모든 상태 공통' },
  { prop: 'padding-x', value: '20px', desc: '아이콘 없을 때' },
  { prop: 'padding-x (with left icon)', value: '46px', desc: '좌측 아이콘 존재 시' },
] as const;

export const INPUT_BORDER_STATES = [
  { state: 'Default', token: '--color-line-neutral', raw: '#e8ebed' },
  { state: 'Active', token: '--color-accent-normal', raw: '#1d7ff9' },
  { state: 'Error', token: '--color-state-error', raw: '#f95c5c' },
  { state: 'Filled', token: '--color-line-neutral', raw: '#e8ebed' },
  { state: 'Disabled', token: '--label/disable', raw: 'opacity 35%' },
] as const;

export const INPUT_TYPOGRAPHY = [
  { el: 'Value', size: '14px', weight: '400', color: '--color-label-normal (#26282b)' },
  { el: 'Placeholder', size: '14px', weight: '400', color: '--color-label-assistive (#9ea4aa)' },
  { el: 'Title Label', size: '12px', weight: '400', color: '--color-label-assistive (#9ea4aa)' },
  { el: 'Error Message', size: '13px', weight: '400', color: '--color-state-error (#f95c5c)' },
] as const;

export const INPUT_ICON = [
  { prop: 'size', value: '18×18px', desc: 'Left / Right 공통' },
  { prop: 'color', value: '--color-label-assistive (#9ea4aa)', desc: '기본 아이콘 색' },
  { prop: 'left icon position', value: '20px from edge', desc: '' },
  { prop: 'right icon position', value: '20px from edge', desc: '' },
  { prop: 'error icon size', value: '16×16px', desc: '에러 메시지 앞 아이콘' },
  { prop: 'error message margin-top', value: '4px', desc: 'container 하단 간격' },
] as const;
