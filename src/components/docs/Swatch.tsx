import { SpecToken, SpecVal } from './SpecTable';
import s from './Swatch.module.css';

/**
 * 색 칩 + 표기 — 스펙 표 셀 안에서 쓴다.
 *
 * `token` 을 주면 **semantic 토큰명이 1급 표기**가 되고 hex 는 부차로 붙는다
 * (2026-08-13 규약 — 컴포넌트에 쓰인 색은 전부 semantic 토큰으로 문서화한다).
 * hex 만 주는 형태는 팔레트 미등재 값(문서에 그 사실을 명시할 것) 전용.
 *
 * 표기 구조(2026-08-28 피드백 "행 간격 똑바로" — 좁은 열에서 토큰명이 세 줄로 꺾여
 * 행이 들쭉날쭉했다): 토큰 뱃지 **한 줄 고정**(넘치면 말줄임 + title) 아래 칩·hex 한 줄 —
 * 셀이 항상 2줄이라 표의 행 높이가 균일하다.
 */
export default function Swatch({ hex, token }: { hex: string; token?: string }) {
  // #ffffff 만 라인 — 흰 칩은 표 배경과 붙어 라인 없이는 안 보인다 (2026-08-28 요청)
  const white = /^#(?:fff|ffffff)$/i.test(hex.trim());
  const chip = (
    <span
      className={white ? `${s.chip} ${s.chipWhite}` : s.chip}
      style={{ background: hex }}
      aria-hidden="true"
    />
  );
  if (!token) {
    return (
      <span className={s.valueRow}>
        {chip} <SpecVal>{hex}</SpecVal>
      </span>
    );
  }
  return (
    <span className={s.swatch}>
      <span className={s.tokenClamp} title={token}>
        <SpecToken>{token}</SpecToken>
      </span>
      <span className={s.valueRow}>
        {chip} <SpecVal>{hex}</SpecVal>
      </span>
    </span>
  );
}
