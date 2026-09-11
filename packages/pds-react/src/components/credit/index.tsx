'use client';

import { color, font } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { CreditProps } from './types.js';

/**
 * PDS Figma `Component/Contents → credit` 실측.
 *
 * AI 크레딧 잔량 표시. 보라(ai/normal)는 AI 기능 전용 색이라는 시스템 규칙이
 * 그대로 적용되는 자리다 — 다른 맥락에 이 컴포넌트를 쓰지 않는다.
 */
const ICON_BOX = 24;
const ICON = 18;

const wrap: CSSProperties = {
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '2px 8px 2px 2px',
  borderRadius: 999,
  fontFamily: font.family,
  fontSize: font.body1Size,
  lineHeight: 1.5,
  whiteSpace: 'nowrap',
};

/** 기본 글리프 — 디자인의 전용 아이콘을 대신하는 자리표시 */
function CoinGlyph({ tint }: { tint: string }) {
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <circle cx="9" cy="9" r="7.5" stroke={tint} strokeWidth="1.6" fill="none" />
      <path d="M9 5.2L10.1 7.6L12.6 8L10.8 9.8L11.2 12.3L9 11.1L6.8 12.3L7.2 9.8L5.4 8L7.9 7.6Z" fill={tint} />
    </svg>
  );
}

function CreditBase({ value, available = true, icon, className }: CreditProps) {
  const tint = available ? color.aiNormal : color.labelAssistive;
  return (
    <span
      className={className}
      style={{
        ...wrap,
        background: available ? color.aiHover : color.fillNeutral,
        color: tint,
        fontWeight: available ? 700 : 500,
      }}
    >
      <span
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: ICON_BOX, height: ICON_BOX, flexShrink: 0 }}
      >
        {icon ?? <CoinGlyph tint={tint} />}
      </span>
      {value}
    </span>
  );
}

export const Credit = withSupported(CreditBase, { acceptsChildren: false });
