/** Popup 스펙 — 원본 `docs/components/popup.md`.
 * 2026-08-21 Web 사양으로 개편 (Figma 1065:27230 의 property=web 변형이 정본, 모바일은 추후 반영):
 * Title 18→16px, X 24→18px, 버튼 48/45→32px·radius-sm·14px Medium·우측 정렬. */

export const POPUP_ANATOMY = [
  { n: '01', title: 'Title', desc: '팝업의 목적을 나타내는 제목. 16px / bold (Web)' },
  { n: '02', title: 'Close (X)', desc: '팝업을 닫는 18×18 아이콘 버튼. 선택적으로 사용' },
  { n: '03', title: 'Body', desc: '상황 설명 또는 선택 안내 텍스트. 14px / regular' },
  { n: '04', title: 'Secondary Button', desc: '취소 또는 보조 액션. 선택적으로 사용' },
  { n: '05', title: 'Primary CTA', desc: '주요 액션 버튼. 항상 포함' },
  { n: '06', title: '다시 보지 않기 (Optional)', desc: '반복 노출 방지 옵션. 필요 시에만 사용' },
] as const;

/** `### 의도와 맥락` — 언제 Popup 을 쓰는가.
 *
 * sample 은 원래 한 줄 문자열(「제목」 — 본문 (버튼 / 버튼))이었는데, Design 탭이 예문을
 * 실물 Popup 으로 렌더하게 되며(2026-08-28 디자인 검토 반영) 제목·본문·버튼으로 분해했다 —
 * **문구는 구 문자열 그대로, 창작 없음**. 버튼 variant 도 새로 정한 게 아니라 같은 케이스를
 * 이미 렌더하던 Demo 탭 호출과 동일하다(01 = TwoBtnDemo 의 default/delete — Guidelines
 * "위험 액션의 Primary 는 Red 계열" 그대로, 03 = OneBtnDemo 의 primary). */
export const POPUP_CONTEXT = [
  {
    n: '01',
    title: '되돌릴 수 없는 액션 전 확인',
    desc: '삭제, 초기화, 탈퇴 등 실행 후 복구가 어려운 작업 전에 사용자의 의도를 한 번 더 확인해요. TWO BTN 구성으로 취소 수단을 반드시 제공해요.',
    sample: {
      title: '정말 삭제할까요?',
      body: '삭제된 데이터는 복구할 수 없습니다.',
      actions: [
        { label: '취소', variant: 'default' },
        { label: '삭제', variant: 'delete' },
      ],
    },
  },
  {
    n: '02',
    title: '선택을 요구하는 분기점',
    desc: '저장 여부, 권한 허용, 약관 동의 등 사용자가 선택해야만 흐름이 이어지는 상황에 사용해요. 선택지가 명확히 구분되도록 버튼 레이블을 구체적으로 작성해요.',
    sample: {
      title: '변경 사항을 저장할까요?',
      body: '저장하지 않으면 변경 내용이 사라집니다.',
      actions: [
        { label: '저장 안 함', variant: 'default' },
        { label: '저장', variant: 'primary' },
      ],
    },
  },
  {
    n: '03',
    title: '반드시 인지해야 하는 정보 전달',
    desc: "서비스 점검, 결제 오류, 필수 업데이트 등 사용자가 확인하고 넘어가야 할 중요 정보를 전달해요. ONE BTN ('닫기' 또는 '확인') 구성으로 X 버튼 없이 사용해요.",
    sample: {
      title: '서비스 점검 안내',
      body: '6월 30일 02:00–04:00 서비스 점검이 예정되어 있습니다.',
      actions: [{ label: '확인', variant: 'primary' }],
    },
  },
] as const;

export const POPUP_ANTI_CASES = [
  '사용자 응답이 필요 없는 단순 알림 → Toast 사용 (저장 완료, 복사 성공 등)',
  '오래 표시되어야 하는 시스템 공지 → Banner/Alert 사용',
  '입력 폼이나 복잡한 다단계 작업 → 별도 페이지 또는 Bottom Sheet 사용',
  '버튼이 3개 이상 필요한 경우 → 선택지를 줄이거나 전용 화면으로 분리',
] as const;

export const POPUP_USAGE = {
  do: [
    '제목은 질문형(~할까요?) 또는 명사형으로 간결하게 작성',
    'TWO BTN: 우측(Primary)에 위계가 높은 CTA 버튼 배치',
    "'닫기' 외 다른 액션 버튼일 때 X 버튼 추가",
    "정보성 팝업에만 '다시 보지 않기' 옵션 제공",
  ],
  dont: [
    '사용자 흐름을 불필요하게 차단하는 팝업 남발 금지',
    '본문 내용이 길면 팝업 대신 별도 페이지 사용',
    '버튼 3개 이상 배치 금지',
    '위험 액션(삭제 등)의 Primary는 Red 계열 적용',
  ],
} as const;

export const POPUP_X_RULES = [
  { case: "버튼 레이블이 '닫기'", x: '✗ 불필요 (닫기 버튼으로 대체)' },
  { case: 'Alert · 정보성 모달', x: '✗ 불필요' },
  { case: '버튼 레이블이 다른 액션 (ex. 하러가기)', x: '✓ 필요 (닫을 수단 제공)' },
  { case: '다시 보지 않기 포함 팝업', x: '✓ 필요' },
] as const;

export const POPUP_CONTAINER = [
  { prop: 'width', value: '343px', desc: '' },
  { prop: 'border-radius', value: 'radius-lg (16px)', desc: '' },
  { prop: 'padding', value: '12px 16px 16px', desc: 'top / horizontal / bottom' },
  { prop: 'gap (header ↔ footer)', value: '24px', desc: '' },
  { prop: 'background', value: '--color-background-base (white)', desc: '' },
  { prop: 'box-shadow', value: '0px 2px 8px rgba(0,0,0,0.1)', desc: 'popover shadow' },
  { prop: 'overlay', value: 'rgba(0,0,0,0.4)', desc: '배경 딤 처리' },
] as const;

export const POPUP_BUTTON = [
  { prop: 'height', primary: '32px', secondary: '32px' },
  { prop: 'padding', primary: '0 10px', secondary: '0 10px' },
  { prop: 'border-radius', primary: 'radius-sm (8px)', secondary: 'radius-sm (8px)' },
  {
    prop: 'background',
    primary: '--color-accent-normal (#1d7ff9)',
    secondary: '--color-background-base (white)',
  },
  { prop: 'border', primary: 'none', secondary: '1px solid --color-line-neutral (#e8ebed)' },
  { prop: 'color', primary: '--color-static-white', secondary: '--color-label-normal (#26282b)' },
  { prop: 'font', primary: '14px / 500', secondary: '14px / 500' },
  { prop: '배치', primary: '우측 정렬 (오른쪽이 CTA)', secondary: 'Primary 왼쪽, 버튼 간 gap 8px' },
] as const;

export const POPUP_TYPOGRAPHY = [
  { el: 'Title', size: '16px', weight: '700', color: '--color-label-normal (#26282b)' },
  { el: 'Title line-height', size: '1.5', weight: '—', color: 'letter-spacing: 0' },
  { el: 'Body', size: '14px', weight: '400', color: '--color-label-neutral (#454c53)' },
  { el: '다시 보지 않기', size: '13px', weight: '500', color: '--color-label-assistive (#9ea4aa)' },
  {
    el: '다시보지않기 checkbox',
    size: '21×21px',
    weight: '—',
    color: 'border: 2px solid --color-line-normal (#c9cdd2), border-radius: 6px',
  },
  { el: 'Close (X) icon', size: '18×18px', weight: '—', color: '--color-label-assistive (#9ea4aa)' },
] as const;
