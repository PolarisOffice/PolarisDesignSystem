import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import { H2 } from '@/components/docs/Heading';
import { PreviewCard, PreviewGrid } from '@/components/docs/CardGrid';
import { COMPONENT_PREVIEWS } from './component-previews';
import { COMPONENT_GROUPS } from '@/lib/docs/components-catalog';
import { isNew } from '@/lib/docs/changelog';
import NewBadge from '@/components/docs/NewBadge';
import { pageMeta } from '@/lib/docs/pages';

const meta = pageMeta('/components')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/index.md` */
export default function ComponentsIndexPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>Polaris Design System의 모든 컴포넌트를 둘러보세요.</PageLead>

      {/* Figma 와 같은 소분류로 묶는다(2026-09-18 — 구 단일 그리드 대체). 사이드바와 같은 순서·같은 소스.
          카드는 갤러리형 + 실물 프리뷰(2026-09-21, component-previews.tsx) */}
      {COMPONENT_GROUPS.map((group) => (
        <section key={group.label}>
          <H2>{group.label}</H2>
          <PreviewGrid>
            {group.items.map((item) => (
              <PreviewCard
                key={item.slug}
                href={`/components/${item.slug}`}
                name={
                  <>
                    {item.name}
                    {isNew(item.since) && <NewBadge />}
                  </>
                }
                desc={item.desc}
                preview={COMPONENT_PREVIEWS[item.slug]}
              />
            ))}
          </PreviewGrid>
        </section>
      ))}
    </>
  );
}
