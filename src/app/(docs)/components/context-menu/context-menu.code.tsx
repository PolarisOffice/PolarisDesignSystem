import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';

import { BaseDemo, Case1Demo, Case2Demo, DividerDemo, ScrollDemo } from './context-menu.demo';

const IMPORT = `import { Menu, MenuItem, MenuDivider } from '${PDS_PACKAGE}';`;

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'base',
    title: 'Base · Single List',
    desc: '너비는 부모 기준 fill 로 채워요.',
    previewName: 'Menu',
    preview: (
      <DemoRow>
        <BaseDemo />
      </DemoRow>
    ),
    code: `${IMPORT}

<Menu>
  <MenuItem>Text</MenuItem>
  <MenuItem selected>Text</MenuItem>
  <MenuItem>Text</MenuItem>
</Menu>`,
  },
  {
    id: 'plain',
    title: 'Text Only',
    desc: '고르는 목록이 아니라 실행 메뉴일 때. 체크 슬롯을 빼면 레이블만 남아요.',
    previewName: 'Menu',
    preview: (
      <DemoRow>
        <Case1Demo />
      </DemoRow>
    ),
    code: `${IMPORT}

<Menu>
  <MenuItem hideCheck>Text</MenuItem>
  <MenuItem hideCheck>Text</MenuItem>
  <MenuItem hideCheck>Text</MenuItem>
</Menu>`,
  },
  {
    id: 'submenu',
    title: 'Submenu',
    desc: '하위 메뉴가 있는 항목에 화살표를 붙여요. 실제로 더 들어갈 때만 써요.',
    previewName: 'Menu',
    preview: (
      <DemoRow>
        <Case2Demo />
      </DemoRow>
    ),
    code: `${IMPORT}

<Menu>
  <MenuItem hideCheck hasSubmenu>Text</MenuItem>
  <MenuItem hideCheck hasSubmenu>Text</MenuItem>
</Menu>`,
  },
  {
    id: 'divider',
    title: 'Divider',
    desc: '항목 그룹 구분이 필요할 때만 넣어요.',
    previewName: 'Menu',
    preview: (
      <DemoRow>
        <DividerDemo />
      </DemoRow>
    ),
    code: `${IMPORT}

<Menu>
  <MenuItem>Text</MenuItem>
  <MenuDivider />
  <MenuItem>Text</MenuItem>
</Menu>`,
  },
  {
    id: 'scroll',
    title: 'Scroll',
    desc: '항목이 많으면 max-height 220px + 스크롤. 10개를 넘으면 그룹 분리를 먼저 검토해요.',
    previewName: 'Menu',
    preview: (
      <DemoRow>
        <ScrollDemo />
      </DemoRow>
    ),
    code: `${IMPORT}

<Menu maxHeight={220}>
  {items.map((item) => (
    <MenuItem key={item.id}>{item.label}</MenuItem>
  ))}
</Menu>`,
  },
];

export default function ContextMenuCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
