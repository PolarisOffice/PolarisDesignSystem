import { Chip, UserIcon } from '@polarisoffice/pds-react';
import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow, DemoCol } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';
import { CHIP_SIZES } from './chip.data';
import { ChipRemoveDemo, ChipToggleDemo } from './chip.demo';

const IMPORT = `import { Chip } from '${PDS_PACKAGE}';`;

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'chip',
    title: 'Chip',
    desc: 'type 을 안 주면 조건 칩(default)이에요. 걸린 조건이나 값을 보여 주는 회색 칩이고, 눌러도 선택되지 않아요. 눌러서 켜고 끄는 칩은 type="select" 예요. 글자만 있는 굵은 태그는 Badge 예요.',
    previewName: 'Chip',
    code: `${IMPORT}

<Chip>디자인</Chip>`,
    preview: (
      <DemoRow>
        <Chip>디자인</Chip>
      </DemoRow>
    ),
  },
  {
    id: 'icon',
    title: 'Icon',
    desc: 'leftIcon 으로 라벨 앞에 아이콘을 붙여요. 아이콘 크기는 md 16 · sm 14 로 넘겨요.',
    previewName: 'Chip',
    code: `import { Chip, UserIcon } from '${PDS_PACKAGE}';

<Chip leftIcon={<UserIcon size={16} />}>김하늘</Chip>`,
    preview: (
      <DemoRow>
        <Chip leftIcon={<UserIcon size={16} />}>김하늘</Chip>
      </DemoRow>
    ),
  },
  {
    id: 'remove',
    title: 'Remove',
    desc: '조건 칩에 onRemove 를 주면 오른쪽에 × 가 생겨요(선택 칩에서는 그리지 않아요). 걸린 조건은 「팀: 디자인」처럼 무엇의 어떤 값인지 함께 쓰고, 표 툴바(TableToolbar)의 below 줄에 놓아요. × 의 접근성 이름은 라벨에서 만들어져요(「팀: 디자인 해제」). 바꾸려면 removeLabel 을 줘요. × 를 누르면 그 버튼이 사라지니 키보드 포커스는 남아 있는 곳으로 옮겨요.',
    previewName: 'Chip',
    code: `${IMPORT}

<Chip onRemove={() => setTeam('all')}>팀: 디자인</Chip>
<Chip onRemove={() => setStatus('all')}>상태: 재직</Chip>`,
    preview: <ChipRemoveDemo />,
  },
  {
    id: 'controlled',
    title: 'Select',
    desc: 'type="select" 는 눌러서 켜고 끄는 선택 칩이에요. 흰 면에 테두리로 그려지고, selected 가 true 면 파란 면에 체크 표시가 붙어요. onClick 에서 selected 를 바꿔요. 여러 개가 함께 켜질 수 있어요. 하나만 고르는 전환은 SegmentControl 을 써요.',
    previewName: 'Chip',
    code: `${IMPORT}
import { useState } from 'react';

const [on, setOn] = useState<string[]>(['디자인']);

{['디자인', '개발', '기획', '마케팅'].map((t) => (
  <Chip
    key={t}
    type="select"
    selected={on.includes(t)}
    onClick={() => setOn(on.includes(t) ? on.filter((x) => x !== t) : [...on, t])}
  >
    {t}
  </Chip>
))}`,
    preview: <ChipToggleDemo />,
  },
  {
    id: 'check',
    title: 'Check',
    desc: '켜진 선택 칩의 체크 표시는 checkIcon={false} 로 뺄 수 있어요. 기본은 붙여요(색만으로는 켜진 걸 알기 어려운 사람을 위해서예요). 체크가 붙으면 칩이 그만큼 넓어져요.',
    previewName: 'Chip',
    code: `${IMPORT}

<Chip type="select" selected checkIcon={false} onClick={toggle}>디자인</Chip>`,
    preview: <ChipToggleDemo check={false} />,
  },
  {
    id: 'size',
    title: 'Size',
    desc: `md · sm 두 단계. ${CHIP_SIZES.map((t) => `${t.size}(${t.height})`).join(' · ')}. sm 은 표 셀 안처럼 좁은 곳에 써요. 두 종류 모두 같은 크기 체계예요. 한 줄 안에서는 크기를 하나로 맞춰요.`,
    previewName: 'Chip',
    code: `${IMPORT}

${CHIP_SIZES.map((t) => `<Chip size="${t.size}">디자인</Chip>`).join('\n')}`,
    preview: (
      <DemoRow gap="wide">
        {CHIP_SIZES.map((t) => (
          <DemoCol key={t.size} label={`${t.size} · ${t.height}`}>
            <Chip size={t.size}>디자인</Chip>
          </DemoCol>
        ))}
      </DemoRow>
    ),
  },
];

export default function ChipCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
