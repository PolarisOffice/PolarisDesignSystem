export type SkeletonShape = 'rect' | 'circle' | 'text';

export interface SkeletonProps {
  /** `circle` 은 아바타, `text` 는 문장 한 줄. 기본은 `rect` */
  shape?: SkeletonShape;
  /** 너비. 기본은 모양별(rect·text 240, circle 48) */
  width?: number | string;
  /** 높이. 기본은 모양별(rect 120, text 16, circle 은 너비와 같다) */
  height?: number | string;
  className?: string;
}
