/**
 * PDS DESIGN.md 생성 — 문서 사이트 + tokens.css → `designs/pds.md`.
 *
 * **왜 생성하는가**
 * PAX 웹채팅·MCP·스킬 번들은 DB 를 읽고, DB 에 넣는 입구는 DESIGN.md 업로드
 * 하나뿐이다. 그래서 PDS 도 md 가 필요하다 — 다만 그 안에 들어갈 내용(토큰·
 * 용도·사용 예제)이 이미 tokens.css 와 문서 사이트에 전부 있다. 손으로 쓰면
 * **네 번째 손관리 사본**이 생기고, 컴포넌트를 고칠 때마다 여기까지 같이
 * 고쳐야 한다. 그래서 뽑아 쓴다.
 *
 * **무엇을 넣지 않는가**
 * 컴포넌트 구현. PDS 는 npm 패키지로 제공되므로 `#### Code` 는 저장할 파일이
 * 아니라 **사용 예제**다. 예제의 import 문이 외부 패키지를 가리키므로
 * `componentDelivery` 가 이걸 보고 `install` 로 자동 판정한다 — md 어디에도
 * "패키지 방식"이라고 선언하지 않는다.
 *
 * **추출 방법**
 * `*.code.tsx` 의 `code:` 필드는 `${SIZES.map(...)}` 같은 실제 JS 식을 담고
 * 있어 문자열 파싱으로는 못 읽는다. esbuild 로 번들해 **평가**한다. JSX 와
 * CSS 모듈은 스텁으로 대체 — 우리가 필요한 건 문자열 필드뿐이고 렌더는 안 한다.
 *
 * 실행: node PDS/scripts/generate-pds-design-md.mjs [--check]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'src/app/(docs)/components');
const TOKENS_CSS = join(ROOT, 'packages/pds-react/tokens.css');
const check = process.argv.includes('--check');

/** md 의 `name:` — PAX 등록표(`PDS_SYSTEM_NAME`)와 반드시 일치해야 한다 */
const SYSTEM_NAME = 'pds';
const SYSTEM_TITLE = 'Polaris Design System';
const PACKAGE = '@polarisoffice/pds-react';
/** md 의 version 은 패키지 버전과 같이 간다 — 리터럴로 두면 패키지 bump 때 어긋난다 */
const PACKAGE_VERSION = JSON.parse(readFileSync(join(ROOT, 'packages/pds-react/package.json'), 'utf8')).version;

/**
 * 산출 위치 — 킷 저장소(`designs/`)에 직접 낸다. 파일명은 저장소 규약대로
 * `{name}.md` 여야 한다.
 *
 * 2026-08-26 결정: 손으로 쓴 polaris-extended.md 를 이 생성본이 대체한다.
 * 근거는 실측이다 — 수기본은 실존하지 않는 export(Input·ContextMenu)와 옛
 * prop 을 들고 있었다. 컴포넌트 API 를 바꿔도 md 가 따라오지 않아서다.
 * 생성본의 원천은 킷 빌드에 포함되는 `*.code.tsx` 라 같은 어긋남이 구조적으로
 * 불가능하다.
 *
 * 커밋되는 생성물이다(.gitignore 에 예외 등재) — 킷을 받은 사람이 업로드 없이
 * 바로 가이드를 볼 수 있어야 하기 때문이다. PAX 관리자에는 이 파일을 올린다.
 */
const OUT_DIR = join(ROOT, 'designs');
const OUT_MD = join(OUT_DIR, `${SYSTEM_NAME}.md`);

/* ────────────────────────────────────────────────────────────
 * 1. 토큰 — tokens.css 의 semantic 계층을 frontmatter 로
 * ──────────────────────────────────────────────────────────── */

/**
 * frontmatter 는 카테고리별 평탄 맵이다(`colors: { accent-normal: "#1d7ff9" }`).
 * primitive 는 제외하고 semantic 만 — 소비 앱이 쓰는 것은 semantic 이며,
 * 값은 alias 를 끝까지 따라가 얻은 실제 값을 적는다.
 */
function readTokens() {
  const css = readFileSync(TOKENS_CSS, 'utf8');
  /*
   * 라이트는 `tokens:`, 다크는 `themes.dark` 로 따로 낸다. 프로토콜의 themes.dark 는
   * "라이트 토큰의 오버라이드만" 받는데, tokens.css 의 [data-theme="dark"] 블록이 정확히
   * 그 모양(재정의된 것만)이다. 예전엔 다크 블록을 통째로 버리고 라이트만 실었다 —
   * 그러면 md 를 소비하는 쪽(PAX 웹채팅·MCP·스킬 zip)에는 다크 값이 하나도 안 가서,
   * 패키지는 다크를 지원하는데 그걸로 만든 앱은 다크가 안 되는 상태였다.
   */
  const darkBlocks = [...css.matchAll(/\[data-theme="dark"\][^{]*\{([\s\S]*?)\n\}/g)].map((m) => m[1]);
  const lightOnly = css.replace(/\[data-theme="dark"\][^{]*\{[\s\S]*?\n\}/g, '');
  const raw = new Map();
  for (const m of lightOnly.matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gm)) {
    if (!raw.has(m[1])) raw.set(m[1], m[2].trim());
  }
  // 다크는 라이트를 덮어쓰는 층이다 — var() 해석은 다크 값 → 없으면 라이트(primitive 포함)
  const darkRaw = new Map();
  for (const block of darkBlocks) {
    for (const m of block.matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gm)) darkRaw.set(m[1], m[2].trim());
  }
  const resolveIn = (map, fallback) => {
    const fn = (name, depth = 0) => {
      if (depth > 12) return null;
      const v = map.get(name) ?? fallback?.get(name);
      if (v === undefined) return null;
      const ref = v.match(/^var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^)]+))?\)$/);
      if (!ref) return v;
      return fn(ref[1], depth + 1) ?? (ref[2]?.trim() ?? null);
    };
    return fn;
  };
  const resolve = resolveIn(raw);
  const resolveDark = resolveIn(darkRaw, raw);

  /*
   * 카테고리명은 **CSS 변수 접두어가 그대로 된다** — `buildTokensCss` 와
   * `DesignGuideView.tokenVars` 가 `--{category}-{key}` 로 만든다.
   * 그래서 tokens.css 의 접두어와 1:1 이어야 한다: `colors`(복수)로 쓰면
   * `--colors-accent-normal` 이 되어 컴포넌트의 `--color-accent-normal`
   * 조회가 전부 빗나가고, 폴백 hex 로 그려져 "토큰을 쓴다" 는 전제가 깨진다.
   * (`{colors.x}` 참조 문법과 헷갈리기 쉬운 지점 — aurora.md 도 `color:` 다)
   */
  const MAP = [
    ['color', 'color'],
    ['typography', 'typography'],
    ['spacing', 'spacing'],
    ['radius', 'radius'],
    ['shadow', 'shadow'],
    ['duration', 'duration'],
    ['ease', 'ease'],
  ];
  // 컴포넌트가 직접 참조하는 primitive 는 실어야 한다 — Button 의 sub variant 가
  // po-blue-10/20 을 쓴다(대응 semantic 토큰이 아직 없다). 나머지 primitive 는
  // semantic 이 가리키는 원재료라 md 에 넣지 않는다.
  const usedPrimitives = new Set();
  const scan = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) scan(full);
      else if (/\.tsx?$/.test(e.name)) {
        for (const m of readFileSync(full, 'utf8').matchAll(/var\((--primitive-[a-z0-9-]+)/g)) usedPrimitives.add(m[1]);
      }
    }
  };
  scan(join(ROOT, 'packages/pds-react/src'));

  const out = {};
  for (const name of raw.keys()) {
    if (name.startsWith('--primitive-')) {
      if (!usedPrimitives.has(name)) continue;
      const value = resolve(name);
      if (value !== null) (out.primitive ??= {})[name.slice('--primitive-'.length)] = value;
      continue;
    }
    const hit = MAP.find(([, prefix]) => name.startsWith(`--${prefix}-`));
    if (!hit) continue;
    const [category, prefix] = hit;
    const value = resolve(name);
    if (value === null) continue;
    (out[category] ??= {})[name.slice(prefix.length + 3)] = value;
  }

  // 다크 오버라이드 — 라이트에 실린 토큰 중 다크 블록이 재정의한 것만, 값이 실제로 다를 때만.
  // (같은 값이면 오버라이드가 아니다 — 프로토콜 규칙: "다크 값이 없는 토큰은 라이트 값 유지")
  const dark = {};
  for (const name of darkRaw.keys()) {
    const hit = MAP.find(([, prefix]) => name.startsWith(`--${prefix}-`));
    if (!hit) continue;
    const [category, prefix] = hit;
    const key = name.slice(prefix.length + 3);
    if (!out[category]?.[key]) continue;
    const dv = resolveDark(name);
    if (dv === null || dv === out[category][key]) continue;
    (dark[category] ??= {})[key] = dv;
  }
  return { tokens: out, themes: Object.keys(dark).length ? { dark } : {} };
}

/* ────────────────────────────────────────────────────────────
 * 2. 컴포넌트 — 문서 사이트에서 제목·용도·예제 추출
 * ──────────────────────────────────────────────────────────── */

/**
 * 스텁 모듈이 내보내야 할 이름 — 소스의 import 문에서 수집한다.
 * (esbuild 는 번들 시 named export 존재를 검사하므로 Proxy 만으로는 부족)
 */
const stubNames = new Map();
const STUB_RE = /^(@polarisoffice\/pds-react|@\/components\/docs\/|react$|react-dom$|react\/)/;
function collectStubNames(file) {
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+'([^']+)'/g)) {
    if (!STUB_RE.test(m[2])) continue;
    const set = stubNames.get(m[2]) ?? new Set();
    for (const part of m[1].split(',')) {
      const name = part.replace(/\btype\b/, '').split(/\s+as\s+/).pop().trim();
      if (/^[A-Za-z_$][\w$]*$/.test(name)) set.add(name);
    }
    stubNames.set(m[2], set);
  }
}

/** 렌더는 하지 않는다 — 문자열 필드만 필요하므로 JSX·CSS 를 스텁으로 대체 */
const stubPlugin = {
  name: 'pds-md-stub',
  setup(b) {
    // CSS 모듈 — 클래스명 아무거나 돌려주는 Proxy
    b.onResolve({ filter: /\.css$/ }, (a) => ({ path: a.path, namespace: 'stub-css' }));
    b.onLoad({ filter: /.*/, namespace: 'stub-css' }, () => ({
      contents: 'export default new Proxy({}, { get: (_, k) => String(k) });',
      loader: 'js',
    }));
    // 패키지·문서 컴포넌트 — 이름만 있으면 되는 자리
    b.onResolve({ filter: /^(@polarisoffice\/pds-react|@\/components\/docs\/|react$|react-dom$|react\/)/ }, (a) => ({
      path: a.path,
      namespace: 'stub-mod',
    }));
    // esbuild 는 정적 named import 를 검사하므로 Proxy 로는 안 된다 —
    // 소스에서 실제로 가져다 쓰는 이름을 읽어 그 이름들만 내보낸다.
    b.onLoad({ filter: /.*/, namespace: 'stub-mod' }, (a) => {
      // 소스에서 수집한 이름 + JSX 런타임이 자동 주입하는 이름
      const names = new Set([...(stubNames.get(a.path) ?? []), 'jsx', 'jsxs', 'jsxDEV', 'Fragment', 'createElement']);
      const decls = [...names].map((n) => `export const ${n} = h;`).join('\n');
      return {
        contents:
          'const h = new Proxy(function () {}, { get: () => h, apply: () => h });\n' +
          `export default h;\n${decls}\n`,
        loader: 'js',
      };
    });
    // 그 밖의 `@/` 별칭은 실제 파일로 — 확장자·index 를 직접 붙여 본다
    b.onResolve({ filter: /^@\// }, (a) => {
      const base = join(ROOT, 'src', a.path.slice(2));
      for (const cand of [base, `${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')]) {
        if (existsSync(cand) && !cand.endsWith('/')) {
          const st = statSync(cand);
          if (st.isFile()) return { path: cand };
        }
      }
      return { path: base };
    });
  },
};

/**
 * `*.data.ts` 의 변형·사이즈 표 → frontmatter `components:` 스펙 맵.
 *
 * 가이드는 이 맵으로 Variant/Size 축을 만들고 각 축마다 타일을 그린다. 맵이
 * 없으면 축이 없어 AI 문서의 추론에 의존하게 되고, 실제로 Button primary 가
 * 검정으로 그려졌다(값이 아니라 이름만 보고 고른 결과).
 *
 * 데이터 파일 구조가 컴포넌트마다 다르므로 **모양으로 판별**한다 —
 * `{ name, bg, fg }` 를 가진 배열은 변형, `{ size, height }` 는 사이즈.
 * 해당 모양이 없는 컴포넌트는 스펙을 안 내고 건너뛴다(추론 대신 공백).
 */
async function loadSpecEntries(slug) {
  const dir = join(DOCS, slug);
  const dataFile = join(dir, `${slug}.data.ts`);
  if (!existsSync(dataFile)) return {};
  for (const g of readdirSync(dir)) if (/\.tsx?$/.test(g)) collectStubNames(join(dir, g));
  let mod;
  try {
    const res = await build({
      entryPoints: [dataFile], bundle: true, write: false, format: 'esm', platform: 'node',
      tsconfigRaw: { compilerOptions: { jsx: 'preserve' } },
      jsx: 'transform', jsxFactory: '__jsx', jsxFragment: '__jsxFrag',
      banner: { js: 'const __jsx = () => null; const __jsxFrag = null;' },
      plugins: [stubPlugin], logLevel: 'silent',
    });
    mod = await import(`data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString('base64')}`);
  } catch {
    return {};
  }
  const arrays = Object.values(mod).filter((v) => Array.isArray(v) && v.length);
  const variants = arrays.filter((a) => a.every((x) => x && typeof x === 'object' && 'name' in x && 'bg' in x)).flat();
  const sizes = arrays.filter((a) => a.every((x) => x && typeof x === 'object' && 'size' in x && 'height' in x)).flat();
  if (!variants.length) return {};

  const px = (v) => (typeof v === 'number' ? `${v}px` : String(v ?? ''));
  const out = {};
  // 사이즈가 있으면 변형 × 대표 사이즈, 없으면 변형만
  const sizeList = sizes.length ? sizes.filter((s) => [48, 32, 24].includes(Number(s.size))) : [null];
  for (const v of variants) {
    for (const sz of sizeList.length ? sizeList : [null]) {
      const key = sz ? `${slug}-${v.name}${sz.size}` : `${slug}-${v.name}`;
      const e = { backgroundColor: v.bg ?? 'transparent', textColor: v.fg ?? '' };
      if (v.border) e.borderColor = v.border;
      if (sz) {
        e.height = px(sz.height);
        e.rounded = px(sz.radius);
        if (sz.padX != null) e.padding = `0 ${px(sz.padX)}`;
      }
      out[key] = e;
    }
  }
  return out;
}

/** 컴포넌트 페이지의 `.data.ts` 모듈 — 스펙(색·치수)과 산문 둘 다 여기서 나온다 */
async function loadComponentData(slug) {
  const dir = join(DOCS, slug);
  const dataFile = join(dir, `${slug}.data.ts`);
  if (!existsSync(dataFile)) return null;
  for (const g of readdirSync(dir)) if (/\.tsx?$/.test(g)) collectStubNames(join(dir, g));
  try {
    const res = await build({
      entryPoints: [dataFile], bundle: true, write: false, format: 'esm', platform: 'node',
      tsconfigRaw: { compilerOptions: { jsx: 'preserve' } },
      jsx: 'transform', jsxFactory: '__jsx', jsxFragment: '__jsxFrag',
      banner: { js: 'const __jsx = () => null; const __jsxFrag = null;' },
      plugins: [stubPlugin], logLevel: 'silent',
    });
    return await import(`data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString('base64')}`);
  } catch {
    return null;
  }
}

async function loadExamples(slug) {
  const dir = join(DOCS, slug);
  const entry = join(dir, `${slug}.code.tsx`);
  if (!existsSync(entry)) return null;
  for (const g of readdirSync(dir)) if (/\.tsx?$/.test(g)) collectStubNames(join(dir, g));
  const res = await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    // JSX 는 값을 만들지 않는 스텁 팩토리로 — preview 필드는 읽지 않는다
    tsconfigRaw: { compilerOptions: { jsx: 'preserve' } },
    jsx: 'transform',
    jsxFactory: '__jsx',
    jsxFragment: '__jsxFrag',
    banner: { js: 'const __jsx = () => null; const __jsxFrag = null;' },
    plugins: [stubPlugin],
    logLevel: 'silent',
  });
  const code = res.outputFiles[0].text;
  const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  return mod.EXAMPLES ?? null;
}

/**
 * 파운데이션·브랜드 페이지의 `*.data.ts` 를 평가해 export 를 돌려준다.
 * 컴포넌트 예제와 같은 esbuild 경로를 쓴다 — 데이터 파일은 순수 상수뿐이라 스텁도 필요 없다.
 */
async function loadData(relPath) {
  const entry = join(ROOT, 'src/app/(docs)', relPath);
  if (!existsSync(entry)) return null;
  const res = await build({ entryPoints: [entry], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
  return import(`data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString('base64')}`);
}

/** 마크다운 표 — 셀 안 `|` 는 이스케이프 */
const mdTable = (headers, rows) => {
  const esc = (v) => String(v ?? '').replace(/\|/g, '\\|');
  return [
    `| ${headers.map(esc).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${r.map(esc).join(' | ')} |`),
  ].join('\n');
};

/**
 * 파운데이션·브랜드 참조 문서 — `## Resources` 아래 `### 영문 제목` 으로 들어간다.
 *
 * 왜 여기인가: 토큰(frontmatter)으로 표현되지 않는 규칙들이다 — 브레이크포인트, 아이콘
 * 규격, 서체 위계, 브랜드 색 용도, 로고 사용 규칙. 프로토콜이 `## Resources` 를 정확히
 * 이 용도("컴포넌트 외 참조 문서 — 레이아웃 규칙·페이지 패턴 등")로 정의한다.
 * 원천은 문서 사이트의 `*.data.ts` — 사이트가 렌더하는 바로 그 배열이라 어긋날 수 없다.
 */
/**
 * 시스템 수준 설계 규칙 — 페이지를 **조합**할 때 지켜야 할 것. 컴포넌트 단위 usage 와 다르다.
 *
 * 왜 필요한가(2026-08-26 실측): 토큰·컴포넌트만 주고 "조합은 자유" 로 두면 AI 가 규칙 안에서
 * 자기 취향대로 꾸민다 — 이중 그라데이션 배경, AI 전용 보라를 일반 배경에 섞기, color-mix 로 색
 * 발명, 패키지 컴포넌트가 "약해 보인다" 며 자체 CSS 로 덮어씌우기. 전부 토큰은 썼으니 규칙
 * 위반은 아니었다. 이 문서가 그 빈틈을 메운다. 코드 원천이 없는 산문이라 여기 상수로 둔다.
 *
 * 2026-08-28 축소: 디자이너 문서(파운데이션·컴포넌트 페이지)에 근거가 있는 규칙과, 코드가 동작하기 위한
 * 구현 규칙만 남겼다. 실측 사고에서 역산해 넣었던 심미 규칙(배경 단색·그라데이션 금지·강조 한 곳·
 * 페이지 안 카드 그림자 금지·문서형 한 열·empty/loading/error 동반·셀프 체크)은 뺐다 — 그중 "카드
 * 그림자 금지"는 elevation 문서("카드부터는 그림자를 더해 위계를 세운다")와 반대였다. 없이 생성해
 * 품질을 비교한 뒤, 필요한 것만 디자이너 확인을 거쳐 문서 사이트 쪽 데이터로 되돌린다(후속 PR).
 */
const PRINCIPLES = `### Principles

**페이지를 조합할 때 지키는 규칙.** 컴포넌트 하나하나의 용도는 각 컴포넌트 문서에 있고, 여기는 그것들을 한 화면에 놓는 법이다. UI 작업 전에 반드시 읽는다. 앞부분은 디자이너 지침(문서 사이트의 파운데이션·컴포넌트 문서) 요약이고, 마지막 절은 코드가 동작하기 위한 구현 규칙이다.

#### 색 — 역할 토큰으로

- 색은 semantic 역할 토큰(\`accent-*\`·\`label-*\`·\`fill-*\`·\`line-*\`·\`state-*\`)으로 지정한다. \`primitive-*\` 는 semantic 이 참조하는 팔레트라 페이지 코드에서 직접 쓰지 않는다.
- \`accent\` 는 브랜드·강조 색이다 — 텍스트와 배경 양쪽에 쓴다.
- \`ai-*\`(보라)와 Button 의 \`ai\` variant 는 **AI 기능 진입·실행 전용**이다.

#### 깊이 — 배경 레이어링과 보더 먼저

- 깊이감은 그림자보다 배경색 레이어링(\`layer-*\`)과 보더(\`line-neutral\`)로 먼저 표현한다. 정적 콘텐츠는 배경색과 보더로 영역을 잡고, 카드부터는 그림자를 더해 위계를 세운다.
- 그림자는 Elevation 티어(\`shadow-sm/md/lg/xl\`) 중 하나를 그대로 쓴다 — 값을 새로 만들지 않는다. 떠 있는 요소(드롭다운·모달·토스트)일수록 강한 티어.

#### 간격과 타이포

- 간격은 4px 기본 단위의 \`spacing-*\` 스케일 값만 쓴다(0~64px, 미세 조정용 \`spacing-4xs\` 2px 예외).
- 서체는 Pretendard. 본문은 \`typography-body1\`(16px/150%), 굵기는 400·500·700 세 단계.

#### 버튼 — 위계와 짝

- \`primary\` 는 화면 내 가장 중요한 **단일** 액션. \`sub\` 는 Primary 와 쌍을 이루는 보조, \`gray\` 는 중립적인 보조, \`ghost\` 는 UI 밀도를 낮추고 싶을 때, \`black\` 은 다크 배경·강렬한 톤이 필요할 때.
- 조합: Primary+Sub(확인/더 알아보기) · Black+Gray(완료/닫기) · Ghost+Default(동의/취소) · Delete+Delete Ghost(삭제/취소).
- \`delete\` 는 되돌릴 수 없는 삭제 액션에만, 반드시 확인 팝업과 함께. \`deleteGhost\` 는 그 삭제의 보조 짝.

#### 오버레이

- Popup 은 사용자의 확인이나 선택이 필요한 중요한 상황에 — 화면을 차단하고 즉각적인 응답을 요구한다. Toast 는 사용자 액션의 결과를 간단하게 전달하는 일시적 알림.

#### 모션 — 기능적으로만

- 애니메이션은 상태 변환 확인과 주의 안내가 목적이며 지연·장식은 피한다. 인터랙티브 요소는 \`duration-fast\`(150ms), 모달·토스트 같은 오버레이는 \`duration-slow\`(350ms). 페이지 전환은 지연 없이 즉시. easing 은 ease-in-out(기본)·ease-out(등장)·ease-in(퇴장).
- Modal 등장 opacity 0→1 + translateY(8px→0) slow/ease-out, 퇴장 역방향 normal/ease-in.
- \`prefers-reduced-motion: reduce\` 면 모든 transform 애니메이션을 끄고 opacity 전환만 남긴다.

#### 구현 규칙 — 코드가 동작하기 위한 것

- \`@polarisoffice/pds-react\` 컴포넌트에 className·style 로 **색·크기·라운드·그림자를 덮어씌우지 않는다.** 배치(margin·grid 위치)만 바깥에서 준다. 컴포넌트가 "약해 보인다" 고 AI 스스로 느껴도 CSS 로 보강하지 않는다 — 그 모습이 의도된 PDS 다. 목록에 있는 컴포넌트를 비슷하게 다시 만들지 않는다.
- 예외는 **사용자가 특정 형상을 명시했을 때뿐**("버튼 더 둥글게", "이 버튼은 빨갛게"). 먼저 \`variant\`·\`size\` 옵션 안에서 맞추고, 옵션으로 안 되면 \`style\` prop 으로 **그 요청만** 적용한다(내부가 인라인 style 이라 className 은 안 먹는다). 그 줄에 주석 \`// PDS 이탈: 사용자 요청 — {내용}\` 을 남긴다 — 코드에만. 사용자에게 디자인 시스템·PDS 얘기는 하지 않는다.
- **이미 그 주석이 붙어 있는 스타일은 사용자의 결정이다.** 다른 수정을 하면서 "규칙 위반"이라고 지우거나 되돌리지 않는다 — 사용자가 그 부분을 바꾸라고 말할 때만 손댄다.
- 상태가 있는 컴포넌트(Tabs·SegmentControl·Select·Toggle·InputField)를 바깥 상태와 묶을 때는 **\`value\` + \`onChange\` 제어 모드**를 쓴다. \`key\` 를 바꿔 리마운트하지 않는다 — 전환 모션이 통째로 사라진다.
- 토큰을 \`--app-bg\` 같은 이름으로 **다시 감싸지 않는다** — \`var(--color-…)\` 를 직접 쓴다. 감싸면 다크 전환·재동기화가 그 층에서 끊긴다.
- 다크 모드는 \`<html data-theme="dark">\` 로만 켠다. **앱 코드에 다크 분기 CSS 를 쓰지 않는다** — \`[data-theme="dark"]\`·\`.dark\`·\`prefers-color-scheme\` 셀렉터 전부. 토큰이 테마에 따라 값을 바꾸므로 같은 \`var()\` 가 양쪽에서 맞는 색이 된다. 토큰 파일에 \`[data-theme="dark"]\` 블록이 없으면 다크를 손으로 만들지 말고 파운데이션을 다시 받아 파일을 덮어쓴다(첫 줄 hash 가 다르면 덮어쓰기).
- 토큰 CSS(\`styles/design-tokens.css\`)는 \`app/layout.tsx\` 최상단에서 **한 번** import 한다. 페이지마다 넣지 않는다 — 새 페이지가 빠지면 그 페이지는 토큰이 없어 여백·색·선이 전부 사라진다.
- 서버 컴포넌트 페이지(\`metadata\` export)에는 \`'use client'\`·\`useRouter\` 를 넣을 수 없다. 이동은 \`<Link href>\` 로 하고, 버튼 모양이 필요하면 그 부분만 클라이언트 컴포넌트로 분리해 \`Button\` + \`useRouter\` 를 쓴다. \`Button\` 을 \`<a>\` + CSS 로 흉내 내지 않는다.
`;

async function foundationResources() {
  const out = [PRINCIPLES];
  const grid = await loadData('foundation/grid/grid.data.ts');
  if (grid?.BREAKPOINTS) {
    out.push(
      '### Grid',
      '',
      '반응형 레이아웃의 컬럼·거터·마진 규칙. 뷰포트 너비로 단계를 고르고 그 단계의 값을 그대로 쓴다.',
      '',
      ...(grid.GRID_TERMS ?? []).map((t) => `- **${t.title}** — ${t.desc}`),
      '',
      '#### Breakpoints',
      '',
      mdTable(['단계', '뷰포트', '컬럼', '거터', '마진'], grid.BREAKPOINTS.map((b) => [b.token, b.viewport, b.columns, b.gutters, b.margins])),
      '',
    );
  }
  const icon = await loadData('foundation/iconography/iconography.data.ts');
  if (icon?.SIZE_VARIATIONS) {
    out.push(
      '### Iconography',
      '',
      '아이콘 크기 4단과 각 단의 선 굵기·안쪽 여백·라이브 영역. 컴포넌트 안에서는 이 규격 중 하나를 고른다(Button 18/24, Menu 18 등).',
      '',
      mdTable(['크기(px)', '선 굵기', '안쪽 여백', '라이브 영역', '외부 패딩(터치 영역)'], icon.SIZE_VARIATIONS.map((v) => [v.size, v.stroke, v.padding, v.liveArea, v.outerPadding])),
      '',
    );
  }
  const type = await loadData('brand/typeface/typeface.data.ts');
  if (type?.PRETENDARD_WEIGHTS) {
    out.push(
      '### Typeface',
      '',
      '제품 UI 서체는 **Pretendard** 하나다. 굵기로 위계를 만들고, 크기는 `typography` 토큰의 `font-size-*` 를 쓴다.',
      '',
      '#### Pretendard 굵기 위계',
      '',
      mdTable(['굵기', 'weight', '쓰는 곳'], type.PRETENDARD_WEIGHTS.map((w) => [w.label, w.weight, w.usage])),
      '',
      ...(type.BRAND_WEIGHTS
        ? [
            '#### 브랜드 서체 (로고·브랜드 자산 전용)',
            '',
            '제품 UI 에는 쓰지 않는다. 로고·브랜드 자산에만 쓴다.',
            '',
            mdTable(['굵기', 'weight', '영문', '국문'], type.BRAND_WEIGHTS.map((w) => [w.label, w.weight, w.en, w.ko])),
            '',
          ]
        : []),
    );
  }
  const colors = await loadData('brand/colors/colors.data.ts');
  if (colors?.PRODUCT_UI_CARDS) {
    const card = (c) => [c.name, c.hex, ...c.rows.filter((r) => r.label !== 'HEX').map((r) => `${r.label}: ${r.value}`)];
    out.push(
      '### Brand Colors',
      '',
      '브랜드 색의 정체와 용도. 실제 값은 `color` 토큰(`accent-normal` 등)을 쓰고, 이 표는 어떤 토큰이 어떤 브랜드 색인지 알려준다.',
      '',
      '#### 제품 UI',
      '',
      mdTable(['이름', 'HEX', '토큰 / 용도'], colors.PRODUCT_UI_CARDS.map((c) => { const r = card(c); return [r[0], r[1], r.slice(2).join(' · ')]; })),
      '',
      ...(colors.GROUP_BRAND_CARDS
        ? ['#### 그룹 브랜드', '', mdTable(['이름', 'HEX', '용도'], colors.GROUP_BRAND_CARDS.map((c) => { const r = card(c); return [r[0], r[1], r.slice(2).join(' · ')]; })), '']
        : []),
      ...(colors.SYSTEM_COLOR_CARDS
        ? ['#### 시스템 색', '', mdTable(['이름', 'HEX'], colors.SYSTEM_COLOR_CARDS.map((c) => [c.name, c.hex])), '']
        : []),
    );
  }
  const logo = await loadData('brand/logo/logo.data.ts');
  if (logo?.LOGO_VERSIONS) {
    out.push(
      '### Logo',
      '',
      '로고 사용 규칙. 로고 파일 자체는 문서 사이트 Foundation > Logo 에서 내려받는다. 앱 코드 안에서 로고를 다시 그리지 않는다.',
      '',
      '#### 버전별 사용 규칙',
      '',
      ...logo.LOGO_VERSIONS.map((v) => `- **${v.name}** (${v.rule}) — ${v.desc}${v.examples ? ` _${v.examples}_` : ''}`),
      '',
      ...(logo.LOGO_MEDIUMS
        ? ['#### 매체별 파일', '', mdTable(['매체', '색 공간', '용도', '예'], logo.LOGO_MEDIUMS.map((m) => [m.name, m.mode, m.purpose, m.examples])), '']
        : []),
      ...(logo.LOGO_DONTS
        ? ['#### 금지', '', ...logo.LOGO_DONTS.map((d) => `- ${d.label}`), '']
        : []),
    );
  }
  return out;
}

/** 페이지 메타(제목·한 줄 용도) — 순수 데이터 모듈이라 그대로 읽는다 */
async function loadPageMeta() {
  const res = await build({
    entryPoints: [join(ROOT, 'src/lib/docs/pages.ts')],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    plugins: [stubPlugin],
    logLevel: 'silent',
  });
  const mod = await import(
    `data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString('base64')}`
  );
  const list = mod.PAGES ?? mod.default ?? [];
  return new Map(list.filter((p) => p.path?.startsWith('/components/')).map((p) => [p.path.split('/').pop(), p]));
}

/* ────────────────────────────────────────────────────────────
 * 3. md 조립
 * ──────────────────────────────────────────────────────────── */

const yamlScalar = (v) => {
  const s = String(v);
  // CSS 값은 콜론·쉼표·괄호를 담으므로 항상 인용한다
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
};

function frontmatter({ tokens, themes }) {
  const lines = [
    '---',
    `name: ${SYSTEM_NAME}`,
    `title: ${yamlScalar(SYSTEM_TITLE)}`,
    `version: ${PACKAGE_VERSION}`,
    `description: ${yamlScalar('폴라리스오피스 제품군의 단일 디자인 기준. 컴포넌트 구현은 npm 패키지로 제공됩니다.')}`,
  ];
  // 정규형은 `tokens:` 아래에 카테고리를 둔다. 최상위에 두면 designCompat 이
  // 옮겨 주긴 하지만, 킷 파일 저장소(store.loadFile)는 compat 을 거치지 않고
  // 파서를 직접 부르므로 "tokens 는 필수" 로 거절된다 — 처음부터 정규형으로 낸다.
  lines.push('tokens:');
  for (const [cat, map] of Object.entries(tokens)) {
    lines.push(`  ${cat}:`);
    for (const [k, v] of Object.entries(map).sort(([a], [b]) => a.localeCompare(b))) {
      lines.push(`    ${k}: ${yamlScalar(v)}`);
    }
  }
  // themes.dark — 라이트 오버라이드만. 가이드는 이걸로 다크 팔레트를 그리고,
  // buildTokensCss 는 [data-theme="dark"] 블록으로 낸다.
  for (const [theme, cats] of Object.entries(themes ?? {})) {
    if (!lines.includes('themes:')) lines.push('themes:');
    lines.push(`  ${theme}:`);
    for (const [cat, map] of Object.entries(cats)) {
      lines.push(`    ${cat}:`);
      for (const [k, v] of Object.entries(map).sort(([a], [b]) => a.localeCompare(b))) {
        lines.push(`      ${k}: ${yamlScalar(v)}`);
      }
    }
  }
  lines.push('---');
  return lines.join('\n');
}

const OVERVIEW = `
${SYSTEM_TITLE}(PDS)는 폴라리스오피스 제품군의 단일 디자인 기준입니다.

**컴포넌트 구현은 npm 패키지 \`${PACKAGE}\` 로 제공됩니다.** 아래 각 컴포넌트의 코드는
저장할 파일이 아니라 **사용 예제**입니다 — 패키지를 설치해 import 해서 쓰고, 구현을
복사하거나 다시 만들지 않습니다.

색·간격·라운드는 하드코딩하지 않고 토큰 CSS 의 \`var(--…)\` 변수만 사용합니다.

> 이 문서는 자동 생성됩니다 — \`PDS/scripts/generate-pds-design-md.mjs\`.
> 내용을 고치려면 정본(\`packages/pds-react/tokens.css\`, 문서 사이트 페이지)을 고치고
> 다시 생성하세요.
`.trim();

/**
 * H3 제목이 곧 컴포넌트 이름(슬러그)이 된다 — 파서가 제목을 슬러그화한다.
 * 그래서 제목을 자유롭게 쓰면 안 된다: 셸의 실물 등록표(liveComponents)와
 * 킷 문서 사이트 폴더명이 이미 슬러그 기준이라, 어긋나면 실물 렌더가
 * 조용히 꺼진다(실제로 12개 중 7개가 어긋났다 — "Input Field" → input-field
 * vs 등록표 input).
 *
 * 슬러그를 H3 제목으로 쓰고, 사람이 읽는 제목은 본문 첫 줄에 둔다.
 */
// 슬러그는 packages/pds-react/src/components 폴더명과 같아야 한다 — 스킬 생성기가 폴더명으로 소스를 매칭한다(2026-09-01 통일).
const SLUG_TITLE = {
  'context-menu': 'menu',
  'segment-control': 'segment',
  tabs: 'tab',
  input: 'input',
};

/*
 * Props 표는 md 에 싣지 않는다(2026-08-27 결정). 명세의 정본은 npm 에 발행된 패키지의 .d.ts 이고,
 * 웹 도구(get_design_component)가 install 배달 시 unpkg 에서 그 원문을 붙인다 — md 에 베끼면
 * 사본이 하나 더 생겨 드리프트의 원천이 된다. md 는 디자인 의도(용도·조합 규칙)만 담는다.
 */
/**
 * 문서 사이트 `.data.ts` 의 산문을 `#### Usage` 감으로 뽑는다.
 *
 * 사이트는 변형 하나하나에 용도(usage)를, 컴포넌트마다 Do/Don't·가이드라인·위계
 * 설명을 갖고 있는데, 예전 생성기는 색·치수만 읽고 이 산문을 버렸다. 그 결과 md 에
 * "Delete 는 되돌릴 수 없는 삭제에" 같은 판단 근거가 없어 AI 가 변형을 고를
 * 근거를 잃었다. 데이터가 다섯 형태뿐이라 이름이 아니라 **모양**으로 판별한다 —
 * 컴포넌트를 추가해도 같은 모양이면 자동으로 따라온다.
 */
function proseFromData(mod) {
  if (!mod) return [];
  const out = [];
  const isStr = (v) => typeof v === 'string' && v.trim();
  const arrays = Object.entries(mod).filter(([, v]) => Array.isArray(v) && v.length);
  const objects = Object.entries(mod).filter(([, v]) => v && typeof v === 'object' && !Array.isArray(v));

  // (a) 변형별 용도 — { name, usage } 배열. 색 배열과 같은 것이라 usage 만 뽑는다.
  const variantUsage = arrays
    .flatMap(([, a]) => a)
    .filter((x) => x && typeof x === 'object' && isStr(x.usage) && (x.name || x.label));
  if (variantUsage.length) {
    out.push('**변형별 용도**', '', ...variantUsage.map((v) => `- **${v.label ?? v.name}** — ${v.usage}`), '');
  }

  // (b) 위계·구성·케이스 — { title, desc } 배열 (n·kind 같은 부가 필드는 무시)
  for (const [key, a] of arrays) {
    if (!a.every((x) => x && typeof x === 'object' && isStr(x.title) && isStr(x.desc))) continue;
    if (/ANATOMY/.test(key)) continue; // 해부도는 시각 자료 — 산문으로는 뜻이 안 선다
    const head = /HIERARCHY/.test(key) ? '위계' : /CASE/.test(key) ? '구성' : /CONTEXT/.test(key) ? '쓰는 맥락' : /ANTI/.test(key) ? '쓰지 않는 경우' : /ALTERNATIVE|VS_/.test(key) ? '다른 컴포넌트와 구분' : null;
    if (head) out.push(`**${head}**`, '');
    out.push(...a.map((x) => `- **${x.title}** — ${x.desc}`), '');
  }

  // (c) Do / Don't — { do: [], dont: [] }
  for (const [, o] of objects) {
    if (!Array.isArray(o.do) && !Array.isArray(o.dont)) continue;
    if (o.do?.length) out.push('**권장**', '', ...o.do.map((t) => `- ${t}`), '');
    if (o.dont?.length) out.push('**피하기**', '', ...o.dont.map((t) => `- ${t}`), '');
  }

  // (d) 가이드라인 — string[] (GUIDELINES·RULES 류)
  for (const [key, a] of arrays) {
    if (!/GUIDELINE|RULE/.test(key) || !a.every(isStr)) continue;
    out.push('**가이드라인**', '', ...a.map((t) => `- ${t}`), '');
  }

  // (e) 조건 → 판단 표 — { case, x } 또는 { title, primary, secondary }
  for (const [key, a] of arrays) {
    if (a.every((x) => x && isStr(x.case) && isStr(x.x))) {
      out.push('**닫기(X) 버튼 규칙**', '', mdTable(['경우', 'X 버튼'], a.map((x) => [x.case, x.x])), '');
    } else if (a.every((x) => x && isStr(x.title) && isStr(x.primary) && isStr(x.secondary))) {
      out.push('**버튼 조합**', '', mdTable(['조합', '주 버튼', '보조 버튼'], a.map((x) => [x.title, x.primary, x.secondary])), '');
    }
  }
  return out;
}

function componentSection(slug, title, meta, examples, dataMod) {
  const name = SLUG_TITLE[slug] ?? slug;
  const out = [`### ${name}`, ''];
  if (title && title.toLowerCase() !== name) out.push(`**${title}**`, '');
  // 한 줄 용도 — 페이지 메타
  if (meta?.description) out.push(meta.description, '');
  // `#### Usage` — 파서가 이 서브섹션만 usageMd 로 싣고, 조회 도구가 그걸
  // "[사용 규칙]" 으로 AI 에게 전달한다. H3 직속 산문은 안 실린다.
  // 순서: 예제별 맥락(코드 탭) → 데이터 산문(디자인 탭)
  const rules = examples.filter((e) => e.desc).map((e) => `- **${e.title}** — ${e.desc}`);
  const prose = proseFromData(dataMod);
  if (rules.length || prose.length) out.push('#### Usage', '', ...rules, ...(rules.length && prose.length ? [''] : []), ...prose);
  /*
   * 코드는 대표 예제 + (있으면) 제어 모드 예제. 파서 규약상 `#### Code` 펜스는 하나뿐이라
   * 두 예제를 한 펜스 안에 주석으로 나눠 싣는다.
   *
   * 왜 제어 예제가 꼭 필요한가(2026-08-26 실측): 비제어(defaultValue) 예제만 실었더니 AI 가
   * 외부 상태와 동기화하려고 `key={activeTab}` 로 컴포넌트를 매번 리마운트했다. 그러면
   * 탭 인디케이터가 미끄러질 인스턴스가 사라져 모션이 통째로 없어진다. value/onChange 를
   * 보여주면 그 우회를 안 한다. 캡(64KB)은 여유가 크다 — 지금 최대 400자 수준.
   */
  const primary = examples.find((e) => e.code) ?? null;
  const controlled = examples.find((e) => e.id === 'controlled' && e.code && e !== primary) ?? null;
  if (primary) {
    const parts = [primary.code.trim()];
    if (controlled) {
      parts.push('', `// ── 제어 모드${controlled.desc ? ` — ${controlled.desc}` : ''}`, '// 바깥 상태와 묶을 때는 value + onChange. key 로 리마운트하지 않는다(모션이 사라진다).', controlled.code.trim().replace(/^import .*\n?/gm, '').trim());
    }
    out.push('#### Code', '', '```tsx', ...parts, '```', '');
  }
  return out.join('\n');
}

/* ────────────────────────────────────────────────────────────
 * 4. 실행
 * ──────────────────────────────────────────────────────────── */

const slugs = readdirSync(DOCS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const pageMeta = await loadPageMeta();
const sections = [];
const specMap = {};
const names = [];
const skipped = [];

for (const slug of slugs) {
  const examples = await loadExamples(slug);
  Object.assign(specMap, await loadSpecEntries(slug));
  if (!examples?.length) {
    skipped.push(slug);
    continue;
  }
  const meta = pageMeta.get(slug);
  const dataMod = await loadComponentData(slug);
  names.push(SLUG_TITLE[slug] ?? slug);
  sections.push(componentSection(slug, meta?.title, meta, examples, dataMod));
}

/*
 * 패키지엔 있는데 문서 사이트에 독립 페이지가 없는 컴포넌트. md 에 없으면 PAX 조회
 * 도구가 못 찾아 AI 에게 존재하지 않는 컴포넌트가 된다 — 그래서 최소 예제라도 싣는다.
 * Radio 는 Checkbox 페이지 안에 살아서 그 데이터(RADIO_SPEC·GUIDELINES)를 빌려 쓴다.
 * 나머지 셋은 사이트에 페이지가 생기면 이 표에서 빼고 일반 경로로 넘긴다.
 */
const ORPHAN_COMPONENTS = [
  {
    slug: 'radio',
    title: 'Radio',
    description: '여러 항목 중 하나만 고르는 단일 선택 컨트롤. 다중 선택은 Checkbox 를 쓴다.',
    borrow: 'checkbox',
    usage: [
      '- 같은 `name` 을 가진 Radio 끼리 한 그룹이다 — `RadioGroup` 으로 묶으면 값 하나로 제어된다.',
      '- Radio 에는 부분 선택(indeterminate)이 없다. 「전체 선택」이 필요하면 Checkbox 그룹을 쓴다.',
      '- `tone="ai"` 는 AI 기능 문맥에서만.',
    ],
    code: `import { Radio, RadioGroup } from '${PACKAGE}';

<RadioGroup name="plan" defaultValue="basic">
  <Radio value="basic" label="Basic" />
  <Radio value="pro" label="Pro" />
</RadioGroup>`,
  },
  {
    slug: 'badge',
    title: 'Badge',
    description: '선택·필터 태그. 눌러서 켜고 끄는 칩 형태.',
    usage: [
      '- 필터·카테고리 선택처럼 여러 개를 동시에 켤 수 있는 자리에 쓴다. 단일 선택 전환은 SegmentControl.',
      '- `selected` 로 켜짐을 표시하고 `onClick` 으로 토글한다.',
    ],
    code: `import { Badge } from '${PACKAGE}';

<Badge selected onClick={() => {}}>디자인</Badge>
<Badge onClick={() => {}}>개발</Badge>`,
  },
  {
    slug: 'credit',
    title: 'Credit',
    description: 'AI 크레딧 잔량 표시. 남은 개수를 보여주고, 쓸 수 없으면 회색으로 가라앉는다.',
    usage: [
      '- AI 기능 근처에 두어 사용 전 잔량을 알린다.',
      '- `value` 는 남은 크레딧 수. `available={false}` 면 소진·비활성 상태로 회색 표시. 아이콘은 `icon` 으로 교체.',
    ],
    code: `import { Credit } from '${PACKAGE}';

<Credit value={120} />
<Credit value={0} available={false} />`,
  },
  {
    slug: 'dim',
    title: 'Dim',
    description: '화면을 덮는 반투명 검정 막. 로딩 중이거나 뒤 화면 조작을 막을 때 쓴다.',
    usage: [
      '- `loading` 이면 가운데 스피너와 안내 문구(`label`)를 함께 그린다.',
      '- Popup 은 자체 딤을 가진다 — Popup 위에 Dim 을 또 얹지 않는다.',
      '- `fullscreen` 은 뷰포트 전체, 아니면 부모 요소 안을 덮는다(부모가 `position: relative` 여야 한다).',
    ],
    code: `import { Dim } from '${PACKAGE}';

<div style={{ position: 'relative', minHeight: 240 }}>
  {/* 내용 */}
  <Dim loading label="불러오는 중" />
</div>`,
  },
];

for (const o of ORPHAN_COMPONENTS) {
  const borrowed = o.borrow ? await loadComponentData(o.borrow) : null;
  const out = [`### ${o.slug}`, '', `**${o.title}**`, '', o.description, '', '#### Usage', '', ...o.usage];
  // 빌린 데이터에서 이 컴포넌트에 해당하는 것만 — Radio 는 checkbox 의 GUIDELINES 가 둘을 함께 다룬다
  if (borrowed) {
    const g = Object.entries(borrowed).find(([k, v]) => /GUIDELINE/.test(k) && Array.isArray(v));
    if (g) out.push('', '**가이드라인**', '', ...g[1].filter((t) => /Radio|단일/.test(t)).map((t) => `- ${t}`));
  }
  out.push('', '#### Code', '', '```tsx', o.code, '```', '');
  sections.push(out.join('\n'));
  names.push(o.slug);
}

/*
 * 스펙 맵은 frontmatter 가 아니라 `## Resources` 의 `### Spec components`
 * yaml 블록에 둔다 — 가이드가 Variant/Size 축을 읽는 정본 위치다(손작성본도 여기).
 * 이게 없으면 축이 안 만들어져 AI 문서 추론으로 떨어지고, 실제로 Button
 * primary 가 검정으로 그려졌다.
 */
const refDocs = await foundationResources();
const specBlock = Object.keys(specMap).length || refDocs.length
  ? [
      '## Resources',
      '',
      ...refDocs,
      '### Spec components',
      '',
      '```yaml',
      ...Object.entries(specMap).flatMap(([name, props]) => [
        `${name}:`,
        ...Object.entries(props)
          .filter(([, v]) => v)
          .map(([k, v]) => `  ${k}: ${yamlScalar(v)}`),
      ]),
      '```',
      '',
    ]
  : [];

const md = [frontmatter(readTokens()), '', OVERVIEW, '', '## Components', '', ...sections, ...specBlock].join('\n').replace(/\n{3,}/g, '\n\n') + '\n';

/*
 * 컴포넌트가 실제로 참조하는 CSS 변수가 md 토큰으로 다 나오는지 —
 * 카테고리명이 곧 변수 접두어라 한 글자만 달라도(colors vs color) 전부
 * 빗나가고 폴백 hex 로 그려진다. 화면은 그럴듯해서 눈으로는 못 잡는다.
 */
{
  const emitted = new Set();
  for (const [cat, map] of Object.entries(readTokens().tokens)) {
    for (const k of Object.keys(map)) emitted.add(`--${cat}-${k}`);
  }
  const used = new Set();
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.tsx?$/.test(e.name)) {
        for (const m of readFileSync(full, 'utf8').matchAll(/var\((--[a-z0-9-]+)/g)) used.add(m[1]);
      }
    }
  };
  walk(join(ROOT, 'packages/pds-react/src'));
  const missing = [...used].filter((v) => !emitted.has(v)).sort();
  if (missing.length) {
    console.warn(`[pds-design-md] ⚠ 컴포넌트가 쓰는데 md 에 없는 토큰 ${missing.length}개 — 폴백 hex 로 그려집니다:\n    ${missing.join(', ')}`);
  }
}

/*
 * 실물 등록표와 이름이 맞는지 — 어긋나면 가이드가 **조용히** 골격 렌더로
 * 떨어진다(에러도 경고도 없다). 생성 시점에 잡는다.
 */
{
  const registry = join(ROOT, 'src/live-components.ts');
  if (existsSync(registry)) {
    const src = readFileSync(registry, 'utf8');
    const body = src.slice(src.indexOf('LIVE_COMPONENTS'));
    const keys = new Set([...body.matchAll(/^\s+'?([a-z][a-z-]*)'?:\s*\w/gm)].map((m) => m[1]));
    const missing = names.filter((n) => !keys.has(n));
    if (missing.length) {
      console.warn(
        `[pds-design-md] ⚠ 등록표에 없는 컴포넌트 ${missing.length}개 — 가이드에서 골격 렌더로 표시됩니다: ${missing.join(', ')}`,
      );
    }
  }
}

const same = existsSync(OUT_MD) && readFileSync(OUT_MD, 'utf8') === md;
if (check) {
  if (!same) {
    console.error('[pds-design-md] 드리프트 — node PDS/scripts/generate-pds-design-md.mjs 실행 후 커밋하세요');
    process.exit(1);
  }
  console.log('[pds-design-md] clean');
} else {
  if (!same) {
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(OUT_MD, md);
  }
  console.log(
    `[pds-design-md] ${basename(OUT_MD)} — 컴포넌트 ${sections.length}개 · ${(md.length / 1024).toFixed(1)}KB (${same ? '변경 없음' : '갱신'})` +
      (skipped.length ? `\n  건너뜀(예제 없음): ${skipped.join(', ')}` : ''),
  );
}
