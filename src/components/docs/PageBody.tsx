'use client';

import { usePathname } from 'next/navigation';

import type { ReactNode } from 'react';

/**
 * 문서 본문 래퍼 — 페이지가 바뀔 때마다 새로 그려 등장 애니메이션(DocsShell.module.css `.body`)을 다시 돌린다.
 * 키가 경로뿐이라 같은 페이지 안의 탭(?tab=)·해시 이동에서는 움직이지 않는다.
 * `data-docs-body` 는 Toc 가 헤딩을 찾는 표식이다 — 떼지 말 것.
 */
export default function PageBody({ className, children }: { className?: string; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} data-docs-body className={className}>
      {children}
    </div>
  );
}
