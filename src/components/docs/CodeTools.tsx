'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useDocTabs } from './DocTabs';
import { PDS_PREVIEW_ENABLED } from '@/lib/docs/package';
import { copyText } from '@/lib/docs/copyText';
import s from './CodeExample.module.css';

/**
 * 미리보기 면.
 *
 * 두 가지를 게이트한다:
 * 1. **패키지 미발행** — `preview` 가 없거나 스위치가 꺼져 있으면 조용한 자리표시를 그린다.
 *    DemoSurface 와 같은 치수라 나중에 실물이 들어와도 레이아웃이 안 흔들린다.
 * 2. **탭이 열린 적 있는지** — Code 패널은 항상 마운트돼 있지만 `hidden` 이다. Toast·Tooltip·
 *    Popup 같은 컴포넌트를 `display:none` 안에서 마운트하면 치수가 0으로 측정되고 타이머가
 *    제멋대로 돈다. 한 번 열린 뒤로는 계속 마운트해 데모 상태를 보존한다.
 *
 * SSR 시 everActive 는 서버·클라이언트 모두 false 라 hydration 불일치가 없다.
 */
export function PreviewFrame({ name, children }: { name: string; children?: ReactNode }) {
  const { active } = useDocTabs();
  const [everActive, setEverActive] = useState(false);

  useEffect(() => {
    if (active === 'code') setEverActive(true);
  }, [active]);

  const live = PDS_PREVIEW_ENABLED && children != null;

  return (
    <div className={s.preview}>
      {live ? (
        everActive ? (
          children
        ) : null
      ) : (
        <span className={s.pending}>{`<${name} />`}</span>
      )}
    </div>
  );
}

/**
 * 코드 패널 — `<pre>` + 복사 + 펼치기.
 *
 * `clamped` 는 **서버에서** 줄 수로 결정해 넘긴다(측정 없음 → 접혔다 펴지는 깜빡임 없음).
 * 코드 텍스트는 SSR 마크업에 그대로 들어가므로 view-source·Ctrl-F 로도 잡힌다.
 */
export function CodePanel({ code, clampable, children }: { code: string; clampable: boolean; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    setCopied(await copyText(code));
  };

  const clamped = clampable && !expanded;

  return (
    <div className={s.codeWrap}>
      <div className={s.toolbar}>
        {clampable && (
          <button type="button" className={s.toolButton} onClick={() => setExpanded((v) => !v)}>
            {expanded ? '접기' : '펼치기'}
          </button>
        )}
        <button type="button" className={s.toolButton} onClick={copy}>
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <pre className={clamped ? `${s.pre} ${s.preClamped}` : s.pre}>
        <code>{children}</code>
      </pre>
      {clamped && <span className={s.fade} aria-hidden="true" />}
    </div>
  );
}
