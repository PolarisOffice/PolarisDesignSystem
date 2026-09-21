'use client';

import { color as token } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { ProgressCircleProps, ProgressCircleSize } from './types.js';

/**
 * PDS Figma `Feedback → Loading / ProgressCircle`(3192:1894) 실측.
 *
 * 트랙(옅은 원)은 없다 — 호 하나만 돈다. 48 박스를 픽셀로 읽어 확인했다.
 *
 * 애니메이션은 디자인 스펙 표 그대로다:
 *   주기 2,000ms · 앞끝 0→1,667ms 에 1%→100% · 뒤끝 333→2,000ms 에 0%→99%
 *   회전 주기당 356.4도 linear · 이징 cubic-bezier(0.333, 0, 0.667, 1)
 * 두 끝이 겹쳐 움직이므로 호가 길어졌다 짧아지고, 멈춰 보이는 구간이 없다.
 * 회전이 360 이 아니라 356.4 인 것은 뒤끝이 99% 에서 0 으로 되돌아가며 생기는
 * 3.6도를 상쇄해 이음매를 감추기 위한 것이다 — 값을 360 으로 고치면 매 주기 튄다.
 */
const CYCLE_MS = 2000;
const TRIM_MS = 1667;
/** 뒤끝이 앞끝을 뒤따르는 간격 */
const LAG_MS = 333;
const SPIN_DEG = 356.4;

/** 박스 → [링 바깥지름, 선 두께] */
const SIZES: Record<ProgressCircleSize, [ring: number, stroke: number]> = {
  18: [12, 1.5],
  24: [16, 2],
  32: [22, 3],
  48: [32, 4],
};

/**
 * cubic-bezier(0.333, 0, 0.667, 1) 의 y 값.
 * CSS 에 이징을 맡기면 키프레임 구간마다 다시 적용돼 곡선이 달라진다 —
 * 곡선을 여기서 미리 풀어 넣고 애니메이션은 linear 로 돌린다.
 */
const easeY = (x: number): number => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const cx = (t: number) => 3 * (1 - t) * (1 - t) * t * 0.333 + 3 * (1 - t) * t * t * 0.667 + t * t * t;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (cx(mid) < x) lo = mid;
    else hi = mid;
  }
  const t = (lo + hi) / 2;
  return 3 * (1 - t) * t * t + t * t * t;
};

/** 앞끝(%) — 1 에서 100 까지 */
const trimEnd = (ms: number) => 1 + 99 * easeY(ms / TRIM_MS);
/** 뒤끝(%) — 앞끝을 LAG_MS 만큼 뒤따른다 */
const trimStart = (ms: number) => 99 * easeY((ms - LAG_MS) / TRIM_MS);

/**
 * 길이를 100 으로 정규화(`pathLength`)해 두면 dasharray 를 퍼센트처럼 쓸 수 있어
 * 네 크기가 키프레임 한 벌을 공유한다.
 */
const SAMPLE_MS = 100;
const TRIM_KEYFRAMES = (() => {
  const stops: string[] = [];
  for (let ms = 0; ms <= CYCLE_MS; ms += SAMPLE_MS) {
    const seg = trimEnd(ms) - trimStart(ms);
    stops.push(
      `${((ms / CYCLE_MS) * 100).toFixed(2)}%{stroke-dasharray:${seg.toFixed(3)} ${(100 - seg).toFixed(3)};stroke-dashoffset:${(-trimStart(ms)).toFixed(3)}}`,
    );
  }
  return `@keyframes pds-progress-circle-trim{${stops.join('')}}`;
})();

const SPIN_KEYFRAMES = `@keyframes pds-progress-circle-spin{to{transform:rotate(${SPIN_DEG}deg)}}`;

function ProgressCircleBase({
  size = 18,
  color = token.labelAlternative,
  className,
  'aria-label': ariaLabel = 'loading',
  'aria-hidden': ariaHidden,
}: ProgressCircleProps) {
  const [ring, stroke] = SIZES[size] ?? SIZES[18];
  const center = size / 2;
  // 선은 경로 위에 가운데 정렬로 그려진다 — 링 바깥지름을 맞추려면 반지름에서 선 절반을 뺀다
  const r = (ring - stroke) / 2;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role={ariaHidden ? undefined : 'status'}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      focusable="false"
      style={{
        display: 'block',
        flex: 'none',
        transformOrigin: 'center',
        animation: `pds-progress-circle-spin ${CYCLE_MS}ms linear infinite`,
      }}
    >
      <style>{SPIN_KEYFRAMES + TRIM_KEYFRAMES}</style>
      <circle
        cx={center}
        cy={center}
        r={r}
        pathLength={100}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        style={{ animation: `pds-progress-circle-trim ${CYCLE_MS}ms linear infinite` }}
      />
    </svg>
  );
}

export const ProgressCircle = withSupported(ProgressCircleBase, {
  acceptsChildren: false,
  size: Object.keys(SIZES).map(Number),
});
