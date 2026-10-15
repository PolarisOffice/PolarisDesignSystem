import { Checkbox } from '@polarisoffice/pds-react';
import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow, DemoCol } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';
import { CheckboxGroupDemo } from './checkbox-demos';
import { CHECKBOX_SIZES } from './checkbox.data';

const IMPORT = `import { Checkbox } from '${PDS_PACKAGE}';`;

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
    id: 'variant',
    title: 'Variant',
    desc: 'Checkbox 모양 두 가지. box(기본) · check(면 없이 체크 표시만). 상태와 동작은 같아요.',
    previewName: 'Checkbox',
    code: `${IMPORT}

<Checkbox variant="box" label="박스" checked />
<Checkbox variant="check" label="체크형" checked />`,
    preview: (
      <DemoRow>
        <Checkbox variant="box" label="박스" defaultChecked />
        <Checkbox variant="check" label="체크형" defaultChecked />
      </DemoRow>
    ),
  },
  {
    id: 'size',
    title: 'Size',
    desc: `md · sm 두 단계. ${CHECKBOX_SIZES.map((t) => `${t.size}(${t.box})`).join(' · ')}. sm 은 표처럼 14px 글자 옆에 써요. 두 모양 모두 같은 크기 체계예요.`,
    previewName: 'Checkbox',
    code: `${IMPORT}

${CHECKBOX_SIZES.map((t) => `<Checkbox size="${t.size}" checked />`).join('\n')}`,
    preview: (
      <DemoRow gap="wide">
        {CHECKBOX_SIZES.map((t) => (
          <DemoCol key={t.size} label={`${t.size} · ${t.box}`}>
            <Checkbox size={t.size} defaultChecked />
          </DemoCol>
        ))}
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
