import type { ReactNode } from 'react';
import s from './InfoNote.module.css';

/**
 * 안내 바 — 본문 옆에 작게 붙는 보조 설명을 담는다.
 *
 * 형태는 2026-08-25 사용자가 제시한 레퍼런스(제품 관리자 화면의 MCP 안내 바)를 따른다:
 * 옅은 면 + 회색 ⓘ 아이콘 + 본문색 텍스트 한 덩어리. **색 띠·강조 라벨("참고"/"주의")을 두르는
 * 콜아웃(admonition) 형태는 금지** — 같은 날 명시적으로 반려된 디자인이다(메모리
 * no-colored-callout-banners). 색·라벨 없이 면과 아이콘만으로 "본문과 다른 층"임을 알린다.
 */
export default function InfoNote({ children }: { children: ReactNode }) {
  return (
    <aside className={s.bar}>
      <svg className={s.icon} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="4.9" r="0.75" fill="currentColor" />
        <path d="M8 7.2v4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <div className={s.body}>{children}</div>
    </aside>
  );
}
