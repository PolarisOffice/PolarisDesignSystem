import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import { CardGrid, DocCard } from '@/components/docs/CardGrid';
import { COMPONENT_GROUPS } from '@/lib/docs/components-catalog';
import { pageMeta } from '@/lib/docs/pages';

const meta = pageMeta('/components')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/components/index.md` */
export default function ComponentsIndexPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>Polaris Design System의 모든 컴포넌트를 둘러보세요.</PageLead>

      {/* 카테고리 라벨 없이 단일 그리드 — 개수가 적어 분류가 소음이라는 결정(2026-08-13),
          순서는 사이드바와 동일한 이름 오름차순 */}
      <CardGrid>
        {COMPONENT_GROUPS.flatMap((g) => g.items)
          .sort((a, b) => a.name.localeCompare(b.name, 'en'))
          .map((item) => (
            <DocCard
              key={item.slug}
              href={`/components/${item.slug}`}
              name={item.name}
              desc={item.desc}
            />
          ))}
      </CardGrid>
    </>
  );
}
