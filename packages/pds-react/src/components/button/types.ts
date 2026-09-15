import type { ButtonHTMLAttributes, ReactNode } from 'react';

/** 채움 계열 + 외곽선 계열 */
export type ButtonVariant =
  | 'primary'
  /** 흰 배경 + line/neutral 보더 */
  | 'default'
  | 'ai'
  | 'sub'
  | 'gray'
  | 'black'
  | 'delete'
  | 'ghost'
  | 'blackGhost'
  | 'deleteGhost';

/** 높이(px)가 곧 이름 — 스펙 표기 그대로 숫자를 쓴다 */
export type ButtonSize = 64 | 54 | 48 | 40 | 32 | 24;

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** 채움·외곽선 계열 선택. 기본 `primary`, 목록 밖 값은 `primary` 로 대체된다(개발 모드에서 경고) */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 컨테이너 가로 전체를 채운다 */
  fullWidth?: boolean;
  /** 진행 중 표시. 클릭이 막히고 aria-busy 가 붙는다 */
  loading?: boolean;
  /** 레이블 왼쪽 아이콘 */
  leftIcon?: ReactNode;
  /** 레이블 오른쪽 아이콘 */
  rightIcon?: ReactNode;
}
