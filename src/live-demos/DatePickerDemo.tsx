'use client';

import { useState } from 'react';

import { DatePicker, type DateRange } from '@polarisoffice/pds-react';

/** 가이드 견본용 — 기간 날짜 선택기 하나. 눌러서 달력을 열고 빠른 선택이나 날짜 두 번으로 고른다 */
export default function DatePickerDemo() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return <DatePicker mode="range" size="md" value={range} onChange={setRange} label="조회 기간" />;
}
