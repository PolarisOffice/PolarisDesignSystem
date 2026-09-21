'use client';

import { ProgressBar, ProgressCircle, Skeleton } from '@polarisoffice/pds-react';

/**
 * 가이드 견본용 Loading 3종.
 *
 * ProgressBar 는 너비를 영역에서 받으므로 타일에 그냥 눕히면 안 보인다 —
 * 폭을 가진 상자에 넣어 등록한다. Skeleton 도 같은 이유로 실제 쓰임(아바타 + 두 줄)을 보인다.
 */
const row: React.CSSProperties = { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' };

/** 가이드 견본의 `loading` 한 칸 — 원형 4크기·막대 2종·스켈레톤(아바타+두 줄)을 한눈에 */
export function LoadingDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={row}>
        <ProgressCircle size={18} />
        <ProgressCircle size={24} />
        <ProgressCircle size={32} />
        <ProgressCircle size={48} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 240 }}>
        <ProgressBar />
        <ProgressBar type="determinate" value={60} />
      </div>
      <div style={{ ...row, gap: 12 }}>
        <Skeleton shape="circle" width={40} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton shape="text" width={180} />
          <Skeleton shape="text" width={120} height={12} />
        </div>
      </div>
    </div>
  );
}
