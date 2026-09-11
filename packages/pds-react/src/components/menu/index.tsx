'use client';

import { useState } from 'react';

import { color, font, shadow, motion } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { MenuItemProps, MenuProps } from './types.js';

/**
 * PDS docs/components/context-menu.md + Figma `Component/Overlay → MenuItem`·
 * `ContextMenu` 실측.
 *
 * 값의 출처: 치수·색은 디자인이 정본이고, md 산문은 사용 규칙을 준다.
 */
const ITEM_H = 28;
const ITEM_PAD = 6;
const ITEM_GAP = 8;
const ITEM_RADIUS = 6;
const ICON = 18;

const MENU_PAD = 4;
const MENU_GAP = 4;
const MENU_RADIUS = 8;
/**
 * 초과 시 스크롤. md 산문은 220 이지만 그건 **콘텐츠** 높이(7×28 + 6×4)고,
 * Figma 프레임(2674:535 등 4변형 전부)은 패딩 2×4 를 포함한 228 이다.
 * border-box 에 220 을 걸면 7번째 아이템이 8px 잘려 스크롤바가 생긴다.
 */
const MENU_MAX_H = 228;

const itemBase: CSSProperties = {
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: ITEM_GAP,
  width: '100%',
  height: ITEM_H,
  padding: ITEM_PAD,
  borderRadius: ITEM_RADIUS,
  border: 'none',
  fontFamily: font.family,
  fontSize: font.body3Size,
  lineHeight: 1.5,
  textAlign: 'left',
  cursor: 'pointer',
};

/** 좌측 체크 — 선택 표시. 자리는 항상 차지해 목록 정렬이 흔들리지 않게 한다 */
function CheckSlot({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: ICON, height: ICON, flexShrink: 0 }}
    >
      {on && (
        <svg width="9" height="6" viewBox="0 0 9 6" focusable="false">
          <path
            d="M1 3L3.4 5.2L8 1"
            stroke={color.labelNormal}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}
    </span>
  );
}

/** 우측 화살표 — 하위 메뉴 */
function SubmenuArrow() {
  return (
    <span
      aria-hidden="true"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: ICON, height: ICON, flexShrink: 0 }}
    >
      <svg width="6" height="12" viewBox="0 0 6 12" focusable="false">
        <path d="M1 1L5 6L1 11" stroke={color.labelNeutral} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    </span>
  );
}

/**
 * PDS Menu Item.
 *
 * 폭은 부모를 채운다 — 고정 px 를 주지 않는 것이 규칙이다. 아이템 안에 복잡한
 * UI 를 넣지 않고, 한 메뉴에 10개 이상이면 그룹을 나눈다.
 */
function MenuItemBase({
  label,
  children,
  selected = false,
  disabled = false,
  hideCheck = false,
  hasSubmenu = false,
  onClick,
}: MenuItemProps) {
  const [hover, setHover] = useState(false);

  const bg = selected
    ? color.interactionPressed
    : hover && !disabled
      ? color.interactionHover
      : color.backgroundBase;

  return (
    <button
      type="button"
      role="menuitem"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...itemBase,
        background: bg,
        // hover 배경이 즉시 튀지 않게
        transition: `background-color ${motion.durationInstant} ${motion.easeOut}`,
        fontWeight: selected ? 500 : 400,
        color: selected ? color.labelNormal : color.labelNeutral,
        ...(disabled ? { opacity: 0.4, cursor: 'not-allowed' } : null),
      }}
    >
      {!hideCheck && <CheckSlot on={selected} />}
      <span style={{ flex: '1 0 0', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label ?? children}
      </span>
      {hasSubmenu && <SubmenuArrow />}
    </button>
  );
}

/**
 * PDS Context Menu.
 *
 * MenuItem 을 담는 컨테이너. 220px 을 넘으면 스크롤한다.
 */
function MenuBase({ children, width = '100%', maxHeight = MENU_MAX_H, className }: MenuProps) {
  return (
    <div
      className={className}
      role="menu"
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: MENU_GAP,
        width,
        maxHeight,
        overflowY: 'auto',
        padding: MENU_PAD,
        borderRadius: MENU_RADIUS,
        background: color.backgroundBase,
        // 보더 금지(2026-08-25 피드백 — 스트로크 두른 메뉴가 싫다는 강한 요청으로 회귀).
        // 배경(layerSurface, 페이지보다 한 단 밝음)과 그림자만으로 분리 — Toast(최상위 티어)
        // 와 같은 급의 그림자를 쓴다.
        boxShadow: shadow.xl,
      }}
    >
      {children}
    </div>
  );
}

export const MenuItem = withSupported(MenuItemBase, { acceptsChildren: false });
export const Menu = MenuBase;

/** 항목 그룹을 가르는 선 — 한 메뉴에 10개가 넘으면 그룹을 나눈다 */
export function MenuDivider() {
  return (
    <div
      role="separator"
      style={{ height: 1, margin: '4px 0', background: color.lineNeutral, flexShrink: 0 }}
    />
  );
}
