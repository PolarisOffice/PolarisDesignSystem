import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import PopupDesign from './popup.design';
import PopupCode from './popup.code';

const meta = pageMeta('/components/popup')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/popup.md` */
export default function PopupPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        확인이나 선택이 꼭 필요할 때 화면을 막고 응답을 받는 모달이에요.
      </PageLead>
      <DocTabs
        design={<PopupDesign />}
        code={<PopupCode />}
        codeBadge={isComponentLive('popup') ? undefined : '준비 중'}
      />
    </>
  );
}
