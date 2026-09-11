import type { ReactNode } from 'react';

export interface BadgeProps {
  /** 라벨. Button 과 같이 자식으로 받는다 */
  children: ReactNode;
  /** 선택됨. 누를 수 있는 필터로 쓸 때의 켜진 상태 */
  selected?: boolean;
  /** 누를 수 있게 한다. 넘기면 button 으로 렌더된다 */
  onClick?: () => void;
  className?: string;
}
