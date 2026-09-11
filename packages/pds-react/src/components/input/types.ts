import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * 상태 축.
 * focus 는 상호작용으로 결정되므로 prop 으로 받지 않는다.
 */
export type InputStatus = 'default' | 'error';

export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 필드 **안 상단**에 작게 뜨는 제목. 값이 있거나 포커스일 때만 보이고,
   * 비어 있을 때는 placeholder 자리를 내준다.
   */
  label?: ReactNode;
  /** 오류 문구. 주면 테두리가 오류색이 되고 아래에 아이콘과 함께 뜬다 */
  error?: ReactNode;
  /** 왼쪽 아이콘 18×18 */
  leftIcon?: ReactNode;
  /**
   * 값 가림/보임 토글(우측 24×24). **비밀번호 전용**이다 —
   * 다른 용도의 우측 아이콘을 여기에 넣지 않는다.
   *
   * 기본값은 `type === 'password'` — PDS 규칙이 비밀번호 필드에 눈 아이콘을
   * 항상 요구하므로, 끄려면 `revealToggle={false}` 를 명시한다.
   */
  revealToggle?: boolean;
  /** 컨테이너 가로 전체를 채운다 */
  fullWidth?: boolean;
}
