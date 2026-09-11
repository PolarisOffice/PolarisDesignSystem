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
        사용자의 확인이나 선택이 필요한 중요한 상황에 사용하는 모달 다이얼로그예요. 화면을 차단하고
        사용자의 즉각적인 응답을 요구해요.
      </PageLead>
      <DocTabs
        design={<PopupDesign />}
        code={<PopupCode />}
        codeBadge={isComponentLive('popup') ? undefined : '준비 중'}
      />
    </>
  );
}
