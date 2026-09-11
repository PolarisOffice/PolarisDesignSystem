'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarFor, flattenLinks } from '@/lib/docs/nav';
import { pageMeta } from '@/lib/docs/pages';
import s from './DocsShell.module.css';

/**
 * 이전/다음 링크 — 원본이 `docFooter` 를 끄지 않아 라이브 사이트에 있는 기능. 푸터는 DocsFooter(서버).
 * 순서는 사이드바 평탄화로 파생하므로 nav.ts 만 고치면 따라온다.
 */
export default function PrevNext() {
  const pathname = usePathname();
  // standalone 페이지(이용약관)는 카드를 그리지 않고, 이웃 계산에서도 건너뛴다 — pages.ts 참고
  if (pageMeta(pathname)?.standalone) return null;
  const links = flattenLinks(sidebarFor(pathname)).filter((l) => !pageMeta(l.link)?.standalone);
  const idx = links.findIndex((l) => l.link === pathname);
  const prev = idx > 0 ? links[idx - 1] : undefined;
  const next = idx >= 0 && idx < links.length - 1 ? links[idx + 1] : undefined;

  // 사이드바 라벨보다 페이지 H1 을 우선 표시 (둘은 의도적으로 다르다 — pages.ts 참고)
  const label = (link: string, fallback: string) => pageMeta(link)?.title ?? fallback;

  return (
    <>
      {(prev || next) && (
        <nav className={s.prevNext} aria-label="이전·다음 문서">
          {prev && (
            <Link href={prev.link} className={s.pnLink}>
              <span className={s.pnLabel}>이전</span>
              <span className={s.pnTitle}>{label(prev.link, prev.text)}</span>
            </Link>
          )}
          {next && (
            <Link href={next.link} className={`${s.pnLink} ${s.pnNext}`}>
              <span className={s.pnLabel}>다음</span>
              <span className={s.pnTitle}>{label(next.link, next.text)}</span>
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
