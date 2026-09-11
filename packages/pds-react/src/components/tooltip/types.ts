import type { ReactNode } from 'react';

/**
 * 말풍선이 트리거의 어느 쪽에 붙는가. 화살표 방향과 같다.
 * 같은 축이다 — `none` 은 화살표 없이 붙는다.
 */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'none';

export interface TooltipProps {
  /** 보조 설명 한 줄. 링크·버튼을 넣지 않고, 에러 전달에 쓰지 않는다 */
  content: ReactNode;
  /** 툴팁을 띄울 대상 */
  children: ReactNode;
  placement?: TooltipPlacement;
  /** 강제로 열어 둔다(문서·테스트용). 주면 호버·포커스를 무시한다 */
  open?: boolean;
  /** 화살표 표시. @default true */
  arrow?: boolean;
  /** 첫 호버에서 뜨기까지 ms. @default 600 */
  showDelay?: number;
  /** 벗어난 뒤 사라지기까지 ms. @default 0 */
  hideDelay?: number;
  className?: string;
}
