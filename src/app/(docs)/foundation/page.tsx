import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import { PreviewCard, PreviewGrid } from '@/components/docs/CardGrid';
import { FOUNDATION_GLYPHS } from '@/components/docs/FoundationGlyphs';
import { FOUNDATION_LINKS } from '@/lib/docs/nav';
import { pageMeta } from '@/lib/docs/pages';

const meta = pageMeta('/foundation')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/**
 * 파운데이션 랜딩 — GNB 탭의 착지점(2026-09-18 섹션 분리).
 *
 * 카드 목록은 사이드바와 **같은 단일 소스**(nav.ts FOUNDATION_LINKS)를 쓰고,
 * 설명은 pages.ts 의 description 을 그대로 가져온다 — 목록을 따로 손관리하지 않는다.
 */
export default function FoundationIndexPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        색·글자·간격처럼 모든 컴포넌트가 딛고 서는 기본 규칙이에요. 값은 토큰으로 정의돼 있어요.
      </PageLead>

      {/* 갤러리형 + 메타포 그래픽(2026-09-21, FoundationGlyphs.tsx) */}
      <PreviewGrid>
        {FOUNDATION_LINKS.map((item) => {
          const page = item.link ? pageMeta(item.link) : undefined;
          return (
            <PreviewCard
              key={item.link}
              href={item.link!}
              name={item.text}
              desc={page?.description}
              preview={FOUNDATION_GLYPHS[item.link!]}
            />
          );
        })}
      </PreviewGrid>
    </>
  );
}
