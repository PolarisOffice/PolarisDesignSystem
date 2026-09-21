'use client';

import { useState } from 'react';

import { Tabs } from '@polarisoffice/pds-react';

import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow, DemoCol } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';

const IMPORT = `import { Tabs } from '${PDS_PACKAGE}';`;

const ITEMS = `const items = [
  { value: 'all', label: '전체' },
  { value: 'doc', label: '문서' },
  { value: 'sheet', label: '스프레드시트' },
];`;

const items = [
  { value: 'all', label: '전체' },
  { value: 'doc', label: '문서' },
  { value: 'sheet', label: '스프레드시트' },
];

function ControlledDemo() {
  const [tab, setTab] = useState('all');
  return <Tabs items={items} value={tab} onChange={setTab} />;
}

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'variant',
    title: 'Variant',
    desc: 'Primary 는 최상단 메인 네비게이션, Secondary 는 섹션 안 서브 카테고리예요.',
    previewName: 'Tabs',
    /* layout="hug" 명시 (2026-08-28 검토 — "하단 라인이 hug로 적용이 안되어 있음"):
       기본 fill 은 폭이 없는 데모 컨테이너에서 세 탭이 자연 폭 합을 등분해
       '스프레드시트' 텍스트가 칸을 넘치고 밑줄 폭이 텍스트 길이와 어긋났다. */
    preview: (
      <DemoRow stack>
        {(['primary', 'secondary'] as const).map((v) => (
          <DemoCol key={v} label={v}>
            <Tabs variant={v} layout="hug" items={items} defaultValue="all" />
          </DemoCol>
        ))}
      </DemoRow>
    ),
    code: `${IMPORT}

${ITEMS}

<Tabs variant="primary" layout="hug" items={items} defaultValue="all" />
<Tabs variant="secondary" layout="hug" items={items} defaultValue="all" />`,
  },
  {
    id: 'layout',
    title: 'Layout',
    desc: 'Fill 은 3–5개 균등 분할, Hug 는 6개 이상이거나 레이블 길이가 제각각일 때.',
    previewName: 'Tabs',
    preview: (
      <DemoRow stack>
        {(['fill', 'hug'] as const).map((l) => (
          <DemoCol key={l} label={l}>
            <div style={{ width: 320 }}>
              <Tabs layout={l} items={items} defaultValue="all" />
            </div>
          </DemoCol>
        ))}
      </DemoRow>
    ),
    code: `${IMPORT}

<Tabs layout="fill" items={items} defaultValue="all" />
<Tabs layout="hug" items={items} defaultValue="all" />`,
  },
  {
    id: 'size',
    title: 'Size',
    desc: 'Medium 44px · Small 40px.',
    previewName: 'Tabs',
    preview: (
      <DemoRow stack>
        {(['medium', 'small'] as const).map((sz) => (
          <DemoCol key={sz} label={sz}>
            <Tabs size={sz} items={items} defaultValue="all" />
          </DemoCol>
        ))}
      </DemoRow>
    ),
    code: `${IMPORT}

<Tabs size="medium" items={items} defaultValue="all" />
<Tabs size="small" items={items} defaultValue="all" />`,
  },
  {
    id: 'controlled',
    title: 'Controlled',
    desc: '선택 탭 하단 인디케이터는 150ms(duration-fast)로 슬라이드해요.',
    previewName: 'Tabs',
    preview: (
      <DemoRow>
        <ControlledDemo />
      </DemoRow>
    ),
    code: `${IMPORT}
import { useState } from 'react';

const [tab, setTab] = useState('all');

<Tabs items={items} value={tab} onChange={setTab} />`,
  },
  {
    id: 'disabled',
    title: 'Disabled',
    desc: 'Tabs 의 Disabled 는 투명도 35% 예요.',
    previewName: 'Tabs',
    preview: (
      <DemoRow>
        <Tabs
          items={[
            { value: 'all', label: '전체' },
            { value: 'archive', label: '보관함', disabled: true },
          ]}
          defaultValue="all"
        />
      </DemoRow>
    ),
    code: `${IMPORT}

<Tabs
  items={[
    { value: 'all', label: '전체' },
    { value: 'archive', label: '보관함', disabled: true },
  ]}
  defaultValue="all"
/>`,
  },
];

export default function TabsCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
