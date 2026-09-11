'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { hashIdCandidates } from '@/lib/docs/slug';
import { resolveAnchorAlias } from '@/lib/docs/anchor-aliases';

/**
 * 한글 앵커 딥링크 구제.
 *
 * 우리 앵커 id 는 VitePress 와 동일하게 **NFKD 조합형 자모**다(src/lib/docs/slug.ts 참고).
 * 붙여넣는 URL 의 정규화 형태가 다르면(macOS=NFD, Windows=NFC) `getElementById` 가 실패하고
 * **에러 없이 스크롤만 안 된다.** 후보 목록은 DocTabs 와 공유한다 — 두 판정이 어긋나면
 * "탭은 맞게 열렸는데 스크롤은 안 되는" 상태가 생긴다.
 *
 * 브라우저 기본 동작이 이미 성공했으면 아무 것도 하지 않는다(같은 위치로 다시 스크롤될 뿐).
 */
export default function HashRescue() {
  const pathname = usePathname();

  useEffect(() => {
    const candidates = hashIdCandidates(window.location.hash);
    if (candidates.length === 0) return;

    // 레이아웃 확정 후 시도 — 사이드바·목차가 자리를 잡고, DocTabs 가 탭을 정한 뒤여야 한다
    const timer = window.setTimeout(() => {
      for (const id of candidates) {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ block: 'start' });
          return;
        }
      }
      // 마지막 수단 — 명명 통일(2026-08-13)로 사라진 구 앵커를 별칭 맵으로 구제
      for (const id of candidates) {
        const alias = resolveAnchorAlias(pathname, id);
        const el = alias ? document.getElementById(alias) : null;
        if (el) {
          el.scrollIntoView({ block: 'start' });
          return;
        }
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
