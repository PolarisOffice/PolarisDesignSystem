import type { ReactNode } from 'react';
import s from './PageLead.module.css';

/**
 * 페이지 H1 아래 도입부 — 원본 `.component-tag` + `.component-desc`.
 * `.component-desc` 는 32개 페이지 전부가 쓰는 최다 공용 프리미티브다. 크기는 본문과 동일
 * (16px / 1.75 — 원본 17px → 2026-08-21 14px → 2026-09-18 본문과 통일, 이력은 PageLead.module.css).
 * `tag`(카테고리 캡션)는 컴포넌트 12페이지가 쓰다가 걷어냈다(2026-08-13 — 분류 소음 결정,
 * CardGrid 의 SectionLabel 과 동시 제거). prop 은 원본 프리미티브 보존 차원에서 남긴다.
 */
export default function PageLead({ tag, children }: { tag?: string; children: ReactNode }) {
  return (
    <>
      {tag && <p className={s.tag}>{tag}</p>}
      <p className={s.desc}>{children}</p>
    </>
  );
}
