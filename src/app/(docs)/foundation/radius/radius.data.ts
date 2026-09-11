/** 원본 `docs/foundation/radius.md` 의 Radius token 표 */
export interface RadiusToken {
  token: string;
  /** CSS border-radius 값 — 미리보기 박스에 그대로 쓴다 */
  css: string;
  /** 표에 표시할 px 숫자 */
  px: string;
  usage: string;
}

export const RADIUS_TOKENS: RadiusToken[] = [
  { token: 'radius-none', css: '0', px: '0', usage: 'Square (각진 요소)' },
  { token: 'radius-xxs', css: '4px', px: '4', usage: '작은 컴포넌트 (Badge 등)' },
  { token: 'radius-xs', css: '6px', px: '6', usage: 'Checkbox, Tooltip' },
  { token: 'radius-sm', css: '8px', px: '8', usage: '인풋 박스' },
  { token: 'radius-md', css: '12px', px: '12', usage: '표준 버튼, 모달 창 및 일반적인 카드' },
  { token: 'radius-lg', css: '16px', px: '16', usage: '큰 버튼(54px 높이 등), 섹션 카드' },
  { token: 'radius-xl', css: '24px', px: '24', usage: '강조가 필요한 버튼이나 팝업' },
  { token: 'radius-2xl', css: '38px', px: '38', usage: 'Bottom Sheet' },
  { token: 'radius-3xl', css: '64px', px: '64', usage: '' },
  { token: 'radius-full', css: '999px', px: '999', usage: '알약 모양(Pill) 버튼' },
];
