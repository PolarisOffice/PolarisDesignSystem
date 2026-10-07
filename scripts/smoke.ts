/**
 * 자가 점검 — 코어 사본이 examples/DESIGN.md(aurora 샘플)를 파싱·검증·resolve·생성까지 통과하는지 확인.
 * 실행: npm run smoke (tsx). 실패 시 exit 1.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  prepareDesignUpload,
  resolveFromList,
  buildTokensCss,
  buildGuideMarkdown,
  buildSkillBundle,
  skillBundleName,
  parsedToItems,
} from '../src/lib/design/designGenerators';
import { INJECTION_PATTERNS, SANDBOX_FENCE_MARKER } from '../src/lib/design/designSecurityPatterns';
import { lintDesignSystem, contrastRatio } from '../src/lib/design/designLint';

let failures = 0;
function check(name: string, ok: boolean, detail?: string) {
  if (ok) {
    console.log(`  ✓ ${name}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('[PDS smoke]');

const raw = readFileSync(join(process.cwd(), 'examples', 'DESIGN.md'), 'utf8');
const prep = prepareDesignUpload(raw);
check('examples/DESIGN.md 파싱·검증 통과', prep.ok, prep.ok ? undefined : JSON.stringify(prep.issues));

if (prep.ok) {
  const meta = {
    id: prep.parsed.name,
    name: prep.parsed.name,
    title: prep.parsed.title,
    description: prep.parsed.description,
    version: prep.parsed.version,
    status: 'published' as const,
    contentHash: prep.contentHash,
    publishedAt: null,
    updatedAt: null,
  };

  check('컴포넌트 3개 파싱', prep.parsed.components.length === 3, `실제 ${prep.parsed.components.length}`);
  check('호환 노트 0건 (네이티브 형식)', prep.compatNotes.length === 0);

  const single = resolveFromList([meta]);
  check('resolve: 1개 → 자동 선택', single.ok && single.system.name === meta.name);
  const none = resolveFromList([]);
  check('resolve: 0개 → not_found', !none.ok && none.reason === 'not_found');
  const multi = resolveFromList([meta, { ...meta, name: 'other', id: 'other' }]);
  check('resolve: 2개 → multiple', !multi.ok && multi.reason === 'multiple');
  const named = resolveFromList([meta, { ...meta, name: 'other', id: 'other' }], meta.name);
  check('resolve: 이름 지정 조회', named.ok);

  const css = buildTokensCss(prep.parsed.tokens, prep.parsed.themes);
  check('토큰 CSS 에 --color-primary', css.includes('--color-primary:'));
  // 다크 셀렉터는 data-theme 속성 — designGenerators buildTokensCss 주석 참조(구 .dark 클래스 단언이 develop 에서 계속 실패하고 있었다)
  check('토큰 CSS 에 [data-theme="dark"] 오버라이드', css.includes('[data-theme="dark"] {'));

  const items = parsedToItems(prep.parsed);
  const guide = buildGuideMarkdown(meta, { tokens: prep.parsed.tokens, themes: prep.parsed.themes, overviewMd: prep.parsed.overviewMd }, items);
  check('가이드 마크다운 생성 (컴포넌트 섹션 포함)', guide.includes('## 컴포넌트') && guide.includes('### Button'));

  // ── 스킬 번들 (zip 산출물의 순수 부분) ──
  const foundation = { tokens: prep.parsed.tokens, themes: prep.parsed.themes, overviewMd: prep.parsed.overviewMd };
  const bundle = buildSkillBundle(meta, foundation, items);
  check('스킬 번들: frontmatter name = aurora-design', bundle.skillMd.startsWith(`---\nname: ${skillBundleName(meta.name)}\n`) && skillBundleName(meta.name) === 'aurora-design');
  check('스킬 번들: 토큰 CSS 인라인 (--color-primary)', bundle.skillMd.includes('--color-primary:'));
  check('스킬 번들: 카탈로그에 Button 참조 파일', bundle.skillMd.includes('references/button.md'));
  check('스킬 번들: 참조 4개 (컴포넌트 3 + 리소스 1)', bundle.references.length === 4, `실제 ${bundle.references.length}`);
  check('스킬 번들: 목록 모드 아님', !bundle.listOnly);
  check('스킬 번들: 컴포넌트 참조에 provenance 헤더', bundle.references.find((r) => r.filename === 'button.md')?.content.includes('// @design-system aurora@') === true);
  // 생성기 고정 텍스트가 인젝션 패턴·펜스 마커를 밟지 않는지 (aurora 콘텐츠는 클린이라 실패=생성기 텍스트 결함)
  const allTexts = [bundle.skillMd, ...bundle.references.map((r) => r.content)];
  check(
    '스킬 번들: 인젝션 패턴·샌드박스 마커 0건',
    !allTexts.some((t) => INJECTION_PATTERNS.some((p) => p.test(t)) || t.includes(SANDBOX_FENCE_MARKER)),
  );

  // ── 품질 린트 (자체 결정적 진단 — advisory) ──
  const cleanFindings = lintDesignSystem(prep.parsed);
  check('린트: aurora 는 진단 0건 (클린 fixture)', cleanFindings.length === 0, JSON.stringify(cleanFindings));
  check('린트: 결정성 (2회 실행 동일)', JSON.stringify(cleanFindings) === JSON.stringify(lintDesignSystem(prep.parsed)));
  check('린트: 대비율 함수 (검정/흰색 = 21:1)', contrastRatio('#000000', '#FFFFFF') === 21);

  // 합성 결함 fixture — primary 없음 + 저대비 + 다크 짝 깨짐 + 카테고리 오타 + hex 하드코딩
  const badParsed = {
    ...prep.parsed,
    tokens: {
      color: { surface: '#FFFFFF', text: '#CCCCCC', special: '#FF0000' }, // accent 는 이제 primary 계열 취급 — 중립 키로
      colour: { extra: '#00FF00' },
    },
    themes: { dark: { color: { surface: '#0B1120' } } },
    components: [
      {
        ...prep.parsed.components[0],
        name: 'hardcoded',
        title: 'Hardcoded',
        code: 'const s = { a: "#111111", b: "#222222", c: "#333333" };',
      },
    ],
  };
  const badFindings = lintDesignSystem(badParsed);
  const rules = badFindings.map((f) => f.rule);
  check('린트: missing-primary 발화', rules.includes('missing-primary'));
  check('린트: low-contrast 발화 (#CCC on #FFF)', rules.includes('low-contrast'));
  check('린트: dark-pair-gap 발화 (surface 만)', rules.includes('dark-pair-gap'));
  check('린트: category-convention 발화 (colour→color)', rules.includes('category-convention'));
  check('린트: hardcoded-colors 발화 (hex 3+·var 0)', rules.includes('hardcoded-colors'));
}

if (failures > 0) {
  console.error(`\n${failures}건 실패`);
  process.exit(1);
}
console.log('\n모든 점검 통과');
