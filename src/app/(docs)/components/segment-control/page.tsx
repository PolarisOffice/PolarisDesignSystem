import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import SegmentControlDesign from './segment-control.design';
import SegmentControlCode from './segment-control.code';

const meta = pageMeta('/components/segment-control')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/segment-control.md` */
export default function SegmentControlPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        상호 배타적인 옵션을 즉시 필터링하거나 뷰를 전환할 때 사용해요. 선택 결과가 같은 화면에 바로
        반영돼요.
      </PageLead>
      <DocTabs
        design={<SegmentControlDesign />}
        code={<SegmentControlCode />}
        codeBadge={isComponentLive('segment-control') ? undefined : '준비 중'}
      />
    </>
  );
}
