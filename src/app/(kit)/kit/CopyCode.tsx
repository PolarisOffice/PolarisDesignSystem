'use client';

import { useEffect, useState } from 'react';
import s from './kit.module.css';

/** 코드 블록 + 복사 버튼 — 문서 사이트 CodePanel 과 같은 동작(1.5초 '복사됨'), 탭 컨텍스트 없이 단독. */
export default function CopyCode({ code }: { code: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  useEffect(() => {
    if (state === 'idle') return;
    const t = window.setTimeout(() => setState('idle'), 1500);
    return () => window.clearTimeout(t);
  }, [state]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setState('copied');
    } catch {
      // 클립보드 차단(http 로 다른 PC 에서 연 비보안 컨텍스트 등) — 조용히 실패하면 눌렀는지 모른다
      setState('failed');
    }
  };
  return (
    <div className={s.codeWrap}>
      <pre className={s.code}>{code}</pre>
      <button type="button" className={s.copyBtn} onClick={copy} aria-live="polite" aria-label="명령 복사">
        {state === 'copied' ? '복사됨' : state === 'failed' ? '직접 선택해 복사' : '복사'}
      </button>
    </div>
  );
}
