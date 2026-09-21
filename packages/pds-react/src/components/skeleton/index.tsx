'use client';

import { color, radius } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { SkeletonProps, SkeletonShape } from './types.js';

/**
 * PDS Figma `Feedback → Loading / Skeleton`(3192:1914) 실측.
 *
 * 색은 `fill/normal` 하나뿐이다 — 오버레이가 없어 다크에서 별도 지정이 필요 없다.
 * 움직임은 **쓸고 지나가는 빛(shimmer)이 아니라** 블록 전체의 투명도가
 * 100%↔30% 를 2,000ms ease-in-out 으로 오가는 것이다. 그라데이션을 넣지 말 것.
 *
 * 크기는 실제 콘텐츠에 맞춘다 — 기본값은 Figma 의 기본 변형 치수다.
 */
const CYCLE_MS = 2000;
const PULSE_KEYFRAMES = `@keyframes pds-skeleton-pulse{0%,100%{opacity:1}50%{opacity:.3}}`;

const DEFAULTS: Record<SkeletonShape, { width: number; height: number; radius: string }> = {
  rect: { width: 240, height: 120, radius: radius.md },
  circle: { width: 48, height: 48, radius: radius.full },
  text: { width: 240, height: 16, radius: radius.xs },
};

function SkeletonBase({ shape = 'rect', width, height, className }: SkeletonProps) {
  const base = DEFAULTS[shape] ?? DEFAULTS.rect;
  const w = width ?? base.width;
  // 원은 지름 하나로 다룬다 — 너비만 바꿔도 원이 유지된다
  const h = height ?? (shape === 'circle' ? w : base.height);

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        width: w,
        height: h,
        flex: 'none',
        borderRadius: base.radius,
        background: color.fillNormal,
        animation: `pds-skeleton-pulse ${CYCLE_MS}ms ease-in-out infinite`,
      }}
    >
      <style>{PULSE_KEYFRAMES}</style>
    </div>
  );
}

export const Skeleton = withSupported(SkeletonBase, {
  acceptsChildren: false,
  shape: ['rect', 'circle', 'text'],
});
