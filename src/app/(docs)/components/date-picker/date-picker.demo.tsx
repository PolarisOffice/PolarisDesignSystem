'use client';

import { useState } from 'react';

import { Calendar, DatePicker, type DateRange } from '@polarisoffice/pds-react';

/**
 * Date Picker 페이지에서 함수 prop·Date 값이 필요한 것들 — 서버 컴포넌트(date-picker.design.tsx ·
 * date-picker.code.tsx)에서 넘기지 않고 여기서 만든다(chip.demo.tsx 와 같은 방식).
 *
 * Design 탭 그림은 오늘을 Figma 와 같은 2026.10.14 로 고정한다 — 그림이 날마다 바뀌지 않게.
 */
const TODAY = new Date(2026, 9, 14);
const RANGE = { start: new Date(2026, 9, 8), end: new Date(2026, 9, 14) };
const DAY = new Date(2026, 9, 20);

/** Design 탭 정지 그림 — 입력칸 아래에 달력이 열린 모습을 펼쳐 그린다(팝오버가 아니라 제자리) */
export function DatePickerFigure({
  mode = 'single',
  open = true,
  size = 'md',
}: {
  mode?: 'single' | 'range';
  open?: boolean;
  size?: 'lg' | 'md' | 'sm' | 'xs';
}) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
      {mode === 'range' ? (
        <DatePicker mode="range" size={size} value={RANGE} today={TODAY} />
      ) : (
        <DatePicker size={size} value={DAY} today={TODAY} />
      )}
      {open && (mode === 'range' ? <Calendar mode="range" value={RANGE} today={TODAY} /> : <Calendar value={DAY} today={TODAY} />)}
    </div>
  );
}

/** Design 탭 Properties — 하루 칸 한 상태만 보여 주는 작은 달력 조각 대신, 패널 하나에 상태가 다 보이게 기간을 건다 */
export function CalendarFigure({ mode = 'single' }: { mode?: 'single' | 'range' }) {
  return mode === 'range' ? <Calendar mode="range" presets={false} value={RANGE} today={TODAY} /> : <Calendar value={DAY} today={TODAY} />;
}

/** Design 탭 Case '직접 입력' — 치는 중 / 다 쳤을 때 / 형식이 틀렸을 때 */
export function DatePickerInputCase() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <DatePicker mode="range" size="md" today={TODAY} />
      <DatePicker mode="range" size="md" value={RANGE} today={TODAY} />
      <DatePicker mode="range" size="md" today={TODAY} error="날짜를 YYYY.MM.DD 형식으로 입력해 주세요." />
    </div>
  );
}

/* ── Code 탭 살아있는 예제 ─────────────────────────────── */

export function DatePickerSingleDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return <DatePicker value={date} onChange={setDate} label="시작일" />;
}

export function DatePickerRangeDemo() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return <DatePicker mode="range" size="md" value={range} onChange={setRange} label="조회 기간" />;
}

export function CalendarDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return <Calendar value={date} onChange={setDate} />;
}
