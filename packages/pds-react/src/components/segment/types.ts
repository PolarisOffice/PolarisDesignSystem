import type { ReactNode } from 'react';

/**
 * pill — 캡슐형(필터 태그, 개수 배지 지원)
 * filled — 선택 항목을 accent 로 채운다(주요 뷰 전환)
 * outlined — 선택 항목이 흰 배경 + 그림자(서브 컨트롤)
 */
export type SegmentVariant = 'pill' | 'filled' | 'outlined';

/** fill = 균등 분할 · hug = 레이블 길이만큼 */
export type SegmentLayout = 'fill' | 'hug';

/** MD 44 · SM 36 */
export type SegmentSize = 'md' | 'sm';

export interface SegmentItem {
  value: string;
  label: ReactNode;
  /** pill 전용 개수 배지 */
  count?: ReactNode;
  /** 좌측 아이콘 */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentControlProps {
  items: SegmentItem[];
  /** 제어 모드 */
  value?: string;
  /** 비제어 모드의 초기 선택 */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** @default 'pill' */
  variant?: SegmentVariant;
  /** @default 'hug' */
  layout?: SegmentLayout;
  /** @default 'md' */
  size?: SegmentSize;
  className?: string;
}
