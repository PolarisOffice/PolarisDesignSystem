'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

/**
 * 다운로드 집계 — 다운로드 링크가 여러 컴포넌트(DownloadButton·DownloadMenu·AssetCard·AssetDownload·
 * Po26Actions·kit)에 흩어져 있어, 하나하나 심지 않고 문서 한 곳에서 위임으로 잡는다.
 * 새 다운로드 링크도 `download` 속성만 있으면 따로 손대지 않아도 집계된다.
 *
 * `file_download` { page, file } — download 속성이 있는 링크. DownloadButton·DownloadMenu 가
 * 즉석 생성해 `a.click()` 하는 앵커도 body 에 붙은 뒤 클릭되므로 여기서 잡힌다.
 *
 * Vercel Pro 는 이벤트당 정보(property)가 2개까지다 — 늘리면 Web Analytics Plus 가 필요하다.
 * layout 이 Analytics 와 같은 조건(PAX 동봉 빌드 제외)으로만 그린다.
 */
export default function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a?.href || !a.hasAttribute('download')) return;
      try {
        // download="DESIGN.md" 처럼 저장 이름이 있으면 그걸, 없으면 주소의 파일명
        const file = a.getAttribute('download') || decodeURIComponent(new URL(a.href).pathname.split('/').pop() || '');
        track('file_download', { page: window.location.pathname, file });
      } catch {
        /* 잘못된 주소·인코딩 — 집계만 건너뛴다 */
      }
    };
    // capture — 클릭 핸들러가 전파를 막아도 집계는 남긴다
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
