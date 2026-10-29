import type { Metadata } from 'next';
import Sidebar from '@/components/docs/Sidebar';
import Toc from '@/components/docs/Toc';
import PrevNext from '@/components/docs/PrevNext';
import DocsFooter from '@/components/docs/DocsFooter';
import HashRescue from '@/components/docs/HashRescue';
import RequestButton from '@/components/docs/RequestButton';
import PageBody from '@/components/docs/PageBody';
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
 * `data-docs-body` 는 Toc 가 헤딩을 찾는 표식이다 — 본문 래퍼(PageBody)에서 떼지 말 것.
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.layout}>
      <Sidebar />
      <main className={s.main}>
        <PageBody className={s.body}>
          {/* 모든 문서 페이지의 제목 오른쪽 — 페이지마다 따로 넣지 않고 여기 한 곳. 첫 요소가 h1 이라 그 줄에 붙는다 */}
          <RequestButton type="improve" className={s.improve}>
            개선 요청
          </RequestButton>
          {children}
        </PageBody>
        <PrevNext />
        <DocsFooter />
      </main>
      <Toc />
      <HashRescue />
    </div>
  );
}
