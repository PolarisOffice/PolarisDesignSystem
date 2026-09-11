'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { OUTLINE_LABEL } from '@/lib/docs/nav';
import s from './DocsShell.module.css';

interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * 우측 목차 — 원본 `outline: { label: '이 페이지', level: [2,3] }`.
 *
 * 왜 **런타임 DOM 스캔**인가: TSX 페이지에는 마크다운 AST 가 없다. 빌드타임 추출은 헤딩을
 * 데이터 배열에서 `.map()` 으로 만드는 페이지(colors 의 Role 섹션 등)에서 깨지고,
 * 페이지마다 `export const toc` 를 두면 두 번째 진실원천이 되어 헤딩 이름을 고칠 때 반드시
 * 어긋난다. 렌더된 헤딩 자체를 읽으면 마크다운 시절과 같은 "항상 일치" 보장을 얻는다.
 *
 * 대가: 초기 HTML 에 목차가 없다(SEO·view-source 미노출). 사내 문서라 수용하되,
 * 필요해지면 `items` prop 으로 서버 주입할 수 있게 처음부터 열어 둔다.
 */
export default function Toc({ items }: { items?: TocEntry[] }) {
  const pathname = usePathname();
  const [entries, setEntries] = useState<TocEntry[]>(items ?? []);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items) return; // 서버 주입 모드
    const scan = () => {
      // 제외 2종: Anatomy 실물 견본 안의 헤딩(문서 구조 아님), 그리고 `data-toc-scope="active"`
      // 탭 루트(PageTabs) 안의 **숨겨진 패널** 헤딩 — seed 처럼 활성 탭만 목차에 싣는다.
      // 컴포넌트 페이지의 DocTabs 는 스코프 속성이 없어 종전대로 전부 노출(Code 탭에서도
      // Design 헤딩으로 점프 가능).
      const EXCL = ':not([data-anatomy-sample] *):not([data-toc-scope="active"] [hidden] *)';
      const nodes = document.querySelectorAll<HTMLHeadingElement>(
        `[data-docs-body] h2[id]${EXCL}, [data-docs-body] h3[id]${EXCL}`,
      );
      setEntries(
        Array.from(nodes).map((el) => ({
          id: el.id,
          // 우선순위: 명시 tocText → 헤딩 텍스트 span → 요소 전체.
          // 마지막 폴백은 앵커 '#' 가 섞이므로 Heading 컴포넌트를 쓰지 않은 헤딩에서만 쓰인다.
          text:
            el.dataset.tocText ??
            el.querySelector<HTMLElement>('[data-heading-text]')?.textContent?.trim() ??
            el.textContent?.trim() ??
            '',
          level: el.tagName === 'H2' ? 2 : 3,
        })),
      );
    };
    scan();
    window.addEventListener('docs:tabchange', scan);
    return () => window.removeEventListener('docs:tabchange', scan);
  }, [items, pathname]);

  useEffect(() => {
    if (entries.length === 0) {
      setActiveId(null);
      return;
    }
    // 관찰자가 처음 발화하기 전의 빈 구간을 메운다. 첫 헤딩이 상단 밴드 **밖**에서 시작하는
    // 페이지가 있어서 필요하다 — 컴포넌트 Code 탭은 안내 카드가 첫 예제를 밴드 아래로 밀어내,
    // 진입 직후 목차 전체가 비활성으로 보였다(Design 탭은 우연히 밴드 안이라 멀쩡했다).
    // 해시로 바로 들어온 경우엔 그 대상이 현재이므로 첫 항목으로 깜빡이지 않게 한다.
    const fromHash = decodeURIComponent(window.location.hash.slice(1));
    setActiveId(entries.some((e) => e.id === fromHash) ? fromHash : entries[0].id);

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records.filter((r) => r.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
          return;
        }
        // 밴드가 빈 경우는 두 가지다. 첫 헤딩보다 **위로** 올라왔으면 첫 항목이 현재고,
        // 헤딩 사이를 지나는 중이면 직전 값을 유지한다. 이 구분이 없으면 첫 헤딩이 밴드 밖에서
        // 시작하는 페이지(Code 탭)에서 맨 위로 되돌아와도 지나온 항목이 계속 켜져 있다.
        const first = document.getElementById(entries[0].id);
        if (first && first.getBoundingClientRect().top > 0) setActiveId(entries[0].id);
      },
      // 상단 30% 안에 들어온 헤딩을 현재 위치로 본다
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );
    for (const e of entries) {
      const el = document.getElementById(e.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [entries]);

  // 레이아웃 시프트 방지 — 내용이 없어도 컬럼 자리는 유지한다(빈 <aside>)
  return (
    <aside className={s.toc} aria-label={OUTLINE_LABEL}>
      {entries.length > 0 && (
        <>
          <p className={s.tocTitle}>{OUTLINE_LABEL}</p>
          <ul className={s.tocList}>
            {entries.map((e) => (
              <li key={e.id}>
                <a
                  href={`#${encodeURIComponent(e.id)}`}
                  className={e.id === activeId ? `${s.tocLink} ${s.tocActive}` : s.tocLink}
                  style={{ '--level': e.level - 2 } as React.CSSProperties}
                >
                  {e.text}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
