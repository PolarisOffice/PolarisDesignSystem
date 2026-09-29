#!/usr/bin/env node
/**
 * @polarisoffice/pds-react 릴리스 준비 — 사람이 정하는 건 버전 번호 하나.
 *
 *   npm run release:pds -- patch|minor|major|X.Y.Z [--dry-run]
 *   (patch/minor/major 는 npm latest 와 package.json 중 큰 쪽 기준으로 계산 — 번호를 직접 정하지 않아도 된다)
 *
 * 하는 일(순서대로, 하나라도 실패하면 exit 1 — 실패 지점 이전 변경은 워킹트리에 남는다):
 *   0. 버전: semver · package.json 보다 큼 · npm latest 보다 큼
 *   1. 브랜치: 워킹트리 clean · HEAD ⊇ origin/develop. develop 에 없는 패키지 소스 변경은 **경고만** —
 *      이 스크립트는 발행하지 않고 PR 을 만들 뿐이라 리뷰는 PR 에서 받는다("코드 + bump 를 한 PR 에" 가 기본 흐름)
 *      (2026-09-04 1.0.5 사고 재발 차단 — 옛 피처 브랜치 체크아웃에서 발행돼 develop 에
 *      이미 있던 Sub 버튼 다크 수정 2건이 tarball 에 빠졌다. docs/pds-release.md)
 *   2. package.json version 기록 + 변경 이력(src/lib/docs/changelog.ts) 맨 위 항목 날짜를 오늘로
 *      (맨 위 항목 version 이 새 버전과 다르면 중단 — 이력 없이 발행되지 않게. 푸터 '업데이트' 와
 *      컴포넌트 'New' 배지가 이 파일을 읽는다)
 *   3. pds:build → tokens:sync → md:gen → skill:gen → skill:zip (pds.md·SKILL 이 새 버전으로 재생성)
 *   4. 검증: dist·tokens.css 헤더·pds.md·SKILL.md 버전 일치, tarball 구성
 *   5. 커밋
 *   6. 다음 할 일 출력 — push · PR (PAX 의 pds.md 는 발행 후 자동 반영 — src/lib/design/officialSync.ts)
 *
 * publish 는 하지 않는다: PR 이 develop 에 머지되면 미러 동기화 → 미러의 npm-publish 워크플로
 * (PDS/.github/workflows/npm-publish.yml, npm Trusted Publishing)가 발행하고 그 미러 커밋에 태그 `pds-react@X.Y.Z`
 * 를 찍는다. 정본에는 태그를 찍지 않는다(스쿼시 머지되면 고아 커밋을 가리키고, 미러엔 안 넘어간다).
 * --dry-run 은 4 까지 돌린 뒤 변경을 되돌린다(커밋 없음).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PDS = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = join(PDS, '..');
const PKG_DIR = join(PDS, 'packages/pds-react');
const PKG_JSON = join(PKG_DIR, 'package.json');
const PKG_NAME = '@polarisoffice/pds-react';
const MD = join(PDS, 'designs/pds.md');
const SKILL_MD = join(PKG_DIR, 'SKILL/SKILL.md');
/** develop 에 없는 변경이 있으면 발행 불가한 경로 — 소스·패키지 메타. SKILL/ 은 md 파생물이라 제외 */
const SOURCE_PATHS = ['src', 'tokens.css', 'tsconfig.build.json', 'LICENSE', 'NOTICE', 'README.md'].map(
  (p) => `PDS/packages/pds-react/${p}`,
);
const CHAIN = ['pds:build', 'tokens:sync', 'md:gen', 'skill:gen', 'skill:zip'];

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const versionArg = args.find((a) => !a.startsWith('--'));
const dryRun = flags.has('--dry-run');

const fail = (msg) => {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
};
const step = (msg) => console.log(`\n▶ ${msg}`);
/** 셸 문자열 조립 금지 — 인자는 argv 로 그대로 */
const run = (cmd, argv, opts = {}) => {
  const r = spawnSync(cmd, argv, { cwd: opts.cwd ?? REPO, encoding: 'utf8', stdio: opts.inherit ? 'inherit' : 'pipe' });
  if (r.error) fail(`${cmd} ${argv.join(' ')} — ${r.error.message}`);
  return r;
};
const git = (argv, opts) => run('git', argv, opts);
const must = (r, msg) => {
  if (r.status !== 0) fail(`${msg}${r.stderr ? `\n${r.stderr.trim()}` : ''}`);
  return r;
};
const diffLines = (out) => out.split('\n').filter((l) => /^[-+]/.test(l) && !/^[-+]{3}/.test(l));
const semverRe = /^\d+\.\d+\.\d+$/;
const cmp = (a, b) => {
  const x = a.split('.').map(Number);
  const y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
};

const BUMPS = ['patch', 'minor', 'major'];
if (!versionArg || (!semverRe.test(versionArg) && !BUMPS.includes(versionArg))) {
  fail('사용법: npm run release:pds -- patch|minor|major|X.Y.Z [--dry-run]');
}
const bump = (base, kind) => {
  const [M, m, p] = base.split('.').map(Number);
  return kind === 'major' ? `${M + 1}.0.0` : kind === 'minor' ? `${M}.${m + 1}.0` : `${M}.${m}.${p + 1}`;
};

/* 0) 버전 */
step('버전 확인');
const pkg = JSON.parse(readFileSync(PKG_JSON, 'utf8'));
const view = run('npm', ['view', PKG_NAME, 'version']);
if (view.status !== 0) fail('npm 레지스트리 조회 실패 — 네트워크·npm 로그인 확인');
const latest = view.stdout.trim();
// patch/minor/major 는 "지금 세상에 있는 가장 큰 버전" 기준 — 로컬 package.json 이 앞서 있으면(직전 릴리스 커밋) 그쪽
const base = cmp(pkg.version, latest) > 0 ? pkg.version : latest;
const version = BUMPS.includes(versionArg) ? bump(base, versionArg) : versionArg;
if (cmp(version, pkg.version) <= 0) fail(`새 버전 ${version} 은 현재 package.json ${pkg.version} 보다 커야 해요`);
if (cmp(version, latest) <= 0) fail(`새 버전 ${version} 은 npm latest ${latest} 보다 커야 해요 (내려간 번호는 재사용 불가)`);
console.log(`  package.json ${pkg.version} · npm latest ${latest} → ${version}${BUMPS.includes(versionArg) ? ` (${versionArg})` : ''}`);

/* 1) 브랜치 */
step('브랜치 검사');
must(git(['fetch', '-q', 'origin', 'develop', 'main']), 'git fetch 실패');
const dirty = must(git(['status', '--porcelain', '--untracked-files=no']), 'git status 실패').stdout.trim();
if (dirty) fail(`워킹트리가 깨끗하지 않아요 — 먼저 커밋하거나 스태시:\n${dirty}`);
if (git(['merge-base', '--is-ancestor', 'origin/develop', 'HEAD']).status !== 0) {
  fail('HEAD 가 origin/develop 최신을 포함하지 않아요 — develop 을 먼저 머지(옛 브랜치에서 발행하면 develop 의 수정이 빠져요)');
}
// develop 에 없는 소스 변경 = 리뷰 안 된 코드 발행. package.json 은 version 줄만 다른 것(직전 릴리스 커밋) 허용
const ahead = must(git(['diff', '--name-only', 'origin/develop', '--', ...SOURCE_PATHS]), 'git diff 실패').stdout.trim();
const pkgNonVersion = diffLines(must(git(['diff', 'origin/develop', '--', 'PDS/packages/pds-react/package.json']), 'git diff 실패').stdout).filter(
  (l) => !/^[-+]\s*"version":/.test(l),
);
if (ahead || pkgNonVersion.length) {
  // 발행은 머지 후 미러 CI 가 하므로 여기서 막을 이유가 없다 — 리뷰어가 코드와 bump 를 같은 PR 에서 본다는 사실만 알린다
  console.log(`  ⚠ develop 에 아직 없는 패키지 변경이 이 브랜치에 있어요 — 이 PR 에 코드 + 버전 bump 가 함께 들어가요(리뷰어가 둘 다 확인):\n${[ahead, ...pkgNonVersion].filter(Boolean).map((l) => `      ${l}`).join('\n')}`);
}
const mainLag = must(git(['log', '--oneline', 'origin/main..origin/develop', '--', 'PDS/packages/pds-react']), 'git log 실패').stdout.trim();
if (mainLag) {
  console.log(`  ⚠ main 에 아직 안 나간 패키지 변경 ${mainLag.split('\n').length}건 — PAX 가이드(정적 동봉)는 다음 main 배포 때 따라와요`);
}
console.log('  ok — develop 최신 포함');

/* 2) bump */
/* 변경 이력 — 맨 위 항목이 새 버전이어야 하고, 날짜는 오늘(KST)로 채운다 */
const CHANGELOG = join(PDS, 'src/lib/docs/changelog.ts');
const changelogRaw = readFileSync(CHANGELOG, 'utf8');
const firstEntry = changelogRaw.match(/^\s*\{\s*version:\s*'([^']+)',\s*date:\s*(null|'[^']*'),/m);
if (!firstEntry) fail('src/lib/docs/changelog.ts 에서 첫 항목(`{ version: …, date: … ,`)을 못 읽었어요');
if (firstEntry[1] !== version) {
  fail(`변경 이력 맨 위 항목이 ${firstEntry[1]} 이에요 — ${version} 항목을 src/lib/docs/changelog.ts 맨 위에 먼저 적어 주세요(date: null)`);
}
const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(/-/g, '.');
step(`변경 이력 ${version} 발행일 → ${today}`);
writeFileSync(CHANGELOG, changelogRaw.replace(firstEntry[0], firstEntry[0].replace(/date:\s*(null|'[^']*')/, `date: '${today}'`)));

step(`package.json version → ${version}`);
const raw = readFileSync(PKG_JSON, 'utf8');
const bumped = raw.replace(/"version":\s*"[^"]+"/, `"version": "${version}"`);
if (bumped === raw) fail('package.json 의 version 줄을 못 찾았어요');
writeFileSync(PKG_JSON, bumped);

/* 3) 체인 */
step(`빌드·재생성 (${CHAIN.join(' → ')})`);
if (!existsSync(join(PDS, 'node_modules'))) must(run('npm', ['install', '--no-audit', '--no-fund'], { cwd: PDS, inherit: true }), 'PDS npm install 실패');
for (const s of CHAIN) must(run('npm', ['run', s], { cwd: PDS, inherit: true }), `npm run ${s} 실패`);

/* 4) 검증 */
step('검증');
const checks = [
  [existsSync(join(PKG_DIR, 'dist/index.js')), 'dist/index.js 존재'],
  [readFileSync(join(PKG_DIR, 'dist/tokens.css'), 'utf8').split('\n')[0].includes(` ${version} `), `dist/tokens.css 헤더 = ${version}`],
  [new RegExp(`^version: ${version.replace(/\./g, '\\.')}$`, 'm').test(readFileSync(MD, 'utf8')), `pds.md frontmatter version = ${version}`],
  [readFileSync(SKILL_MD, 'utf8').includes(`pds@${version}`), `SKILL.md 헤더 = ${version}`],
  [new RegExp(`version:\\s*'${version.replace(/\./g, '\\.')}',\\s*date:\\s*'${today.replace(/\./g, '\\.')}'`).test(readFileSync(CHANGELOG, 'utf8')), `changelog.ts ${version} 발행일 = ${today}`],
];
const pack = run('npm', ['pack', '--dry-run', '--json'], { cwd: PKG_DIR });
let files = [];
try {
  files = JSON.parse(pack.stdout)[0].files.map((f) => f.path);
} catch {
  fail('npm pack --dry-run 결과를 못 읽었어요');
}
for (const f of ['dist/index.js', 'dist/tokens.css', 'LICENSE', 'README.md', 'package.json']) checks.push([files.includes(f), `tarball 에 ${f}`]);
checks.push([files.length >= 50, `tarball 파일 수 ${files.length} (≥50)`]);
checks.push([!files.some((f) => f.startsWith('src/')), 'tarball 에 src/ 없음']);
let bad = 0;
for (const [ok, label] of checks) {
  console.log(`  ${ok ? '✓' : '✗'} ${label}`);
  if (!ok) bad++;
}
if (bad) fail(`검증 ${bad}건 실패 — 커밋하지 않았어요(package.json·재생성 파일은 워킹트리에 남아 있어요)`);

// PAX 반영 안내 — 관리자 재업로드는 없다. 발행 후 PAX 가 npm latest 를 보고 미러 태그의 pds.md 를
// 공식 pds 발행본에 반영한다(src/lib/design/officialSync.ts).
// (예전엔 "재업로드 필요/불필요" 를 여기서 판정했는데, 이 릴리스 단계의 diff 만 봐서 앞선 커밋에 이미 들어간
//  문서 변경을 놓쳤다 — 1.1.0 Loading 이 "불필요" 로 안내된 사고. 판정 자체를 없앴다.)
const paxSync = '발행 후 자동 반영(관리자 재업로드 불필요)';

if (dryRun) {
  step('dry-run — 변경 되돌림');
  must(git(['checkout', '--', 'PDS']), 'git checkout 실패');
  must(run('npm', ['run', 'pds:build'], { cwd: PDS }), 'dist 복원 빌드 실패');
  console.log(`  ok — 실제 실행이면 커밋. PAX pds.md: ${paxSync}`);
  process.exit(0);
}

/* 5) 커밋 */
step('커밋');
must(git(['add', '--', 'PDS']), 'git add 실패');
const staged = must(git(['diff', '--cached', '--name-only']), 'git diff 실패').stdout.trim();
console.log(staged.split('\n').map((l) => `  + ${l}`).join('\n'));
const msg = [
  `chore(pds-react): ${version} 발행 준비 — package.json bump + 변경 이력 발행일 + pds.md·SKILL 재생성`,
  '',
  '릴리스 스크립트(PDS/scripts/release-pds.mjs)가 develop 최신 포함·미머지 소스 없음을 검사하고 생성했다.',
  `PAX pds.md: ${paxSync}.`,
].join('\n');
must(git(['commit', '-q', '-m', msg]), 'git commit 실패');

step('다음 할 일');
console.log(`  1. 푸시:  git push   → develop 대상 PR → 리뷰·머지
  2. 발행:  자동 — 머지 후 미러 동기화(수 분) → 미러 Actions 'npm publish' 가 ${version} 발행 + 태그
            확인: https://github.com/PolarisOffice/PolarisDesignSystem/actions · npm view ${PKG_NAME} version
  3. PAX 반영: ${paxSync}
            (공식 pds 를 발행해 둔 회사만 — 다음 디자인 조회 때, npm 조회 캐시로 최대 약 10분)`);
