import type { CSSProperties } from 'react';

/** 데모를 여는 버튼 — PDS 컴포넌트가 아니라 견본용 장치다 */
export const demoTrigger: CSSProperties = {
  padding: '0 16px',
  height: 40,
  borderRadius: 12,
  border: '1px solid var(--color-line-neutral, #e8ebed)',
  background: 'var(--color-background-base, #fff)',
  color: 'var(--color-label-normal, #26282b)',
  fontFamily: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};
