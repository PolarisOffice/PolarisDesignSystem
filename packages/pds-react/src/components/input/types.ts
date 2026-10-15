import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * 상태 축.
 * focus 는 상호작용으로 결정되므로 prop 으로 받지 않는다.
 */
export type InputStatus = 'default' | 'error';

/**
 * 높이 축 — Select 와 같은 4단계. 같은 높이의 Button 과 한 줄에 선다.
 * - `lg` 52: 폼 필드(기본)
 * - `md` 40: 검색창
 * - `sm` 32: 표 툴바·촘촘한 화면
 * - `xs` 28: 표 셀 안 등 좁은 곳(글자 13)
 */
export type InputFieldSize = 'lg' | 'md' | 'sm' | 'xs';

export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 기본 `'lg'`. `'md'`·`'sm'`·`'xs'` 는 필드 안 제목(label)을 **그리지 않는다** — 줄 높이에
   * 제목이 올라올 자리가 없다. 문자열 label 은 접근성 이름(aria-label)으로 옮기고, 그 밖엔 `aria-label` 로 준다.
   */
  size?: InputFieldSize;
  /**
   * 필드 **안 상단**에 작게 뜨는 제목. 값이 있거나 포커스일 때만 보이고,
   * 비어 있을 때는 placeholder 자리를 내준다.
   */
  label?: ReactNode;
  /** 오류 문구. 주면 테두리가 오류색이 되고 아래에 아이콘과 함께 뜬다 */
  error?: ReactNode;
  /**
   * 왼쪽 아이콘 — lg·md 18×18, sm·xs 16×16. 패키지 아이콘은 `size` 를 주지 않으면
   * 이 크기에 맞춰진다(`size` 를 직접 주면 그 값을 따른다).
   */
  leftIcon?: ReactNode;
  /**
   * 값 가림/보임 토글(우측 24×24). **비밀번호 전용**이다 —
   * 다른 용도의 우측 아이콘을 여기에 넣지 않는다.
   *
   * 기본값은 `type === 'password'` — PDS 규칙이 비밀번호 필드에 눈 아이콘을
   * 항상 요구하므로, 끄려면 `revealToggle={false}` 를 명시한다.
   */
  revealToggle?: boolean;
  /**
   * 값이 있을 때 오른쪽에 지우기 버튼(lg·md 24×24, sm·xs 20×20)을 띄운다. 누르거나 입력 중 Esc 를
   * 누르면 `onClear` 를 부르고 입력에 포커스를 돌려준다. 제어형이면 호출자가
   * `onClear` 에서 value 를 비운다(비제어면 컴포넌트가 비운다).
   *
   * `revealToggle` 과 함께 켜면 무시된다 — 우측 자리는 하나다.
   */
  clearable?: boolean;
  onClear?: () => void;
  /** 지우기 버튼의 접근성 이름. 기본 '입력 지우기' */
  clearLabel?: string;
  /** 컨테이너 가로 전체를 채운다 */
  fullWidth?: boolean;
}
