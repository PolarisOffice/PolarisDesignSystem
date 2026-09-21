/** Toast 스펙 — 원본 `docs/components/toast.md` */

export const TOAST_ANATOMY = [
  { n: '01', title: 'Container', desc: '블러 반투명 배경, border-radius 12px, padding 13px 16px' },
  { n: '02', title: 'Status Icon', desc: 'Error / Success 상태 구분. 20×20px SVG 아이콘' },
  { n: '03', title: 'Message', desc: '1~2줄 피드백 텍스트. 14px / white' },
  { n: '04', title: 'Close', desc: '수동으로 닫는 버튼. 기본 opacity 55%' },
] as const;

export const TOAST_VARIANTS = [
  { name: 'default', label: 'Default', icon: '—', color: '', usage: '일반 안내 메시지' },
  { name: 'error', label: 'Error', icon: '!', color: '#F95C5C', colorToken: '--color-state-error', usage: '작업 실패, 오류 발생' },
  /* ⚠️ success 용 semantic state 토큰 미정의 — 팔레트 green-60 직접 참조 (state-success 신설은 디자인 결정 필요) */
  { name: 'success', label: 'Success', icon: '✓', color: '#51B41B', colorToken: '--primitive-green-60', usage: '작업 완료, 저장 성공' },
] as const;

export const TOAST_USAGE = {
  do: [
    '메시지는 1~2줄로 짧게',
    '작업 결과(성공/실패)를 즉시 피드백할 때',
    '한 번에 하나만',
    '자동 닫힘 3,000ms 유지',
  ],
  dont: [
    '확인·결정이 필요하면 Popup',
    '긴 메시지나 상세 설명',
    '여러 개 동시 노출',
    '링크·버튼 등 인터랙션 요소',
  ],
} as const;

/** Toast vs Popup 결정 표 — 플랫폼 무관 판단 기준이라 그대로 보존 */
export const TOAST_VS_POPUP = [
  { item: '사용자 확인 필요', toast: '✗', popup: '✓' },
  { item: '자동 닫힘', toast: '✓ 3초', popup: '✗' },
  { item: '화면 차단', toast: '✗', popup: '✓' },
  { item: '적합한 상황', toast: '저장 완료, 오류 발생', popup: '삭제 확인, 약관 동의' },
] as const;

export const TOAST_CONTAINER = [
  { prop: 'background', value: 'rgba(44,44,44,0.78)', desc: '블러 + 반투명' },
  { prop: 'backdrop-filter', value: 'blur(16px)', desc: '' },
  { prop: 'border-radius', value: 'radius-md (12px)', desc: '' },
  { prop: 'padding', value: '13px 16px', desc: '' },
  { prop: 'max-width', value: '480px', desc: '' },
  { prop: 'min-width', value: '280px', desc: '' },
  { prop: 'box-shadow', value: '0 4px 20px rgba(0,0,0,0.25)', desc: '' },
  { prop: 'position (top)', value: 'top: 50px', desc: '화면 상단 기준' },
  { prop: 'position (bottom)', value: 'bottom: 50px', desc: '화면 하단 기준' },
] as const;

export const TOAST_STATUS_ICON = [
  { variant: 'Error', bg: '#F95C5C', bgToken: '--color-state-error', icon: '! (Exclamation circle)' },
  { variant: 'Success', bg: '#51B41B', bgToken: '--primitive-green-60', icon: '✓ (Checkmark circle)' },
] as const;

export const TOAST_TYPOGRAPHY = [
  { el: 'Message', size: '14px', weight: '400', color: '--color-static-white (#ffffff)' },
  { el: 'Close Icon', size: '16×16px', weight: '—', color: 'rgba(255,255,255,0.55)' },
  { el: 'Close Icon :hover', size: '—', weight: '—', color: 'rgba(255,255,255,0.9)' },
] as const;

/**
 * `### 의도와 맥락` — 언제 쓰는가.
 * `type` 은 Design 탭 실물 프리뷰가 띄우는 variant (2026-08-28 디자인 검토 반영) —
 * Demo 탭의 호출(toast.success/error)과 같은 짝을 유지한다.
 */
export const TOAST_CONTEXT = [
  {
    n: '01',
    title: '백그라운드 처리 완료 알림',
    desc: '저장·업로드·설정 변경처럼 요청한 작업이 끝난 직후 결과를 알려요. 화면 흐름은 그대로예요.',
    sample: '변경 사항이 저장되었습니다.',
    type: 'success',
  },
  {
    n: '02',
    title: '즉각적인 오류 피드백',
    desc: '네트워크 오류·처리 실패처럼 바로 알아야 하지만 응답은 필요 없는 오류예요. 재시도는 사용자 몫이에요.',
    sample: '파일 업로드에 실패했습니다.',
    type: 'error',
  },
  {
    n: '03',
    title: '비파괴적 상태 변경 확인',
    desc: '복사·즐겨찾기처럼 되돌리기 쉬운 액션의 결과를 확인해 줘요. 흐름을 막지 않고 안심시켜요.',
    sample: '링크가 클립보드에 복사되었습니다.',
    type: 'success',
  },
] as const;

export const TOAST_ANTI_CASES = [
  '확인·선택이 필요한 삭제 확인, 약관 동의는 Popup',
  '오래 떠 있어야 하는 점검 공지, 결제 오류는 Banner/Alert',
  '상세 내용이나 여러 단계 정보(Toast 는 1~2줄까지)',
  '여러 이벤트를 한꺼번에(한 번에 하나만)',
] as const;
