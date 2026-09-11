import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import CheckboxDesign from './checkbox.design';
import CheckboxCode from './checkbox.code';

const meta = pageMeta('/components/checkbox')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/checkbox.md` */
export default function CheckboxPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        Checkbox는 다중 선택, Radio는 단일 선택 항목에 사용해요. 목록에서 옵션을 선택하거나 동의 여부를
        확인할 때 사용해요.
      </PageLead>
      <DocTabs
        design={<CheckboxDesign />}
        code={<CheckboxCode />}
        codeBadge={isComponentLive('checkbox') ? undefined : '준비 중'}
      />
    </>
  );
}
