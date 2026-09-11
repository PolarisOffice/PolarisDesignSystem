'use client';

import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';

import { Toast } from './index.js';

import type { ReactNode } from 'react';
import type { ToastPlacement, ToastType } from './types.js';

/**
 * 명령형 toast API.
 *
 * 토스트는 화면에 계속 있는 것이 아니라 **지금 이 순간 일어나는 사건**이라,
 * 쓰는 자리(비동기 콜백·이벤트 핸들러)에서 바로 부를 수 있어야 한다. 상태를
 * 끌어올리고 렌더 트리에 조건부로 거는 방식은 호출 지점과 표시 지점이 멀어진다.
 *
 *     try { await save(); toast.success('저장했습니다'); }
 *     catch { toast.error('저장하지 못했습니다'); }
 *
 * "한 번에 하나만 표시" 라는 PDS 규칙도 여기서 지킨다 — 큐를 패키지가 들고
 * 있으므로 두 곳에서 동시에 불러도 겹치지 않는다.
 *
 * 마운트는 자동이다. `<Toaster/>` 를 앱에 심지 않아도 첫 호출 때 컨테이너를
 * 만든다 — 심어 두면 그쪽을 쓴다(SSR·테스트에서 위치를 통제하고 싶을 때).
 */
export interface ToastOptions {
  /** @default 'bottom' */
  position?: ToastPlacement;
  /** 자동 닫힘까지의 ms. @default 3000 */
  duration?: number;
}

interface Item extends ToastOptions {
  id: number;
  type: ToastType;
  message: ReactNode;
}

let seq = 0;
let current: Item | null = null;
const listeners = new Set<(item: Item | null) => void>();

function publish() {
  for (const fn of listeners) fn(current);
}

/** 큐가 없다 — 한 번에 하나만 보이고, 새 토스트가 이전 것을 대체한다 */
function show(type: ToastType, message: ReactNode, opts: ToastOptions = {}) {
  ensureMounted();
  current = { id: ++seq, type, message, ...opts };
  publish();
  return current.id;
}

/** 표시 중인 토스트를 즉시 닫는다 */
function dismiss() {
  current = null;
  publish();
}

export const toast = {
  default: (message: ReactNode, opts?: ToastOptions) => show('default', message, opts),
  success: (message: ReactNode, opts?: ToastOptions) => show('success', message, opts),
  error: (message: ReactNode, opts?: ToastOptions) => show('error', message, opts),
  dismiss,
};

/**
 * 토스트가 실제로 그려지는 자리. 앱에 직접 심어도 되고, 안 심으면 첫 호출 때
 * 자동으로 만들어진다.
 */
export function Toaster() {
  const [item, setItem] = useState<Item | null>(current);

  useEffect(() => {
    listeners.add(setItem);
    return () => { listeners.delete(setItem); };
  }, []);

  if (!item) return null;
  return (
    <Toast
      key={item.id}
      type={item.type}
      message={item.message}
      placement={item.position ?? 'bottom'}
      duration={item.duration ?? 3000}
      onClose={dismiss}
    />
  );
}

/* ── 자동 마운트 — 브라우저에서만, 한 번만 ── */
let mounted = false;
function ensureMounted() {
  if (mounted || typeof document === 'undefined') return;
  // 앱이 <Toaster/> 를 이미 심었으면 그쪽이 구독하고 있다
  if (listeners.size > 0) { mounted = true; return; }
  const host = document.createElement('div');
  host.setAttribute('data-pds-toaster', '');
  document.body.appendChild(host);
  createRoot(host).render(<Toaster />);
  mounted = true;
}
