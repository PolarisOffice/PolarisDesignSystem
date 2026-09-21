import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import SelectDesign from './select.design';
import SelectCode from './select.code';

const meta = pageMeta('/components/select')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/select.md` */
export default function SelectPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        정해진 옵션 중 하나를 고르는 컴포넌트예요. 누르면 Context &amp; Menu Item 목록이 열려요.
      </PageLead>
      <DocTabs
        design={<SelectDesign />}
        code={<SelectCode />}
        codeBadge={isComponentLive('select') ? undefined : '준비 중'}
      />
    </>
  );
}
