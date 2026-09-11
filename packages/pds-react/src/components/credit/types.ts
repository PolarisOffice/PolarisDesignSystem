import type { ReactNode } from 'react';

export interface CreditProps {
  /** 남은 크레딧 수 */
  value: ReactNode;
  /**
   * 쓸 수 있는 상태인지. false 면 회색으로 가라앉는다
   */
  available?: boolean;
  /**
   * 좌측 아이콘. 디자인은 전용 크레딧 글리프를 쓰지만 패키지에 벡터를 동봉하지
   * 않으므로 기본은 단순 코인 모양이다 — 제품에서는 실제 아이콘을 넘길 것.
   */
  icon?: ReactNode;
  className?: string;
}
