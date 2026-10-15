import { Radio, RadioGroup } from '@polarisoffice/pds-react';
import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow, DemoCol } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';
import { RADIO_SIZES } from './radio.data';

const IMPORT = `import { Radio, RadioGroup } from '${PDS_PACKAGE}';`;

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'radio',
    title: 'Radio',
    desc: '그룹 안에서 하나만 선택돼요. RadioGroup 이 name·선택 상태를 안의 Radio 에 내려줘요. AI 기능에는 tone="ai" 를 써요.',
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
    id: 'size',
    title: 'Size',
    desc: `md · sm 두 단계. ${RADIO_SIZES.map((t) => `${t.size}(${t.ring})`).join(' · ')}. sm 은 표처럼 14px 글자 옆에 써요. RadioGroup 에 주면 안의 Radio 에 모두 적용돼요.`,
    previewName: 'Radio',
    code: `${IMPORT}

${RADIO_SIZES.map((t) => `<RadioGroup name="size-${t.size}" size="${t.size}" defaultValue="a">\n  <Radio value="a" label="선택" />\n  <Radio value="b" label="미선택" />\n</RadioGroup>`).join('\n')}`,
    preview: (
      <DemoRow gap="wide">
        {RADIO_SIZES.map((t) => (
          <DemoCol key={t.size} label={`${t.size} · ${t.ring}`}>
            <RadioGroup name={`docs-size-${t.size}`} size={t.size} defaultValue="a">
              <Radio value="a" label="선택" />
              <Radio value="b" label="미선택" />
            </RadioGroup>
          </DemoCol>
        ))}
      </DemoRow>
    ),
  },
];

export default function RadioCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
