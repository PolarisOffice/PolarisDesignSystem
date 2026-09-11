/** 원본 `docs/foundation/elevation.md` 의 Elevation Levels 6단계 · Shadow tokens · Z-Index Scale */

export interface ElevationLevel {
  level: string;
  /** 신호 — mono=false 는 원본에서 monospace 칩(.el-signal) 없이 일반 텍스트("그림자 없음") */
  signal: string;
  mono: boolean;
  usage: string;
}

export const ELEVATION_LEVELS: ElevationLevel[] = [
  { level: 'Flat', signal: '그림자 없음', mono: false, usage: '인라인 카드, 페이지 섹션, 리스트 아이템' },
  { level: 'Surface', signal: 'Border 1px', mono: true, usage: '인풋, 코드 블록, 비활성카드, 정보박스' },
  { level: 'Raised', signal: 'shadow-sm', mono: true, usage: '카드, 위젯' },
  { level: 'Floating', signal: 'shadow-md', mono: true, usage: '드롭다운, 툴팁' },
  { level: 'Overlay', signal: 'shadow-lg', mono: true, usage: '모달, 바텀 시트' },
  { level: 'Top', signal: 'shadow-xl', mono: true, usage: '토스트' },
];

export interface ShadowToken {
  token: string;
  /** light/dark 값 표기는 콘텐츠 — 리터럴 유지 */
  light: string;
  dark: string;
  usage: string;
}

export const SHADOW_TOKENS: ShadowToken[] = [
  {
    token: 'shadow-sm',
    light: '0 1px 8px rgba(0,0,0,0.04)',
    dark: '0 1px 8px rgba(0,0,0,0.08)',
    usage: '위젯',
  },
  {
    token: 'shadow-md',
    light: '0 2px 12px rgba(0,0,0,0.06)',
    dark: '0 2px 12px rgba(0,0,0,0.12)',
    usage: '드롭다운, 툴팁',
  },
  {
    token: 'shadow-lg',
    light: '0 4px 16px rgba(0,0,0,0.08)',
    dark: '0 4px 16px rgba(0,0,0,0.16)',
    usage: '모달, 바텀 시트',
  },
  {
    token: 'shadow-xl',
    light: '0 6px 24px rgba(0,0,0,0.12)',
    dark: '0 6px 24px rgba(0,0,0,0.24)',
    usage: '토스트',
  },
];

export interface ZIndexToken {
  token: string;
  value: string;
  usage: string;
}

export const Z_INDEX_TOKENS: ZIndexToken[] = [
  { token: 'z-base', value: '0', usage: '일반 콘텐츠' },
  { token: 'z-sticky', value: '100', usage: '스티키 헤더, 고정 탭' },
  { token: 'z-dropdown', value: '200', usage: '드롭다운, 툴팁, 팝오버' },
  { token: 'z-dim', value: '300', usage: 'Dim 오버레이' },
  { token: 'z-modal', value: '400', usage: '모달, 팝업, 바텀 시트' },
  { token: 'z-toast', value: '500', usage: '토스트 알림' },
];
