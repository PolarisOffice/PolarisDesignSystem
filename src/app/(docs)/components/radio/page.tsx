import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import RadioDesign, { RadioSpecification } from './radio.design';
import RadioCode from './radio.code';

const meta = pageMeta('/components/radio')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/checkbox.md` 의 Radio 부분 — 2026-10-12 별도 페이지로 분리 */
export default function RadioPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>여러 항목 중 하나만 고르는 단일 선택이에요. 여러 개를 고를 땐 Checkbox 를 써요.</PageLead>
      <DocTabs
        design={<RadioDesign />}
        code={
          <>
            <RadioCode />
            <RadioSpecification />
          </>
        }
        codeBadge={isComponentLive('radio') ? undefined : '준비 중'}
      />
    </>
  );
}
