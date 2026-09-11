import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';

import { TOAST_VARIANTS } from './toast.data';
import { VariantDemo, PositionDemo, DurationDemo } from './toast.demo';

const IMPORT = `import { toast } from '${PDS_PACKAGE}';`;

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'variant',
    title: 'Variant',
    desc: 'Default · Error · Success. 한 번에 하나만 표시해요.',
    previewName: 'Toast',
    preview: (
      <DemoRow>
        <VariantDemo />
      </DemoRow>
    ),
    code: `${IMPORT}

${TOAST_VARIANTS.map((v) => `toast.${v.name}('${v.usage}');`).join('\n')}`,
  },
  {
    id: 'position',
    title: 'Position',
    desc: '상단·하단 각각 화면 끝에서 50px 여백을 둬요.',
    previewName: 'Toast',
    preview: (
      <DemoRow>
        <PositionDemo />
      </DemoRow>
    ),
    code: `${IMPORT}

toast.success('변경 사항이 저장되었습니다.', { position: 'top' });
toast.error('파일 업로드에 실패했습니다.', { position: 'bottom' });`,
  },
  {
    id: 'duration',
    title: 'Duration',
    desc: '자동 닫힘 기본값 3,000ms 는 유지하는 것을 권장해요.',
    previewName: 'Toast',
    preview: (
      <DemoRow>
        <DurationDemo />
      </DemoRow>
    ),
    code: `${IMPORT}

toast.success('링크가 클립보드에 복사되었습니다.', { duration: 3000 });`,
  },
];

export default function ToastCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
