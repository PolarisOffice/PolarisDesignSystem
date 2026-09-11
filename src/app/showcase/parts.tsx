'use client';

import type { CSSProperties, ReactNode } from 'react';

/**
 * 쇼케이스 전용 레이아웃 조각 — PDS 컴포넌트가 아니다.
 *
 * 색은 리터럴이 아니라 **토큰**을 쓴다. 이 페이지가 디자인 리뷰의 무대이고, 무대가 테마를
 * 안 따라가면 다크 검토 자체가 불가능하다 — 흰 카드 위에 다크 컴포넌트가 놓여 실제와 다른
 * 그림이 나오고, 다크에서 흰 배경이 되는 버튼(black)은 카드에 묻혀 사라진 것처럼 보인다.
 */
const shell: CSSProperties = {
  fontFamily: 'Pretendard, -apple-system, sans-serif',
  color: 'var(--color-label-normal)',
};

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section style={{ ...shell, marginBottom: 56 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>{title}</h2>
      </div>
      {note && <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--color-label-alternative)', lineHeight: 1.6 }}>{note}</p>}
      <div
        style={{
          border: '1px solid var(--color-line-neutral)',
          borderRadius: 12,
          padding: 24,
          background: 'var(--color-background-base)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {children}
      </div>
    </section>
  );
}

/** 한 줄 = 하나의 변형 축 */
export function Row({ label, children, align = 'center' }: { label: string; children: ReactNode; align?: 'center' | 'start' }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: align === 'center' ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
      <span
        style={{
          width: 92,
          flexShrink: 0,
          fontSize: 12,
          fontFamily: 'ui-monospace, Menlo, monospace',
          color: 'var(--color-label-assistive)',
          paddingTop: align === 'start' ? 6 : 0,
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', flex: '1 0 0', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}

/** 페이지와 구분되는 바탕이 필요한 컴포넌트용(Dim 등) — 테마를 따라간다 */
export function DarkStage({
  children,
  width = 300,
  height = 200,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <div
      style={{
        position: 'relative',
        // absolute 로 덮는 컴포넌트(Dim)를 담으려면 무대가 크기를 가져야 한다
        width,
        height,
        flexShrink: 0,
        borderRadius: 8,
        background: 'var(--color-fill-normal)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}
