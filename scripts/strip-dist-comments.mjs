/**
 * pds-react 배포물 정리 — tsc 산출 dist/ 의 주석을 배포 규칙대로 걷고, tokens.css 를 주석 없이 dist/ 로 낸다.
 *   dist/**\/*.js    → 주석 전부 제거
 *   dist/**\/*.d.ts  → export 선언·멤버의 JSDoc 만 보존 (prop 설명 = 소비자·AI 명세)
 *   tokens.css       → dist/tokens.css (주석 제거 + 한 줄 헤더). package.json exports './tokens.css' 가 이 파일을 가리킨다.
 * 실행: node ../../scripts/strip-dist-comments.mjs  (packages/pds-react 의 build 에서)
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { stripTsComments, stripCssComments } from './lib/strip-comments.mjs';

const PKG = resolve(process.cwd());
const DIST = join(PKG, 'dist');
const pkg = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf8'));

let js = 0, dts = 0;
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (e.name.endsWith('.d.ts')) { writeFileSync(p, stripTsComments(readFileSync(p, 'utf8'), e.name, 'public-jsdoc')); dts++; }
    else if (e.name.endsWith('.js')) { writeFileSync(p, stripTsComments(readFileSync(p, 'utf8'), e.name, 'all')); js++; }
  }
};
walk(DIST);
const css = stripCssComments(readFileSync(join(PKG, 'tokens.css'), 'utf8'));
writeFileSync(join(DIST, 'tokens.css'), `/* ${pkg.name} ${pkg.version} — design tokens. Generated; edit the source tokens.css instead. */\n${css}`);
console.log(`[strip-dist] js ${js} · d.ts ${dts} · dist/tokens.css`);
