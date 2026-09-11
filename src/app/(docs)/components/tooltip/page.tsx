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
        요소에 대한 추가 설명을 호버 시 표시하는 컴포넌트예요. 강조하고자 하는 요소에서 8px 상단 노출을
        기본으로 해요.
      </PageLead>
      <DocTabs
        design={<TooltipDesign />}
        code={<TooltipCode />}
        codeBadge={isComponentLive('tooltip') ? undefined : '준비 중'}
      />
    </>
  );
}
