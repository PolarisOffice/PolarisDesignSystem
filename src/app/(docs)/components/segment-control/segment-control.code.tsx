'use client';

import { useState } from 'react';

import { SegmentControl } from '@polarisoffice/pds-react';

import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow, DemoCol } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';

import { SEG_VARIANTS } from './segment-control.data';

const IMPORT = `import { SegmentControl } from '${PDS_PACKAGE}';`;

const ITEMS = `const items = [
  { value: 'all', label: '전체' },
  { value: 'new', label: '최신' },
  { value: 'hot', label: '인기' },
];`;

const items = [
  { value: 'all', label: '전체' },
  { value: 'new', label: '최신' },
  { value: 'hot', label: '인기' },
];

function ControlledDemo() {
  const [view, setView] = useState('all');
  return <SegmentControl items={items} value={view} onChange={setView} />;
}

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'variant',
    title: 'Variant',
    desc: 'Pill(필터링) · Filled(뷰 전환) · Outlined(2차 컨트롤).',
    previewName: 'SegmentControl',
    preview: (
      <DemoRow stack>
        {SEG_VARIANTS.map((v) => (
          <DemoCol key={v} label={v}>
            <SegmentControl variant={v} items={items} defaultValue="all" />
          </DemoCol>
        ))}
      </DemoRow>
    ),
    code: `${IMPORT}

${ITEMS}

${SEG_VARIANTS.map((v) => `<SegmentControl variant="${v}" items={items} defaultValue="all" />`).join('\n')}`,
  },
  {
    id: 'count',
    title: 'Count Badge',
    desc: 'Count badge 는 Pill 전용이에요. Filled/Outlined 에는 표시하지 않아요.',
    previewName: 'SegmentControl',
    preview: (
      <DemoRow>
        <SegmentControl
          variant="pill"
          items={[
            { value: 'event', label: '이벤트', count: 3 },
            { value: 'end', label: '종료', count: 4 },
          ]}
          defaultValue="event"
        />
      </DemoRow>
    ),
    code: `${IMPORT}

<SegmentControl
  variant="pill"
  items={[
    { value: 'event', label: '이벤트', count: 3 },
    { value: 'end', label: '종료', count: 4 },
  ]}
  defaultValue="event"
/>`,
  },
  {
    id: 'layout',
    title: 'Layout · Size',
    desc: 'Fill 은 옵션 5개 이하일 때만. 같은 화면 내 사이즈는 통일해요.',
    previewName: 'SegmentControl',
    preview: (
      <DemoRow stack>
        <DemoCol label="fill · md">
          <SegmentControl layout="fill" size="md" items={items} defaultValue="all" />
        </DemoCol>
        <DemoCol label="hug · sm">
          <SegmentControl layout="hug" size="sm" items={items} defaultValue="all" />
        </DemoCol>
      </DemoRow>
    ),
    code: `${IMPORT}

<SegmentControl layout="fill" size="md" items={items} defaultValue="all" />
<SegmentControl layout="hug" size="sm" items={items} defaultValue="all" />`,
  },
  {
    id: 'controlled',
    title: 'Controlled',
    desc: '항상 하나만 선택돼요. 복수 선택은 Checkbox 나 Filter Chip 이에요.',
    previewName: 'SegmentControl',
    preview: (
      <DemoRow>
        <ControlledDemo />
      </DemoRow>
    ),
    code: `${IMPORT}
import { useState } from 'react';

const [view, setView] = useState('all');

<SegmentControl items={items} value={view} onChange={setView} />`,
  },
];

export default function SegmentControlCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
