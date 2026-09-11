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
        화면 상단 또는 하단에 일시적으로 표시되는 알림 메시지예요. 사용자 액션의 결과를 간단하게 전달할
        때 사용해요.
      </PageLead>
      <DocTabs
        design={<ToastDesign />}
        code={<ToastCode />}
        codeBadge={isComponentLive('toast') ? undefined : '준비 중'}
      />
    </>
  );
}
