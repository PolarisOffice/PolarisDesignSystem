import type { ReactNode } from 'react';

/** 선택 표시 색. AI 기능 맥락에서만 ai(purple)를 쓴다 */
export type CheckboxTone = 'brand' | 'ai';

/**
 * md(기본) = 박스 21·누르는 영역 32. sm = 박스 16·누르는 영역 24.
 * sm 은 표처럼 14px 글자 옆에 놓을 때 쓴다. Figma checkbox 세트 Size=21 / Size=16
 */
export type CheckboxSize = 'md' | 'sm';

/**
 * 모양. 둘 다 같은 Checkbox(다중 선택)이고 상태도 같다.
 * box = 네모 박스(기본, 폼·설정·필터) · check = 면 없이 체크 표시만(메뉴 안 켜진 옵션, 선택 안 됨은 회색 체크)
 */
export type CheckboxVariant = 'box' | 'check';

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
  /** 기본 md(21). 표처럼 14px 글자 옆에 놓을 때는 sm(16) */
  size?: CheckboxSize;
  /** 기본 box. check = 체크 표시만 */
  variant?: CheckboxVariant;
  /** 옆에 붙는 설명. 클릭 영역에 포함된다 */
  label?: ReactNode;
  className?: string;
}
