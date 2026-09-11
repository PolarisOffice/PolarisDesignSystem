import type { ButtonHTMLAttributes, ReactNode } from 'react';

/** 정사각 한 변(px) */
export type IconButtonSize = 40 | 32 | 28;

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 아이콘 노드. 문자열이면 자리표시 글리프를 그린다(문서 예제용) */
  icon?: ReactNode;
  /** @default 40 */
  size?: IconButtonSize;
  /**
   * 접근성 이름. 레이블이 없는 버튼이라 **반드시 준다** —
   * 그리고 PDS 규칙상 tooltip 을 함께 붙인다.
   */
  'aria-label'?: string;
}
