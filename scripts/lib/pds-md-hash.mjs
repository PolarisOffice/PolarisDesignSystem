/**
 * pds.md 번들 해시 — 단일 소스. 두 곳이 같은 값을 써야 한다:
 *   · generate-pds-skill.mjs → SKILL.md 규칙 3 이 "이 번들의 값" 으로 인용
 *   · build-pds-skill-zip.mjs → zip 의 styles/design-tokens.css 첫 줄 `hash:` 헤더
 * 사용자 프로젝트에 복사된 design-tokens.css 의 첫 줄과 SKILL.md 의 인용값을 비교해 stale 을 판정하므로
 * 둘이 어긋나면 매번 "다르다" 로 덮어쓴다.
 *
 * `version:` 줄은 뺀다 — 버전만 올린 릴리스는 내용이 같으니 같은 번들이다(참조 파일 churn 방지).
 * frontmatter 전체를 빼면 토큰 값 변경을 놓치므로 version 줄만.
 */
import { createHash } from 'node:crypto';

export function pdsMdHash(md) {
  return createHash('sha256').update(md.replace(/^version: .*\n/m, '')).digest('hex').slice(0, 12);
}
