'use client';

import { toast } from '@polarisoffice/pds-react';

/**
 * 아직 공개 전인 외부 리소스 링크 — 이동 대신 토스트로 예고만 한다.
 * 공개되면 데이터의 comingSoon 플래그만 걷어내면 원래 외부 링크로 돌아간다(href 는 데이터에 유지).
 */
export default function ComingSoonLink({ label }: { label: string }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        toast.default('곧 공개될 예정입니다.');
      }}
    >
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}
