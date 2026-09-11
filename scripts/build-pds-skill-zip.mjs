/**
 * PDS 오프라인 스킬 zip 조립 — `packages/pds-react/SKILL/` + `src/` (폴더명 매칭) + 토큰 CSS → `public/pds-design-skill.zip`.
 *
 * 소스는 리포 안에서 복사되지 않는다(정본 하나). 여기서 zip 안에서만 합친다:
 *   pds-design/SKILL.md, references/…        ← SKILL/ (generate-pds-skill.mjs 산출)
 *   pds-design/src/components/{이름}/…       ← references/{이름} 과 폴더명이 같은 소스 폴더
 *   pds-design/src/{tokens,tokens.generated,supported,index}.ts   ← 공용 파일 (항상)
 *   pds-design/styles/design-tokens.css      ← packages/pds-react/tokens.css (외부 @import 줄 제외, hash 헤더)
 *   pds-design/LICENSE
 * 결정적(고정 mtime) — 같은 정본이면 바이트 동일. 실행: node PDS/scripts/build-pds-skill-zip.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, rmSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pdsMdHash } from './lib/pds-md-hash.mjs';
import JSZip from 'jszip';
import { stripTsComments, stripCssComments } from './lib/strip-comments.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG_DIR = join(ROOT, 'packages/pds-react');
const SKILL_DIR = join(PKG_DIR, 'SKILL');
const SRC = join(PKG_DIR, 'src');
const OUT = join(ROOT, 'public/pds-design-skill.zip');
const LEGACY = join(ROOT, 'public/polaris-design-skill.zip'); // 손으로 만들던 구 zip — 있으면 제거
const ZIP_ROOT = 'pds-design';
const SHARED = ['tokens.ts', 'tokens.generated.ts', 'supported.ts', 'index.ts'];

if (!existsSync(join(SKILL_DIR, 'SKILL.md'))) {
  console.error('[pds-skill-zip] SKILL/ 이 없습니다 — 먼저 node scripts/generate-pds-skill.mjs');
  process.exit(1);
}
const pkg = JSON.parse(readFileSync(join(PKG_DIR, 'package.json'), 'utf8'));
const md = readFileSync(join(ROOT, 'designs/pds.md'), 'utf8');
const hash = pdsMdHash(md); // generate-pds-skill.mjs(SKILL.md 규칙 3 인용값)와 같은 값 — lib/pds-md-hash.mjs

const zip = new JSZip();
const date = new Date(0);
const add = (rel, content) => zip.file(`${ZIP_ROOT}/${rel}`, content, { date });
const addDir = (abs, rel) => {
  for (const e of readdirSync(abs, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = join(abs, e.name);
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) addDir(p, r);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) add(r, stripTsComments(readFileSync(p, 'utf8'), e.name, 'public-jsdoc')); // 내부 메모 제거, prop JSDoc 유지
    else add(r, readFileSync(p));
  }
};

// 1) SKILL/ 통째
addDir(SKILL_DIR, '');

// 2) references/{이름} ↔ src/components/{이름} 폴더명 매칭
const refDirs = readdirSync(join(SKILL_DIR, 'references'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const missing = [];
for (const name of refDirs) {
  const srcDir = join(SRC, 'components', name);
  if (!existsSync(srcDir) || !statSync(srcDir).isDirectory()) { missing.push(name); continue; }
  addDir(srcDir, `src/components/${name}`);
}
if (missing.length) {
  console.error(`[pds-skill-zip] references 에 있는데 src/components 에 없는 폴더: ${missing.join(', ')}`);
  process.exit(1);
}
// 3) 공용 파일 — 컴포넌트가 상대 경로로 import 하므로 항상 동봉
for (const f of SHARED) add(`src/${f}`, stripTsComments(readFileSync(join(SRC, f), 'utf8'), f, 'public-jsdoc'));

// 4) 토큰 CSS — 정본 tokens.css 에서 외부 @import(제3자 CDN) 줄만 제외, 첫 줄 hash 헤더
// 주석 제거 — 정본 tokens.css 의 설계 메모(Figma 키·이력)는 배포물에 싣지 않는다
const tokensCss = stripCssComments(readFileSync(join(PKG_DIR, 'tokens.css'), 'utf8'));
add('styles/design-tokens.css', `/* @design-system pds@${pkg.version} hash:${hash} — PDS 오프라인 번들. 수정 금지, 오버라이드는 app-tokens.css */\n${tokensCss}`);

// 5) 라이선스
add('LICENSE', readFileSync(join(PKG_DIR, 'LICENSE')));

const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } });
const prev = existsSync(OUT) ? readFileSync(OUT) : null;
if (prev && prev.equals(buf)) {
  console.log(`[pds-skill-zip] public/pds-design-skill.zip 변경 없음 (${(buf.length / 1024).toFixed(1)}KB)`);
} else {
  writeFileSync(OUT, buf);
  console.log(`[pds-skill-zip] public/pds-design-skill.zip 갱신 — 컴포넌트 ${refDirs.length}개, ${(buf.length / 1024).toFixed(1)}KB`);
}
if (existsSync(LEGACY)) { rmSync(LEGACY); console.log('[pds-skill-zip] 구 polaris-design-skill.zip 제거'); }
