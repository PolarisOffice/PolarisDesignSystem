import type { ReactNode } from 'react';

/**
 * 높이 축 — InputField 와 같은 4단계. 같은 높이의 Button 과 한 줄에 선다.
 * - `lg` 52: 폼(기본)
 * - `md` 40: 검색
 * - `sm` 32: 표 툴바·촘촘한 화면
 * - `xs` 28: 표 셀 안 등 좁은 곳(글자 13)
 */
export type SelectSize = 'lg' | 'md' | 'sm' | 'xs';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** 값이 없을 때 보이는 문구. 레이블 대체용으로 쓰지 않는다 */
  placeholder?: ReactNode;
  size?: SelectSize;
  disabled?: boolean;
  /** 트리거 폭. 기본은 부모를 채운다 */
  width?: number | string;
  id?: string;
  className?: string;
}
