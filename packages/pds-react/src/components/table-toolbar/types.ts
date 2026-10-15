import type { ReactNode } from 'react';

/** 행을 골랐을 때 1행을 대신하는 일괄 작업 바 */
export interface TableToolbarSelection {
  /** 선택한 행 수. 0 이면 바를 그리지 않고 평소 1행을 보인다 */
  count: number;
  /** 일괄 작업 버튼들 — 개수 바로 뒤에 붙는다 */
  actions?: ReactNode;
  /**
   * 오른쪽 끝 '선택 해제' 를 눌렀을 때. 누른 버튼이 바와 함께 사라지므로 키보드 포커스는
   * 쓰는 쪽이 남아 있는 곳(검색 입력·표 등)으로 옮긴다. 필터 칩(Chip onRemove)을 지울 때도 같다
   */
  onClear: () => void;
  /** @default '선택 해제' */
  clearLabel?: string;
}

export interface TableToolbarProps {
  /** 왼쪽 — 검색·필터·필터 초기화 */
  start?: ReactNode;
  /** 오른쪽 — 건수·액션 */
  end?: ReactNode;
  /** 1행 아래 줄 — 적용된 필터 칩. 일괄 작업 중엔 보이지 않지만 자리는 남아 표가 움직이지 않는다 */
  below?: ReactNode;
  /** 주고 count > 0 이면 1행 전체를 일괄 작업 바로 바꾼다 */
  selection?: TableToolbarSelection;
  className?: string;
}
