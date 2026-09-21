/** Loading 스펙 — Design 탭 표와 Code 탭 스니펫의 단일 소스. 원본 Figma `Feedback → Loading`(3192:233) */

/** Anatomy 항목 — 세 표시의 역할 한 줄씩 */
export const LOADING_ANATOMY = [
  { n: '01', title: 'Progress Circle', desc: '1~4초의 짧은 로딩. 버튼 안이나 전체 화면 딤 위' },
  { n: '02', title: 'Progress Bar', desc: '4초 이상, 진행률을 아는 작업' },
  { n: '03', title: 'Skeleton', desc: '첫 진입과 목록 로딩. 실제 콘텐츠 자리에 골격만' },
] as const;

/* ── Progress Circle ─────────────────────────────────────── */

export const CIRCLE_SIZES = [
  { size: 18, ring: 12, stroke: 1.5, use: '아이콘 박스. 버튼 안 같은 좁은 자리' },
  { size: 24, ring: 16, stroke: 2, use: '아이콘 박스' },
  { size: 32, ring: 22, stroke: 3, use: '아이콘 박스' },
  { size: 48, ring: 32, stroke: 4, use: '전체 화면 딤 위' },
] as const;

/** 소요 시간 기준 — Loading 세 컴포넌트가 공유하는 선택 기준이다 */
export const DURATION_RULES = [
  { duration: '1초 이내', rule: '표시하지 않아요.' },
  { duration: '1~4초', rule: 'Progress Circle 또는 Skeleton' },
  { duration: '4~10초', rule: 'Skeleton 또는 Progress Bar' },
  { duration: '10초 이상', rule: 'Progress Bar + 예상 소요 시간' },
  { duration: '1분 이상', rule: '백그라운드 처리 또는 취소 수단' },
] as const;

export const CIRCLE_COLORS = [
  { context: '기본', token: '--color-label-alternative', desc: '밝은 배경 위' },
  { context: '어두운 배경 · Black 버튼', token: '--color-static-white', desc: '딤 위도 같아요' },
  { context: '버튼 안', token: 'currentColor', desc: '버튼 라벨 색을 그대로 따라가요' },
  { context: '그 밖', token: '자유', desc: '브랜드·AI 색 등 화면에 맞게' },
] as const;

export const CIRCLE_MOTION = [
  { prop: '주기', value: '2,000ms', desc: '' },
  { prop: '앞끝(trim end)', value: '0 → 1,667ms 동안 1% → 100%', desc: '뒤끝과 구간이 겹쳐 호가 길어졌다 짧아져요' },
  { prop: '뒤끝(trim start)', value: '333 → 2,000ms 동안 0% → 99%', desc: '' },
  { prop: '회전', value: '주기당 356.4도, linear', desc: '트림이 되돌아가는 각도와 같아 이음매가 보이지 않아요' },
  { prop: '이징', value: 'cubic-bezier(0.333, 0, 0.667, 1)', desc: '표준 ease-in-out 과 같은 곡선' },
  { prop: '구현', value: 'stroke-dasharray · stroke-dashoffset', desc: '' },
] as const;

export const CIRCLE_USAGE = {
  do: [
    '1~4초의 짧은 로딩에 써요.',
    '버튼 안, 전체 화면 딤 위에 써요.',
    '어두운 배경에선 static/white 로 바꿔요.',
  ],
  dont: [
    '1초 안에 끝나는 작업엔 안 띄워요.',
    '진행률이 필요한 작업엔 Progress Bar 를 써요.',
    '한 영역에 하나만 둬요.',
    '실패하면 로딩을 걷고 오류와 다음 행동을 안내해요.',
  ],
} as const;

/* ── Progress Bar ────────────────────────────────────────── */

export const BAR_TYPES = [
  {
    type: 'indeterminate',
    label: 'Indeterminate',
    desc: '진행률을 모를 때. 너비 30% 구간이 반복해 지나가요.',
  },
  {
    type: 'determinate',
    label: 'Determinate',
    desc: '진행률을 알 때. value(0~100) 만큼 좌에서 우로 채워요.',
  },
] as const;

export const BAR_SPECS = [
  { prop: '높이', value: '4px', desc: '기본값. 필요하면 height 로 조정해요' },
  { prop: '너비', value: '100%', desc: '부모 폭을 따라요' },
  { prop: 'border-radius', value: '--radius-full', desc: '트랙과 채움 모두' },
  { prop: '트랙', value: '--color-fill-normal', desc: '' },
  { prop: '채움', value: '--color-label-alternative', desc: 'color 로 브랜드·AI 색 지정' },
] as const;

export const BAR_MOTION = [
  { prop: 'Indeterminate 주기', value: '1,500ms', desc: '' },
  { prop: 'Indeterminate 구간', value: '전체 너비의 30% 가 좌에서 우로 이동', desc: '' },
  { prop: 'Indeterminate 이징', value: 'linear', desc: '진행률을 모르므로 일정한 속도로 움직여요' },
  { prop: 'Determinate 전환', value: '값이 바뀔 때 200ms ease-out', desc: '' },
] as const;

export const BAR_USAGE = {
  do: [
    '4초 이상, 진행률을 아는 작업에 써요.',
    '10초를 넘으면 예상 시간도 보여줘요.',
    '화면 전체 진행은 헤더 아래 전체 폭으로 둬요.',
    '항목별 진행은 그 항목 아래에 둬요.',
  ],
  dont: [
    '진행률을 모르면 Determinate 로 흉내내지 않아요.',
    '1초 안에 끝나는 작업엔 안 띄워요.',
    '한 영역에 하나만 둬요.',
    '실패하면 막대를 걷고 오류와 다음 행동을 안내해요.',
  ],
} as const;

/* ── Skeleton ────────────────────────────────────────────── */

export const SKELETON_SHAPES = [
  { shape: 'rect', label: 'Rect', size: '240 × 120', radius: '--radius-md (12px)', use: '카드·썸네일·이미지 자리' },
  { shape: 'circle', label: 'Circle', size: '48 × 48', radius: '--radius-full', use: '아바타' },
  { shape: 'text', label: 'Text', size: '240 × 16', radius: '--radius-xs (6px)', use: '문장 한 줄' },
] as const;

export const SKELETON_MOTION = [
  { prop: '주기', value: '2,000ms', desc: '' },
  { prop: '투명도', value: '100% → 30% → 100%', desc: '' },
  { prop: '이징', value: 'ease-in-out', desc: '양 끝에서 부드럽게 멈췄다 돌아와요' },
] as const;

export const SKELETON_USAGE = {
  do: [
    '첫 진입과 목록 로딩에 써요.',
    '실제 콘텐츠와 같은 자리·크기로 둬요.',
    'Circle 은 아바타, Text 는 한 줄에 써요.',
    '여러 줄은 쌓고 마지막 줄은 짧게 해요.',
  ],
  dont: [
    '정적인 요소엔 쓰지 않아요.',
    'shimmer 그라데이션을 얹지 않아요.',
    '실제 콘텐츠와 다른 크기로 두지 않아요. 끝날 때 화면이 튀어요.',
    '실패하면 골격을 걷고 오류와 다음 행동을 안내해요.',
  ],
} as const;
