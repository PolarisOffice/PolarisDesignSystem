/** Date Picker 스펙 — 정본: Figma Action → Date Picker(2026-10-14).
 *  하루 칸 32 · 빠른 선택 104×32 · 패널 모서리 md · 그림자 md. 패키지 date-picker/index.tsx 의 값과 같다.
 *  입력칸은 Input Field 를 그대로 쓴다(크기 4단계·제목·오류 문구 동작이 같다). */

export const DATE_PICKER_MODES = [
  {
    mode: 'single',
    name: '날짜 하나',
    desc: '날짜 하나를 받아요. 달력만 떠요. 날짜를 누르면 바로 정해지고 달력이 닫혀요.',
  },
  {
    mode: 'range',
    name: '기간',
    desc: '시작일과 종료일을 받아요. 달력 왼쪽에 빠른 선택이 붙어요. 시작일과 종료일을 차례로 누르면 정해져요.',
  },
] as const;

export const DATE_PICKER_ANATOMY = [
  { n: '01', title: 'Field', desc: '날짜를 보여 주고 직접 칠 수 있는 입력칸. 앞에 달력 아이콘이 붙어요' },
  { n: '02', title: 'Presets (기간만)', desc: '오늘·지난 7일·지난 30일·이번 달을 한 번에 고르는 빠른 선택' },
  { n: '03', title: 'Month', desc: '보고 있는 달과 이전·다음 달로 넘기는 버튼' },
  { n: '04', title: 'Day', desc: '하루 칸. 오늘은 파란 굵은 글자, 고른 날은 파란 면이에요' },
] as const;

/** Design 탭 Day 절 — 하루 칸이 갖는 모양 */
export const DATE_PICKER_DAY_STATES = [
  { name: '기본', desc: '고를 수 있는 날. 마우스를 올리면 옅은 회색 면이 깔려요' },
  { name: '오늘', desc: '파란 굵은 글자. 고르지 않아도 늘 표시돼요' },
  { name: '고른 날', desc: '파란 면에 흰 글자. 기간이면 시작일과 종료일이 이 모양이에요' },
  { name: '기간 사이', desc: '시작일과 종료일 사이를 연한 파란 띠로 이어요' },
  { name: '앞뒤 달', desc: '보고 있는 달 밖의 날은 흐린 글자예요. 누르면 그 달로 넘어가요' },
] as const;

export const DATE_PICKER_CASES = [
  {
    n: '01',
    id: 'range',
    title: '기간 고르기',
    desc: '조회·필터 화면에서 기간을 정할 때 써요. 빠른 선택으로 한 번에 고르거나, 시작일과 종료일을 차례로 눌러요.',
  },
  {
    n: '02',
    id: 'single',
    title: '날짜 하나 고르기',
    desc: '폼에서 날짜 하나를 받을 때 써요. 빠른 선택 없이 달력만 떠요.',
  },
  {
    n: '03',
    id: 'input',
    title: '직접 입력',
    desc: '날짜를 알고 있으면 입력칸에 바로 쳐요. 형식이 틀리면 칸 아래에 알려 줘요.',
  },
] as const;

export const DATE_PICKER_USAGE = {
  do: [
    '기간을 고르는 화면에는 자주 쓰는 기간을 빠른 선택으로 둬요',
    '입력칸에 날짜 형식을 미리 보여 줘요(YYYY.MM.DD)',
    '같은 화면에서는 입력칸 크기를 다른 입력과 맞춰요',
  ],
  dont: [
    '생년월일처럼 먼 날짜를 고르는 데 달력만 두지 않아요(직접 입력을 안내해요)',
    '시작일과 종료일을 날짜 선택기 두 개로 나누지 않아요(기간 모드 하나로)',
    '시간까지 고르는 데 쓰지 않아요',
  ],
} as const;

/* ── Code 탭 Specification ─────────────────────────────── */

export const DATE_PICKER_SIZE_SPEC = [
  { prop: '입력칸', value: 'Input Field 와 같음 (lg 52 · md 40 · sm 32 · xs 28)' },
  { prop: '입력칸 너비 (기본)', value: '날짜 하나 200px · 기간 280px' },
  { prop: '입력칸 ↔ 패널', value: '4px' },
  { prop: '패널 border-radius', value: '12px (radius-md)' },
  { prop: '달력 padding', value: '16px' },
  { prop: '하루 칸', value: '32×32px · border-radius 8px' },
  { prop: '주 사이', value: '4px' },
  { prop: '요일 줄 높이', value: '24px' },
  { prop: '이전·다음 달 버튼', value: '28×28px (화살표 18)' },
  { prop: '빠른 선택 한 줄', value: '104×32px · padding 0 10px' },
  { prop: '빠른 선택 칸 padding · gap', value: '8px · 2px' },
] as const;

export const DATE_PICKER_COLOR_SPEC = [
  { part: '패널', bg: '--color-layer-surface', text: '—', etc: '테두리 1px --color-line-neutral · 그림자 shadow-md' },
  { part: '하루 칸 · 기본', bg: '없음 (hover --color-interaction-hover)', text: '--color-label-normal · 13px / 400', etc: '—' },
  { part: '하루 칸 · 오늘', bg: '없음', text: '--color-accent-normal · 13px / 700', etc: '—' },
  { part: '하루 칸 · 고른 날 · 기간 양 끝', bg: '--color-accent-normal', text: '--color-static-white · 13px / 700', etc: '—' },
  { part: '하루 칸 · 기간 사이', bg: '#d9eaff (format word hover)', text: '--color-label-normal', etc: '양 끝 칸은 안쪽 절반에 같은 띠' },
  { part: '하루 칸 · 앞뒤 달', bg: '없음', text: '--color-label-assistive', etc: '—' },
  { part: '요일', bg: '없음', text: '--color-label-assistive · 12px / 400', etc: '—' },
  { part: '빠른 선택 · 선택됨', bg: '--color-fill-normal', text: '--color-label-normal · 13px / 700', etc: '그 밖은 --color-label-neutral / 400' },
] as const;
