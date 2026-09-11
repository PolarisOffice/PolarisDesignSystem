import type { ReactNode } from 'react';

export interface MenuItemProps {
  /** 한 줄로 끝나는 레이블. 아이템 안에 복잡한 UI 를 넣지 않는다 */
  /** 항목 텍스트. `children` 으로 줘도 된다 — 문서 예제는 children 형태를 쓴다 */
  label?: ReactNode;
  children?: ReactNode;
  /** 선택됨. 좌측 체크가 켜지고 글자가 진해진다 */
  selected?: boolean;
  disabled?: boolean;
  /** 좌측 체크 자리를 비워 둘지. 체크 쓰는 메뉴에서는 정렬을 위해 유지한다 */
  hideCheck?: boolean;
  /** 우측 화살표 — 하위 메뉴가 있을 때 */
  hasSubmenu?: boolean;
  onClick?: () => void;
}

export interface MenuProps {
  children: ReactNode;
  /**
   * 컨테이너 너비. **고정 px 를 쓰지 않는 것이 규칙**이라 기본은 부모를 채운다 —
   * 부모 쪽에서 폭을 정한다.
   */
  width?: number | string;
  /** 넘치면 스크롤한다. 기본 220 */
  maxHeight?: number;
  className?: string;
}
