'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarFor, TOP_NAV, type NavNode } from '@/lib/docs/nav';
import NewBadge from './NewBadge';
import s from './DocsShell.module.css';

/**
 * 문서 사이드바 — Seed Design(seed-design.io) 문법.
 *
 * 접기가 없다. 그룹은 **흐린 섹션 라벨**, 항목은 평탄 목록. 활성 항목은 hover 와 같은 배경
 * 박스를 자기 자신이 그리고(.itemActive), 켜지고 꺼지는 건 CSS transition 페이드뿐이다
 * (2026-09-18: 경로 변경 때 항목 사이를 미끄러져 다니던 슬라이딩 pill 은 "위아래로 옮겨
 * 다니는 게 거슬린다" 는 피드백으로 제거 — 측정·ResizeObserver·phase 상태 전부 사라졌다).
 */
export default function Sidebar() {
  const pathname = usePathname();
  const nodes = sidebarFor(pathname);

  return (
    <nav id="kit-sidebar" className={s.sidebar} aria-label="문서 목차">
      {nodes.map((node) => (
        <SidebarSection key={node.text} node={node} pathname={pathname} />
      ))}
      {/* 모바일 드로어 전용 — GNB 섹션 4개를 아코디언으로, 처음엔 전부 접힘(2026-09-18: "섹션 묶음 +
          현재 섹션 목록" 두 층이 헷갈린다는 피드백). 데스크톱은 CSS 로 숨기고 위 목록이 담당한다.
          key=pathname — 이동하면 remount 돼 다시 전부 접힌 채로 열린다(native details 는 비제어) */}
      <div className={s.drawer} data-drawer key={pathname}>
        {TOP_NAV.map((item) => (
          <details key={item.text} className={s.acc}>
            <summary className={s.accSummary} aria-current={item.isActive(pathname) ? 'true' : undefined}>
              {item.text}
            </summary>
            {sidebarFor(item.link).map((node) => (
              // 섹션 이름과 같은 소제목은 summary 가 이미 보여 주므로 생략
              <SidebarSection key={node.text} node={node} pathname={pathname} hideLabel={node.text === item.text} />
            ))}
          </details>
        ))}
      </div>
    </nav>
  );
}

function SidebarSection({ node, pathname, hideLabel }: { node: NavNode; pathname: string; hideLabel?: boolean }) {
  // 단독 링크 (소개 · 리소스)
  if (!node.items?.length) {
    return <ItemLink text={node.text} link={node.link} pathname={pathname} />;
  }

  return (
    <section className={s.section}>
      {hideLabel ? null : node.link ? (
        <Link
          href={node.link}
          data-label
          className={`${s.sectionLabel} ${s.sectionLabelLink}`}
          aria-current={node.link === pathname ? 'page' : undefined}
        >
          {node.text}
        </Link>
      ) : (
        <span className={s.sectionLabel}>{node.text}</span>
      )}
      <ul className={s.list}>
        {node.items.map((item) => (
          <li key={item.text}>
            <ItemLink text={item.text} link={item.link} badge={item.badge} pathname={pathname} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ItemLink({ text, link, badge, pathname }: { text: string; link?: string; badge?: string; pathname: string }) {
  const active = link === pathname;
  return (
    <Link
      href={link ?? '#'}
      className={active ? `${s.item} ${s.itemActive}` : s.item}
      aria-current={active ? 'page' : undefined}
    >
      {text}
      {badge && <NewBadge />}
    </Link>
  );
}
