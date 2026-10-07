'use client';

import { useEffect, useState } from 'react';
import { toast } from '@polarisoffice/pds-react';
import { track } from '@vercel/analytics';
import { copyText } from '@/lib/docs/copyText';
import s from './Heading.module.css';

/**
 * 링크 아이콘 — GNB 아이콘들과 같은 선 언어(stroke 2·round). 크기는 16 고정이다:
 * 글자였던 `#` 은 헤딩 폰트를 따라 커졌지만, 아이콘까지 H2(24)·H3(20)에 맞춰 키우면
 * 제목만큼 커져 보조 요소로 안 읽힌다.
 */
function LinkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/**
 * 헤딩 옆 링크 아이콘 — hover 시에만 보이고, 클릭하면 **섹션 링크를 클립보드에 복사**한다
 * (2026-08-28 검토: "호버시 링크 복사 되면 좋을 것 같음").
 *
 * 클릭은 복사만 한다 — preventDefault 로 hash 이동(스크롤 점프)을 막는다(2026-08-28
 * 피드백 "복사할때 스크롤 이동 막아"). href 는 남겨 우클릭 '링크 주소 복사'와 새 탭
 * 열기는 그대로 동작한다. 성공 시 인라인 '복사됨' + PDS toast 로 알린다.
 */
export default function AnchorLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = (e: React.MouseEvent) => {
    e.preventDefault(); // 스크롤 이동 없이 복사만
    // 동료에게 많이 공유되는 섹션 — 페이지별·섹션별 집계
    track('link_copy', { page: location.pathname, section: id });
    const url = `${location.origin}${location.pathname}#${encodeURIComponent(id)}`;
    void copyText(url).then((ok) => {
      setCopied(ok);
      if (ok) toast.success('링크를 복사했어요');
    });
  };

  return (
    <a
      className={s.anchor}
      href={`#${encodeURIComponent(id)}`}
      aria-label="이 섹션 링크 복사"
      onClick={copy}
      data-copied={copied || undefined}
    >
      {copied ? '복사됨' : <LinkIcon />}
    </a>
  );
}
