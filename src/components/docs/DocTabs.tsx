'use client';

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Tabs } from '@polarisoffice/pds-react';
import { hashIdCandidates } from '@/lib/docs/slug';
import s from './DocTabs.module.css';

export type DocTabId = 'design' | 'code';

const TABLIST_LABEL = '문서 보기 전환';

const TABS: { id: DocTabId; label: string }[] = [
  { id: 'design', label: 'Design' },
  { id: 'code', label: 'Code' },
];

interface DocTabsCtx {
  active: DocTabId;
  select: (id: DocTabId) => void;
}
const Ctx = createContext<DocTabsCtx>({ active: 'design', select: () => {} });

/** 하위(서버 렌더된 콘텐츠 안의 클라이언트 컴포넌트)에서 탭 상태를 읽는다 */
export function useDocTabs() {
  return useContext(Ctx);
}

/**
 * SSR 경고 회피용 별칭. DocTabs 는 서버에서도 렌더되므로 useLayoutEffect 를 그대로 부르면
 * "useLayoutEffect does nothing on the server" 경고가 매번 뜬다. 조건 선택은 환경당 상수라
 * hooks 규칙에 안 걸린다.
 */
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** URL 과 해시로부터 초기 탭 결정. 해시가 `?tab` 을 이긴다 — 해시는 특정 위치 요청이기 때문 */
function resolveInitialTab(root: HTMLElement | null): DocTabId {
  for (const id of hashIdCandidates(window.location.hash)) {
    const owner = document.getElementById(id)?.closest<HTMLElement>('[data-tabpanel]');
    if (owner?.dataset.tabpanel === 'code' || owner?.dataset.tabpanel === 'design') {
      return owner.dataset.tabpanel as DocTabId;
    }
  }
  void root;
  return new URLSearchParams(window.location.search).get('tab') === 'code' ? 'code' : 'design';
}

interface DocTabsProps {
  design: ReactNode;
  code: ReactNode;
  /** Code 탭 라벨 옆 뱃지 — 패키지 미발행 동안 'Soon' 같은 표시 */
  codeBadge?: string;
}

/**
 * 컴포넌트 페이지의 Design / Code 탭.
 *
 * 콘텐츠는 children 이 아니라 **prop 으로 받는다.** 그래야 각 탭 내용이 서버 컴포넌트로 남고
 * 클라이언트 번들에 들어가지 않는다(이 파일만 클라이언트 경계).
 *
 * ⚠️ 두 패널을 **항상 마운트**하고 비활성만 `hidden` 처리한다. Toc 의 헤딩 스캔 effect 는
 * deps 가 `[items, pathname]` 이라 라우트당 1회만 도는데, 언마운트/재마운트하면 목차가 조용히
 * 낡는다. DOM 을 상수로 두면 Toc 를 한 줄도 안 고쳐도 된다.
 *
 * 목차는 **활성 패널만** 싣는다 — 루트의 `data-toc-scope="active"` 를 Toc 의 제외 선택자가
 * 보고 `[hidden]` 패널 안의 헤딩을 건너뛴다(PageTabs 와 같은 규약). 탭을 바꾸면 `docs:tabchange`
 * 를 쏴서 Toc 가 재스캔한다 — 이벤트가 없으면 목차가 이전 탭 것으로 고정된다.
 *
 * 그래서 Code 탭에도 id 있는 헤딩을 **넣어도 된다.** 예전엔 스코프가 없어 비활성 패널 헤딩이
 * 목차에 새어나왔고, 그걸 "Code 탭엔 id 를 넣지 않는다"로 우회했었다. 그 우회의 대가는
 * Code 탭 목차가 통째로 비고 Design 헤딩이 대신 뜨는 것이었다.
 */
export default function DocTabs({ design, code, codeBadge }: DocTabsProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  // 서버·클라이언트 첫 렌더가 일치해야 하므로 항상 design 으로 시작한다
  const [active, setActive] = useState<DocTabId>('design');
  // select 는 deps 없는 콜백이라 지금 탭을 ref 로 본다 — 같은 탭 재클릭을 집계에서 거른다
  const activeRef = useRef<DocTabId>(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // 페인트 전에 커밋돼야 한다 — HashRescue 의 setTimeout(0) 보다 먼저 탭이 정해져야
  // 해시 대상이 보이는 패널 안에 있게 된다
  useIsoLayoutEffect(() => {
    setActive(resolveInitialTab(rootRef.current));
  }, [pathname]);

  // 패널 hidden 이 커밋된 **뒤**에 알린다 — select() 안에서 쏘면 Toc 가 이전 상태를 스캔한다.
  // 초기 탭 확정(위 effect)도 active 를 바꾸므로 같은 경로로 커버된다.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('docs:tabchange'));
  }, [active]);

  /**
   * PDS Tabs 가 밖으로 주지 않는 ARIA 배선을 렌더 뒤에 채운다 — `id`(패널의 aria-labelledby 대상),
   * `aria-controls`(탭→패널 연결), roving tabIndex(탭 바를 탭 스톱 하나로).
   *
   * 패키지에 prop 을 추가하는 게 정공법이지만 이번엔 문서만 고치기로 했다(2026-08-25 결정).
   * 그 대가로 이 effect 가 필요하다 — 없으면 패널의 aria-labelledby 가 존재하지 않는 id 를 가리켜
   * 스크린리더에서 탭·패널 이름이 통째로 사라진다(빈 참조는 '이름 없음'과 같다).
   */
  useEffect(() => {
    const list = rootRef.current?.querySelector<HTMLElement>('[role="tablist"]');
    if (!list) return;
    list.setAttribute('aria-label', TABLIST_LABEL);
    const buttons = list.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons.forEach((btn, i) => {
      const id = TABS[i]?.id;
      if (!id) return;
      btn.id = `tab-${id}`;
      btn.setAttribute('aria-controls', `panel-${id}`);
      btn.tabIndex = id === active ? 0 : -1;
    });
  }, [active, codeBadge]);

  const select = useCallback((next: DocTabId) => {
    // 사용자가 탭을 바꾼 것만 센다(초기 탭 확정은 setActive 직접 호출이라 제외). PDS Tabs 는
    // 이미 선택된 탭을 눌러도 onChange 를 부르므로 같은 탭은 거른다 — 페이지별 Design/Code 열람 비중
    if (next !== activeRef.current) track('doc_tab', { page: window.location.pathname, tab: next });
    setActive(next);
    const url = new URL(window.location.href);
    // 기본값은 URL 에 남기지 않는다 — 정규 주소가 지금과 동일하게 유지된다
    if (next === 'design') url.searchParams.delete('tab');
    else url.searchParams.set('tab', next);
    // replaceState — 뒤로가기가 탭 전환 이력을 훑고 다니면 안 된다
    window.history.replaceState(null, '', url);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = TABS.length - 1;
    if (next < 0) return;
    e.preventDefault();
    // 자동 활성화 — 패널이 이미 렌더돼 있으므로 APG 권장 기본값을 따른다
    select(TABS[next].id);
    // PDS Tabs 는 버튼 ref 를 밖으로 주지 않는다 — 렌더된 tablist 에서 직접 찾아 포커스를 옮긴다
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <Ctx.Provider value={{ active, select }}>
      <div ref={rootRef} data-toc-scope="active">
        {/* 탭 UI 는 PDS 패키지 Tabs 를 쓴다 (2026-08-25) — 문서 사이트가 자기 컴포넌트를 안 쓰면
            "실물이 정본" 이라는 이 사이트의 전제가 무너진다. 바깥 계약(해시 딥링크·?tab 동기화·
            패널 항상 마운트·data-toc-scope·Ctx)은 그대로 두고 tablist 렌더만 갈아끼운 어댑터다.
            ⚠️ 키보드 화살표 이동은 onKeyDown 을 감싸는 div 에 유지한다 — PDS Tabs 에 없는 기능이라
            여기서 보완한다(포커스 이동은 tablist 안 버튼을 직접 찾아 옮긴다). */}
        <div className={s.tablist} onKeyDown={onKeyDown}>
          <Tabs
            variant="secondary"
            layout="hug"
            value={active}
            onChange={(v) => select(v as DocTabId)}
            items={TABS.map((t) => ({
              value: t.id,
              label:
                t.id === 'code' && codeBadge ? (
                  <>
                    {t.label}
                    <span className={s.badge}>{codeBadge}</span>
                  </>
                ) : (
                  t.label
                ),
            }))}
          />
        </div>

        <div
          role="tabpanel"
          id="panel-design"
          aria-labelledby="tab-design"
          data-tabpanel="design"
          className={s.panel}
          hidden={active !== 'design'}
          tabIndex={0}
        >
          {design}
        </div>
        <div
          role="tabpanel"
          id="panel-code"
          aria-labelledby="tab-code"
          data-tabpanel="code"
          className={s.panel}
          hidden={active !== 'code'}
        >
          {code}
        </div>
      </div>
    </Ctx.Provider>
  );
}

/**
 * Design 탭 본문에서 Code 탭으로 보내는 인라인 링크.
 * 카탈로그성 데모(Variant/Size 나열)를 Design 탭에서 뺐기 때문에 생기는 공백을 잇는다.
 */
export function TabSwitchLink({ to, children }: { to: DocTabId; children: ReactNode }) {
  const { select } = useDocTabs();
  return (
    <button type="button" className={s.switchLink} onClick={() => select(to)}>
      {children}
      <span aria-hidden="true">→</span>
    </button>
  );
}
