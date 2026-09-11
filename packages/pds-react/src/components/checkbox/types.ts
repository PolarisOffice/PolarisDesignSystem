import type { ReactNode } from 'react';

/** 선택 표시 색. AI 기능 맥락에서만 ai(purple)를 쓴다 */
export type CheckboxTone = 'brand' | 'ai';

export interface CheckboxProps {
  /** 제어 모드 */
  checked?: boolean;
  /** 비제어 모드의 초기 상태 */
  defaultChecked?: boolean;
  /** 일부만 선택된 상태. checked 보다 우선한다 */
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  tone?: CheckboxTone;
  /** 옆에 붙는 설명. 클릭 영역에 포함된다 */
  label?: ReactNode;
  className?: string;
}
