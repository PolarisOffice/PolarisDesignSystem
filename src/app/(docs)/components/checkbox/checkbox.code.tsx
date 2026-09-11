import { Checkbox, Radio, RadioGroup } from '@polarisoffice/pds-react';
import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';
import { CheckboxGroupDemo } from './checkbox-demos';

const IMPORT = `import { Checkbox, Radio, RadioGroup } from '${PDS_PACKAGE}';`;

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'checkbox',
    title: 'Checkbox',
    desc: '미선택 · 선택됨 · 부분 선택(indeterminate) · 비활성화.',
    previewName: 'Checkbox',
    code: `${IMPORT}

<Checkbox label="항목 1" />
<Checkbox label="항목 2" checked />
<Checkbox label="전체 선택" indeterminate />
<Checkbox label="비활성화" disabled />`,
    preview: (
      <DemoRow>
        <Checkbox label="항목 1" />
        <Checkbox label="항목 2" defaultChecked />
        <Checkbox label="전체 선택" indeterminate />
        <Checkbox label="비활성화" disabled />
      </DemoRow>
    ),
  },
  {
    id: 'radio',
    title: 'Radio',
    desc: '그룹 안에서 하나만 선택돼요. 라디오에는 부분 선택이 없어요.',
    previewName: 'Radio',
    code: `${IMPORT}

<RadioGroup name="plan" defaultValue="basic">
  <Radio value="basic" label="Basic" />
  <Radio value="pro" label="Pro" />
  <Radio value="off" label="비활성화" disabled />
</RadioGroup>`,
    preview: (
      <DemoRow>
        <RadioGroup name="docs-plan" defaultValue="basic">
          <Radio value="basic" label="Basic" />
          <Radio value="pro" label="Pro" />
          <Radio value="off" label="비활성화" disabled />
        </RadioGroup>
      </DemoRow>
    ),
  },
  {
    id: 'group',
    title: 'Checkbox 그룹',
    desc: '「전체 선택」이 하위 항목을 제어하고, 일부만 선택되면 부분 선택 상태가 돼요.',
    previewName: 'Checkbox',
    code: `${IMPORT}
import { useState } from 'react';

const [items, setItems] = useState([true, false, false]);
const all = items.every(Boolean);
const some = items.some(Boolean) && !all;

<Checkbox
  label="전체 선택"
  checked={all}
  indeterminate={some}
  onChange={(next) => setItems(items.map(() => next))}
/>
{items.map((on, i) => (
  <Checkbox
    key={i}
    label={\`항목 \${i + 1}\`}
    checked={on}
    onChange={(next) => setItems(items.map((v, j) => (i === j ? next : v)))}
  />
))}`,
    preview: <CheckboxGroupDemo />,
  },
];

export default function CheckboxCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
