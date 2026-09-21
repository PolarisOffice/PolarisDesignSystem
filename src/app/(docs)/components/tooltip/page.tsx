import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import TooltipDesign from './tooltip.design';
import TooltipCode from './tooltip.code';

const meta = pageMeta('/components/tooltip')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/tooltip.md` */
export default function TooltipPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        호버하면 요소의 짧은 설명을 띄워요. 기본은 요소 위 8px 이에요.
      </PageLead>
      <DocTabs
        design={<TooltipDesign />}
        code={<TooltipCode />}
        codeBadge={isComponentLive('tooltip') ? undefined : '준비 중'}
      />
    </>
  );
}
