import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import ToastDesign from './toast.design';
import ToastCode from './toast.code';

const meta = pageMeta('/components/toast')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/toast.md` */
export default function ToastPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        액션의 결과를 짧게 알려주고 사라지는 메시지예요. 화면 상단이나 하단에 떠요.
      </PageLead>
      <DocTabs
        design={<ToastDesign />}
        code={<ToastCode />}
        codeBadge={isComponentLive('toast') ? undefined : '준비 중'}
      />
    </>
  );
}
