'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { KIT_NAV_LINK, TOP_NAV } from '@/lib/docs/nav';
import SearchDialog from '@/components/docs/SearchDialog';
import { IS_EMBED, withBase } from '@/lib/basePath';

/** 테마 저장 키 — layout.tsx 의 무플래시 인라인 스크립트와 **동일 문자열**이어야 한다. */
const THEME_KEY = 'PDS-theme';

type Theme = 'light' | 'dark';

/**
 * 상단 GNB — PDS 문서 사이트의 네비(Docs / AI Integration)와 테마 토글.
 *
 * 메뉴 정의는 [nav.ts](../lib/docs/nav.ts)의 TOP_NAV 단일 소스를 쓴다 — 원본 config.js 의
 * `activeMatch` 정규식을 술어로 옮겨 놓은 것이다.
 *
 * 테마는 PDS tokens.css 규약대로 `html[data-theme]` 한 곳만 바꾼다. 최초 값은 layout.tsx 의
 * 인라인 스크립트가 페인트 전에 확정하므로 여기서는 **읽어서 표시만** 하고 클릭 때만 쓴다
 * (마운트 전 서버 렌더에서는 테마를 알 수 없어 아이콘을 비워 hydration 불일치를 피한다).
 */
export default function KitHeader() {
  const pathname = usePathname();

  // 모바일 사이드바 접기/펼치기 — 상태의 단일 소유자는 헤더. html[data-nav-open] 로 CSS 에
  // 알리고(DocsShell.module.css), 경로가 바뀌면 자동으로 닫는다(항목 선택 = 닫힘)
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.navOpen = navOpen ? 'true' : '';
  }, [navOpen]);
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  // 초협폭 GNB 오버플로 메뉴(⋯) — 텍스트 링크들이 접히는 대신 팝오버 리스트로 노출
  const [menuOpen, setMenuOpen] = useState(false);
  const overflowRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!overflowRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === 'dark' ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* 시크릿 모드 등 localStorage 차단 — 이번 세션만 적용되고 기억은 안 된다 */
    }
  };

  return (
    <header className="kit-header">
      {/* 햄버거(모바일만)와 로고는 한 덩어리 — space-between 레이아웃에서 셋으로 흩어지지 않게 */}
      <div className="kit-header-brand">
      <button
        type="button"
        className="kit-nav-toggle"
        onClick={() => setNavOpen((v) => !v)}
        aria-expanded={navOpen}
        aria-controls="kit-sidebar"
        aria-label={navOpen ? '문서 목차 닫기' : '문서 목차 열기'}
        title={navOpen ? '문서 목차 닫기' : '문서 목차 열기'}
      >
        <MenuIcon open={navOpen} />
      </button>
      <Link href="/" className="kit-logo" aria-label="Polaris Design System">
        {/* next/image 를 쓰지 않는다 — 로고는 SVG 고정 크기라 최적화 이득이 없다 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBase('/brand-assets/logo.svg')} alt="" width={24} height={24} aria-hidden="true" />
        {/* 워드마크 "PDS" — 텍스트가 아니라 SVG 마스크(globals.css .kit-logo-text). 접근성 이름은
            위 Link 의 aria-label 이 담당한다 (hover 확장 인터랙션은 2026-08-31 검토 후 제거) */}
        <span className="kit-logo-text" aria-hidden="true" />
      </Link>
      </div>
      <nav>
        {/* 데스크톱 인라인 링크들 — 초협폭에선 통째로 숨고 ⋯ 오버플로가 대신한다 */}
        <span className="kit-nav-links">
          {TOP_NAV.map((item) => {
            const active = item.isActive(pathname);
            return (
              <Link key={item.text} href={item.link} aria-current={active ? 'page' : undefined}>
                {item.text}
              </Link>
            );
          })}
          {/* 내 디자인 시스템 — 문서 탭이 아니라 도구 진입점이라 버튼 형태로 구분(nav.ts KIT_NAV_LINK 주석).
              PAX 동봉본은 업로드 도구를 싣지 않으므로 숨긴다 */}
          {!IS_EMBED && (
            <Link
              href={KIT_NAV_LINK.link}
              className="kit-header-kit-link"
              aria-current={KIT_NAV_LINK.isActive(pathname) ? 'page' : undefined}
            >
              {KIT_NAV_LINK.text}
            </Link>
          )}
        </span>
        {/* 초협폭 오버플로 메뉴 — 리스트 항목은 인라인과 동일한 단일 소스(TOP_NAV + KIT_NAV_LINK) */}
        <span className="kit-nav-overflow" ref={overflowRef}>
          <button
            type="button"
            className="kit-nav-more"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="메뉴 더보기"
            title="메뉴 더보기"
          >
            <MoreIcon />
          </button>
          {menuOpen && (
            <div className="kit-nav-popover" role="menu">
              {TOP_NAV.map((item) => (
                <Link
                  key={item.text}
                  role="menuitem"
                  href={item.link}
                  aria-current={item.isActive(pathname) ? 'page' : undefined}
                >
                  {item.text}
                </Link>
              ))}
              {/* 문서 탭 ↔ 도구 진입점 위계 분리 — 인라인의 버튼 형태 구분을 리스트에선 구분선이 담당 */}
              {!IS_EMBED && (
                <>
                  <span className="kit-nav-popover-divider" aria-hidden="true" />
                  <Link
                    role="menuitem"
                    href={KIT_NAV_LINK.link}
                    aria-current={KIT_NAV_LINK.isActive(pathname) ? 'page' : undefined}
                  >
                    {KIT_NAV_LINK.text}
                  </Link>
                </>
              )}
            </div>
          )}
        </span>
        {/* 아이콘 버튼 쌍은 자체 gap 으로 묶는다 — nav 의 20px gap 은 텍스트 링크 간격용 */}
        <span className="kit-header-icons">
          <SearchDialog />
          <button
            type="button"
            className="kit-theme-toggle"
            onClick={toggle}
            aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {theme === null ? null : theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
        </span>
      </nav>
    </header>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
