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
        Checkbox 는 다중 선택, Radio 는 단일 선택이에요. 옵션 고르기나 동의 확인에 써요.
      </PageLead>
      <DocTabs
        design={<CheckboxDesign />}
        code={<CheckboxCode />}
        codeBadge={isComponentLive('checkbox') ? undefined : '준비 중'}
      />
    </>
  );
}
