import type { Metadata } from 'next';
import Sidebar from '@/components/docs/Sidebar';
import Toc from '@/components/docs/Toc';
import PrevNext from '@/components/docs/PrevNext';
import DocsFooter from '@/components/docs/DocsFooter';
import HashRescue from '@/components/docs/HashRescue';
import { SITE_TITLE, SITE_DESCRIPTION } from '@/lib/docs/pages';
import '@/styles/docs-tokens.css';
import s from '@/components/docs/DocsShell.module.css';

export const metadata: Metadata = {
  title: { default: SITE_TITLE, template: `%s | ${SITE_TITLE}` },
  description: SITE_DESCRIPTION,
};

/**
 * 문서 셸 — 사이드바 / 본문 / 우측 목차.
 *
 * 라우트 그룹 `(docs)` 는 URL 에 경로를 추가하지 않으므로 기존 VitePress URL 과 동일하게 유지된다.
 * `data-docs-body` 는 Toc 가 헤딩을 찾는 표식이다 — 본문 래퍼에서 떼지 말 것.
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.layout}>
      <Sidebar />
      <main className={s.main}>
        <div data-docs-body>{children}</div>
        <PrevNext />
        <DocsFooter />
      </main>
      <Toc />
      <HashRescue />
    </div>
  );
}
