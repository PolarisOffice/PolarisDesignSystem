'use client';

import { color, font } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { DimProps } from './types.js';

/**
 * PDS Figma `Component/Overlay → dim` 실측.
 *
 * 스피너는 디자인에서 Lottie(spiner_ai.json)로 들어가 있다. 패키지는 런타임
 * 의존을 두지 않으므로 같은 크기(48px)의 회전 원호로 대신한다 — 모양이
 * 정확히 같지는 않다는 점을 여기 남긴다.
 */
const SPINNER = 48;
const GAP = 8;
const SPIN_KEYFRAMES = '@keyframes pds-dim-spin{to{transform:rotate(360deg)}}';

const wrap = (fullscreen: boolean): CSSProperties => ({
  ...(fullscreen ? { position: 'fixed', inset: 0 } : { position: 'absolute', inset: 0 }),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: GAP,
  background: color.layerOverlay,
  zIndex: 900, // Popup(1000) 아래 — 딤은 배경이다
});

function DimBase({ loading = true, label = 'loading', fullscreen = false, className }: DimProps) {
  return (
    <div className={className} role={loading ? 'status' : undefined} aria-busy={loading} style={wrap(fullscreen)}>
      {loading && (
        <>
          <style>{SPIN_KEYFRAMES}</style>
          <svg
            width={SPINNER}
            height={SPINNER}
            viewBox="0 0 48 48"
            aria-hidden="true"
            focusable="false"
            style={{ animation: 'pds-dim-spin 900ms linear infinite' }}
          >
            <circle cx="24" cy="24" r="20" stroke={color.staticWhite} strokeOpacity="0.25" strokeWidth="4" fill="none" />
            <path
              d="M24 4a20 20 0 0 1 20 20"
              stroke={color.accentNormal}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span
            style={{
              fontFamily: font.family,
              fontSize: font.body1Size,
              fontWeight: 500,
              lineHeight: 1.5,
              // 배경 layer-overlay 는 양 테마에서 같은 반투명 검정 — 글자도 고정 흰색
              color: color.staticWhite,
              textAlign: 'center',
            }}
          >
            {label}
          </span>
        </>
      )}
    </div>
  );
}

export const Dim = withSupported(DimBase, { acceptsChildren: false });
