import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import TabsDesign from './tabs.design';
import TabsCode from './tabs.code';

const meta = pageMeta('/components/tabs')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/tabs.md` */
export default function TabsPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        같은 계층의 콘텐츠 영역을 오갈 때 써요.
      </PageLead>
      <DocTabs
        design={<TabsDesign />}
        code={<TabsCode />}
        codeBadge={isComponentLive('tabs') ? undefined : '준비 중'}
      />
    </>
  );
}
