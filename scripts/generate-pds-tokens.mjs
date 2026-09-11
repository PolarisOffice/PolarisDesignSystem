/**
 * tokens.css(정본) → tokens.generated.ts(파생).
 *
 * **PDS 토큰의 정본은 `packages/pds-react/tokens.css` 이고 사람이 관리한다.**
 * Figma Variables 와 같은 2계층(primitive → semantic alias) 구조라 디자인
 * 쪽 변경을 그대로 받아 적을 수 있다. 예전에는 `designs/polaris-extended.md`
 * 에서 생성했지만, PDS 는 우리 회사 디자인 시스템이라 손으로 관리한다 —
 * **다른 테넌트·킷 사용자의 DESIGN.md 경로는 그대로다**(buildTokensCss).
 *
 * 이 스크립트가 만드는 것은 컴포넌트가 import 하는 참조 맵 하나뿐이다.
 * 값을 새로 정하지 않는다 — css 에 있는 것을 읽어 옮길 뿐이다.
 *
 * 폴백: `var(--x, #hex)` 의 hex 는 alias 를 끝까지 따라가 얻은 실제 값이다.
 * 토큰 CSS 를 안 불러온 환경에서도 화면이 무너지지 않게 한다.
 *
 * 실행: node PDS/scripts/generate-pds-tokens.mjs [--check]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_CSS = join(ROOT, 'packages/pds-react/tokens.css');
const OUT_TS = join(ROOT, 'packages/pds-react/src/tokens.generated.ts');
const check = process.argv.includes('--check');

const css = readFileSync(SOURCE_CSS, 'utf8');

/* ── 1. 선언 수집 — 라이트(기본) 값만. 다크는 런타임이 덮는다 ── */
const raw = new Map();
// [data-theme="dark"] 블록은 폴백 계산에서 제외한다
const lightOnly = css.replace(/\[data-theme="dark"\][^{]*\{[\s\S]*?\n\}/g, '');
for (const m of lightOnly.matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gm)) {
  if (!raw.has(m[1])) raw.set(m[1], m[2].trim());
}

/* ── 2. alias 해석 — var(--x) 를 끝까지 따라간다 ── */
const seen = new Set();
function resolve(name, depth = 0) {
  if (depth > 12) return null; // 순환 방어
  const v = raw.get(name);
  if (v === undefined) return null;
  const ref = v.match(/^var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^)]+))?\)$/);
  if (!ref) return v;
  return resolve(ref[1], depth + 1) ?? (ref[2]?.trim() ?? null);
}

/* ── 3. 카테고리별로 묶기 — --{category}-{key} ── */
const CATEGORIES = ['color', 'radius', 'spacing', 'typography', 'motion', 'elevation', 'shadow', 'duration', 'ease'];
const groups = {};
for (const name of raw.keys()) {
  if (name.startsWith('--primitive-')) continue; // 컴포넌트는 semantic 만 쓴다
  const cat = CATEGORIES.find((c) => name.startsWith(`--${c}-`));
  if (!cat) continue;
  const key = name.slice(cat.length + 3);
  const value = resolve(name);
  if (value === null) continue;
  (groups[cat] ??= []).push({ key, name, value });
}

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

const out = [
  '/**',
  ' * 자동 생성 — PDS/scripts/generate-pds-tokens.mjs. 직접 고치지 마세요.',
  ' * 정본: packages/pds-react/tokens.css (사람이 관리한다)',
  ' *',
  ' * 값을 여기 적는 게 아니라 CSS 변수를 가리킨다. 두 번째 인자는 폴백 —',
  ' * 토큰 CSS 가 없는 환경에서만 쓰이며, 정본의 alias 를 끝까지 따라가',
  ' * 얻은 값이라 어긋나지 않는다.',
  ' */',
  '',
  'const v = (name: string, fallback: string) => `var(${name}, ${fallback})`;',
  '',
];
for (const [cat, list] of Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))) {
  out.push(`export const ${camel(cat)} = {`);
  for (const { key, name, value } of list.sort((a, b) => a.key.localeCompare(b.key))) {
    out.push(`  ${JSON.stringify(camel(key))}: v('${name}', ${JSON.stringify(value)}),`);
  }
  out.push('} as const;', '');
}
const tsOut = out.join('\n');

const same = existsSync(OUT_TS) && readFileSync(OUT_TS, 'utf8') === tsOut;
if (check) {
  if (!same) {
    console.error('[pds-tokens] 드리프트 — node PDS/scripts/generate-pds-tokens.mjs 를 실행하고 커밋하세요');
    process.exit(1);
  }
  console.log('[pds-tokens] clean');
} else {
  if (!same) writeFileSync(OUT_TS, tsOut);
  const total = Object.values(groups).reduce((a, l) => a + l.length, 0);
  console.log(`[pds-tokens] tokens.css → ${total}개 토큰 (${same ? '변경 없음' : '갱신'})`);
}
