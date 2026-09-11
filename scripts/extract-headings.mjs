/**
 * VitePress 빌드 산출물에서 **실제 렌더된 헤딩 앵커 id** 를 뽑아 픽스처로 저장한다.
 *
 * 왜 마크다운이 아니라 빌드 결과에서 뽑나: 우리 slugify 이식이 맞는지 검증하려면 정답지가
 * 필요한데, 마크다운에서 우리 함수로 다시 계산하면 순환 검증이 된다. VitePress 가 실제로
 * 출력한 HTML 의 id 가 유일한 ground truth 다. 특히 한글 앵커의 NFKD 조합형 자모 문제
 * (src/lib/docs/slug.ts 경고 참고)는 이 방식이 아니면 잡히지 않는다.
 *
 * 실행: node scripts/extract-headings.mjs [PDS_DIST_DIR] [OUT_JSON]
 * 기본값: ~/dev/PDS/docs/.vitepress/dist → src/lib/docs/__fixtures__/headings.json
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { homedir } from 'node:os';

const DIST = process.argv[2] ?? join(homedir(), 'dev/PDS/docs/.vitepress/dist');
const OUT = process.argv[3] ?? join(process.cwd(), 'src/lib/docs/__fixtures__/headings.json');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'assets') continue;
      out.push(...walk(full));
    } else if (entry.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

// VitePress 헤딩 마크업: <h2 id="…" tabindex="-1">텍스트 <a class="header-anchor" …
const HEADING_RE = /<(h[123])\s+id="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/g;

function plainText(html) {
  return html
    .replace(/<a\s+class="header-anchor"[\s\S]*?<\/a>/g, '') // 앵커 링크 제거
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const files = walk(DIST).sort();
const pages = [];
let total = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const route = '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\.html$/, '');
  const headings = [];
  for (const m of html.matchAll(HEADING_RE)) {
    const [, tag, id, inner] = m;
    const text = plainText(inner);
    if (!text) continue;
    headings.push({ tag, id, text });
    total += 1;
  }
  if (headings.length) pages.push({ route, headings });
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ source: 'vitepress build output', pages }, null, 2) + '\n', 'utf8');

const korean = pages.flatMap((p) => p.headings).filter((h) => /[가-힣]/.test(h.text)).length;
const dupes = pages.flatMap((p) => p.headings).filter((h) => /-\d+$/.test(h.id));
console.log(`페이지 ${pages.length} · 헤딩 ${total} (한글 포함 ${korean})`);
if (dupes.length) console.log(`중복 슬러그 ${dupes.length}건: ${dupes.map((d) => d.id).join(', ')}`);
console.log(`→ ${relative(process.cwd(), OUT)}`);
