import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import TableDesign from './table.design';
import TableCode from './table.code';

const meta = pageMeta('/components/table')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/table.md` */
export default function TablePage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        행과 열로 데이터를 정렬해 보여줘요. 비교하거나 찾아볼 정보에 써요.
      </PageLead>
      <DocTabs
        design={<TableDesign />}
        code={<TableCode />}
        codeBadge={isComponentLive('table') ? undefined : '준비 중'}
      />
    </>
  );
}
