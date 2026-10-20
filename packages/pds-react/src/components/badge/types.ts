import type { ReactNode } from 'react';

/** 글자 크기가 곧 이름 — md 14px(body2) / sm 12px(caption1). 패딩 4/12 는 같다 */
export type BadgeSize = 'md' | 'sm';

export interface BadgeProps {
  /** 라벨. Button 과 같이 자식으로 받는다 */
  children: ReactNode;
  /** 선택됨. 누를 수 있는 필터로 쓸 때의 켜진 상태 */
  selected?: boolean;
  /** 누를 수 있게 한다. 넘기면 button 으로 렌더된다 */
  onClick?: () => void;
  /** 기본 md. 표 셀처럼 좁은 자리에는 sm */
  size?: BadgeSize;
  className?: string;
}
