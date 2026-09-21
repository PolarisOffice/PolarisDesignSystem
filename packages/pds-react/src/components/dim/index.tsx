'use client';

import { color, font } from '../../tokens.js';
import { withSupported } from '../../supported.js';
import { ProgressCircle } from '../progress-circle/index.js';

import type { CSSProperties } from 'react';
import type { DimProps } from './types.js';

/**
 * PDS Figma `Component/Overlay → dim` 실측.
 *
 * 스피너는 Loading 스펙(3192:1894)의 ProgressCircle 48 을 그대로 쓴다 —
 * 딤 위에서는 Indicator 를 `static/white` 로 지정하라는 색 규칙을 따른다.
 */
const SPINNER = 48;
const GAP = 8;

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
          <ProgressCircle size={SPINNER} color={color.staticWhite} aria-hidden />
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
