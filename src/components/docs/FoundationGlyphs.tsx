import type { ReactNode } from 'react';
import { withBase } from '@/lib/basePath';
import s from './FoundationGlyphs.module.css';

/**
 * Foundation Overview 카드의 추상 메타포 그래픽(2026-09-21).
 *
 * 토큰 값을 그대로 보여주는 스와치·눈금은 "추상적이라 큰 타일에 안 어울린다" 는 피드백으로,
 * 각 규칙의 은유를 브랜드 블루 3톤(채움·중간·틴트)으로만 그린 인라인 SVG 로 바꿨다 —
 * 이미지 파일 없음, 다크 모드는 토큰이 처리. Logo 카드만 실제 심볼.
 * 키 = 라우트(nav.ts FOUNDATION_LINKS 의 link) — 항목이 늘면 여기에 그림을 하나 더 그린다.
 */
const B = 'var(--color-accent-normal)';
const BT = 'color-mix(in srgb, var(--color-accent-normal) 22%, transparent)';
const BT2 = 'color-mix(in srgb, var(--color-accent-normal) 45%, transparent)';

function G({ children }: { children: ReactNode }) {
  return (
    <svg className={s.glyph} viewBox="0 0 120 72" aria-hidden="true">
      {children}
    </svg>
  );
}

export const FOUNDATION_GLYPHS: Record<string, ReactNode> = {
  // Color — 겹치는 원 셋(혼색)
  '/foundation/colors': (
    <G>
      <circle cx="46" cy="30" r="22" fill={BT} />
      <circle cx="74" cy="30" r="22" fill={BT2} />
      <circle cx="60" cy="48" r="22" fill={B} opacity="0.85" />
    </G>
  ),
  // Typography — 굵은 제목 줄 + 본문 줄
  '/foundation/typography': (
    <G>
      <rect x="22" y="14" width="56" height="12" rx="6" fill={B} />
      <rect x="22" y="34" width="76" height="6" rx="3" fill={BT2} />
      <rect x="22" y="46" width="64" height="6" rx="3" fill={BT2} />
      <rect x="22" y="58" width="40" height="6" rx="3" fill={BT} />
    </G>
  ),
  // UX Writing — 말풍선 안 문장 줄
  '/foundation/writing': (
    <G>
      <path
        d="M22 14h66a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10H50l-14 12V54h-14a10 10 0 0 1-10-10V24a10 10 0 0 1 10-10z"
        fill={BT}
      />
      <rect x="34" y="26" width="42" height="5" rx="2.5" fill={B} />
      <rect x="34" y="37" width="28" height="5" rx="2.5" fill={BT2} />
    </G>
  ),
  // Spacing — 두 블록 사이 치수선
  '/foundation/spacing': (
    <G>
      <rect x="18" y="18" width="30" height="36" rx="8" fill={BT2} />
      <rect x="72" y="18" width="30" height="36" rx="8" fill={BT2} />
      <path d="M52 36h16" stroke={B} strokeWidth="2" strokeLinecap="round" />
      <path d="M52 31v10M68 31v10" stroke={B} strokeWidth="2" strokeLinecap="round" />
    </G>
  ),
  // Grid — 타일 격자, 하나 강조
  '/foundation/grid': (
    <G>
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => (
          <rect
            key={`${c}${r}`}
            x={24 + c * 26}
            y={14 + r * 24}
            width="22"
            height="20"
            rx="5"
            fill={c === 1 && r === 0 ? B : BT}
          />
        )),
      )}
    </G>
  ),
  // Radius — 큰 모서리 곡률 + 안쪽 점선 곡선
  '/foundation/radius': (
    <G>
      <path d="M30 60V36a22 22 0 0 1 22-22h38v46z" fill={BT} />
      <path d="M30 60V36a22 22 0 0 1 22-22h38" fill="none" stroke={B} strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M38 60V36a14 14 0 0 1 14-14h30"
        fill="none"
        stroke={BT2}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
    </G>
  ),
  // Elevation — 층층이 떠 있는 판
  '/foundation/elevation': (
    <G>
      <rect x="30" y="40" width="60" height="18" rx="6" fill={BT} />
      <rect x="30" y="28" width="60" height="18" rx="6" fill={BT2} />
      <rect x="30" y="14" width="60" height="18" rx="6" fill={B} />
    </G>
  ),
  // Motion — 공과 잔상
  '/foundation/motion': (
    <G>
      <circle cx="34" cy="40" r="7" fill={BT} />
      <circle cx="50" cy="34" r="8" fill={BT2} />
      <circle cx="70" cy="28" r="10" fill={B} />
      <path d="M22 54c18 0 30-6 44-16" fill="none" stroke={BT2} strokeWidth="2" strokeLinecap="round" />
    </G>
  ),
  // Iconography — 둥근 틀 안 반짝이
  '/foundation/iconography': (
    <G>
      <rect x="36" y="12" width="48" height="48" rx="12" fill={BT} />
      <path
        d="M60 22c1.5 8 4 10.5 12 12-8 1.5-10.5 4-12 12-1.5-8-4-10.5-12-12 8-1.5 10.5-4 12-12z"
        fill={B}
      />
    </G>
  ),
  // Logo — 둥근 틀 안 실제 심볼(이 카드만 실물)
  '/brand/logo': (
    <div className={s.logoTile}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 정적 SVG 심볼 */}
      <img className={s.logo} src={withBase('/brand-assets/logo.svg')} alt="" />
    </div>
  ),
};
