'use client';

import { Children, Fragment, isValidElement, useEffect, useId } from 'react';

import { color, font, radius, shadow } from '../../tokens.js';
import { withSupported } from '../../supported.js';
import { Checkbox } from '../checkbox/index.js';

import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import type { PopupProps } from './types.js';

/**
 * PDS docs/components/popup.md + Figma `Component/Feedback → Popup` 실측.
 * 여기 숫자는 전부 디자인에 있는 값이다 — 추정치를 섞지 않는다.
 *
 * 값의 출처: 치수·색은 디자인이 정본이다. 그림자는 md 의 elevation 표가
 * Overlay 티어(shadow-lg)로 적었지만 실제 디자인은 X/popover shadow 다.
 */
/*
 * Figma `Component/Feedback → Popup` 의 **Property=web** 변형 실측
 * (node 2674:812 OneButton / 2674:824 TwoButton).
 *
 * 모바일 변형(Property=mobile)과 폭·패딩·그림자는 같고 **푸터와 제목이 다르다** —
 * 모바일은 버튼이 전체폭을 균등 분할하며 높이 48/45, 웹은 내용폭 버튼을 우측에
 * 정렬하며 높이 32. 제목도 18px → 16px 이다. 모바일 변형은 추후 반영.
 */
const WIDTH = 343;
const PAD_TOP = 12;
const PAD_X = 16;
const PAD_BOTTOM = 16;
const HEADER_GAP = 24;
const TITLE_ROW_H = 36;
/** 제목↔본문 */
const HEAD_GAP = 4;
/** 버튼 — 웹은 ONE·TWO 동일(모바일은 48/45로 갈렸다). Button size=32 와 같은 값 */
const BTN_H = 32;
const BTN_RADIUS = 8;
const BTN_PAD_X = 10;
const BTN_FONT = 14;
const BTN_WEIGHT = 500;
const BTN_GAP = 8;
/** '다시 보지 않기' 묶음 ↔ 버튼 묶음 */
const FOOTER_GAP = 12;

/** 딤 — layer/overlay(검정 50%) 토큰 (2026-08-26 디자이너 확정) */
const DIM_COLOR = color.layerOverlay;
/** 팝업 그림자 — Elevation lg (동상) */
const POPOVER_SHADOW = shadow.lg;

const panel: CSSProperties = {
  boxSizing: 'border-box',
  width: WIDTH,
  maxWidth: 'calc(100vw - 32px)',
  display: 'flex',
  flexDirection: 'column',
  gap: HEADER_GAP,
  padding: `${PAD_TOP}px ${PAD_X}px ${PAD_BOTTOM}px`,
  background: color.backgroundBase,
  borderRadius: radius.lg,
  boxShadow: POPOVER_SHADOW,
  overflow: 'hidden',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: font.family,
  // 웹 변형은 Bold_700/Body1 (16px) — 모바일의 18px 과 다르다
  fontSize: font.body1Size,
  fontWeight: 700,
  lineHeight: 1.5,
  color: color.labelNormal,
  wordBreak: 'break-word',
};

const bodyStyle: CSSProperties = {
  margin: 0,
  fontFamily: font.family,
  fontSize: font.body2Size,
  fontWeight: 400,
  lineHeight: 1.5,
  color: color.labelNeutral,
  wordBreak: 'break-word',
};

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="닫기"
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
        color: color.labelNormal,
        flexShrink: 0,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/**
 * 푸터의 실제 액션 개수.
 *
 * `<>{a}{b}</>` 는 `Children.count` 로 세면 1 이다(프래그먼트가 자식 하나) —
 * 그대로 쓰면 2버튼 팝업이 1버튼으로 판정돼 높이(45 vs 48)와 X 버튼 노출이
 * 둘 다 틀어진다. 최상위 프래그먼트는 벗겨 내고 센다.
 */
function countActions(footer: ReactNode): number {
  const top = Children.toArray(footer);
  if (top.length === 1 && isValidElement(top[0]) && top[0].type === Fragment) {
    return Children.count((top[0].props as { children?: ReactNode }).children);
  }
  return top.length;
}

function PopupBase({
  open = true,
  title,
  children,
  footer,
  closable,
  onClose,
  dontShowAgain,
  onDontShowAgainChange,
  id,
  className,
}: PopupProps) {
  const autoId = useId();
  const titleId = id ?? `${autoId}-title`;

  // 버튼 개수가 높이를 정한다 — 하나면 48, 둘이면 45 (디자인 스펙)
  const actionCount = countActions(footer);
  const two = actionCount > 1;
  // X 는 **옵트인**이다 — md 스펙: "X 버튼은 버튼 레이블이 '닫기'가 아닌 경우에만
  // 추가(정보성 모달엔 X 없음)". 컴포넌트는 버튼 레이블의 의미를 알 수 없으므로
  // 호출자가 closable 로 밝힌다. 버튼이 둘이면 취소 수단이 이미 있어 겹쳐 두지 않는다.
  const showClose = Boolean(onClose) && !two && closable === true;

  // Esc 로 닫기 — 위험 액션에 취소 수단을 강제하는 규칙의 최소 보장
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onDimClick = (e: MouseEvent<HTMLDivElement>) => {
    if (onClose && e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={className}
      onClick={onDimClick}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: DIM_COLOR,
        zIndex: 1000,
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} style={panel}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: HEAD_GAP,
            // Figma: 버튼 하나면 pl 4, 둘이면 pl 8 / pr 4
            paddingLeft: two ? 8 : 4,
            paddingRight: two ? 4 : 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: showClose ? 'space-between' : 'flex-start',
              height: TITLE_ROW_H,
            }}
          >
            <h2 id={titleId} style={titleStyle}>{title}</h2>
            {showClose && onClose && <CloseButton onClick={onClose} />}
          </div>
          {children && <p style={bodyStyle}>{children}</p>}
        </div>

        {/*
          * 웹 변형의 푸터는 **한 행**이다 — 좌측에 '다시 보지 않기', 우측에 버튼.
          * (모바일은 버튼 줄 아래에 체크박스가 따로 놓인다)
          */}
        {(footer || dontShowAgain !== undefined) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: FOOTER_GAP, width: '100%' }}>
            {dontShowAgain !== undefined && (
              <Checkbox
                checked={dontShowAgain}
                onChange={(v) => onDontShowAgainChange?.(v)}
                label="다시 보지 않기"
              />
            )}
            {footer && (
              <div
                style={{
                  display: 'flex',
                  flex: '1 0 0',
                  minWidth: 0,
                  gap: BTN_GAP,
                  alignItems: 'center',
                  // 위계가 높은 CTA 가 오른쪽 — 배치는 호출자가 순서로 정한다
                  justifyContent: 'flex-end',
                }}
                /*
                 * 팝업 버튼의 크기 축은 **팝업이 정한다** — 호출자가 size 를 안 주면
                 * Button 기본값(48)이 걸려 radius 12·폰트 16 이 되고, 높이만 32 로
                 * 눌려 Figma 와 어긋난다. 높이·모서리·폰트를 함께 강제해야 한 벌이 된다.
                 * (Button size=32 와 같은 값 — 상수는 아래 BTN_* 에 명시)
                 */
                ref={(el) => {
                  if (!el) return;
                  for (const child of Array.from(el.children)) {
                    const b = child as HTMLElement;
                    b.style.height = `${BTN_H}px`;
                    b.style.borderRadius = `${BTN_RADIUS}px`;
                    b.style.fontSize = `${BTN_FONT}px`;
                    b.style.fontWeight = String(BTN_WEIGHT);
                    b.style.padding = `0 ${BTN_PAD_X}px`;
                    b.style.flex = '0 0 auto';
                    b.style.minWidth = '0';
                  }
                }}
              >
                {footer}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const Popup = withSupported(PopupBase, {});
