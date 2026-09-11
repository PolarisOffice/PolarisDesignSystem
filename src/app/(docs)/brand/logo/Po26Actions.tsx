'use client';

import { Button } from '@polarisoffice/pds-react';
import DownloadMenu from '@/components/docs/DownloadMenu';
import type { Po26Format } from './logo.data';
import ac from '@/components/docs/AssetCard.module.css';
import { withBase } from '@/lib/basePath';

/** download 앵커 즉석 생성 — DownloadMenu 와 같은 패턴 */
function saveFile(href: string) {
  const a = document.createElement('a');
  a.href = withBase(href);
  a.download = '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * 로고 카드 버튼 줄 — 전부 시스템 Button. '화면용' 은 공용 DownloadMenu(SVG·PNG 선택),
 * 나머지(인쇄용·가로·세로)는 즉시 다운로드 — 전부 default variant (2026-08-24 피드백).
 */
export default function Po26Actions({
  screen,
  formats,
  size = 'lg',
}: {
  screen?: Po26Format[];
  formats?: Po26Format[];
  size?: 'lg' | 'sm';
}) {
  const btnSize = size === 'sm' ? 24 : 32;
  return (
    <span className={ac.formats}>
      {screen && screen.length > 0 && <DownloadMenu label="화면용" items={screen} size={btnSize} menuWidth={132} />}
      {formats?.map((f) => (
        <Button key={f.href} variant="default" size={btnSize} onClick={() => saveFile(f.href)}>
          {f.label}
        </Button>
      ))}
    </span>
  );
}
