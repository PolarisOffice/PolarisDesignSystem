import type { ReactNode } from 'react';

/**
 * default = 조건 칩. 걸린 조건이나 값을 보여 준다(회색 면). × 로 지울 수 있다.
 * select  = 선택 칩. 눌러서 켜고 끈다(흰 면에 테두리, 켜지면 파란 면).
 */
export type ChipType = 'default' | 'select';

/** md = 높이 28(기본), sm = 높이 24(좁은 자리) */
export type ChipSize = 'md' | 'sm';

export interface ChipProps {
  /** 라벨. 조건 칩은 `팀: 디자인` 처럼 무엇의 어떤 값인지 함께 쓴다 */
  children: ReactNode;
  /** @default 'default' */
  type?: ChipType;
  /** @default 'md' */
  size?: ChipSize;
  /** 라벨 앞 아이콘. 크기는 md 16 · sm 14 로 넘긴다 */
  leftIcon?: ReactNode;
  /** 선택 칩(type="select")의 켜진 상태. 조건 칩에서는 쓰지 않는다 */
  selected?: boolean;
  /**
   * 선택 칩이 켜졌을 때 라벨 앞에 체크 표시를 붙인다 — 색을 못 봐도 켜진 걸 알 수 있다.
   * 켜진 동안은 leftIcon 자리를 체크가 대신한다
   * @default true
   */
  checkIcon?: boolean;
  /** 누를 수 있게 한다. 선택 칩은 여기서 selected 를 바꾼다 */
  onClick?: () => void;
  /**
   * 조건 칩(type="default") 오른쪽에 × 를 달고, 눌렀을 때 부른다(onClick 과 따로). 누른 버튼이 칩과 함께
   * 사라지므로 키보드 포커스는 쓰는 쪽이 남아 있는 곳(검색 입력·표 등)으로 옮긴다. 선택 칩에서는 쓰지 않는다
   */
  onRemove?: () => void;
  /** × 버튼의 접근성 이름. 기본은 라벨이 글자면 `{라벨} 해제`, 아니면 `해제` */
  removeLabel?: string;
  className?: string;
}
