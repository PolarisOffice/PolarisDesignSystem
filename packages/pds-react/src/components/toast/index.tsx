'use client';

import { useEffect } from 'react';

import { color, font, radius, shadow } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { ToastProps } from './types.js';

/**
 * PDS docs/components/toast.md + Figma `Component/Feedback → toast` 실측.
 *
 * 값의 출처: **치수·색은 Figma 가 정본**이고, md 산문은 사용 규칙(언제 쓰는지,
 * 무엇을 넣지 않는지)을 준다. 둘이 어긋나면 디자인을 따른다 — 산문은 갱신이
 * 늦고, 구현이 참고할 정밀도도 갖지 못한다.
 *
 * 실제로 어긋난 곳: 배경(산문 rgba(44,44,44,0.78)·blur 16px → 디자인
 * layer/overlay·blur 6px), 너비(산문 280–480px → 디자인 hug).
 */
const HEIGHT = 48;
const PAD_X = 12;
const GAP = 10;
const INNER_GAP = 8;
const EDGE_OFFSET = 50; // 화면 상·하 여백
// Figma 는 내용만큼(hug) 잡는다 — md 산문의 '280–480px' 은 디자인과 어긋난다.
// 상한만 넘침 방지로 남긴다.
const MAX_W = 480;
const DEFAULT_DURATION = 3000;

const bar: CSSProperties = {
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: GAP,
  height: HEIGHT,
  width: 'max-content',
  maxWidth: MAX_W,
  padding: `0 ${PAD_X}px`,
  borderRadius: radius.md,
  background: color.layerOverlay,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  boxShadow: shadow.xl,
};

const messageStyle: CSSProperties = {
  fontFamily: font.family,
  fontSize: font.body2Size,
  fontWeight: 500,
  letterSpacing: '-0.28px',
  color: color.staticWhite,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

/**
 * 20px 자리 안의 16px 글리프 — Figma Component 19.
 * default 는 상태 아이콘이 없다(일반 안내라 색으로 뜻을 주지 않는다).
 */
function StatusIcon({ type }: { type: 'success' | 'error' }) {
  const tint = type === 'success' ? color.toastSuccess : color.stateError;
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        flexShrink: 0,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
        <circle cx="8" cy="8" r="8" fill={tint} />
        {type === 'success' ? (
          <path
            d="M4.5 8.2L6.9 10.6L11.5 6"
            stroke={color.staticWhite}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <>
            <path d="M8 4.2V8.9" stroke={color.staticWhite} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="8" cy="11.4" r="0.95" fill={color.staticWhite} />
          </>
        )}
      </svg>
    </span>
  );
}

/**
 * PDS Toast.
 *
 * 응답이 필요 없는 알림 전용이고 3초 뒤 스스로 사라진다. 안에 버튼이나 링크를
 * 넣지 않는다 — 사용자가 눌러야 할 것이 있으면 그건 Popup 이 할 일이다.
 * 한 번에 하나만 띄운다.
 */
function ToastBase({
  message,
  type = 'default',
  placement = 'bottom',
  duration = DEFAULT_DURATION,
  onClose,
  hideCloseButton = false,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!onClose || duration <= 0) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        ...(placement === 'top' ? { top: EDGE_OFFSET } : { bottom: EDGE_OFFSET }),
        zIndex: 1100, // Popup(1000) 위 — Top 티어
        pointerEvents: 'none',
      }}
    >
      <div
        // 알림이므로 흐름을 끊지 않고 읽히게 한다. 실패는 즉시 읽어야 하므로 assertive.
        role="status"
        aria-live={type === 'error' ? 'assertive' : 'polite'}
        style={{ ...bar, pointerEvents: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: INNER_GAP, minWidth: 0 }}>
          {type !== 'default' && <StatusIcon type={type} />}
          <span style={messageStyle}>{message}</span>
        </div>

        {!hideCloseButton && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="알림 닫기"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              padding: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: color.staticWhite,
              flexShrink: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/** 메시지는 props 로 받는다 — 견본이 children 을 흘려보내지 않게 선언한다 */
export const Toast = withSupported(ToastBase, {
  type: ['default', 'success', 'error'],
  placement: ['top', 'bottom'],
  acceptsChildren: false,
});
