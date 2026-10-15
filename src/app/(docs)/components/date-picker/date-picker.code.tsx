import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';
import { CalendarDemo, DatePickerRangeDemo, DatePickerSingleDemo } from './date-picker.demo';

const IMPORT = `import { DatePicker } from '${PDS_PACKAGE}';`;

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'single',
    title: 'Single (날짜 하나)',
    desc: 'mode 를 안 주면 날짜 하나를 받아요. value 는 Date 이고, 비우면 null 이에요. 날짜를 누르거나 입력칸에 YYYY.MM.DD 로 치고 칸을 벗어나면(또는 Enter) onChange 가 불려요. 형식이 틀리면 칸 아래에 오류 문구가 떠요. 입력칸 제목·크기·오류 문구는 InputField 와 같아요.',
    previewName: 'DatePicker',
    code: `${IMPORT}
import { useState } from 'react';

const [date, setDate] = useState<Date | null>(null);

<DatePicker value={date} onChange={setDate} label="시작일" />`,
    preview: (
      <DemoRow>
        <DatePickerSingleDemo />
      </DemoRow>
    ),
  },
  {
    id: 'range',
    title: 'Range (기간)',
    desc: 'mode="range" 는 기간을 받아요. value 는 { start, end } 이고, 시작일과 종료일을 차례로 누르면 onChange 가 불려요(종료일이 앞이면 뒤집어요). 입력칸에는 「2026.10.08 ~ 2026.10.14」처럼 ~ 로 이어 쳐요. 달력 왼쪽 빠른 선택(오늘·지난 7일·지난 30일·이번 달)은 기본으로 붙고, 누르는 즉시 정해져요. 목록을 바꾸려면 presets 에 이름(label)과 기간을 돌려주는 함수(range)를 주고(기본 목록에 더할 땐 DEFAULT_DATE_PRESETS 를 펼쳐 써요), 빼려면 presets={false} 예요.',
    previewName: 'DatePicker',
    code: `import { DatePicker, DEFAULT_DATE_PRESETS } from '${PDS_PACKAGE}';
import { useState } from 'react';
import type { DateRange } from '${PDS_PACKAGE}';

const [range, setRange] = useState<DateRange>({ start: null, end: null });

<DatePicker mode="range" size="md" value={range} onChange={setRange} label="조회 기간" />

// 빠른 선택 목록 바꾸기 — 기본 목록 뒤에 '올해'
const presets = [
  ...DEFAULT_DATE_PRESETS,
  { label: '올해', range: (today: Date) => ({ start: new Date(today.getFullYear(), 0, 1), end: today }) },
];
<DatePicker mode="range" presets={presets} value={range} onChange={setRange} />

// 빠른 선택 없이 달력만
<DatePicker mode="range" presets={false} value={range} onChange={setRange} />`,
    preview: (
      <DemoRow>
        <DatePickerRangeDemo />
      </DemoRow>
    ),
  },
  {
    id: 'calendar',
    title: 'Calendar',
    desc: '입력칸 없이 달력만 페이지에 펼쳐 둘 때는 Calendar 를 써요. DatePicker 가 띄우는 패널과 같고, mode·value·onChange·presets 도 같아요.',
    previewName: 'Calendar',
    code: `import { Calendar } from '${PDS_PACKAGE}';

<Calendar value={date} onChange={setDate} />`,
    preview: (
      <DemoRow>
        <CalendarDemo />
      </DemoRow>
    ),
  },
];

export default function DatePickerCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
