import Link from 'next/link';
import type { ReactNode } from 'react';
import s from './CardGrid.module.css';

/** 카드 그리드 — 원본 `.comp-grid` (auto-fill, 최소 200px) */
export function CardGrid({ children }: { children: ReactNode }) {
  return <div className={s.grid}>{children}</div>;
}

/**
 * 이동 카드 — 원본 `.comp-card`. 내부 링크는 next/link, 외부는 <a> 로 자동 분기.
 * `meta` 는 설명 아래 흐린 한 줄(버전·개수 등 — 내 디자인 시스템 페이지의 카드)
 */
export function DocCard({
  href,
  name,
  desc,
  meta,
}: {
  href: string;
  name: ReactNode;
  desc?: ReactNode;
  meta?: ReactNode;
}) {
  const body = (
    <>
      <div className={s.name}>{name}</div>
      {desc && <div className={s.desc}>{desc}</div>}
      {meta && <div className={s.meta}>{meta}</div>}
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

/**
 * 프리뷰 카드 그리드 — Overview(Foundation·Component) 전용 갤러리형(2026-09-21).
 * 카드 테두리 없이 프리뷰 무대(fill-neutral)만 띄우고 이름·설명은 바탕 위에 둔다 —
 * "상자 안 상자(테두리+타일+구분선)" 가 촌스럽다는 피드백으로 층을 하나로. 3열 고정.
 */
export function PreviewGrid({ children }: { children: ReactNode }) {
  return <div className={s.previewGrid}>{children}</div>;
}

/** 프리뷰 카드 — `preview` 는 장식(aria-hidden·pointer-events 없음). 실물 컴포넌트든 SVG 든 무대 가운데에 놓인다 */
export function PreviewCard({ href, name, desc, preview }: { href: string; name: ReactNode; desc?: ReactNode; preview: ReactNode }) {
  return (
    <Link href={href} className={s.previewCard}>
      <div className={s.previewTile} aria-hidden="true">
        {/* hover 때 무대 안 내용만 살짝 확대하려고 한 겹 더 감싼다(무대 자체는 색만 바뀜) */}
        <div className={s.previewInner}>{preview}</div>
      </div>
      <div className={s.previewBody}>
        <div className={s.previewName}>{name}</div>
        {desc && <div className={s.desc}>{desc}</div>}
      </div>
    </Link>
  );
}
