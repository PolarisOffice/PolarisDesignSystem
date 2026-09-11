'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { color, font } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { TooltipPlacement, TooltipProps } from './types.js';

/**
 * PDS docs/components/tooltip.md + Figma `Component/Feedback → Tooltip` 실측.
 * 노출 정책 표(Default·Cascade)의 값을 그대로 상수로 둔다.
 *
 * 값의 출처: 치수·색은 디자인이 정본이다. md 산문과 어긋난 곳 —
 * 배경(산문 rgba(44,44,44,0.78) → 디자인 layer/overlay), padding(6px 10px → 4px 8px).
 * radius 는 2026-08-28 Figma Radius 표에서 radius-xs(6) 로 확정 — 토큰 참조.
 *
 * 미구현: 산문의 "가장자리는 자동 반전". 뷰포트 충돌을 감지해 방향을 뒤집는
 * 동작은 아직 없다 — placement 로 지정한 방향에 그대로 붙는다.
 */
const SHOW_DELAY = 600; // 의도적 멈춤과 우연한 통과를 가르는 임계점
const CASCADE_DELAY = 100; // 이미 하나를 본 사용자는 탐색 중으로 본다
const CASCADE_RESET = 1500; // 이만큼 호버가 없으면 다시 처음처럼
const FADE_IN = 150; // = --duration-fast (JS 타이머와 공유 — var() 불가)
const FADE_OUT = 100; // = --duration-instant (동상)
/** 등장 슬라이드 억제 — SSR 에선 항상 false 로 시작해도 무해(첫 상호작용은 클라이언트) */
const REDUCE_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const OFFSET = 8;
const MAX_WIDTH = 200;

const ARROW_DEPTH = 6; // 화살표가 말풍선 밖으로 나오는 깊이
const ARROW_BASE_V = 12; // 위·아래 화살표 밑변
const ARROW_BASE_H = 10; // 좌·우 화살표 밑변
/** clip path() 는 px 숫자가 필요 — bubble 의 radius.xs(6px) 와 같은 값. 토큰이 바뀌면 함께 수정 */
const TIP_RADIUS = 6;

/**
 * 케스케이드 상태는 **문서 전체가 공유**한다 — 툴팁 하나를 본 뒤 옆 아이콘으로
 * 넘어가면 즉시 떠야 하므로, 인스턴스별로 두면 정책이 성립하지 않는다.
 */
let lastHiddenAt = 0;

const bubble: CSSProperties = {
  position: 'relative', // 도형 svg(absolute inset 0)의 기준
  boxSizing: 'border-box',
  // flex 부모 안에서는 폭이 콘텐츠에 맞지 않아 글자가 세로로 쌓인다 —
  // max-content 로 내용만큼 잡고, 200px 을 넘을 때만 줄바꿈한다.
  width: 'max-content',
  maxWidth: MAX_WIDTH,
  padding: '4px 8px',
  // 배경·둥근 모서리는 svg path 가 그린다(아래 tooltipPath). blur 는 2026-08-31 제거 —
  // WebKit 에서 backdrop-filter 는 clip-path·마스크와 한 요소에 두면 합성 단계에서 간헐적으로
  // 풀리고(화살표가 나왔다 사라지는 증상), 별도 조각으로 붙이면 알파 경계가 이음새로 보인다.
  // 반투명 단일 도형이 모든 엔진에서 안전한 유일한 형태.
  fontFamily: font.family,
  fontSize: font.caption1Size,
  fontWeight: 500,
  lineHeight: 1.3,
  // 배경 layer-overlay 가 양 테마에서 같은 반투명 검정이라 글자도 고정 흰색이다
  color: color.staticWhite,
  textAlign: 'center',
  wordBreak: 'break-word',
};

/**
 * 말풍선+화살표를 **한 도형**으로 그리는 clip-path.
 *
 * 화살표를 별도 조각(svg 형제·절대 위치 svg)으로 붙이면 반투명 배경(layer/overlay 0.78 알파)과
 * backdrop-filter 의 경계가 이음새로 드러난다 — 2026-08-28~31 디자이너 리포트·실측: right 에서
 * 틈, top 에서 화살표 밑변에 밝은 선. 두 조각을 붙이는 한(겹치든 맞대든) 알파 합성·블러 경계
 * 때문에 어느 브라우저에선 반드시 보인다. 요소 **하나**에 배경·블러를 깔고 "둥근 사각형 + 삼각형"
 * 합집합을 **inline svg path 하나**로 직접 그리면 이음새가 존재할 수 없다. clip-path 로 자르는
 * 방식은 WebKit 에서 backdrop-filter 와 충돌해(간헐 소실) svg 렌더로 확정(2026-08-31).
 * 요소는 화살표 깊이만큼 그쪽 padding 이 커져 있고, svg 가 그 전체를 캔버스로 쓴다.
 */
function tooltipPath(w: number, h: number, placement: TooltipPlacement): string {
  const d = ARROW_DEPTH;
  const r = TIP_RADIUS;
  if (placement === 'none') {
    // 화살표 없는 변형(none·arrow=false) — 둥근 사각형만
    return `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
  }
  if (placement === 'top') {
    const b = h - d; // 말풍선 아랫변 — 화살표는 아래(트리거 쪽)로
    const cx = w / 2;
    const half = ARROW_BASE_V / 2;
    return `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${b - r} A ${r} ${r} 0 0 1 ${w - r} ${b} H ${cx + half} L ${cx} ${h} L ${cx - half} ${b} H ${r} A ${r} ${r} 0 0 1 0 ${b - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
  }
  if (placement === 'bottom') {
    const cx = w / 2;
    const half = ARROW_BASE_V / 2;
    return `M ${r} ${d} H ${cx - half} L ${cx} 0 L ${cx + half} ${d} H ${w - r} A ${r} ${r} 0 0 1 ${w} ${d + r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${d + r} A ${r} ${r} 0 0 1 ${r} ${d} Z`;
  }
  if (placement === 'left') {
    const b = w - d; // 말풍선 오른변 — 화살표는 오른쪽(트리거 쪽)으로
    const cy = h / 2;
    const half = ARROW_BASE_H / 2;
    return `M ${r} 0 H ${b - r} A ${r} ${r} 0 0 1 ${b} ${r} V ${cy - half} L ${w} ${cy} L ${b} ${cy + half} V ${h - r} A ${r} ${r} 0 0 1 ${b - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
  }
  // right — 화살표는 왼쪽(트리거 쪽)으로
  const cy = h / 2;
  const half = ARROW_BASE_H / 2;
  return `M ${d + r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${d + r} A ${r} ${r} 0 0 1 ${d} ${h - r} V ${cy + half} L 0 ${cy} L ${d} ${cy - half} V ${r} A ${r} ${r} 0 0 1 ${d + r} 0 Z`;
}

/**
 * PDS Tooltip.
 *
 * 레이블 없는 아이콘의 보조 설명용이다. 안에 링크·버튼을 넣지 않고, 에러 전달에
 * 쓰지 않는다(에러는 Toast 나 Error Message 가 한다). 모바일 전용 UI 에는 쓰지
 * 않는다 — 호버가 없는 곳에서는 존재하지 않는 것과 같다.
 */
function TooltipBase({
  content,
  children,
  placement = 'top',
  open,
  arrow = true,
  showDelay = SHOW_DELAY,
  hideDelay = 0,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  /** 마운트 프레임에 최종 상태로 그리면 transition 이 스킵된다 — 페인트 한 프레임 뒤 true */
  const [entered, setEntered] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tipId = useId();

  const controlled = open !== undefined;
  const shown = controlled ? open : visible;

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const show = useCallback(() => {
    if (controlled) return;
    clear();
    const cascading = Date.now() - lastHiddenAt < CASCADE_RESET;
    timer.current = setTimeout(() => setVisible(true), cascading ? CASCADE_DELAY : showDelay);
  }, [controlled, showDelay]);

  const hide = useCallback(() => {
    if (controlled) return;
    clear();
    const done = () => {
      setVisible(false);
      lastHiddenAt = Date.now();
    };
    // 기본 0ms — 벗어나면 즉시 사라진다
    if (hideDelay > 0) timer.current = setTimeout(done, hideDelay);
    else done();
  }, [controlled, hideDelay]);

  useEffect(() => () => clear(), []);

  // 페이드아웃이 끝난 뒤에 떼어낸다. 페이드인은 마운트 → 페인트 → entered 2단계로
  // 시작해야 transition 이 실제로 재생된다 (더블 rAF — 첫 rAF 는 페인트 직전일 수 있음)
  useEffect(() => {
    if (shown) {
      setMounted(true);
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setEntered(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    setEntered(false);
    const t = setTimeout(() => setMounted(false), FADE_OUT);
    return () => clearTimeout(t);
  }, [shown]);

  const vertical = placement === 'top' || placement === 'bottom';
  // placement 'none' 은 화살표 없이 붙는 변형이라 arrow 와 무관하게 안 그린다
  const showArrow = arrow && placement !== 'none';
  // 화살표 깊이는 도형(padding) 안에 있다 — 트리거↔화살표 끝 간격이 곧 OFFSET
  const gap = OFFSET;

  /*
   * 렌더 후 실측 크기로 path 를 만들어 clip-path 로 자른다. 크기는 콘텐츠·폰트 로드로
   * 변하므로 ResizeObserver 로 추적. path 를 아직 못 만든 프레임은 opacity 0(entered 전)
   * 이라 화살표 없는 순간이 사용자에게 보이지 않는다.
   */
  const shapeRef = useRef<HTMLSpanElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    if (!mounted) {
      setDims(null);
      return;
    }
    const el = shapeRef.current;
    if (!el) return;
    const update = () => setDims({ w: el.offsetWidth, h: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mounted]);

  const shapeStyle: CSSProperties = {
    ...bubble,
    // 화살표 영역만큼 그쪽 padding 을 넓혀 두고 path 로 잘라낸다 — 글자는 말풍선 부분에만 앉는다
    ...(showArrow && placement === 'top' && { paddingBottom: 4 + ARROW_DEPTH }),
    ...(showArrow && placement === 'bottom' && { paddingTop: 4 + ARROW_DEPTH }),
    ...(showArrow && placement === 'left' && { paddingRight: 8 + ARROW_DEPTH }),
    ...(showArrow && placement === 'right' && { paddingLeft: 8 + ARROW_DEPTH }),
    ...(showArrow && (placement === 'left' || placement === 'right') && { maxWidth: MAX_WIDTH + ARROW_DEPTH }),
  };

  // 등장 모션 — 트리거 쪽에서 3px 떠오른다 (reduced-motion 이면 페이드만)
  const slide = entered || REDUCE_MOTION ? 0 : 3;
  const anchor: CSSProperties = {
    position: 'absolute',
    zIndex: 1200,
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row',
    alignItems: 'center',
    pointerEvents: 'none',
    opacity: entered ? 1 : 0,
    transition: shown
      ? `opacity ${FADE_IN}ms ease-out, transform ${FADE_IN}ms ease-out`
      : `opacity ${FADE_OUT}ms ease-in`,
    ...(placement === 'top' && { bottom: `calc(100% + ${gap}px)`, left: '50%', transform: `translateX(-50%) translateY(${slide}px)` }),
    ...(placement === 'bottom' && { top: `calc(100% + ${gap}px)`, left: '50%', transform: `translateX(-50%) translateY(${-slide}px)` }),
    ...(placement === 'left' && { right: `calc(100% + ${gap}px)`, top: '50%', transform: `translateY(-50%) translateX(${slide}px)` }),
    ...(placement === 'right' && { left: `calc(100% + ${gap}px)`, top: '50%', transform: `translateY(-50%) translateX(${-slide}px)` }),
    ...(placement === 'none' && { bottom: `calc(100% + ${OFFSET}px)`, left: '50%', transform: `translateX(-50%) translateY(${slide}px)` }),
  };

  return (
    <span
      className={className}
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      aria-describedby={mounted ? tipId : undefined}
    >
      {children}
      {mounted && (
        <span style={anchor}>
          <span id={tipId} role="tooltip" ref={shapeRef} style={shapeStyle}>
            {dims && (
              <svg
                aria-hidden="true"
                focusable="false"
                width={dims.w}
                height={dims.h}
                viewBox={`0 0 ${dims.w} ${dims.h}`}
                style={{ position: 'absolute', inset: 0 }}
              >
                <path d={tooltipPath(dims.w, dims.h, showArrow ? placement : 'none')} fill={color.layerOverlay} />
              </svg>
            )}
            {/* svg(positioned) 위에 얹히도록 텍스트도 positioned 로 */}
            <span style={{ position: 'relative' }}>{content}</span>
          </span>
        </span>
      )}
    </span>
  );
}

/** 화살표 방향 */
export const Tooltip = withSupported(TooltipBase, {
  placement: ['top', 'bottom', 'left', 'right', 'none'],
});
