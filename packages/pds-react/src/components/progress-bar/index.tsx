'use client';

import { color as token, radius } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { ProgressBarProps } from './types.js';

/**
 * PDS Figma `Feedback → Loading / ProgressBar`(3192:1907) 실측.
 *
 * 높이 4 · radius full · 너비는 영역에 맞춘다(기본 100%).
 * Indeterminate: 전체 너비의 30% 구간이 1,500ms linear 로 좌에서 우로 이동한다.
 *   시작은 트랙 왼쪽 밖, 끝은 오른쪽 밖 — 이동량을 자기 너비 기준으로 적으면
 *   (-100% → 트랙폭/자기폭 × 100%) 이라 30% 막대는 333.333% 다.
 * Determinate: 값이 바뀔 때 200ms ease-out 으로 채운다.
 */
const CYCLE_MS = 1500;
const HEIGHT = 4;
const INDETERMINATE_WIDTH = 30; // 트랙 너비의 %
const TRAVEL = `${((100 / INDETERMINATE_WIDTH) * 100).toFixed(3)}%`;
const FILL_MS = 200;

const SLIDE_KEYFRAMES = `@keyframes pds-progress-bar-slide{from{transform:translateX(-100%)}to{transform:translateX(${TRAVEL})}}`;

const clamp = (v: number) => (v < 0 ? 0 : v > 100 ? 100 : v);

function ProgressBarBase({
  type = 'indeterminate',
  value = 0,
  color = token.labelAlternative,
  trackColor = token.fillNormal,
  height = HEIGHT,
  className,
  'aria-label': ariaLabel,
}: ProgressBarProps) {
  const determinate = type === 'determinate';
  const pct = clamp(value);

  const track: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height,
    borderRadius: radius.full,
    background: trackColor,
  };

  const indicator: CSSProperties = determinate
    ? {
        width: `${pct}%`,
        height: '100%',
        borderRadius: radius.full,
        background: color,
        transition: `width ${FILL_MS}ms ease-out`,
      }
    : {
        position: 'absolute',
        insetBlock: 0,
        left: 0,
        width: `${INDETERMINATE_WIDTH}%`,
        borderRadius: radius.full,
        background: color,
        animation: `pds-progress-bar-slide ${CYCLE_MS}ms linear infinite`,
      };

  return (
    <div
      className={className}
      style={track}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuemax={determinate ? 100 : undefined}
      aria-valuenow={determinate ? pct : undefined}
    >
      {!determinate && <style>{SLIDE_KEYFRAMES}</style>}
      <div style={indicator} />
    </div>
  );
}

export const ProgressBar = withSupported(ProgressBarBase, {
  acceptsChildren: false,
  type: ['indeterminate', 'determinate'],
});
