'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import s from './AnatomyFigure.module.css';

export interface AnatomyFigurePart {
  /** legend 와 같은 번호 — "01", "02" … (어긋나면 도해가 거짓말을 한다) */
  n: string;
  /** 컨테이너 내부에서 파트를 찾는 CSS 셀렉터. 못 찾으면 그 콜아웃만 조용히 생략 */
  selector: string;
  /**
   * 점을 찍을 위치 — 기본 'top'(상단 중앙). 파트가 서로 겹치거나 붙어 있으면
   * (예: 토글 트랙 안의 노브) 서로 다른 앵커를 줘서 무엇을 가리키는지 분리한다.
   */
  anchor?: 'top' | 'center' | 'left' | 'right' | 'bottom';
}

interface Marker {
  n: string;
  /** 배지 중심 x (겹침 회피 후) */
  bx: number;
  /** 파트 상단 점 좌표 */
  dx: number;
  dy: number;
}

const BADGE_R = 12;
const BADGE_GAP = 30; // 배지 간 최소 간격
const TOP_SPACE = 48; // 콜아웃이 사는 위 여백

/**
 * 실물 컴포넌트 기반 Anatomy 도해 (2026-08-19 고도화).
 *
 * children 으로 **실제 패키지 컴포넌트**를 렌더하고, 각 파트를 셀렉터로 실측해
 * 번호 배지·리더선·점을 SVG 레이어로 그린다. 손으로 그린 그림이 아니라 실물의
 * 기하에서 파생되므로 컴포넌트가 바뀌면 도해가 자동으로 따라간다(드리프트 0).
 * 다크 모드도 실물이 알아서 — 색은 전부 토큰.
 *
 * 번호는 기존 Anatomy legend 의 items 와 같은 n 을 쓴다 — 도해 아래에
 * `<Anatomy items={…} />`(legend 전용)를 그대로 두면 번호·설명이 한 소스다.
 *
 * SSR 에선 콜아웃 없이 실물만 나온다(측정은 클라이언트) — hydration 불일치 없음.
 */
export default function AnatomyFigure({
  parts,
  scale = 1,
  children,
}: {
  parts: AnatomyFigurePart[];
  /**
   * 견본 확대 배율 — 작은 컴포넌트(토글 35px 등)는 원촌으로는 콜아웃이 비좁아
   * 무엇을 가리키는지 모호해진다. zoom 이라 레이아웃·실측이 같이 확대된다.
   */
  scale?: number;
  children: ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);

  const measure = useCallback(() => {
    const stage = stageRef.current;
    const box = boxRef.current;
    if (!stage || !box) return;
    // 좌표 기준 = SVG 가 사는 stage 프레임 그대로 — 마진·zoom 배율 산수가 끼어들 틈이 없다
    const base = stage.getBoundingClientRect();
    const found: Marker[] = [];
    for (const p of parts) {
      const el = box.querySelector(p.selector);
      if (!el) continue; // 셀렉터 드리프트 — 콜아웃만 생략, 실물은 계속 보인다
      const r = el.getBoundingClientRect();
      const cx = r.left - base.left + r.width / 2;
      const cy = r.top - base.top + r.height / 2;
      const a = p.anchor ?? 'top';
      const dx = a === 'left' ? r.left - base.left : a === 'right' ? r.right - base.left : cx;
      const dy = a === 'top' ? r.top - base.top : a === 'bottom' ? r.bottom - base.top : cy;
      found.push({ n: p.n, bx: dx, dx, dy });
    }
    // 배지 겹침 회피 — x 순 정렬 후 최소 간격 강제 (점은 파트 위치 그대로)
    found.sort((a, b) => a.dx - b.dx);
    for (let i = 1; i < found.length; i++) {
      const prev = found[i - 1];
      const cur = found[i];
      if (prev && cur && cur.bx - prev.bx < BADGE_GAP) cur.bx = prev.bx + BADGE_GAP;
    }
    setMarkers((old) =>
      old.length === found.length &&
      old.every((m, i) => {
        const f = found[i];
        return f && m.n === f.n && Math.abs(m.bx - f.bx) < 0.5 && Math.abs(m.dy - f.dy) < 0.5 && Math.abs(m.dx - f.dx) < 0.5;
      })
        ? old
        : found,
    );
  }, [parts]);

  useEffect(() => {
    measure();
    // 웹폰트 로드·테마 전환·리사이즈 후 좌표가 밀리는 것 자가치유
    document.fonts?.ready.then(measure).catch(() => {});
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    for (const child of Array.from(box.children)) ro.observe(child);
    // absolute 파트(툴팁 말풍선 등)는 늦게 마운트돼도 크기 변화가 없어 RO 가 못 본다 —
    // DOM 추가·제거는 MutationObserver 로 잡는다 (setMarkers 는 동등성 가드라 재렌더 비용 0)
    const mo = new MutationObserver(measure);
    mo.observe(box, { childList: true, subtree: true, attributes: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [measure]);

  return (
    <figure className={s.figure}>
      {/* 아래 여백을 위와 같게 줘 **견본이 회색 박스 정중앙**에 온다 — 위쪽 콜아웃 자리만
          있으면 견본이 아래로 쏠린다(실측 위 73 / 아래 25). 상수는 한 곳에서 온다 */}
      <div
        className={s.stage}
        ref={stageRef}
        style={{ paddingTop: TOP_SPACE, paddingBottom: TOP_SPACE }}
      >
        {/* 도해는 그림이다 — 동작·포커스 불필요(2026-08-19 결정). inert 로 클릭·탭 이동을
            막아 상태 변화로 콜아웃이 움직이는 어색함을 차단한다. 측정엔 무영향.
            위 여백은 zoom 밖(stage 패딩) — 견본 마진에 두면 배율만큼 늘어나 콜아웃이 뜬다 */}
        <div
          className={s.box}
          ref={boxRef}
          style={{ zoom: scale }}
          inert
          aria-hidden="true"
          data-anatomy-sample=""
        >
          {children}
        </div>
        {markers.length > 0 && (
          <svg className={s.overlay} aria-hidden="true">
            {markers.map((m) => (
              <g key={m.n}>
                <line
                  className={s.leader}
                  x1={m.bx}
                  y1={BADGE_R * 2 + 2}
                  x2={m.dx}
                  y2={m.dy - 3}
                />
                <circle className={s.dot} cx={m.dx} cy={m.dy} r={3} />
                <circle className={s.badge} cx={m.bx} cy={BADGE_R} r={BADGE_R} />
                <text className={s.badgeText} x={m.bx} y={BADGE_R} textAnchor="middle" dominantBaseline="central">
                  {m.n}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>
    </figure>
  );
}
