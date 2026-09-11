import { Tooltip, IconButton } from '@polarisoffice/pds-react';

import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow, DemoCol } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';

import { TOOLTIP_POSITIONS } from './tooltip.data';

const IMPORT = `import { Tooltip, IconButton } from '${PDS_PACKAGE}';`;

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'position',
    title: 'Position',
    desc: '기본은 top. 화면 가장자리에 가려지면 자동으로 반대 방향으로 fallback 해요.',
    previewName: 'Tooltip',
    // 넷을 한꺼번에 띄우면 말풍선끼리 겹쳐 방향을 못 읽는다 — 실제처럼 호버로 하나씩 보게 한다
    preview: (
      <DemoRow gap="wide">
        {TOOLTIP_POSITIONS.map((p) => (
          <DemoCol key={p} label={p}>
            <Tooltip content="Text" placement={p}>
              <IconButton aria-label={`${p} 방향 예시`} />
            </Tooltip>
          </DemoCol>
        ))}
      </DemoRow>
    ),
    code: `${IMPORT}

${TOOLTIP_POSITIONS.map((p) => `<Tooltip content="Text" placement="${p}"><IconButton /></Tooltip>`).join('\n')}`,
  },
  {
    id: 'arrow',
    title: 'Arrow',
    desc: '트리거와 툴팁의 관계가 맥락상 명확하지 않을 때만 화살표를 붙여요.',
    previewName: 'Tooltip',
    preview: (
      <DemoRow gap="wide">
        <DemoCol label="arrow">
          <Tooltip content="저장" arrow open>
            <IconButton aria-label="저장" />
          </Tooltip>
        </DemoCol>
        <DemoCol label="arrow 없음">
          <Tooltip content="공유" arrow={false} open>
            <IconButton aria-label="공유" />
          </Tooltip>
        </DemoCol>
      </DemoRow>
    ),
    code: `${IMPORT}

<Tooltip content="저장" arrow><IconButton icon="save" /></Tooltip>
<Tooltip content="공유"><IconButton icon="share" /></Tooltip>`,
  },
  {
    id: 'timing',
    title: 'Timing',
    desc: '첫 호버 600ms, 연속 호버 100ms(cascade), 무호버 1,500ms 경과 시 리셋. 기본값이라 보통 건드리지 않아요.',
    previewName: 'Tooltip',
    // 타이밍은 정지 화면으로 못 보여준다 — 실제 호버해 보게 둔다
    preview: (
      <DemoRow gap="wide">
        <DemoCol label="호버해 보세요">
          <Tooltip content="Text" showDelay={600} hideDelay={0}>
            <IconButton aria-label="예시" />
          </Tooltip>
        </DemoCol>
      </DemoRow>
    ),
    code: `${IMPORT}

<Tooltip content="Text" showDelay={600} hideDelay={0}>
  <IconButton />
</Tooltip>`,
  },
];

export default function TooltipCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
