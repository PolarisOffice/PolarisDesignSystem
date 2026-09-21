import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import ButtonDesign from './button.design';
import ButtonCode from './button.code';

const meta = pageMeta('/components/button')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/**
 * 원본: PDS `docs/components/button.md`
 *
 * 페이지는 서버 컴포넌트로 유지한다 — DocTabs 만 클라이언트 경계이고, 두 탭 내용은 prop 으로
 * 넘어가므로 서버 렌더된 채 클라이언트 번들에 들어가지 않는다.
 */
export default function ButtonPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        행동을 유도하거나 기능을 실행할 때 써요. 중요도와 맥락에 맞는 Variant 와 Size 를 골라요.
      </PageLead>
      <DocTabs
        design={<ButtonDesign />}
        code={<ButtonCode />}
        codeBadge={isComponentLive('button') ? undefined : '준비 중'}
      />
    </>
  );
}
