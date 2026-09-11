'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { color, font } from '../../tokens.js';
import { withSupported } from '../../supported.js';
import { Menu, MenuItem } from '../menu/index.js';

import type { CSSProperties } from 'react';
import type { SelectProps, SelectSize } from './types.js';

/**
 * PDS docs/components/select.md + Figma `Component/Overlay → DropdownList` 실측.
 *
 * Figma 견본에는 LG 만 있고 MD·SM 수치는 md 산문의 Specification 표에 있다.
 * LG 는 디자인으로 검증했다(py14 + 14px·lh1.5 + 보더 = 52px).
 */
const SIZES: Record<SelectSize, { height: number; padY: number; radius: number; font: string; chevron: number }> = {
  lg: { height: 52, padY: 14, radius: 8, font: font.body2Size, chevron: 24 },
  md: { height: 38, padY: 8, radius: 8, font: font.body3Size, chevron: 18 },
  sm: { height: 26, padY: 3, radius: 6, font: font.body3Size, chevron: 14 },
};

const PAD_LEFT = 12;
const PAD_RIGHT = 8;
const MENU_OFFSET = 4; // 트리거 하단에서 띄우는 거리

function Chevron({ size, open }: { size: number; open: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
        transform: open ? 'rotate(180deg)' : undefined,
        transition: 'transform 120ms ease-out',
      }}
    >
      <svg width="12" height="6" viewBox="0 0 12 6" focusable="false">
        <path d="M1 1L6 5L11 1" stroke={color.labelNeutral} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    </span>
  );
}

/**
 * PDS Select.
 *
 * 옵션이 5개 이상일 때 쓴다 — 2~4개면 Segment Control 이 낫다.
 * 메뉴는 Context & Menu Item 을 그대로 쓰고, 트리거와 같은 너비로 연다.
 */
function SelectBase({
  options,
  value,
  onChange,
  placeholder = 'TitleText',
  size = 'lg',
  disabled = false,
  width = '100%',
  id,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const listId = `${id ?? autoId}-list`;

  const s = SIZES[size] ?? SIZES.lg;
  const selected = options.find((o) => o.value === value);

  // 바깥을 누르면 닫는다
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const trigger: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    width: '100%',
    height: s.height,
    padding: `${s.padY}px ${PAD_RIGHT}px ${s.padY}px ${PAD_LEFT}px`,
    borderRadius: s.radius,
    // 열린 동안은 accent 로 — Figma Variant2
    border: `1px solid ${open ? color.accentNormal : color.lineNeutral}`,
    background: color.backgroundBase,
    fontFamily: font.family,
    fontSize: s.font,
    fontWeight: 400,
    lineHeight: 1.5,
    // 값이 없으면 assistive, 있으면 본문 색
    color: selected ? color.labelNormal : color.labelAssistive,
    cursor: 'pointer',
    textAlign: 'left',
    // disabled 는 텍스트·아이콘만 흐리게 한다(테두리는 유지)
    ...(disabled ? { cursor: 'not-allowed', opacity: 0.4 } : null),
  };

  return (
    <div ref={rootRef} className={className} style={{ position: 'relative', width }}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        style={trigger}
      >
        <span style={{ flex: '1 0 0', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : placeholder}
        </span>
        <Chevron size={s.chevron} open={open} />
      </button>

      {open && (
        <div id={listId} style={{ position: 'absolute', top: `calc(100% + ${MENU_OFFSET}px)`, left: 0, width: '100%', zIndex: 1000 }}>
          <Menu>
            {options.map((o) => (
              <MenuItem
                key={o.value}
                label={o.label}
                selected={o.value === value}
                disabled={o.disabled}
                onClick={() => {
                  onChange?.(o.value);
                  setOpen(false);
                }}
              />
            ))}
          </Menu>
        </div>
      )}
    </div>
  );
}

export const Select = withSupported(SelectBase, {
  size: Object.keys(SIZES),
  acceptsChildren: false,
});
