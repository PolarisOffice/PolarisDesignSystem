import type { ReactNode } from 'react';
import s from './CaseList.module.css';

/** 사례 목록 컨테이너 — 원본 `.case-section` */
export function CaseList({ children }: { children: ReactNode }) {
  return <div className={s.section}>{children}</div>;
}

/**
 * 사례 한 건 — 원본 `.case-block`.
 * `tone="caution"` 이 원본의 `-caution` 변형 4종(block/badge/title/list)을 대신한다.
 */
export function CaseBlock({
  badge,
  title,
  sub,
  tone = 'default',
  children,
}: {
  /** "01" 같은 번호, 또는 주의 표시 "!" */
  badge: string;
  title: string;
  sub?: ReactNode;
  tone?: 'default' | 'caution';
  children?: ReactNode;
}) {
  return (
    <div className={tone === 'caution' ? `${s.block} ${s.blockCaution}` : s.block}>
      <div className={s.header}>
        <span className={s.badge}>{badge}</span>
        <div>
          <div className={s.title}>{title}</div>
          {sub && <div className={s.sub}>{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
