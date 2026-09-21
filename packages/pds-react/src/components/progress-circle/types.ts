/** 박스 크기(px). 링과 선 두께가 따라온다 — 18/12/1.5 · 24/16/2 · 32/22/3 · 48/32/4 */
export type ProgressCircleSize = 18 | 24 | 32 | 48;

export interface ProgressCircleProps {
  /** 박스 크기. 18·24·32 는 아이콘과 같은 자리, 48 은 전체 화면 딤 위 */
  size?: ProgressCircleSize;
  /**
   * 호의 색. 기본은 `label/alternative`.
   * 어두운 배경·Black 버튼 위에서는 `static/white`, 버튼 안에서는 라벨 색을 따르도록
   * `currentColor` 를 넘긴다. 브랜드·AI 색도 그대로 지정할 수 있다.
   */
  color?: string;
  className?: string;
  /** 화면 낭독기용 이름. 기본 'loading' — 장식으로 쓸 때는 `aria-hidden` 을 넘긴다 */
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}
