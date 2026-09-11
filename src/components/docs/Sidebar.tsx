'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarFor, type NavNode } from '@/lib/docs/nav';
import s from './DocsShell.module.css';

/**
 * 문서 사이드바 — Seed Design(seed-design.io) 문법 + 슬라이딩 선택 pill.
 *
 * 접기가 없다. 그룹은 **흐린 섹션 라벨**, 항목은 평탄 목록, 활성 표시는 nav 안에 하나뿐인
 * pill 이 경로 변경 시 활성 항목 자리로 옮겨간다 — **가까우면 미끄러지고 멀면 갈아끼운다**
 * (아래 FAR_THRESHOLD 주석).
 *
 * 신뢰성 설계 — 1차 구현은 활성 좌표를 한 번만 재서 pill 이 낡은 좌표에 떠 버리는 사고가
 * 있었다(dev HMR 이 CSS 를 갈아끼우면 재측정 계기가 없었음). 지금은:
 *  · **ResizeObserver 가 nav 의 직계 자식 전부를 관찰** — 폰트 로딩·CSS 교체·줄바꿈 등
 *    어떤 이유로든 레이아웃이 변하면 즉시 재측정해 자가 치유된다
 *  · 첫 배치는 transition 없이(제자리 등장), 이후부터 전환 (ready 게이트)
 *  · 값이 같으면 setState 를 건너뛰어 관찰 루프가 공회전하지 않는다
 */
export default function Sidebar() {
  const pathname = usePathname();
  const nodes = sidebarFor(pathname);
  const navRef = useRef<HTMLElement>(null);
  const readyRef = useRef(false);
  const [pill, setPill] = useState<{ top: number; height: number; visible: boolean }>({
    top: 0,
    height: 0,
    visible: false,
  });
  const [ready, setReady] = useState(false);

  /**
   * 전환 방식 — 가까우면 미끄러지고, 멀면 갈아끼운다(2026-09-02 결정).
   *
   * pill 이 거리와 무관하게 220ms 로 움직여서, 맨 위에서 맨 아래로 갈 때 991px 을 초당
   * 4,500px 로 날아갔다(이웃 항목은 초당 180px — 25배 차이). 게다가 사이드바 클릭은 곧
   * 페이지 이동이라 pill 이 날아가는 동안 본문도 바뀌어 두 움직임이 부딪혔다.
   * 세 칸 남짓(120px)을 넘으면 제자리에서 사라졌다 새 자리에서 나타나게 해 관계없는
   * 메뉴 위를 지나가지 않는다.
   */
  const FAR_THRESHOLD = 120;
  const FADE_OUT = 100;
  const FADE_IN = 140;
  /** 'slide' 는 이동+높이까지 전환, 'in' 은 opacity 만 — transform 이 빠져 자리는 즉시 바뀐다 */
  const [phase, setPhase] = useState<'slide' | 'out' | 'in'>('slide');
  const activeHrefRef = useRef<string | null>(null);
  const jumpingRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  /** 거리 계산용 직전 좌표 — state 는 비동기라 같은 프레임의 판정에 못 쓴다 */
  const pillTopRef = useRef(0);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let readyRaf = 0;
    const measure = () => {
      const active = nav.querySelector<HTMLAnchorElement>('a[aria-current="page"]:not([data-label])');
      if (!active) {
        setPill((p) => (p.visible ? { ...p, visible: false } : p));
        return;
      }
      // offsetTop 이 아니라 rect 차분 — offsetTop 은 offsetParent(가장 가까운 positioned 조상)
      // 기준이라, dev 온디맨드 CSS 가 붙기 전(nav 가 아직 static)에 측정되면 body 기준 값이
      // 잡혀 pill 이 엉뚱한 행에 앉는다(실사고 2회). rect 차분 + scrollTop 은 포지셔닝 문맥과
      // 무관한 레이아웃 진실값이다.
      const navRect = nav.getBoundingClientRect();
      // 모바일 접힘(display:none) 상태의 측정값은 전부 0 — 저장하면 펼칠 때 pill 이 맨 위에서
      // 미끄러져 내려온다. 숨김 중엔 건너뛰고(RO 가 펼침 순간 다시 부른다), ready 도 미루어
      // 첫 실측이 transition 없이 제자리에 앉게 한다
      if (navRect.width === 0 || navRect.height === 0) return;
      const rect = active.getBoundingClientRect();
      const next = {
        top: Math.round(rect.top - navRect.top + nav.scrollTop),
        height: Math.round(rect.height),
        visible: true,
      };

      // 먼 거리 '갈아끼우기' 진행 중이면 자가치유 재측정이 중간 상태를 덮어쓰지 않게 둔다
      if (jumpingRef.current) return;

      // 항목이 실제로 **바뀐** 이동인지, 같은 항목의 재측정(폰트·리사이즈 자가치유)인지 가른다.
      // 재측정은 거리가 멀어도 갈아끼우면 안 된다 — 창 크기만 바꿨는데 pill 이 깜빡인다
      const href = active.getAttribute('href');
      const moved = activeHrefRef.current !== null && activeHrefRef.current !== href;
      activeHrefRef.current = href;
      const far = moved && readyRef.current && Math.abs(next.top - pillTopRef.current) > FAR_THRESHOLD;

      if (far) {
        jumpingRef.current = true;
        setPhase('out'); // 옛 자리에서 사라지고
        timersRef.current.push(
          window.setTimeout(() => {
            setPhase('in'); // transform 이 전환 대상에서 빠져 자리는 즉시 바뀐다
            pillTopRef.current = next.top;
            setPill(next); // 새 자리에서 나타난다
            timersRef.current.push(
              window.setTimeout(() => {
                jumpingRef.current = false;
                setPhase('slide'); // 다음 가까운 이동은 다시 미끄러지도록
              }, FADE_IN),
            );
          }, FADE_OUT),
        );
        return;
      }

      pillTopRef.current = next.top;
      // 갈아끼우기가 이동으로 중간에 끊기면 phase 가 'in'(자리 즉시 이동)에 멈춘다 —
      // 그 상태로 가까운 이동을 하면 미끄러지지 않으므로 되돌린다
      setPhase((ph) => (ph === 'slide' ? ph : 'slide'));
      setPill((p) => (p.top === next.top && p.height === next.height && p.visible ? p : next));
      if (!readyRef.current) {
        // 첫 배치가 페인트된 다음 프레임부터 transition 활성화 — 로드 시 위에서 미끄러져
        // 내려오는 어색한 첫 슬라이드를 막는다
        readyRaf = requestAnimationFrame(() => {
          readyRef.current = true;
          setReady(true);
        });
      }
    };

    const raf = requestAnimationFrame(measure);
    const late = window.setTimeout(measure, 250);
    document.fonts?.ready.then(measure).catch(() => {});

    // 자가 치유의 핵심 — nav 자신 + 직계 자식 어디든 크기가 변하면 재측정.
    // nav 자신을 넣는 이유: CSS 적용 시점에 nav 치수가 바뀌는 것이 초기 로드 경합의 신호다
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    for (const child of Array.from(nav.children)) ro.observe(child);
    window.addEventListener('resize', measure);

    // 모바일 펼침(html[data-nav-open]) 순간 즉시 재측정 — 접힘 중 측정은 위 가드로 건너뛰므로
    // 펼치는 시점의 실측이 첫 배치다. rAF 를 기다리지 않고 동기로 잰다: getBoundingClientRect
    // 가 레이아웃을 강제하므로 display 변경 직후에도 정확하고, 백그라운드 탭(rAF 정지)에서도
    // 돈다. RO 는 그 뒤의 자가치유 담당
    const mo = new MutationObserver(measure);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-nav-open'] });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(readyRaf);
      window.clearTimeout(late);
      // 갈아끼우기 도중 이동하면 타이머가 남아 다음 페이지의 pill 을 건드린다
      for (const t of timersRef.current) window.clearTimeout(t);
      timersRef.current = [];
      jumpingRef.current = false;
      window.removeEventListener('resize', measure);
      ro.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return (
    <nav id="kit-sidebar" className={s.sidebar} aria-label="문서 목차" ref={navRef}>
      <span
        className={s.activePill}
        aria-hidden="true"
        style={{
          transform: `translateY(${pill.top}px)`,
          height: pill.height,
          opacity: pill.visible && phase !== 'out' ? 1 : 0,
          // 'in' 은 opacity 만 전환 대상 — transform 이 빠져 새 자리로 즉시 옮겨진 뒤 떠오른다
          transition: !ready
            ? 'none'
            : phase === 'out'
              ? `opacity ${FADE_OUT}ms var(--ease-out)`
              : phase === 'in'
                ? `opacity ${FADE_IN}ms var(--ease-out)`
                : 'transform 220ms var(--ease-out), height 220ms var(--ease-out), opacity var(--duration-fast) var(--ease-out)',
        }}
      />
      {nodes.map((node) => (
        <SidebarSection key={node.text} node={node} pathname={pathname} />
      ))}
    </nav>
  );
}

function SidebarSection({ node, pathname }: { node: NavNode; pathname: string }) {
  // 단독 링크 (소개 · 리소스)
  if (!node.items?.length) {
    return <ItemLink text={node.text} link={node.link} pathname={pathname} />;
  }

  return (
    <section className={s.section}>
      {node.link ? (
        <Link
          href={node.link}
          data-label
          className={`${s.sectionLabel} ${s.sectionLabelLink}`}
          aria-current={node.link === pathname ? 'page' : undefined}
        >
          {node.text}
        </Link>
      ) : (
        <span className={s.sectionLabel}>{node.text}</span>
      )}
      <ul className={s.list}>
        {node.items.map((item) => (
          <li key={item.text}>
            <ItemLink text={item.text} link={item.link} pathname={pathname} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ItemLink({ text, link, pathname }: { text: string; link?: string; pathname: string }) {
  const active = link === pathname;
  return (
    <Link
      href={link ?? '#'}
      className={active ? `${s.item} ${s.itemActive}` : s.item}
      aria-current={active ? 'page' : undefined}
    >
      {text}
    </Link>
  );
}
