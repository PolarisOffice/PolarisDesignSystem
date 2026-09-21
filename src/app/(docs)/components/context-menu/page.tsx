import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import ContextMenuDesign from './context-menu.design';
import ContextMenuCode from './context-menu.code';

const meta = pageMeta('/components/context-menu')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/context-menu.md` */
export default function ContextMenuPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        컨텍스트 메뉴와 드롭다운 목록의 아이템이에요. 너비는 부모에 맞춰 fill 로 채워요.
      </PageLead>
      <DocTabs
        design={<ContextMenuDesign />}
        code={<ContextMenuCode />}
        codeBadge={isComponentLive('context-menu') ? undefined : '준비 중'}
      />
    </>
  );
}
