import Link from 'next/link';
import { FOOTER_MESSAGE } from '@/lib/docs/nav';
import { PDS_UPDATED, PDS_VERSION } from '@/lib/docs/changelog';
import s from './DocsShell.module.css';

/**
 * 문서 푸터 — 서버 컴포넌트.
 *  · 왼쪽: 태그라인 + © 저작권(연도는 빌드 시점)
 *  · 오른쪽: 버전 + 업데이트 일자 2줄 (2026-08-28 검토 벤치마크 형식 — "Version 1.0.0 /
 *    업데이트 YYYY.MM.DD"). 버전은 `@polarisoffice/pds-react` package.json 이 단일 소스
 *    (패키지 bump 가 곧 푸터 bump), 일자는 변경 이력(changelog.ts)의 발행된 최신 항목 날짜 —
 *    release:pds 가 발행일을 채우므로 버전과 같은 순간에 바뀐다(2026-09-18, 구 PDS_UPDATED
 *    손관리 상수 대체. 빌드 시점 날짜는 내용 없이 재빌드만 해도 바뀌어 거짓 신호라 쓰지 않는다).
 */
const YEAR = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).slice(0, 4);

export default function DocsFooter() {
  return (
    <footer className={s.footer}>
      <span>
        {FOOTER_MESSAGE} · © {YEAR} Polaris Office. All rights reserved. ·{' '}
        <Link href="/terms" className={s.footerLink}>
          이용약관
        </Link>
      </span>
      <span className={s.footerMeta}>
        <span className={s.footerVersion}>Version {PDS_VERSION}</span>
        <span className={s.footerUpdated}>업데이트 {PDS_UPDATED}</span>
      </span>
    </footer>
  );
}
