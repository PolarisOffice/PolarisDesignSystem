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
        사용자가 미리 정의된 옵션 목록에서 하나를 선택할 수 있는 컴포넌트예요. 클릭 시 Context &amp; Menu
        Item 리스트가 노출돼요.
      </PageLead>
      <DocTabs
        design={<SelectDesign />}
        code={<SelectCode />}
        codeBadge={isComponentLive('select') ? undefined : '준비 중'}
      />
    </>
  );
}
