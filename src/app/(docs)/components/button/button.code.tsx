import { Button, DownloadIcon } from '@polarisoffice/pds-react';
import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';
import { BUTTON_GHOST_VARIANTS, BUTTON_SIZES, BUTTON_SOLID_VARIANTS } from './button.data';

/**
 * Button — Code 탭.
 *
 * 코드 문자열은 `button.data.ts` 에서 **파생**한다. Design 탭의 스펙 표와 같은 배열을 읽으므로
 * variant 를 하나 추가하면 양쪽이 함께 따라온다 — 손으로 두 벌 관리하는 문제가 안 생긴다.
 *
 * 패키지 배포 후 할 일: 각 spec 에 `preview:` 한 줄씩 추가. 같은 배열을 돌면 된다. 예)
 *   preview: <DemoRow>{BUTTON_SOLID_VARIANTS.map(v => <Button key={v.name} variant={v.name}>{v.label}</Button>)}</DemoRow>
 *
 * 예제 제목의 앵커는 CodeExample 이 spec 의 `id` 에서 `code-{id}` 로 만든다 — 여기서 손으로
 * 헤딩을 쓸 일이 없다. 목차가 활성 탭만 싣는 것은 DocTabs 가 보장한다.
 */

const IMPORT = `import { Button } from '${PDS_PACKAGE}';`;

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'solid',
    title: 'Solid',
    desc: '배경이 채워진 기본 형태예요. 화면 내 가장 중요한 단일 액션에만 Primary 를 써요.',
    previewName: 'Button',
    code: `${IMPORT}

${BUTTON_SOLID_VARIANTS.map((v) => `<Button variant="${v.name}">${v.label}</Button>`).join('\n')}`,
    preview: (
      <DemoRow>
        {BUTTON_SOLID_VARIANTS.map((v) => (
          <Button key={v.name} variant={v.name}>
            {v.label}
          </Button>
        ))}
      </DemoRow>
    ),
  },
  {
    id: 'ghost',
    title: 'Ghost',
    desc: '배경 없이 아웃라인만 있는 형태예요. 시선을 콘텐츠에 집중시키고 싶을 때 써요.',
    previewName: 'Button',
    code: `${IMPORT}

${BUTTON_GHOST_VARIANTS.map((v) => `<Button variant="${v.name}">${v.label}</Button>`).join('\n')}`,
    preview: (
      <DemoRow>
        {BUTTON_GHOST_VARIANTS.map((v) => (
          <Button key={v.name} variant={v.name}>
            {v.label}
          </Button>
        ))}
      </DemoRow>
    ),
  },
  {
    id: 'default',
    title: 'Default',
    desc: '흰 배경 아웃라인 기본 버튼이에요. 고스트와 달리 배경을 칠하고 hover 가 정의돼 있어요 (Figma Type=Default).',
    previewName: 'Button',
    code: `${IMPORT}

<Button variant="default">버튼</Button>`,
    preview: (
      <DemoRow>
        <Button variant="default">버튼</Button>
      </DemoRow>
    ),
  },
  {
    id: 'size',
    title: 'Size',
    desc: '64 · 54 · 48 · 40 · 32 · 24 여섯 단계. 기본 UI 액션은 48 을 권장해요.',
    previewName: 'Button',
    code: `${IMPORT}

${BUTTON_SIZES.map((b) => `<Button size={${b.size}}>버튼 레이블</Button>`).join('\n')}`,
    preview: (
      <DemoRow>
        {BUTTON_SIZES.map((b) => (
          <Button key={b.size} size={b.size}>
            버튼 레이블
          </Button>
        ))}
      </DemoRow>
    ),
  },
  {
    id: 'icon',
    title: 'Icon',
    desc: '아이콘은 좌우 어느 쪽에도 놓을 수 있어요. 시각적 균형에 따라 좌우 여백을 조정해요.',
    previewName: 'Button',
    code: `${IMPORT}
// 해당 아이콘은 임시 아이콘이라 교체해서 써야 해요.
import { DownloadIcon } from '${PDS_PACKAGE}';

<Button variant="primary" rightIcon={<DownloadIcon />}>버튼</Button>
<Button variant="primary" leftIcon={<DownloadIcon />}>버튼</Button>`,
    preview: (
      <DemoRow>
        <Button variant="primary" rightIcon={<DownloadIcon />}>
          버튼
        </Button>
        <Button variant="primary" leftIcon={<DownloadIcon />}>
          버튼
        </Button>
      </DemoRow>
    ),
  },
  {
    id: 'disabled',
    title: 'Disabled',
    desc: 'Button 의 Disabled 는 투명도가 아니라 색상 자체를 교체해요.',
    previewName: 'Button',
    code: `${IMPORT}

<Button variant="primary" disabled>버튼</Button>`,
    preview: (
      <DemoRow>
        <Button variant="primary" disabled>
          버튼
        </Button>
      </DemoRow>
    ),
  },
];

export default function ButtonCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
