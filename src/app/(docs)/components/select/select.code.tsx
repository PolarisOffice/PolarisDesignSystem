'use client';

import { useState } from 'react';

import { Select } from '@polarisoffice/pds-react';

import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow, DemoCol } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';

const IMPORT = `import { Select } from '${PDS_PACKAGE}';`;

const OPTIONS = `const options = [
  { value: '1', label: '옵션 1' },
  { value: '2', label: '옵션 2' },
  { value: '3', label: '옵션 3' },
];`;

const options = [
  { value: '1', label: '옵션 1' },
  { value: '2', label: '옵션 2' },
  { value: '3', label: '옵션 3' },
];

function ControlledDemo() {
  const [value, setValue] = useState('');
  return <Select options={options} value={value} onChange={setValue} placeholder="Placeholder" />;
}

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'base',
    title: 'Base',
    desc: '옵션 5개 이상일 때 써요. 2~4개면 Segment Control 이 나아요.',
    previewName: 'Select',
    preview: (
      <DemoRow>
        <Select options={options} placeholder="Placeholder" />
      </DemoRow>
    ),
    code: `${IMPORT}

${OPTIONS}

<Select options={options} placeholder="Placeholder" />`,
  },
  {
    id: 'size',
    title: 'Size',
    desc: 'LG(폼) · MD(필터·검색바) · SM(툴바·인라인).',
    previewName: 'Select',
    preview: (
      <DemoRow gap="wide">
        {(['lg', 'md', 'sm'] as const).map((size) => (
          <DemoCol key={size} label={size}>
            <Select size={size} options={options} placeholder="Placeholder" />
          </DemoCol>
        ))}
      </DemoRow>
    ),
    code: `${IMPORT}

<Select size="lg" options={options} placeholder="Placeholder" />
<Select size="md" options={options} placeholder="Placeholder" />
<Select size="sm" options={options} placeholder="Placeholder" />`,
  },
  {
    id: 'state',
    title: 'State',
    desc: 'Disabled 는 텍스트·아이콘만 40% 로 흐려지고 배경·radius 는 그대로예요.',
    previewName: 'Select',
    preview: (
      <DemoRow gap="wide">
        <DemoCol label="selected">
          <Select options={options} value="1" />
        </DemoCol>
        <DemoCol label="disabled">
          <Select options={options} placeholder="Placeholder" disabled />
        </DemoCol>
      </DemoRow>
    ),
    code: `${IMPORT}

<Select options={options} value="1" />
<Select options={options} placeholder="Placeholder" disabled />`,
  },
  {
    id: 'controlled',
    title: 'Controlled',
    desc: '선택된 값은 trigger 텍스트에 반영돼요.',
    previewName: 'Select',
    preview: (
      <DemoRow>
        <ControlledDemo />
      </DemoRow>
    ),
    code: `${IMPORT}
import { useState } from 'react';

const [value, setValue] = useState('');

<Select options={options} value={value} onChange={setValue} placeholder="Placeholder" />`,
  },
];

export default function SelectCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
