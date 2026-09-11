import type { ReactNode } from 'react';

/** MD 35×20 · SM 28×16 — 라벨형은 폭이 내용을 따른다 */
export type ToggleSize = 'md' | 'sm';

export interface ToggleProps {
  /** 제어 모드 */
  checked?: boolean;
  /** 비제어 모드의 초기 상태 */
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** @default 'md' */
  size?: ToggleSize;
  /** 무엇을 켜고 끄는지 밝힌다 */
  label?: ReactNode;
  /** 결과를 짐작하기 어려울 때 한 줄 덧붙인다 */
  description?: ReactNode;
  /** 접근성 이름 — 레이블이 없을 때 반드시 준다 */
  'aria-label'?: string;
  className?: string;
}
