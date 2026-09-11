'use client';

import { useEffect, useRef, useState } from 'react';

import { color, font, motion } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { TabSize, TabsProps, TabVariant } from './types.js';

/**
 * PDS Figma `Component/Action → Tab` 실측.
 * 페이지·카테고리를 이동할 때 쓴다(Figma 컴포넌트 설명 그대로).
 */
const PAD_X = 12;
const PAD_Y: Record<TabVariant, number> = { primary: 8, secondary: 20 };
const INDICATOR = 2;

/** 견본 프레임 높이. Specification 의 tablist 는 MD 44 / SM 40 이고 여기에 상하 여백이 붙는다 */
const HEIGHTS: Record<TabSize, number> = { medium: 60, small: 52 };

const itemBase: CSSProperties = {
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

function TabsBase({
  items,
  value,
  defaultValue,
  onChange,
  variant = 'primary',
  layout = 'hug',
  size = 'medium',
  className,
}: TabsProps) {
  const [hover, setHover] = useState<string | null>(null);
  /*
   * 인디케이터를 **하나만** 두고 옮긴다. 탭마다 border-bottom 색을 바꾸면 이동이
   * 아니라 점멸이 되고, 문서가 약속한 "150ms 슬라이드" 가 성립하지 않는다.
   * 인디케이터 폭 = **셀(버튼) 전체** 폭 (2026-08-31 확정 규칙): 세 탭의 하이라이트 바를 합치면
   * 회색 divider 전체가 되어야 한다 — fill 은 균등 3분할, hug 는 레이블 길이대로 나눈 분할.
   * 그래서 hug 컨테이너는 fit-content 로 줄여 divider 도 셀 합과 같게 만든다.
   */
  const listRef = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState<{ left: number; width: number } | null>(null);
  // 제어(value)·비제어(defaultValue) 둘 다 받는다
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value);
  const current = value !== undefined ? value : inner;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const el = list.querySelector<HTMLElement>('[data-active="true"]');
      if (!el) return setInk(null);
      // offsetLeft/offsetWidth 는 CSS zoom·transform 에 영향받지 않는 레이아웃 좌표 — 인디케이터의
      // left/width 와 같은 좌표계다(getBoundingClientRect 는 zoom 된 조상 안에서 배율이 섞인다).
      setInk({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    // 폰트 로드·컨테이너 크기 변화로 위치가 밀린다
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    for (const c of Array.from(list.children)) ro.observe(c);
    return () => ro.disconnect();
  }, [items, size, layout, className, current]);

  // fill = 균등 분할, hug = 레이블 길이만큼
  const fill = layout === 'fill';
  // Primary 는 accent 로, Secondary 는 어둡게 밑줄을 긋는다
  const activeInk = variant === 'primary' ? color.accentNormal : color.labelNormal;

  return (
    <div
      ref={listRef}
      className={className}
      role="tablist"
      // hug 는 fit-content — divider(border-bottom)가 셀들의 합만큼만 그어져 "하이라이트 3개 합 = 회색바" 가 성립
      style={{ display: 'flex', width: fill ? '100%' : 'fit-content', position: 'relative', borderBottom: `1px solid ${color.lineNeutral}` }}
    >
      {items.map((it) => {
        const active = it.value === current;
        const hot = hover === it.value && !active && !it.disabled;
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
              ...itemBase,
              height: HEIGHTS[size],
              padding: `${PAD_Y[variant]}px ${PAD_X}px`,
              fontSize: size === 'medium' ? font.body1Size : font.body2Size,
              ...(fill ? { flex: '1 0 0', minWidth: 0 } : null),
              // 밑줄은 아래 단일 인디케이터가 그린다 — 여기서는 자리만 비운다
              borderBottom: `${INDICATOR}px solid transparent`,
              marginBottom: -1, // 컨테이너의 1px divider 위에 얹는다
              fontWeight: active && variant === 'primary' ? 700 : 500,
              color: active ? activeInk : hot ? color.labelNeutral : color.labelAlternative,
              // 인디케이터는 border-bottom 색 전환이라 `color` 만으로는 안 걸린다 —
              // 밑줄이 즉시 튀고 문서의 "150ms 슬라이드" 설명과 어긋난다
              transition: `color ${motion.durationFast} ${motion.easeOut}, border-color ${motion.durationFast} ${motion.easeOut}`,
              ...(it.disabled ? { opacity: 0.4, cursor: 'not-allowed' } : null),
            }}
          >
            {it.label}
          </button>
        );
      })}
      {ink && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: -1, // 컨테이너 divider 위
            left: ink.left,
            width: ink.width,
            height: INDICATOR,
            background: activeInk,
            transition: `left ${motion.durationFast} ${motion.easeOut}, width ${motion.durationFast} ${motion.easeOut}`,
          }}
        />
      )}
    </div>
  );
}

/** 종류 — Primary / Secondary */
export const Tabs = withSupported(TabsBase, {
  variant: ['primary', 'secondary'],
  layout: ['fill', 'hug'],
  size: ['medium', 'small'],
  acceptsChildren: false,
});
