import s from './NewBadge.module.css';

/**
 * "New" 표시 — 이번 버전(major.minor)에 추가된 컴포넌트 이름 옆의 주황 'N' 한 글자.
 * 글자 알약(크고 두껍다) → 6px 점(뭔지 모른다) 을 거쳐 2026-09-18 이 형태로. 색은 PDS `state/new`.
 * 켜고 끄는 판정은 changelog.ts `isNew()`(카탈로그 `since` 대조) — 여기는 모양만.
 * 사이드바 항목·랜딩 카드 두 곳이 같은 부품을 쓴다. 낭독기엔 'N' 대신 뜻(aria-label)을 준다.
 */
export default function NewBadge() {
  return (
    <span className={s.n} role="img" aria-label="이번 버전에 추가">
      N
    </span>
  );
}
