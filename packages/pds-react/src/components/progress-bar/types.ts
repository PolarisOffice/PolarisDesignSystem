export type ProgressBarType = 'indeterminate' | 'determinate';

export interface ProgressBarProps {
  /**
   * `indeterminate` 는 진행률을 모를 때(짧은 구간이 좌에서 우로 반복 이동),
   * `determinate` 는 `value` 만큼 좌에서 우로 채운다.
   */
  type?: ProgressBarType;
  /** 진행률 0~100. `determinate` 에서만 쓰인다 */
  value?: number;
  /** 채움 색. 기본은 `label/alternative` — 브랜드·AI 색으로 바꿀 수 있다 */
  color?: string;
  /** 트랙 색. 기본은 `fill/normal` */
  trackColor?: string;
  /** 막대 높이(px). 기본 4 */
  height?: number;
  className?: string;
  /** 화면 낭독기용 이름 */
  'aria-label'?: string;
}
