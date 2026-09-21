import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import LoadingDesign from './loading.design';
import LoadingCode from './loading.code';

const meta = pageMeta('/components/loading')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: Figma `Feedback → Loading`(3192:233) */
export default function LoadingPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        처리 중임을 알리는 표시예요. 짧은 로딩과 좁은 자리에는 원형(Progress Circle)을, 진행률을 계산할 수
        있는 작업에는 막대(Progress Bar)를, 화면 첫 진입과 목록에는 Skeleton 을 사용해요.
      </PageLead>
      <DocTabs
        design={<LoadingDesign />}
        code={<LoadingCode />}
        codeBadge={isComponentLive('loading') ? undefined : '준비 중'}
      />
    </>
  );
}
