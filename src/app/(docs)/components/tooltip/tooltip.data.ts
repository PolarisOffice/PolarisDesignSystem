/** Tooltip 스펙 — 원본 `docs/components/tooltip.md` */

export const TOOLTIP_USAGE = {
  do: [
    '아이콘 버튼처럼 레이블 없는 요소에',
    '텍스트는 1~2줄로 짧게',
    '보조 정보만. 핵심 정보는 화면에 항상 노출',
    '연속 호버는 Cascade 로 바로 표시',
  ],
  dont: [
    '링크·버튼 같은 인터랙션 콘텐츠를 안에 넣기',
    '모바일 전용 UI(호버 없음)',
    '에러·경고 전달(Toast 몫)',
    '긴 설명(Popup 몫)',
  ],
} as const;

/** 노출 정책 1 — 기본 타이밍 */
export const TOOLTIP_TIMING_DEFAULT = [
  { item: '표시 지연 (show)', value: '600ms', reason: '의도적 멈춤과 우연한 통과를 구분하는 임계점' },
  { item: '숨김 지연 (hide)', value: '0ms', reason: '마우스가 벗어나면 즉시 사라짐' },
  { item: '페이드 인 시간', value: '150ms (ease-out)', reason: '자연스러운 등장' },
  { item: '페이드 아웃 시간', value: '100ms (ease-in)', reason: '깔끔한 퇴장' },
] as const;

/** 노출 정책 2 — 케스케이드 */
export const TOOLTIP_TIMING_CASCADE = [
  { state: '첫 호버 (idle → Hover)', delay: '600ms' },
  { state: '연속 호버 (이미 툴팁 본 후)', delay: '100ms' },
  { state: '케스케이드 리셋', delay: '무호버 1,500ms 이상 경과 시 다시 600ms' },
] as const;

export const TOOLTIP_CONTAINER = [
  { prop: 'background', value: 'rgba(44,44,44,0.78)', desc: '블러 + 반투명' },
  { prop: 'backdrop-filter', value: 'blur(16px)', desc: '' },
  { prop: 'border-radius', value: '--radius-xs (6px)', desc: '' },
  { prop: 'padding', value: '6px 10px', desc: '' },
  { prop: 'offset (기본)', value: '8px', desc: '트리거 요소 상단에서 8px 간격' },
  { prop: 'box-shadow', value: '0 2px 8px rgba(0,0,0,0.2)', desc: '' },
  { prop: 'arrow size', value: '5px triangle', desc: '같은 배경색 적용' },
] as const;

export const TOOLTIP_TYPOGRAPHY = [
  { prop: 'font-size', value: '12px', desc: '' },
  { prop: 'font-weight', value: '500 (Medium)', desc: '' },
  { prop: 'color', value: '--color-static-white (#ffffff)', desc: '' },
  { prop: 'max-width', value: '200px', desc: '초과 시 줄바꿈' },
] as const;

export const TOOLTIP_ANIMATION = [
  { prop: 'show delay', value: '600ms', desc: '첫 호버 기준' },
  { prop: 'show delay (cascade)', value: '100ms', desc: '연속 호버 시' },
  { prop: 'hide delay', value: '0ms', desc: '즉시 숨김' },
  { prop: 'fade-in', value: '150ms ease-out', desc: '' },
  { prop: 'fade-out', value: '100ms ease-in', desc: '' },
  { prop: 'cascade reset', value: '무호버 1,500ms 경과', desc: '이후 다시 600ms' },
] as const;

export const TOOLTIP_POSITIONS = ['top', 'bottom', 'left', 'right'] as const;

/** Case — 화살표 포함 여부 견본 (2026-08-28 디자인 검토 반영, Design 탭 실물 프리뷰용).
 *  content 는 Code 탭 Arrow 예제의 값 그대로(저장·공유 — 창작 없음), label 은 본문
 *  "관계가 맥락상 명확한지에 따라 결정" 문장의 재서술이다. */
export const TOOLTIP_ARROW_CASES = [
  { id: 'arrow', label: 'Arrow (관계가 불분명할 때)', content: '저장', arrow: true },
  { id: 'no-arrow', label: 'Arrow 없음 (관계가 명확할 때)', content: '공유', arrow: false },
] as const;

/** Anatomy — 2026-08-13 신설. 같은 페이지 Specification 값에서만 유도(창작 없음) */
export const TOOLTIP_ANATOMY = [
  { n: '01', title: 'Container', desc: '블러 반투명 말풍선. radius 6px, padding 6px 10px, 트리거에서 8px 간격' },
  { n: '02', title: 'Text', desc: '12px / white 보조 설명. max-width 200px 초과 시 줄바꿈' },
  { n: '03', title: 'Arrow (선택)', desc: '5px 삼각형, 컨테이너와 같은 색. 트리거와의 관계가 불분명할 때만' },
] as const;
