import { Button, ProgressBar, ProgressCircle, Skeleton } from '@polarisoffice/pds-react';
import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow, DemoCol } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';
import { CIRCLE_SIZES, SKELETON_SHAPES } from './loading.data';

const IMPORT = `import { ProgressCircle } from '${PDS_PACKAGE}';`;
const BAR_IMPORT = `import { ProgressBar } from '${PDS_PACKAGE}';`;
const SKELETON_IMPORT = `import { Skeleton } from '${PDS_PACKAGE}';`;

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'circle-base',
    title: 'Circle · Base',
    desc: '박스 크기만 정하면 링과 선 두께가 따라와요. 기본은 18 이에요.',
    previewName: 'ProgressCircle',
    code: `${IMPORT}

${CIRCLE_SIZES.map((s) => `<ProgressCircle size={${s.size}} />`).join('\n')}`,
    preview: (
      <DemoRow gap="wide">
        {CIRCLE_SIZES.map((s) => (
          <DemoCol key={s.size} label={`${s.size} · 링 ${s.ring} · 선 ${s.stroke}`}>
            <ProgressCircle size={s.size} />
          </DemoCol>
        ))}
      </DemoRow>
    ),
  },
  {
    id: 'circle-color',
    title: 'Circle · Color',
    desc: '기본은 label/alternative 예요. 어두운 배경 위에서는 static/white 로 바꿔요.',
    previewName: 'ProgressCircle',
    code: `${IMPORT}

<ProgressCircle size={32} />
<ProgressCircle size={32} color="var(--color-static-white)" />
<ProgressCircle size={32} color="var(--color-accent-normal)" />`,
    preview: (
      <DemoRow gap="wide">
        <DemoCol label="기본">
          <ProgressCircle size={32} />
        </DemoCol>
        <DemoCol label="어두운 배경 위">
          <span
            style={{
              display: 'inline-flex',
              padding: 12,
              borderRadius: 12,
              background: 'var(--color-layer-overlay, rgba(0,0,0,.5))',
            }}
          >
            <ProgressCircle size={32} color="var(--color-static-white)" />
          </span>
        </DemoCol>
        <DemoCol label="브랜드 색">
          <ProgressCircle size={32} color="var(--color-accent-normal)" />
        </DemoCol>
      </DemoRow>
    ),
  },
  {
    id: 'in-button',
    title: '버튼 안',
    desc: 'Button 의 loading 을 켜면 아이콘 자리에 들어가요. 클릭은 막히고 버튼 색은 그대로예요.',
    previewName: 'Button',
    code: `import { Button } from '${PDS_PACKAGE}';

<Button variant="primary" size={40} loading>저장중</Button>

// 라벨 없이 스피너만 — 폭이 흔들리지 않게 폭을 고정해요
<Button variant="primary" size={40} loading aria-label="저장중" style={{ width: 79 }} />`,
    preview: (
      <DemoRow gap="wide">
        <DemoCol label="라벨 유지">
          <Button variant="primary" size={40} loading>
            저장중
          </Button>
        </DemoCol>
        <DemoCol label="라벨 없음">
          <Button variant="primary" size={40} loading aria-label="저장중" style={{ width: 79 }} />
        </DemoCol>
      </DemoRow>
    ),
  },
  {
    id: 'accessibility',
    title: '화면 낭독기',
    desc: 'role="status"·aria-label="loading" 이 기본이에요. 문구를 바꾸거나 옆에 안내가 있으면 숨겨요.',
    previewName: 'ProgressCircle',
    code: `${IMPORT}

<ProgressCircle size={24} aria-label="문서를 불러오는 중" />

// 옆에 문구가 따로 있을 때 — 두 번 읽히지 않게 숨겨요
<ProgressCircle size={24} aria-hidden />`,
    preview: (
      <DemoRow gap="wide">
        <DemoCol label='aria-label="문서를 불러오는 중"'>
          <ProgressCircle size={24} aria-label="문서를 불러오는 중" />
        </DemoCol>
        <DemoCol label="aria-hidden">
          <ProgressCircle size={24} aria-hidden />
        </DemoCol>
      </DemoRow>
    ),
  },
  {
    id: 'bar-base',
    title: 'Bar · Base',
    desc: '기본은 Indeterminate 예요. 너비는 부모 영역을 채우니 폭을 가진 자리에 넣어요.',
    previewName: 'ProgressBar',
    code: `${BAR_IMPORT}

<ProgressBar />
<ProgressBar type="determinate" value={60} />`,
    preview: (
      <DemoRow stack align="left" gap="wide">
        <DemoCol label="indeterminate" align="left">
          <div style={{ width: 280 }}>
            <ProgressBar />
          </div>
        </DemoCol>
        <DemoCol label="determinate · value={60}" align="left">
          <div style={{ width: 280 }}>
            <ProgressBar type="determinate" value={60} />
          </div>
        </DemoCol>
      </DemoRow>
    ),
  },
  {
    id: 'bar-color',
    title: 'Bar · Color',
    desc: '채움과 트랙 색을 바꿀 수 있어요. 어두운 배경 위에서는 채움을 static/white 로 둬요.',
    previewName: 'ProgressBar',
    code: `${BAR_IMPORT}

<ProgressBar type="determinate" value={60} color="var(--color-accent-normal)" />
<ProgressBar type="determinate" value={60} color="var(--color-ai-normal)" />`,
    preview: (
      <DemoRow stack align="left" gap="wide">
        <DemoCol label="브랜드" align="left">
          <div style={{ width: 280 }}>
            <ProgressBar type="determinate" value={60} color="var(--color-accent-normal)" />
          </div>
        </DemoCol>
        <DemoCol label="AI" align="left">
          <div style={{ width: 280 }}>
            <ProgressBar type="determinate" value={60} color="var(--color-ai-normal)" />
          </div>
        </DemoCol>
      </DemoRow>
    ),
  },
  {
    id: 'with-label',
    title: 'Bar · 진행률 문구와 함께',
    desc: '10초를 넘는 작업이면 남은 시간이나 퍼센트를 함께 보여줘요.',
    previewName: 'ProgressBar',
    code: `${BAR_IMPORT}

<div style={{ display: 'flex', justifyContent: 'space-between' }}>
  <span>3분기 매출 보고서.xlsx</span>
  <span>60%</span>
</div>
<ProgressBar type="determinate" value={60} aria-label="업로드 진행률" />`,
    preview: (
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>3분기 매출 보고서.xlsx</span>
          <span style={{ fontSize: 13, color: 'var(--color-label-alternative)' }}>60%</span>
        </div>
        <ProgressBar type="determinate" value={60} aria-label="업로드 진행률" />
      </div>
    ),
  },
  {
    id: 'skeleton-base',
    title: 'Skeleton · Base',
    desc: 'Rect · Circle · Text 세 모양. 크기를 주지 않으면 모양별 기본값으로 그려요.',
    previewName: 'Skeleton',
    code: `${SKELETON_IMPORT}

${SKELETON_SHAPES.map((s) => `<Skeleton shape="${s.shape}" />`).join('\n')}`,
    preview: (
      <DemoRow gap="wide">
        {SKELETON_SHAPES.map((s) => (
          <DemoCol key={s.shape} label={`${s.label} · ${s.size}`}>
            <Skeleton
              shape={s.shape}
              width={s.shape === 'rect' ? 160 : undefined}
              height={s.shape === 'rect' ? 80 : undefined}
            />
          </DemoCol>
        ))}
      </DemoRow>
    ),
  },
  {
    id: 'skeleton-size',
    title: 'Skeleton · Size',
    desc: '실제 콘텐츠 크기에 맞춰요. width 는 %도 받아요. Circle 은 width 만 주면 원을 유지해요.',
    previewName: 'Skeleton',
    code: `${SKELETON_IMPORT}

<Skeleton shape="circle" width={40} />
<Skeleton shape="text" width={320} />
<Skeleton shape="text" width="60%" height={12} />`,
    preview: (
      <DemoRow stack align="left" gap="wide">
        <Skeleton shape="circle" width={40} />
        <Skeleton shape="text" width={240} />
        <Skeleton shape="text" width={150} height={12} />
      </DemoRow>
    ),
  },
  {
    id: 'skeleton-list',
    title: 'Skeleton · 목록',
    desc: '아바타 + 두 줄이 기본 뼈대예요. 마지막 줄을 짧게 만들면 문단처럼 보여요.',
    previewName: 'Skeleton',
    code: `${SKELETON_IMPORT}

{items.map((_, i) => (
  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Skeleton shape="circle" width={40} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
      <Skeleton shape="text" width="100%" />
      <Skeleton shape="text" width="60%" height={12} />
    </div>
  </div>
))}`,
    preview: (
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Skeleton shape="circle" width={40} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              <Skeleton shape="text" width="100%" />
              <Skeleton shape="text" width="60%" height={12} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export default function LoadingCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
