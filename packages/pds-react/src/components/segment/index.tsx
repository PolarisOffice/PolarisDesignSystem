'use client';

import { useEffect, useRef, useState } from 'react';

import { color, font, motion, shadow } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties, ReactNode } from 'react';
import type { SegmentControlProps, SegmentSize } from './types.js';

/**
 * PDS Figma `Component/Action → SegmentControl` 실측.
 *
 * 같은 화면의 즉시 필터·뷰 전환 전용이고 항상 단일 선택이다. 페이지가
 * 이동하면 Tabs 를 쓴다.
 */
const PILL_PAD = '8px 16px';
const BOX_PAD = '12px 16px';
const HEIGHTS: Record<SegmentSize, number> = { md: 48, sm: 36 };
const RADIUS_ACTIVE = 12;
const RADIUS_IDLE = 20;
/** outlined 선택 면 — Elevation sm (2026-08-26 디자이너 확정) */
const OUTLINED_SHADOW = shadow.sm;

const base: CSSProperties = {
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'transparent',
  fontFamily: font.family,
  lineHeight: 1.5,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
};


/**
 * 선택되면 굵기가 700 이 되는데, 굵은 글자는 더 넓다 — 그대로 두면 고르던 칸이
 * 1px 씩 흔들린다(디자인은 선택해도 폭이 안 변한다).
 *
 * 같은 글자를 항상 굵게 한 벌 겹쳐 두고 그쪽이 칸 폭을 정하게 한다. 보이는 쪽은
 * 실제 굵기로 그리고, 폭을 정하는 쪽은 감춘다.
 */
function StableLabel({ bold, children }: { bold: boolean; children: ReactNode }) {
  return (
    <span style={{ display: 'grid', alignItems: 'center', justifyItems: 'center' }}>
      <span style={{ gridArea: '1 / 1', fontWeight: bold ? 700 : 500 }}>{children}</span>
      <span style={{ gridArea: '1 / 1', fontWeight: 700, visibility: 'hidden' }} aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

function SegmentControlBase({
  items,
  value,
  defaultValue,
  onChange,
  variant = 'pill',
  layout = 'hug',
  size = 'md',
  className,
}: SegmentControlProps) {
  const [hover, setHover] = useState<string | null>(null);
  /*
   * 선택 면(알약·박스)을 **하나만** 두고 옮긴다. 항목마다 background 를 켜고 끄면
   * 이동이 아니라 점멸이라 duration 토큰이 눈에 안 보인다.
   * 위치는 실측 — 항목 폭이 레이블 길이에 따라 다르고 layout=fill 이면 또 달라진다.
   */
  const listRef = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState<{ left: number; width: number; height: number } | null>(null);
  // 제어(value)·비제어(defaultValue) 둘 다 받는다
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value);
  const current = value !== undefined ? value : inner;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const el = list.querySelector<HTMLElement>('[data-active="true"]');
      if (!el) return setInk(null);
      setInk({ left: el.offsetLeft, width: el.offsetWidth, height: el.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    for (const c of Array.from(list.children)) ro.observe(c);
    return () => ro.disconnect();
  }, [items, size, layout, variant, className, current]);

  const boxed = variant !== 'pill';
  const fill = layout === 'fill';
  const fontSize = size === 'md' ? font.body1Size : font.body2Size;

  return (
    <div
      className={className}
      role="tablist"
      ref={listRef}
      style={{
        position: 'relative',
        display: fill ? 'flex' : 'inline-flex',
        gap: boxed ? 2 : 4,
        alignItems: 'center',
        ...(fill ? { width: '100%' } : null),
      }}
    >
      {/* 움직이는 선택 면 — 항목보다 뒤에 깔린다 */}
      {ink && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            zIndex: 0,
            left: ink.left,
            width: ink.width,
            height: ink.height,
            borderRadius: boxed ? RADIUS_ACTIVE : 999,
            background: boxed && variant === 'outlined' ? color.backgroundBase : color.accentNormal,
            ...(boxed && variant === 'outlined' ? { boxShadow: OUTLINED_SHADOW } : null),
            transition: `left ${motion.durationFast} ${motion.easeOut}, width ${motion.durationFast} ${motion.easeOut}`,
          }}
        />
      )}
      {items.map((it) => {
        const active = it.value === current;
        const hot = hover === it.value && !active && !it.disabled;

        // 캡슐형 — 선택 시 accent 로 채우고 개수 배지를 옆에 둔다
        const pill: CSSProperties = {
          ...base,
          gap: 4,
          padding: PILL_PAD,
          borderRadius: 999,
          fontSize,
          // 배경은 위 인디케이터가 그린다 — 여기서 켜면 이동 대신 점멸이 된다
          background: 'transparent',
          // 선택 시 글자는 accent 인디케이터(고정색) 위에 온다 — static-white
          color: active ? color.staticWhite : hot ? color.labelNormal : color.labelNeutral,
          fontWeight: active ? 700 : 500,
          transition: `color ${motion.durationFast} ${motion.easeOut}`,
        };

        // 상자형 — filled 는 accent 채움, outlined 는 흰 배경 + 그림자.
        // padding 은 상태와 무관하게 같다 — 선택할 때 칸이 흔들리지 않아야 한다
        const box: CSSProperties = {
          ...base,
          gap: 6,
          height: HEIGHTS[size],
          padding: BOX_PAD,
          fontSize,
          borderRadius: active ? RADIUS_ACTIVE : RADIUS_IDLE,
          background: 'transparent',
          transition: `color ${motion.durationFast} ${motion.easeOut}`,
          // 선택 면·그림자는 인디케이터 몫 — 여기서는 글자만 바꾼다
          ...(active
            ? variant === 'filled'
              ? { color: color.staticWhite, fontWeight: 700 } // filled 인디케이터 = accent(고정)
              : { color: color.labelNormal, fontWeight: 500 }
            : { color: hot ? color.labelNeutral : color.labelAssistive, fontWeight: 500 }),
        };

        return (
          <button
            key={it.value}
            type="button"
            role="tab"
            aria-selected={active}
            data-active={active}
            disabled={it.disabled}
            onClick={() => {
              if (value === undefined) setInner(it.value);
              onChange?.(it.value);
            }}
            onMouseEnter={() => setHover(it.value)}
            onMouseLeave={() => setHover(null)}
            style={{
              position: 'relative', // 인디케이터(zIndex 0) 위에 글자가 오도록
              zIndex: 1,
              ...(boxed ? box : pill),
              ...(fill ? { flex: '1 0 0', minWidth: 0 } : null),
              ...(it.disabled ? { opacity: 0.35, cursor: 'not-allowed' } : null),
            }}
          >
            {boxed && it.icon && (
              <span style={{ display: 'flex', alignItems: 'center', width: 24, height: 24, flexShrink: 0 }}>{it.icon}</span>
            )}
            <StableLabel bold={active}>{it.label}</StableLabel>
            {!boxed && it.count !== undefined && (
              <span
                style={{
                  fontSize: font.body3Size,
                  fontWeight: 400,
                  color: active ? color.staticWhite : color.labelAssistive,
                }}
              >
                {it.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export const SegmentControl = withSupported(SegmentControlBase, {
  variant: ['pill', 'filled', 'outlined'],
  layout: ['fill', 'hug'],
  size: ['md', 'sm'],
  acceptsChildren: false,
});
