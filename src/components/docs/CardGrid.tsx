import Link from 'next/link';
import type { ReactNode } from 'react';
import s from './CardGrid.module.css';

/** 카드 그리드 — 원본 `.comp-grid` (auto-fill, 최소 200px) */
export function CardGrid({ children }: { children: ReactNode }) {
  return <div className={s.grid}>{children}</div>;
}

/** 이동 카드 — 원본 `.comp-card`. 내부 링크는 next/link, 외부는 <a> 로 자동 분기 */
export function DocCard({ href, name, desc }: { href: string; name: string; desc?: string }) {
  const body = (
    <>
      <div className={s.name}>{name}</div>
      {desc && <div className={s.desc}>{desc}</div>}
    </>
  );

  if (href.startsWith('http')) {
    return (
      <a href={href} className={s.card} target="_blank" rel="noreferrer">
        {body}
      </a>
    );
  }
  return (
    <Link href={href} className={s.card}>
      {body}
    </Link>
  );
}
