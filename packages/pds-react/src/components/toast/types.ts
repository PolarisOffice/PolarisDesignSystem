import type { ReactNode } from 'react';

/** 상태 아이콘이 갈리는 축 */
export type ToastType = 'default' | 'success' | 'error';

/** 화면 위·아래 중 어디에 띄울지. 어느 쪽이든 가장자리에서 50px 띄운다 */
export type ToastPlacement = 'top' | 'bottom';

export interface ToastProps {
  /** 한두 줄로 끝나는 사실. 안에 버튼·링크를 넣지 않는다 */
  message: ReactNode;
  type?: ToastType;
  placement?: ToastPlacement;
  /**
   * 자동 닫힘까지의 시간(ms). 기본 3000.
   * 0 이나 음수를 주면 자동으로 닫지 않는다 — 그럴 일이 있으면 Popup 을 의심할 것.
   */
  duration?: number;
  /** 자동 닫힘·직접 닫기 모두 이걸 부른다 */
  onClose?: () => void;
  /** 닫기 버튼 숨기기. 기본은 표시 */
  hideCloseButton?: boolean;
  className?: string;
}
