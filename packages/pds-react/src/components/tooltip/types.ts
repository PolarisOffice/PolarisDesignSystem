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
  /**
   * 말풍선을 document.body 에 position: fixed 로 띄운다. 표처럼 overflow 가 잘라내는
   * 컨테이너 안에서 쓴다. 이때만 top 의 위쪽 공간이 모자라면 bottom 으로 뒤집는다. @default false
   */
  portal?: boolean;
  /** 호버·포커스로 열지 않는다(열려 있으면 닫는다). open(강제)이 이보다 우선한다. @default false */
  disabled?: boolean;
  className?: string;
}
