import type { ReactNode } from 'react';
import s from './UsageGrid.module.css';

/**
 * DO / DON'T 비교 — 원본 컴포넌트 문서의 Guidelines 섹션(9개 페이지).
 *
 * 원본은 항상 "✓ DO" / "✗ DON'T" 고정 라벨에 문자열 목록 두 벌이라 prop 두 개로 충분하다.
 * 라벨 문구를 바꿀 일이 생기면 그때 prop 을 늘린다.
 */
export default function UsageGrid({
  do: dos,
  dont: donts,
}: {
  do: ReactNode[];
  dont: ReactNode[];
}) {
  return (
    <div className={s.grid}>
      <div className={`${s.card} ${s.cardDo}`}>
        <p className={s.label}>✓ DO</p>
        <ul className={s.list}>
          {dos.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div className={`${s.card} ${s.cardDont}`}>
        <p className={s.label}>✗ DON&apos;T</p>
        <ul className={s.list}>
          {donts.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
