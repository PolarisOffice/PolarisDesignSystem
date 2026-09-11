/** Toggle 스펙 — Design 탭 표와 Code 탭 스니펫의 단일 소스. 원본 `docs/components/toggle.md` */

export const TOGGLE_STATES = [
  { state: 'ON', track: '#1d7ff9', trackToken: '--color-accent-normal', desc: '활성화 상태' },
  { state: 'OFF', track: '#e5e7eb', trackToken: undefined, desc: '비활성화 상태. ⚠️ #e5e7eb 는 팔레트 미등재 값(디자인 확인 필요)' },
  { state: 'Disabled', track: '#e5e7eb + opacity 38%', trackToken: undefined, desc: '인터랙션 불가' },
] as const;

export const TOGGLE_SIZES = [
  { size: 'md', width: '52px', height: '30px', thumb: '24px', offset: '3px' },
  { size: 'sm', width: '40px', height: '24px', thumb: '18px', offset: '3px' },
] as const;

export const TOGGLE_TOKENS = [
  { prop: 'Track ON', token: '--color-accent-normal', value: '#1d7ff9' },
  /* ⚠️ 구 표기 --color-fill-normal 은 오라벨 — 그 토큰의 실값은 #f2f4f6 이고 #e5e7eb 는
   * 팔레트 미등재 값이다. 토큰화(또는 fill-strong #e8ebed 로 교정)는 디자인 결정 필요 */
  { prop: 'Track OFF', token: '— (팔레트 미등재)', value: '#e5e7eb' },
  { prop: 'Thumb', token: '--color-static-white', value: '#ffffff' },
  { prop: 'Disabled opacity', token: '—', value: '38%' },
  { prop: 'border-radius', token: '--radius-full', value: '999px' },
  { prop: 'transition', token: '—', value: 'background 0.2s' },
] as const;

/** Case 프리뷰의 실물 구성 — Design 탭이 그대로 Toggle props 로 렌더한다 */
export interface ToggleCaseSample {
  checked?: boolean;
  label?: string;
  description?: string;
}

/** 원본 `## Case` 3가지 구성.
 *  sample 은 2026-08-28 디자인팀장 검토("여기도 프리뷰 필요") 반영분 — 값은 각 desc 의
 *  예)에서만 가져왔다(창작 없음). */
export const TOGGLE_CASES: readonly { n: string; title: string; desc: string; sample: ToggleCaseSample }[] = [
  {
    n: '01',
    title: 'Toggle 단독',
    desc: '레이블 없이 토글만 배치해요. 맥락이 이미 분명한 자리에 써요.',
    sample: { checked: true },
  },
  {
    n: '02',
    title: 'Toggle + Label',
    desc: '토글이 무엇을 켜고 끄는지 레이블로 밝혀요. 예) 알림 받기, 다크 모드',
    sample: { checked: true, label: '알림 받기' },
  },
  {
    n: '03',
    title: 'Toggle + Label + Description',
    desc: '레이블만으로 결과를 짐작하기 어려울 때 설명을 덧붙여요. 예) 레이블 「푸시 알림」, 설명 「앱 알림을 받을 수 있습니다」',
    sample: { label: '푸시 알림', description: '앱 알림을 받을 수 있습니다' },
  },
];

/** Anatomy — 2026-08-13 신설. 같은 페이지 Specification 값에서만 유도(창작 없음) */
export const TOGGLE_ANATOMY = [
  { n: '01', title: 'Track', desc: '배경 트랙. ON 은 --color-accent-normal, OFF 는 #e5e7eb(팔레트 미등재, 디자인 확인 필요)' },
  { n: '02', title: 'Thumb', desc: '흰색 원형 손잡이. 상태 전환 시 좌우로 이동해요(background 0.2s)' },
  { n: '03', title: 'Label · Description (선택)', desc: '토글 오른쪽의 레이블과 보조 설명. Case 참고' },
] as const;

/** Guidelines — 2026-08-13 신설. 리드 문장·Case 설명·스펙 값의 재서술(창작 없음) */
export const TOGGLE_GUIDELINES = [
  '켜짐/꺼짐 전환 결과가 즉시 반영되는 설정에만 써요. 저장 버튼이 따로 필요한 폼에는 Checkbox 를 검토하세요.',
  '맥락이 이미 분명하면 단독으로, 무엇을 켜고 끄는지 밝혀야 하면 Label 을, 결과를 짐작하기 어려우면 Description 을 덧붙여요.',
  'Disabled 는 투명도 38% 예요. 컴포넌트마다 Disabled 방식이 다른 것은 의도된 차이예요.',
] as const;
