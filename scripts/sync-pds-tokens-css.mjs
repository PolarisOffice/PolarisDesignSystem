/**
 * 문서 사이트 토큰 CSS 동기화 — `packages/pds-react/tokens.css`(정본) + 문서 전용 브리지 → `src/app/pds-tokens.css`.
 *
 * 예전엔 손으로 복사해 두 파일을 같이 고쳤다(2026-08-31 radius 재편 때도). 이제 빌드가 만든다:
 *   정본에서 외부 @import(제3자 CDN) 줄만 제외 + `src/styles/pds-tokens.bridge.css`(구 폰트 토큰 별칭, 문서 CSS 하위호환) 이어 붙임.
 * 산출물은 커밋한다(pds.md 와 같은 방식) — `--check` 로 드리프트 검출.
 * 실행: node PDS/scripts/sync-pds-tokens-css.mjs [--check]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'packages/pds-react/tokens.css');
const BRIDGE = join(ROOT, 'src/styles/pds-tokens.bridge.css');
const OUT = join(ROOT, 'src/app/pds-tokens.css');
const check = process.argv.includes('--check');

const body = readFileSync(SRC, 'utf8')
  .split('\n')
  .filter((l) => !/^\s*@import\s+url\(/.test(l)) // Pretendard 는 문서 사이트가 직접 로드
  .join('\n')
  .replace('정본: 이 파일 (사람이 관리). designs/pds.md 의 토큰과 tokens.generated.ts 는 여기서 생성된다.',
           '원본: packages/pds-react/tokens.css (정본) — 이 파일은 빌드 생성 사본, 편집 금지');
const out = `/* 생성 파일 — scripts/sync-pds-tokens-css.mjs 가 packages/pds-react/tokens.css + src/styles/pds-tokens.bridge.css 로 만든다. 편집 금지. */\n\n${body.trimEnd()}\n\n${readFileSync(BRIDGE, 'utf8').trimEnd()}\n`;

const cur = (() => { try { return readFileSync(OUT, 'utf8'); } catch { return null; } })();
if (check) {
  if (cur !== out) { console.error('[pds-tokens-css --check] src/app/pds-tokens.css 가 정본과 다릅니다 — node scripts/sync-pds-tokens-css.mjs'); process.exit(1); }
  console.log('[pds-tokens-css --check] clean');
} else {
  if (cur === out) console.log('[pds-tokens-css] src/app/pds-tokens.css 변경 없음');
  else { writeFileSync(OUT, out); console.log('[pds-tokens-css] src/app/pds-tokens.css 갱신'); }
}
