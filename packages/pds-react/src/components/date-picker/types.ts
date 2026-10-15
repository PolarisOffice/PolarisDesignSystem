import type { ReactNode } from 'react';

import type { InputFieldSize } from '../input/types.js';

/** 기간. 시작만 고른 상태(종료 null)는 달력 안에서만 생기고 onChange 로는 나가지 않는다 */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/** 기간 날짜 선택기 왼쪽의 빠른 선택 한 줄 */
export interface DatePreset {
  label: string;
  /** 누른 순간의 오늘을 받아 기간을 돌려준다 */
  range: (today: Date) => { start: Date; end: Date };
}

interface CalendarCommon {
  /** 오늘 표시 기준. 기본은 지금 날짜 — 문서·테스트에서 날짜를 고정할 때만 준다 */
  today?: Date;
  className?: string;
}

export interface CalendarSingleProps extends CalendarCommon {
  /** @default 'single' */
  mode?: 'single';
  value?: Date | null;
  onChange?: (date: Date) => void;
}

export interface CalendarRangeProps extends CalendarCommon {
  mode: 'range';
  value?: DateRange;
  onChange?: (range: { start: Date; end: Date }) => void;
  /** 왼쪽 빠른 선택. 기본은 오늘·지난 7일·지난 30일·이번 달. `false` 면 빼고 달력만 */
  presets?: DatePreset[] | false;
}

/** 달력 패널. DatePicker 가 팝오버 안에 띄우는 것과 같다 — 페이지에 펼쳐 둘 때 따로 쓴다 */
export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

interface DatePickerCommon {
  /** 입력칸 높이 — InputField 와 같은 4단계 @default 'lg' */
  size?: InputFieldSize;
  /** 입력칸 제목. lg 밖에서는 그리지 않고 접근성 이름으로 옮긴다(InputField 와 같음) */
  label?: ReactNode;
  /** 오류 문구. 주지 않아도 형식이 틀리게 치면 컴포넌트가 직접 띄운다 */
  error?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  /** 입력칸 너비. 기본 날짜 하나 200px · 기간 280px */
  width?: number | string;
  today?: Date;
  id?: string;
  className?: string;
}

export interface DatePickerSingleProps extends DatePickerCommon {
  /** @default 'single' */
  mode?: 'single';
  /** 고른 날짜. 비우면 null */
  value?: Date | null;
  defaultValue?: Date | null;
  /** 달력에서 고르거나 직접 친 값이 맞을 때 부른다. 입력칸을 비우면 null */
  onChange?: (date: Date | null) => void;
}

export interface DatePickerRangeProps extends DatePickerCommon {
  mode: 'range';
  value?: DateRange;
  defaultValue?: DateRange;
  /** 종료일까지 골랐거나 빠른 선택을 눌렀을 때 부른다. 입력칸을 비우면 둘 다 null */
  onChange?: (range: DateRange) => void;
  presets?: DatePreset[] | false;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;
