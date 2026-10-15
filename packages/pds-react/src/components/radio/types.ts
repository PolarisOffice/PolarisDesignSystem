import type { ReactNode } from 'react';

/** 선택 표시 색. AI 기능 맥락에서만 purple 을 쓴다  */
export type RadioTone = 'brand' | 'ai';

/**
 * md(기본) = 링 21·점 8·누르는 영역 32. sm = 링 16·점 6·누르는 영역 24.
 * sm 은 표처럼 14px 글자 옆에 놓을 때 쓴다 — Checkbox size 와 같은 축. Figma radio-btn 세트 Size=21 / Size=16
 */
export type RadioSize = 'md' | 'sm';

export interface RadioProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  tone?: RadioTone;
  /** 기본 md(21). 표처럼 14px 글자 옆에 놓을 때는 sm(16) */
  size?: RadioSize;
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
  /** 자식 Radio 에 내려간다. 자식이 따로 주면 자식 것이 우선 */
  size?: RadioSize;
  disabled?: boolean;
  /** 가로 배치. 기본은 세로 */
  inline?: boolean;
  className?: string;
}
