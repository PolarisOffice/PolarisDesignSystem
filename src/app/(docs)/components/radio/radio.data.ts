/** Radio 스펙 — 정본: Figma radio-btn(1097:36798) 2026-08-13 실측, Size=16 2026-10-12.
 * 2026-10-12 Checkbox 페이지에서 분리했다(Montage 처럼 컴포넌트마다 한 페이지). */

export const RADIO_ANATOMY = [
  { n: '01', title: 'Control', desc: '원형 링' },
  { n: '02', title: 'Dot', desc: '선택 표시. 링 안의 작은 원' },
  { n: '03', title: 'Label', desc: '옵션 설명 텍스트. 링 오른쪽에 놓여요' },
] as const;

/** Case 프리뷰의 실물 구성 한 개 — Design 탭이 그대로 Radio props 로 렌더한다 */
export interface RadioCaseItem {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
}

/** 원본 Checkbox & Radio 페이지 `## Case` 중 Radio 2가지 */
export const RADIO_CASES: readonly {
  n: string;
  title: string;
  desc: string;
  /** 단독 상태 나열은 가로, 그룹은 세로(Code 탭 데모와 같은 축) */
  layout: 'row' | 'column';
  sample: readonly RadioCaseItem[];
}[] = [
  {
    n: '01',
    title: 'Radio 단독',
    desc: '미선택 · 선택됨 · 비활성화 세 상태예요. 라디오에는 부분 선택이 없어요.',
    layout: 'row',
    sample: [{}, { checked: true }, { disabled: true }],
  },
  {
    n: '02',
    title: 'Radio 그룹',
    desc: '그룹 안에서 하나만 선택돼요.',
    layout: 'column',
    // Code 탭 RadioGroup 데모(Basic 선택)와 동일 구성
    sample: [{ label: 'Basic', checked: true }, { label: 'Pro' }, { label: '비활성화', disabled: true }],
  },
];

/** Radio size — Figma radio-btn 세트 Size=21 / Size=16(2026-10-12) */
export const RADIO_SIZES = [
  { size: 'md', ring: '21×21px', dot: '8×8px', hit: '32×32px', use: '기본' },
  { size: 'sm', ring: '16×16px', dot: '6×6px', hit: '24×24px', use: '표처럼 14px 글자 옆' },
] as const;

/** 치수 행은 md 기준이에요. sm 은 위 RADIO_SIZES 표를 따라요 */
export const RADIO_SPEC = [
  { prop: 'size (md)', value: '21×21px', desc: '터치 영역 32×32. sm 은 위 Size 표를 봐요' },
  { prop: 'border-radius', value: '50%', desc: '' },
  { prop: 'border (unchecked)', value: '2px solid --color-line-normal (#c9cdd2)', desc: '' },
  { prop: 'border (checked)', value: '2px solid --color-accent-normal', desc: 'ai 톤은 --color-ai-normal' },
  { prop: 'dot size (md)', value: '8×8px', desc: 'filled accent. sm 은 6×6' },
  { prop: 'label gap', value: '8px', desc: '링 오른쪽 끝에서 레이블까지. md·sm 같아요' },
  { prop: 'disabled opacity', value: '60%', desc: 'Figma 미정의 (문서 정본 유지)' },
] as const;

export const RADIO_GUIDELINES = [
  '여러 항목 중 하나만 고를 때 써요. 여러 개를 고를 땐 Checkbox 를 써요.',
  '하나만 고르는 항목끼리는 한 그룹으로 묶어요.',
  '선택지는 둘 이상이어야 해요. 하나뿐인 라디오는 고른 뒤 되돌릴 수 없어요.',
  '라디오에는 부분 선택이 없어요. 「전체 선택」이 필요하면 Checkbox 그룹을 써요.',
  'AI 색은 AI 기능 맥락에서만 써요.',
  '레이블은 링 오른쪽에 둬요.',
  'Disabled 는 흐리게 보여요.',
] as const;
