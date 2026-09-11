import type { ReactNode } from 'react';
import s from './Demo.module.css';

/**
 * 컴포넌트 미리보기 면 — 원본 `.demo-wrap`.
 * 안에는 **실제 살아있는 컴포넌트**가 들어간다(원본은 손으로 쓴 정적 HTML 목업이었다).
 */
export function DemoSurface({
  children,
  pad = 'default',
  align = 'center',
}: {
  children: ReactNode;
  pad?: 'default' | 'tall';
  align?: 'center' | 'stretch';
}) {
  const cls = [s.surface, pad === 'tall' && s.surfaceTall, align === 'stretch' && s.surfaceStretch]
    .filter(Boolean)
    .join(' ');
  return <div className={cls}>{children}</div>;
}

/**
 * 여러 변형을 늘어놓을 때 — 원본 `.demo-row`.
 *
 * 기본은 가로(원본 그대로). 가로로 긴 컴포넌트(Tabs·Segment 등)는 나란히 두면
 * 서로 붙어 읽기 어려우므로 `stack` 으로 위아래로 쌓고 간격을 더 준다.
 */
export function DemoRow({
  children,
  stack = false,
  align = 'center',
  gap = 'default',
}: {
  children: ReactNode;
  stack?: boolean;
  align?: 'center' | 'left';
  /** 변형끼리 붙어 보일 때 `wide` — 레이블이 달린 묶음에 특히 필요하다 */
  gap?: 'default' | 'wide';
}) {
  const cls = [s.row, stack && s.rowStack, align === 'left' && s.rowLeft, gap === 'wide' && s.rowWide]
    .filter(Boolean)
    .join(' ');
  return <div className={cls}>{children}</div>;
}

/**
 * 라벨이 붙은 세로 묶음 — 원본 `.demo-col` + `.demo-col-label`.
 * 원본에서 `.demo-col-label` 은 `.demo-col` 없이 등장한 적이 없어 prop 으로 접었다.
 */
export function DemoCol({
  label,
  children,
  align = 'center',
}: {
  label?: string;
  children: ReactNode;
  align?: 'center' | 'left';
}) {
  const cls = [s.col, align === 'left' && s.colLeft].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      {children}
      {label && <span className={s.colLabel}>{label}</span>}
    </div>
  );
}
