import type { ReactNode } from 'react';

/**
 * Primary 는 메인 네비게이션(indicator 가 accent), Secondary 는 섹션 안
 * 2차 분류(indicator 가 어둡다). **같은 계층에 섞어 쓰지 않는다.**
 */
export type TabVariant = 'primary' | 'secondary';

/** fill = 균등 분할(3~5개), hug = 레이블 길이만큼(6개 이상·길이가 제각각일 때) */
export type TabLayout = 'fill' | 'hug';

/** 높이·글자 단계 — MD 44 / SM 40 */
export type TabSize = 'medium' | 'small';

export interface TabItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** 제어 모드 */
  value?: string;
  /** 비제어 모드의 초기 선택 */
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: TabVariant;
  /** @default 'hug' */
  layout?: TabLayout;
  /** @default 'medium' */
  size?: TabSize;
  className?: string;
}
