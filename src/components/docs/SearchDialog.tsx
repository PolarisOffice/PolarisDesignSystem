'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PAGES, pageMeta } from '@/lib/docs/pages';
import fixture from '@/lib/docs/__fixtures__/headings.json';
import s from './SearchDialog.module.css';

/**
 * 전체 검색 (⌘K / Ctrl+K) — **의존성 0, 서버 0.**
 *
 * 인덱스는 이미 저장소에 있는 두 자산에서 파생한다:
 *  · `__fixtures__/headings.json` — 전 페이지의 헤딩(앵커 id 포함, 원본 VitePress 와 바이트 일치)
 *  · `pages.ts` — 라우트별 제목·설명
 * 즉 페이지 제목·모든 섹션 헤딩으로 점프할 수 있다. 앵커 id 는 NFKD 조합형 그대로라
 * encodeURIComponent 만 하면 정확히 착지한다(같은 페이지면 직접 스크롤).
 *
 * 본문 전문(full-text) 검색은 의도적으로 이 범위 밖 — 필요해지면 Pagefind(정적 출력에서
 * 빌드타임 인덱싱)를 붙이는 게 다음 단계다. 이 컴포넌트의 UI 는 그대로 두고 검색 소스만
 * 갈아끼우면 된다.
 */

interface Entry {
  kind: 'page' | 'h2' | 'h3';
  /** 표시·매칭 텍스트 (헤딩이면 헤딩 텍스트) */
  text: string;
  route: string;
  /** 헤딩 앵커 id (NFKD) */
  id?: string;
  /** 헤딩이 속한 페이지 제목 */
  pageTitle: string;
}

const INDEX: Entry[] = (() => {
  const out: Entry[] = [];
  for (const meta of PAGES) {
    if (meta.hidden) continue;
    out.push({ kind: 'page', text: meta.title, route: meta.path, pageTitle: meta.title });
  }
  for (const page of (fixture as { pages: { route: string; headings: { tag: string; id: string; text: string }[] }[] }).pages) {
    const route = page.route.replace(/\/$/, '') || '/';
    const pageTitle = pageMeta(route)?.title ?? route;
    for (const h of page.headings) {
      if (h.tag === 'h1') continue;
      out.push({ kind: h.tag as 'h2' | 'h3', text: h.text, route, id: h.id, pageTitle });
    }
  }
  return out;
})();

function search(query: string): Entry[] {
  const q = query.trim().toLowerCase();
  if (!q) return INDEX.filter((e) => e.kind === 'page').slice(0, 8);
  const scored: { e: Entry; score: number }[] = [];
  for (const e of INDEX) {
    const t = e.text.toLowerCase();
    if (!t.includes(q) && !(e.kind !== 'page' && e.pageTitle.toLowerCase().includes(q))) continue;
    let score = 0;
    if (t.startsWith(q)) score += 3;
    else if (t.includes(q)) score += 2;
    if (e.kind === 'page') score += 2;
    else if (e.kind === 'h2') score += 1;
    scored.push({ e, score });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 20).map((x) => x.e);
}

export default function SearchDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  const results = useMemo(() => search(query), [query]);

  const open = useCallback(() => {
    setQuery('');
    setCursor(0);
    dialogRef.current?.showModal();
    // showModal 이 autofocus 를 이미 처리하지만, 재오픈 시를 위해 명시
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  // 전역 단축키 — ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const go = (entry: Entry) => {
    close();
    const hash = entry.id ? `#${encodeURIComponent(entry.id)}` : '';
    if (entry.id && entry.route === pathname) {
      // 같은 페이지의 헤딩 — 라우터를 거치지 않고 직접 스크롤 (pathname 불변이라 rescue 미발동)
      document.getElementById(entry.id)?.scrollIntoView({ block: 'start' });
      window.history.replaceState(null, '', entry.route + hash);
      return;
    }
    router.push(entry.route + hash);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    // 한글 IME 조합 중의 키는 조합 확정용이다 — Enter 를 액션으로 삼키면
    // "조합만 끝났는데 페이지가 이동"하거나(오발) "이동이 안 되는"(무시) 오동작이 된다
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter' && results[cursor]) {
      e.preventDefault();
      go(results[cursor]);
    }
  };

  return (
    <>
      <button type="button" className="kit-theme-toggle" onClick={open} aria-label="검색 (⌘K)" title="검색 (⌘K)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        className={s.dialog}
        aria-label="문서 검색"
        onClick={(e) => {
          // 패널 밖(backdrop) 클릭으로 닫기 — dialog 자신이 target 일 때만
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className={s.panel}>
          <input
            ref={inputRef}
            className={s.input}
            type="search"
            placeholder="페이지·섹션 검색…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={onKeyDown}
            aria-label="검색어"
          />
          <ul className={s.results} role="listbox" aria-label="검색 결과">
            {results.length === 0 && <li className={s.empty}>결과 없음</li>}
            {results.map((r, i) => (
              <li key={`${r.route}#${r.id ?? ''}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === cursor}
                  className={i === cursor ? `${s.result} ${s.resultActive}` : s.result}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => go(r)}
                >
                  <span className={s.resultText}>
                    {r.kind === 'page' ? r.text : (
                      <>
                        <span className={s.resultPage}>{r.pageTitle}</span>
                        <span className={s.resultSep} aria-hidden="true">›</span>
                        {r.text}
                      </>
                    )}
                  </span>
                  <span className={s.resultMeta}>{r.kind === 'page' ? r.route : r.kind.toUpperCase()}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className={s.hint}>
            <kbd>↑↓</kbd> 이동 · <kbd>Enter</kbd> 열기 · <kbd>Esc</kbd> 닫기
          </p>
        </div>
      </dialog>
    </>
  );
}
