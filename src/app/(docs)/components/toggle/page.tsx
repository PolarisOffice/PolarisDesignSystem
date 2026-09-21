import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import ToggleDesign from './toggle.design';
import ToggleCode from './toggle.code';

const meta = pageMeta('/components/toggle')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/toggle.md` */
export default function TogglePage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        켜짐/꺼짐을 바로 전환해요. 설정 화면의 옵션 on/off 에 써요.
      </PageLead>
      <DocTabs
        design={<ToggleDesign />}
        code={<ToggleCode />}
        codeBadge={isComponentLive('toggle') ? undefined : '준비 중'}
      />
    </>
  );
}
