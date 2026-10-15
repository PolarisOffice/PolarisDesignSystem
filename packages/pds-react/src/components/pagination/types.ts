export interface PaginationProps {
  /** 현재 페이지(1부터). 범위를 벗어나면 화면은 첫·마지막 페이지로 맞춰 그린다 */
  page: number;
  /** 한 페이지 행 수 */
  pageSize: number;
  /** 전체 행 수 */
  total: number;
  /** 이전·다음을 눌렀을 때 — 바뀔 페이지 번호를 넘긴다 */
  onPageChange: (page: number) => void;
  /** 페이지 크기 선택지. onPageSizeChange 와 함께 줘야 선택 상자가 보인다 */
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  className?: string;
}
