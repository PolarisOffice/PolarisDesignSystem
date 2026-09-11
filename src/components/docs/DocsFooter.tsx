import Link from 'next/link';
import { FOOTER_MESSAGE } from '@/lib/docs/nav';
import { PDS_UPDATED } from '@/lib/docs/package';
import pdsPkg from '../../../packages/pds-react/package.json';
import s from './DocsShell.module.css';

/**
 * 문서 푸터 — 서버 컴포넌트.
 *  · 왼쪽: 태그라인 + © 저작권(연도는 빌드 시점)
 *  · 오른쪽: 버전 + 업데이트 일자 2줄 (2026-08-28 검토 벤치마크 형식 — "Version 1.0.0 /
 *    업데이트 YYYY.MM.DD"). 버전은 `@polarisoffice/pds-react` package.json 이 단일 소스
 *    (패키지 bump 가 곧 푸터 bump), 일자는 PDS_UPDATED 상수(콘텐츠 릴리즈 때 손으로 갱신 —
 *    빌드 시점 날짜를 쓰면 내용 없이 재빌드만 해도 바뀌어 거짓 신호가 된다).
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
        <span className={s.footerVersion}>Version {pdsPkg.version}</span>
        <span className={s.footerUpdated}>업데이트 {PDS_UPDATED}</span>
      </span>
    </footer>
  );
}
