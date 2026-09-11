import type { ReactNode } from 'react';

/** 선택 표시 색. AI 기능 맥락에서만 purple 을 쓴다  */
export type RadioTone = 'brand' | 'ai';

export interface RadioProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  tone?: RadioTone;
  label?: ReactNode;
  /** 같은 그룹으로 묶을 이름 */
  name?: string;
  value?: string;
  className?: string;
}

export interface RadioGroupProps {
  /** `<Radio>` 들. name·tone·선택 상태는 그룹이 내려준다 */
  children: ReactNode;
  /** 그룹 이름 — 자식 Radio 에 자동으로 내려간다 */
  name: string;
  /** 제어 모드 */
  value?: string;
  /** 비제어 모드의 초기 선택 */
  defaultValue?: string;
  onChange?: (value: string) => void;
  tone?: RadioTone;
  disabled?: boolean;
  /** 가로 배치. 기본은 세로 */
  inline?: boolean;
  className?: string;
}
