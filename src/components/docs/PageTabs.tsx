'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Tabs } from '@polarisoffice/pds-react';
import { hashIdCandidates } from '@/lib/docs/slug';
import s from './PageTabs.module.css';

export interface PageTab {
  id: string;
  label: string;
  content: ReactNode;
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * 범용 N-탭 (seed-design.io 의 Overview / Roles / Palette 패턴, 2026-08-19).
 *
 * DocTabs(Design/Code 전용)와 같은 규약: 패널은 전부 항상 마운트(비활성만 hidden), 해시가 ?tab
 * 을 이긴다(해시 대상이 들어 있는 패널을 연다), 기본 탭은 URL 에 남기지 않는다.
 *
 * `tocScope="active"` 를 주면 Toc 가 **활성 탭의 헤딩만** 목차로 쓴다(Toc 는 루트의
 * data-toc-scope 와 패널의 hidden 을 보고 제외, 탭 전환 시 `docs:tabchange` 이벤트로 재스캔).
 * 컴포넌트 페이지의 DocTabs 는 이 속성이 없어 기존 동작(모든 헤딩 노출) 그대로다.
 *
 * 탭 UI 는 PDS 패키지 Tabs 를 쓴다 (2026-08-28 요청 — 전 페이지 탭을 PDS 탭 디자인으로 통일).
 * DocTabs 와 같은 어댑터 방식: 바깥 계약(해시 딥링크·?tab 동기화·패널 항상 마운트·
 * data-toc-scope)은 그대로 두고 tablist 렌더만 갈아끼운다. PDS Tabs 가 밖으로 주지 않는
 * ARIA 배선·키보드 화살표 이동은 DocTabs 와 동일하게 여기서 보완한다.
 */
export default function PageTabs({
  tabs,
  tocScope = 'all',
  ariaLabel = '페이지 보기 전환',
}: {
  tabs: PageTab[];
  tocScope?: 'all' | 'active';
  ariaLabel?: string;
}) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const first = tabs[0]?.id ?? '';
  const [active, setActive] = useState(first);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    let next = first;
    for (const id of hashIdCandidates(window.location.hash)) {
      const owner = document.getElementById(id)?.closest<HTMLElement>('[data-tabpanel]');
      if (owner && root?.contains(owner) && owner.dataset.tabpanel) {
        next = owner.dataset.tabpanel;
        break;
      }
    }
    if (next === first) {
      const q = new URLSearchParams(window.location.search).get('tab');
      if (q && tabs.some((t) => t.id === q)) next = q;
    }
    setActive(next);
  }, [pathname, first, tabs]);

  // Toc 에 알린다 — 활성 탭 스코프일 때 목차를 다시 스캔한다
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('docs:tabchange'));
  }, [active]);

  /**
   * PDS Tabs 가 밖으로 주지 않는 ARIA 배선을 렌더 뒤에 채운다 — `id`(패널의 aria-labelledby
   * 대상), `aria-controls`(탭→패널 연결), roving tabIndex. DocTabs 의 2026-08-25 결정과 동일
   * (패키지에 prop 을 추가하는 정공법 대신 문서 쪽 보완) — 없으면 패널의 aria-labelledby 가
   * 존재하지 않는 id 를 가리켜 스크린리더에서 탭·패널 이름이 사라진다.
   */
  useEffect(() => {
    const list = rootRef.current?.querySelector<HTMLElement>('[role="tablist"]');
    if (!list) return;
    list.setAttribute('aria-label', ariaLabel);
    const buttons = list.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons.forEach((btn, i) => {
      const id = tabs[i]?.id;
      if (!id) return;
      btn.id = `tab-${id}`;
      btn.setAttribute('aria-controls', `panel-${id}`);
      btn.tabIndex = id === active ? 0 : -1;
    });
  }, [active, tabs, ariaLabel]);

  const select = useCallback(
    (next: string) => {
      setActive(next);
      const url = new URL(window.location.href);
      if (next === first) url.searchParams.delete('tab');
      else url.searchParams.set('tab', next);
      window.history.replaceState(null, '', url);
    },
    [first],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    select(tabs[next]!.id);
    // PDS Tabs 는 버튼 ref 를 밖으로 주지 않는다 — 렌더된 tablist 에서 직접 찾아 포커스를 옮긴다
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div ref={rootRef} data-toc-scope={tocScope}>
      <div className={s.tablist} onKeyDown={onKeyDown}>
        <Tabs
          variant="secondary"
          layout="hug"
          value={active}
          onChange={select}
          items={tabs.map((t) => ({ value: t.id, label: t.label }))}
        />
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          data-tabpanel={t.id}
          className={s.panel}
          hidden={active !== t.id}
          tabIndex={0}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
