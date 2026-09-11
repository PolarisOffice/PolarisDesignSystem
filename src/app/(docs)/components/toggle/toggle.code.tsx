import { Toggle } from '@polarisoffice/pds-react';
import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow, DemoCol } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';
import { TOGGLE_SIZES } from './toggle.data';

const IMPORT = `import { Toggle } from '${PDS_PACKAGE}';`;

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'base',
    title: 'Base',
    desc: 'ON / OFF / Disabled 세 가지 상태.',
    previewName: 'Toggle',
    code: `${IMPORT}

<Toggle checked />
<Toggle />
<Toggle disabled />`,
    preview: (
      <DemoRow gap="wide">
        <DemoCol label="on">
          <Toggle defaultChecked />
        </DemoCol>
        <DemoCol label="off">
          <Toggle />
        </DemoCol>
        <DemoCol label="disabled">
          <Toggle disabled />
        </DemoCol>
      </DemoRow>
    ),
  },
  {
    id: 'size',
    title: 'Size',
    desc: `md · sm 두 단계. ${TOGGLE_SIZES.map((t) => `${t.size}(${t.width}×${t.height})`).join(' · ')}`,
    previewName: 'Toggle',
    code: `${IMPORT}

${TOGGLE_SIZES.map((t) => `<Toggle size="${t.size}" checked />`).join('\n')}`,
    preview: (
      <DemoRow gap="wide">
        {TOGGLE_SIZES.map((t) => (
          <DemoCol key={t.size} label={`${t.size} · ${t.width}×${t.height}`}>
            <Toggle size={t.size as 'md' | 'sm'} defaultChecked />
          </DemoCol>
        ))}
      </DemoRow>
    ),
  },
  {
    id: 'with-label',
    title: 'Label · Description',
    desc: '토글이 무엇을 켜고 끄는지 밝혀야 할 때 레이블을, 결과를 짐작하기 어려우면 설명을 덧붙여요.',
    previewName: 'Toggle',
    code: `${IMPORT}

<Toggle label="알림 받기" checked />
<Toggle label="푸시 알림" description="앱 알림을 받을 수 있습니다" />`,
    preview: (
      <DemoRow stack align="left">
        <Toggle label="알림 받기" defaultChecked />
        <Toggle label="푸시 알림" description="앱 알림을 받을 수 있습니다" />
      </DemoRow>
    ),
  },
  {
    id: 'controlled',
    title: 'Controlled',
    desc: '상태를 바깥에서 관리할 때.',
    previewName: 'Toggle',
    code: `${IMPORT}
import { useState } from 'react';

const [on, setOn] = useState(false);

<Toggle checked={on} onChange={setOn} label="다크 모드" />`,
    preview: (
      <DemoRow>
        <Toggle label="다크 모드" />
      </DemoRow>
    ),
  },
];

export default function ToggleCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
