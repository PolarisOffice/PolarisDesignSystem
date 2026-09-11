import type { ReactNode } from 'react';

export interface DimProps {
  /** 스피너와 문구를 함께 보인다. 끄면 딤만 깔린다 */
  loading?: boolean;
  /** 스피너 아래 문구. 기본 'loading' */
  label?: ReactNode;
  /** 화면 전체를 덮을지, 부모 박스만 덮을지 */
  fullscreen?: boolean;
  className?: string;
}
