/** 원본 `docs/foundation/iconography.md` 의 Size Variation 표(.sv-table) */

export interface SizeVariation {
  /** 아이콘 크기(px) */
  size: string;
  stroke: string;
  padding: string;
  liveArea: string;
  /** 외부 Padding — 헤더 부제 "타치영역 축출을 위한" 은 원본 표기 그대로 */
  outerPadding: string;
}

export const SIZE_VARIATIONS: SizeVariation[] = [
  { size: '18', stroke: '1', padding: '1/1/1/1', liveArea: '16×16', outerPadding: '15/15/15/15' },
  { size: '24', stroke: '1.5', padding: '2/2/2/2', liveArea: '20×20', outerPadding: '12/12/12/12' },
  { size: '32', stroke: '2', padding: '3/3/3/3', liveArea: '26×26', outerPadding: '8/8/8/8' },
  { size: '40', stroke: '2', padding: '4/4/4/4', liveArea: '32×32', outerPadding: '4/4/4/4' },
];
