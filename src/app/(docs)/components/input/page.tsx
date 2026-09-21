import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import InputDesign from './input.design';
import InputCode from './input.code';

const meta = pageMeta('/components/input')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/input.md` */
export default function InputPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        텍스트를 입력받을 때 써요. 레이블·아이콘·에러 메시지를 조합해요.
      </PageLead>
      <DocTabs
        design={<InputDesign />}
        code={<InputCode />}
        codeBadge={isComponentLive('input') ? undefined : '준비 중'}
      />
    </>
  );
}
