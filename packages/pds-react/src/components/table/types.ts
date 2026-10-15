import type { ReactNode } from 'react';

export type TableAlign = 'left' | 'center' | 'right';
export type TableSortDirection = 'asc' | 'desc';

/** 지금 정렬 상태. key 는 열 id(= id ?? key) */
export interface TableSort {
  key: string;
  direction: TableSortDirection;
}

export interface TableColumn<Row> {
  /** 행 객체에서 값을 꺼낼 키. render 만 쓰는 열이면 생략하고 id 를 준다 */
  key?: keyof Row & string;
  /** 열 식별자 — 정렬·너비·React key 에 쓴다. 기본은 key */
  id?: string;
  /** 헤더 문구 */
  header: ReactNode;
  /** 값을 직접 그리고 싶을 때 (링크·배지 등) */
  render?: (row: Row, index: number) => ReactNode;
  /**
   * 이 열의 좌우 정렬. 기본은 가운데(하위호환 — left 전환은 다음 major).
   * numeric 이면 기본이 오른쪽이다.
   */
  align?: TableAlign;
  /** 숫자·날짜 열 — 오른쪽 정렬·고정폭 숫자·줄바꿈 없음(lines 무시) */
  numeric?: boolean;
  /**
   * 긴 텍스트 처리. 기본 2 — 2줄까지 보이고 넘치면 말줄임.
   * 1 은 한 줄 말줄임, 'all' 은 줄 제한 없이 줄바꿈. 잘린 글자 셀은 마우스를 올리면 전체를 툴팁으로 보여 준다
   * (터치 기기는 툴팁 없이 잘라 두기만 한다).
   * 1 은 열 폭이 정해져야 잘린다 — auto 레이아웃에선 열이 내용만큼 넓어지므로 maxWidth 를 함께 주거나 fixed 레이아웃에서 쓴다.
   */
  lines?: number | 'all';
  /** 열 너비 — `<col>` 에 준다. resizable 이면 숫자로 줄 것 */
  width?: number | `${number}%`;
  /** 셀 내용의 최소 폭(px). resizable 의 최소 폭(기본 80)이기도 하다 */
  minWidth?: number;
  /** 셀 내용의 최대 폭(px). resizable 의 최대 폭(기본 640)이기도 하다 */
  maxWidth?: number;
  /** 헤더를 눌러 정렬한다. 정렬 연산은 하지 않는다 — onSortChange 를 받아 앱이 rows 를 바꾼다 */
  sortable?: boolean;
  /** 처음 눌렀을 때의 방향. @default 'asc' */
  sortFirst?: TableSortDirection;
  /** 헤더 오른쪽 경계를 끌어 너비를 바꾼다(터치 기기에서는 숨김) */
  resizable?: boolean;
}

export interface TableProps<Row = Record<string, ReactNode>> {
  columns: Array<TableColumn<Row>>;
  rows: Row[];
  /**
   * 열 사이 세로 구분선. **반드시 필요할 때만** 켠다 —
   * 남용하면 표가 격자로 보여 읽기 어려워진다(PDS 규칙).
   */
  columnDivider?: boolean;
  /** 행 키. 없으면 인덱스를 쓴다 — 정렬·선택을 쓰면 반드시 줄 것(인덱스 키는 정렬 뒤 행 상태가 섞인다) */
  rowKey?: (row: Row, index: number) => string;
  className?: string;

  /** 표 제목 — 화면엔 숨기고 스크린 리더·스크롤 영역 이름으로 쓴다 */
  caption?: ReactNode;
  /** caption 이 없을 때의 표 이름 */
  'aria-label'?: string;
  /** 기본: resizable 열이 하나라도 있으면 'fixed', 아니면 'auto' */
  layout?: 'auto' | 'fixed';

  /** 정렬 상태(제어형). null 은 정렬 없음 */
  sort?: TableSort | null;
  onSortChange?: (next: TableSort | null) => void;
  /** 정렬 해제 단계를 건너뛴다 — 항상 어느 열로든 정렬돼 있어야 할 때 */
  sortRequired?: boolean;

  /** rows 가 비고 로딩 중이 아닐 때 보여 줄 내용(TableEmpty 권장). 없으면 헤더만 그린다 */
  emptyState?: ReactNode;
  /** rows 가 비어 있으면 스켈레톤 행, 있으면 본문을 흐리게 하고 조작을 막는다 */
  loading?: boolean;
  /** 스켈레톤 행 수. @default 5 */
  skeletonRows?: number;

  /** 주면 헤더가 고정되고 본문만 세로로 스크롤한다 */
  maxHeight?: number | string;
  /** 첫 데이터 열(선택 열이 있으면 그것까지)을 가로 스크롤에서 고정한다 */
  stickyFirstColumn?: boolean;

  /** 행을 누르면 호출된다. 있을 때만 행이 호버·키보드(Enter/Space)에 반응한다 */
  onRowClick?: (row: Row, index: number) => void;

  /** 선택된 행 키(제어형). onSelectedKeysChange 가 있어야 선택 열이 붙는다 */
  selectedKeys?: string[];
  onSelectedKeysChange?: (keys: string[]) => void;
  /** 선택할 수 없는 행은 체크박스를 끈다 */
  isRowSelectable?: (row: Row) => boolean;

  /** 열 id → px. 주면 제어형 */
  columnWidths?: Record<string, number>;
  /** 끌기·키 조작이 끝났을 때 한 번 */
  onColumnWidthsChange?: (widths: Record<string, number>) => void;
}

export interface TableEmptyProps {
  title: ReactNode;
  description?: ReactNode;
  /** 버튼 등 — 설명 아래 16px */
  action?: ReactNode;
}
