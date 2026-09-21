/**
 * Button 스펙 데이터 — Design 탭의 스펙 표와 Code 탭의 코드 스니펫이 **함께 읽는 단일 소스**.
 *
 * 이렇게 두면 variant 하나를 추가할 때 스펙 표·코드 스니펫·(패키지 배포 후엔) 라이브 미리보기가
 * 한 번에 따라온다. 코드 문자열과 렌더 JSX 를 손으로 두 벌 관리하는 문제가 애초에 안 생긴다.
 *
 * 값 출처: PDS `skill/references/components.md` > Button (Figma 원본을 semantic 토큰으로
 * 정리해 둔 정본). `docs/components/button.md` 의 CSS 와 교차 확인함.
 *
 * `as const` 유지 — 나중에 패키지의 variant prop union 타입과 맞물린다.
 */

export const BUTTON_SIZES = [
  { size: 64, height: 64, padX: 32, gap: 4, fontSize: 18, weight: 700, radius: 12, usage: '마케팅·프로모션 전용' },
  { size: 54, height: 54, padX: 20, gap: 4, fontSize: 16, weight: 700, radius: 12, usage: '히어로 영역 주요 CTA, 대형 액션' },
  { size: 48, height: 48, padX: 16, gap: 4, fontSize: 16, weight: 700, radius: 12, usage: '기본 UI 액션 (권장)' },
  { size: 40, height: 40, padX: 12, gap: 4, fontSize: 14, weight: 500, radius: 8, usage: '컴팩트 레이아웃, 필터, 검색' },
  { size: 32, height: 32, padX: 10, gap: 4, fontSize: 14, weight: 500, radius: 8, usage: '인라인 액션, 태그 영역' },
  { size: 24, height: 24, padX: 8, gap: 4, fontSize: 13, weight: 500, radius: 6, usage: '테이블, 뱃지 내부 등 초소형' },
] as const;

/** 배경이 채워진 형태 — 색은 semantic 토큰 1급 표기(2026-08-13). Sub 배경만 semantic 미정의라 primitive 직접 참조(정본 표기 그대로) */
export const BUTTON_SOLID_VARIANTS = [
  { name: 'primary', label: 'Primary', bg: '#1d7ff9', bgToken: '--color-accent-normal', fg: '#ffffff', fgToken: '--color-static-white', usage: '화면 내 가장 중요한 단일 액션' },
  { name: 'ai', label: 'AI', bg: '#6f3ad0', bgToken: '--color-ai-normal', fg: '#ffffff', fgToken: '--color-static-white', usage: 'AI 기능 진입·실행 전용 액션' },
  { name: 'sub', label: 'Sub', bg: '#d9eaff', bgToken: '--color-format-word-hover', fg: '#1458ad', fgToken: '--color-accent-strong', usage: 'Primary와 쌍을 이루는 보조 액션' },
  { name: 'gray', label: 'Gray', bg: '#f2f4f6', bgToken: '--color-fill-normal', fg: '#26282b', fgToken: '--color-label-normal', usage: '중립적인 보조 액션' },
  { name: 'black', label: 'Black', bg: '#000000', bgToken: '--color-action-normal', fg: '#ffffff', fgToken: '--color-label-inverse', usage: '다크 배경·강렬한 톤이 필요할 때' },
  { name: 'delete', label: 'Delete', bg: '#f95c5c', bgToken: '--color-state-error', fg: '#ffffff', fgToken: '--color-static-white', usage: '되돌릴 수 없는 삭제 액션' },
] as const;

/** 배경 없이 아웃라인만 있는 형태 */
export const BUTTON_GHOST_VARIANTS = [
  { name: 'ghost', label: 'Ghost', fg: '#1d7ff9', fgToken: '--color-accent-normal', border: '#e8ebed', borderToken: '--color-line-neutral', usage: 'UI 밀도를 낮추고 싶을 때' },
  { name: 'blackGhost', label: 'Black Ghost', fg: '#26282b', fgToken: '--color-label-normal', border: '#e8ebed', borderToken: '--color-line-neutral', usage: '중립 톤 아웃라인' },
  { name: 'deleteGhost', label: 'Delete Ghost', fg: '#f95c5c', fgToken: '--color-state-error', border: '#e8ebed', borderToken: '--color-line-neutral', usage: '삭제 액션의 보조 짝' },
] as const;

/**
 * State 프리뷰(Design 탭, 검토 반영 2026-08-28) — 대표 3형태(채움·중립 채움·아웃라인)의
 * Hovered 배경 토큰. 값 출처: 패키지 `packages/pds-react/src/components/button/style.ts`
 * FACES — 이 세 variant 는 hover 에 배경만 덮어쓴다.
 * Pressed 는 현 구현에 전용 색이 없어 Hovered 색이 유지된다(Design 탭 각주와 짝).
 * Disabled 는 색 고정이 아니라 실제 `disabled` prop 으로 렌더한다.
 */
export const BUTTON_STATE_DEMOS = [
  { variant: 'primary', label: 'Primary', hoverToken: '--color-accent-strong' },
  { variant: 'gray', label: 'Gray', hoverToken: '--color-fill-strong' },
  { variant: 'ghost', label: 'Ghost', hoverToken: '--color-interaction-hover' },
] as const;

/**
 * 위계 가이드 — 원본 `### Hierarchy` 의 4단계.
 * Design 탭에서 CaseList 로 렌더한다.
 * `examples` 는 설명에 언급된 variant 의 실물 견본(검토 반영 2026-08-28) —
 * 라벨은 그 위계에서 실제로 쓸 법한 문구를 쓴다(02 는 Primary 와 쌍이라는 규칙까지 보여준다).
 */
export const BUTTON_HIERARCHY = [
  {
    n: '01',
    title: 'Primary',
    desc: '핵심 CTA 하나에만 써요. 한 화면에 하나예요. AI 는 AI 기능 전용, Black 은 다크 배경이나 강렬한 톤에 써요.',
    examples: [
      { variant: 'primary', label: '확인' },
      { variant: 'ai', label: 'AI로 작성' },
      { variant: 'black', label: '완료' },
    ],
  },
  {
    n: '02',
    title: 'Secondary',
    desc: "Primary 와 짝을 이루는 보조 액션이에요. '더 알아보기'처럼 추가 선택지를 줄 때 쓰고, 단독으론 안 써요.",
    examples: [
      { variant: 'primary', label: '확인' },
      { variant: 'sub', label: '더 알아보기' },
    ],
  },
  {
    n: '03',
    title: 'Tertiary',
    // Figma 계층 절의 Tertiary 행 = Gray + Default(2026-09-18 대조 — 구 예시는 ghost 였음)
    desc: 'Primary 아래 위계의 보조 버튼이에요. 취소·이전·더보기처럼 필수는 아닌 액션에 써요. Gray 는 중립, Default 는 흰 배경 테두리예요.',
    examples: [
      { variant: 'gray', label: '취소' },
      { variant: 'default', label: '목록 더보기' },
    ],
  },
  {
    n: '04',
    title: 'Ghost',
    desc: '배경 없이 아웃라인만이에요. 무게를 낮춰 주요 액션에 시선을 모아요. Delete 계열은 삭제에만, 확인 팝업과 함께 써요.',
    examples: [
      { variant: 'ghost', label: '동의하기' },
      { variant: 'deleteGhost', label: '삭제' },
    ],
  },
] as const;

/** 원본 `### 버튼 조합` — 짝을 이루는 조합 */
/* 2026-08-28: 텍스트 나열 → Hierarchy 와 같은 케이스 블록 + 실물 견본으로 개편.
   examples 는 배치 규칙(오른쪽이 주요 액션)대로 보조가 앞, 주요가 뒤다. */
export const BUTTON_PAIRS = [
  {
    n: '01',
    title: 'Primary + Sub',
    desc: '핵심 CTA 옆에 추가 선택지를 붙이는 기본 조합이에요.',
    examples: [
      { variant: 'sub', label: '더 알아보기' },
      { variant: 'primary', label: '확인' },
    ],
  },
  {
    n: '02',
    title: 'Black + Gray',
    desc: '강렬한 톤이 필요한 화면에서 완료와 닫기를 짝지어요.',
    examples: [
      { variant: 'gray', label: '닫기' },
      { variant: 'black', label: '완료' },
    ],
  },
  {
    n: '03',
    title: 'Ghost + Default',
    desc: '시선을 콘텐츠에 두고 싶을 때 동의와 취소를 나란히 제공해요.',
    examples: [
      { variant: 'default', label: '취소' },
      { variant: 'ghost', label: '동의하기' },
    ],
  },
  {
    n: '04',
    title: 'Delete + Delete Ghost',
    desc: '되돌릴 수 없는 삭제 액션의 짝이에요. 반드시 확인 팝업과 함께 써요.',
    examples: [
      { variant: 'deleteGhost', label: '취소' },
      { variant: 'delete', label: '삭제' },
    ],
  },
] as const;

/** 원본 `### Token` — 스펙 표 */
export const BUTTON_TOKENS = [
  { token: '--color-accent-normal', value: '#1d7ff9', usage: 'Primary 배경, Ghost 텍스트' },
  { token: '--color-accent-strong', value: '#1458ad', usage: 'Primary hover, Sub 텍스트' },
  { token: '--color-label-neutral', value: '#454c53', usage: 'Default·Gray hover 텍스트' },
  { token: '--color-ai-normal', value: '#6f3ad0', usage: 'AI 배경' },
  { token: '--color-fill-normal', value: '#f2f4f6', usage: 'Gray 배경' },
  { token: '--color-fill-strong', value: '#e8ebed', usage: 'Disabled 배경' },
  { token: '--color-label-assistive', value: '#9ea4aa', usage: 'Disabled 텍스트' },
  { token: '--color-state-error', value: '#f95c5c', usage: 'Delete 배경' },
  { token: '--color-line-neutral', value: '#e8ebed', usage: 'Ghost 계열·Disabled 테두리' },
] as const;
