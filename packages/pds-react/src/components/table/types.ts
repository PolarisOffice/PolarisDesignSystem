import type { ReactNode } from 'react';

export interface TableColumn<Row> {
  /** 행 객체에서 값을 꺼낼 키 */
  key: keyof Row & string;
  /** 헤더 문구 */
  header: ReactNode;
  /** 이 열만 좌우 정렬을 바꾸고 싶을 때. 기본은 가운데 */
  align?: 'left' | 'center' | 'right';
  /** 값을 직접 그리고 싶을 때 (링크·배지 등) */
  render?: (row: Row, index: number) => ReactNode;
}

export interface TableProps<Row = Record<string, ReactNode>> {
  columns: Array<TableColumn<Row>>;
  rows: Row[];
  /**
   * 열 사이 세로 구분선. **반드시 필요할 때만** 켠다 —
   * 남용하면 표가 격자로 보여 읽기 어려워진다(PDS 규칙).
   */
  columnDivider?: boolean;
  /** 행 키. 없으면 인덱스를 쓴다 */
  rowKey?: (row: Row, index: number) => string;
  className?: string;
}
