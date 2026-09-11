import type { ReactNode } from 'react';

/** 높이가 곧 이름 — LG 52 / MD 38 / SM 26 (md 산문 Specification) */
export type SelectSize = 'lg' | 'md' | 'sm';

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
