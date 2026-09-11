/**
 * PDS 마크다운 HTML → JSX 변환기 (이식 보조 도구, 빌드 스텝 아님).
 *
 * 원본 문서는 `markdown: { html: true }` 로 raw HTML 을 통과시켜 왔다. 그 HTML 을 React 로
 * 옮길 때 **에러 없이 조용히 죽는** 변환이 여럿 있어서, 손으로 하면 반드시 흘린다:
 *
 *   · `style="a:b;c:d"`  → React 가 문자열 style 을 무시한다 (원본 936곳)
 *   · `stroke-width` 등  → React 가 하이픈 SVG 속성을 무시 → 기본 1px 로 그려져 "거의 맞아 보인다"
 *                          (원본 87개 SVG, ~600 속성). 이게 제일 위험하다
 *   · `class`            → className (원본 3570곳)
 *   · 닫히지 않은 <img>  → JSX 파싱 에러 (원본 22곳)
 *
 * 사용:
 *   node scripts/html-to-jsx.mjs <입력.html|->  [--css]
 *   pbpaste | node scripts/html-to-jsx.mjs -
 *
 * `--css` 를 주면 `--vp-c-*` → PDS 토큰 치환만 수행한다(<style> 블록을 CSS Module 로 옮길 때).
 *
 * 의도적으로 **완전 자동화가 아니다**. 산출물은 붙여넣기 출발점이고, 의미 있는 구조
 * (SpecTable·Anatomy·UsageGrid 등)로 접는 것은 사람이 한다.
 */
import { readFileSync } from 'node:fs';

/* ── --vp-c-* → PDS semantic 매핑 ──
   근거는 계획서 §스타일 전략. text-3 는 assistive(대비 2.5:1, AA 실패)가 아니라
   alternative 로 간다 — 원본에서 text-3 는 카드 설명문 같은 실제 문장을 담고 있다. */
export const VP_TOKEN_MAP = {
  '--vp-c-text-1': '--color-label-normal',
  '--vp-c-text-2': '--color-label-neutral',
  '--vp-c-text-3': '--color-label-alternative',
  '--vp-c-divider': '--color-line-neutral',
  '--vp-c-bg-soft': '--color-fill-neutral',
  '--vp-c-bg-alt': '--color-fill-neutral',
  '--vp-c-default-soft': '--color-fill-normal',
  '--vp-c-brand-1': '--color-accent-normal',
  '--vp-c-brand-2': '--color-accent-strong',
  '--vp-c-brand-3': '--docs-accent-surface',
  '--vp-c-brand-soft': '--kit-brand-soft',
  // --vp-c-bg 는 문맥에 따라 background-base / layer-surface 로 갈린다 → 사람이 판정
  '--vp-c-bg': '--color-layer-surface',
};

/** React 가 camelCase 를 요구하는 속성 (하이픈이면 조용히 무시된다) */
const ATTR_MAP = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  autocomplete: 'autoComplete',
  srcset: 'srcSet',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  'fill-rule': 'fillRule',
  'fill-opacity': 'fillOpacity',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'text-anchor': 'textAnchor',
  'font-size': 'fontSize',
  'font-family': 'fontFamily',
  'font-weight': 'fontWeight',
  'letter-spacing': 'letterSpacing',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'shape-rendering': 'shapeRendering',
  'vector-effect': 'vectorEffect',
  'marker-end': 'markerEnd',
  'marker-start': 'markerStart',
  'dominant-baseline': 'dominantBaseline',
  'xlink:href': 'href',
};

const VOID_TAGS = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area', 'col', 'embed']);

/** CSS 속성명 → JS 프로퍼티명 (`-webkit-` 접두는 대문자 시작) */
function cssPropToJs(prop) {
  const p = prop.trim();
  if (p.startsWith('--')) return `'${p}'`; // CSS 변수는 따옴표 키로 유지
  if (p.startsWith('-webkit-') || p.startsWith('-moz-') || p.startsWith('-ms-')) {
    const rest = p.replace(/^-(webkit|moz|ms)-/, '');
    const pre = p.startsWith('-ms-') ? 'ms' : p.startsWith('-moz-') ? 'Moz' : 'Webkit';
    return pre + rest.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase());
  }
  return p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/** `style="a:b;c:d"` → `style={{ a: 'b', c: 'd' }}` */
function styleStringToObject(value) {
  const entries = [];
  // `url(a;b)` 같은 건 원본에 없지만, 괄호 안 세미콜론은 보호한다
  let depth = 0;
  let buf = '';
  const decls = [];
  for (const ch of value) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (ch === ';' && depth === 0) {
      decls.push(buf);
      buf = '';
    } else buf += ch;
  }
  if (buf.trim()) decls.push(buf);

  for (const decl of decls) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop || !val) continue;
    entries.push(`${cssPropToJs(prop)}: '${val.replace(/'/g, "\\'")}'`);
  }
  return `{{ ${entries.join(', ')} }}`;
}

function convertAttrs(attrText) {
  const out = [];
  // name="value" | name='value' | name (불리언)
  const re = /([a-zA-Z_:@][a-zA-Z0-9:._-]*)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g;
  let m;
  while ((m = re.exec(attrText))) {
    const rawName = m[1];
    let value = m[2];
    if (value && (value.startsWith('"') || value.startsWith("'"))) value = value.slice(1, -1);

    const lower = rawName.toLowerCase();

    // 인라인 이벤트 핸들러는 React 에서 동작하지 않는다 — 버리고 표시를 남긴다
    if (lower.startsWith('on')) {
      out.push(`/* TODO(port): ${rawName}="${value}" — React 로 재작성 필요 */`);
      continue;
    }
    if (lower === 'style' && value != null) {
      out.push(`style=${styleStringToObject(value)}`);
      continue;
    }
    const name = ATTR_MAP[lower] ?? (lower === rawName ? rawName : rawName);
    if (value == null) {
      out.push(name);
    } else if (/^\d+$/.test(value) && ['width', 'height', 'colSpan', 'rowSpan', 'tabIndex'].includes(name)) {
      out.push(`${name}={${value}}`);
    } else {
      out.push(`${name}="${value.replace(/"/g, '&quot;')}"`);
    }
  }
  return out.join(' ');
}

export function htmlToJsx(html) {
  let out = html;

  // HTML 주석 → JSX 주석
  out = out.replace(/<!--([\s\S]*?)-->/g, (_, body) => `{/*${body}*/}`);

  // 태그별 속성 변환
  out = out.replace(/<([a-zA-Z][a-zA-Z0-9-]*)((?:\s[^<>]*?)?)(\/?)>/g, (whole, tag, attrs, selfClose) => {
    const converted = attrs.trim() ? ' ' + convertAttrs(attrs) : '';
    const needsSelfClose = selfClose === '/' || VOID_TAGS.has(tag.toLowerCase());
    return `<${tag}${converted}${needsSelfClose ? ' />' : '>'}`;
  });

  // CSS 변수 치환 (인라인 style 안에도 있을 수 있다)
  for (const [from, to] of Object.entries(VP_TOKEN_MAP)) {
    out = out.split(from).join(to);
  }

  return out;
}

export function cssVarsOnly(css) {
  let out = css;
  for (const [from, to] of Object.entries(VP_TOKEN_MAP)) {
    out = out.split(from).join(to);
  }
  // `.dark X` → data-theme 셀렉터. 원본은 VitePress 의 .dark 클래스를 썼지만 킷은 data-theme 만 쓴다
  out = out.replace(/(^|\s|,)\.dark\s+/g, "$1:global(html[data-theme='dark']) ");
  return out;
}

/* ── CLI ── */
const arg = process.argv[2];
if (arg) {
  const input = arg === '-' ? readFileSync(0, 'utf8') : readFileSync(arg, 'utf8');
  const cssMode = process.argv.includes('--css');
  const result = cssMode ? cssVarsOnly(input) : htmlToJsx(input);
  process.stdout.write(result);

  const warnings = [];
  if (!cssMode) {
    const todos = (result.match(/TODO\(port\)/g) ?? []).length;
    if (todos) warnings.push(`인라인 이벤트 핸들러 ${todos}건 — React 로 재작성 필요`);
    if (/var\(--vp-c-bg[^-)]/.test(result))
      warnings.push('--vp-c-bg → layer-surface 로 일괄 치환됨. 테두리 없는 순수 배경이면 background-base 로 바꿀 것');
  }
  if (warnings.length) process.stderr.write('\n[html-to-jsx] ' + warnings.join('\n[html-to-jsx] ') + '\n');
}
