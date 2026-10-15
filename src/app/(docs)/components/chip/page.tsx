import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import ChipDesign, { ChipSpecification } from './chip.design';
import ChipCode from './chip.code';

const meta = pageMeta('/components/chip')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 2026-10-13 신설 — 표 툴바의 필터 칩(구 Badge onRemove)을 독립 컴포넌트로 떼면서 만든 페이지 */
export default function ChipPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        조건을 보여 주거나 여러 개를 고를 때 쓰는 알약 모양 칩이에요. 걸린 필터를 보여 주고 × 로 바로 풀 수 있어요.
      </PageLead>
      <DocTabs
        design={<ChipDesign />}
        code={
          <>
            <ChipCode />
            <ChipSpecification />
          </>
        }
        codeBadge={isComponentLive('chip') ? undefined : '준비 중'}
      />
    </>
  );
}
