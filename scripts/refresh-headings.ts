/**
 * 정답지(headings.json) 재생성 — **렌더된 우리 사이트**를 새 ground truth 로 삼는다.
 *
 * 2026-08-13 명명 통일(목차 감사)로 앵커 id 가 원본 VitePress 와 갈라졌다.
 * 이 시점부터 원본 파리티 검사는 종료 — slug-check·anchor-check 의 정답지는 "우리 표준"이다.
 * 구 앵커 딥링크는 src/lib/docs/anchor-aliases.ts 가 구제한다.
 *
 * 추출 규칙:
 *  · h2/h3/h4 — 렌더된 id 그대로, 텍스트는 data-heading-text span 에서(앵커 '#' 오염 방지)
 *  · h1 — id 없이 렌더되지만 **slugify(텍스트)로 행을 합성**한다. slug-check 의 페이지 단위
 *    중복 카운터가 h1 슬롯을 소비해야 실측 중복이 재현된다(/foundation/grid: h1 'Grid'→grid,
 *    h2 'Grid'→grid-1 — h1 행이 빠지면 h2 기대값이 grid 가 되어 오탐).
 *
 * 실행: 개발 서버를 띄운 상태에서 `npm run docs:headings-refresh`
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { slugify } from '../src/lib/docs/slug';

const BASE = process.env.DOCS_BASE_URL ?? 'http://localhost:3000';
const FIXTURE = join(process.cwd(), 'src/lib/docs/__fixtures__/headings.json');

interface Heading {
  tag: string;
  id: string;
  text: string;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

/**
 * 문서 구조가 아닌 서브트리를 잘라낸다 — 여는 div 부터 짝 맞는 닫는 div 까지 깊이 계산.
 *
 * 대상 2종:
 *  · `data-anatomy-sample` — Anatomy 실물 견본(Popup 제목 h2 등)은 견본이지 문서 구조가 아니다.
 *  · `data-tabpanel="code"` — Code 탭 예제 제목(`code-*` id, CodeExample.tsx)은 문서 목차가 아니다.
 *    2026-08-25 추가: 두 패널이 항상 마운트되므로 SSR HTML 에 code 패널 헤딩이 함께 실려 오는데,
 *    이걸 정답지에 넣으면 slug-check 가 전부 불일치로 잡는다(수동 `code-` 접두라 slugify 로
 *    재현 불가). 기존 정답지도 이 헤딩들을 갖고 있지 않다 — 스크립트가 규칙을 따라잡은 것.
 */
function stripNonDocSubtrees(html: string): string {
  return [/<div\b[^>]*\bdata-anatomy-sample\b[^>]*>/g, /<div\b[^>]*\bdata-tabpanel="code"[^>]*>/g].reduce(
    (acc, re) => stripSubtree(acc, re),
    html,
  );
}

function stripSubtree(html: string, OPEN: RegExp): string {
  let out = html;
  for (;;) {
    const m = OPEN.exec(out);
    if (!m) break;
    let depth = 1;
    let i = m.index + m[0].length;
    const tag = /<\/?div\b[^>]*>/g;
    tag.lastIndex = i;
    let end = -1;
    let t: RegExpExecArray | null;
    while ((t = tag.exec(out))) {
      depth += t[0].startsWith('</') ? -1 : 1;
      if (depth === 0) { end = t.index + t[0].length; break; }
    }
    if (end === -1) break; // 비정상 마크업 — 그냥 둔다
    out = out.slice(0, m.index) + out.slice(end);
    OPEN.lastIndex = 0;
  }
  return out;
}

function plainText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

// 라우트 목록은 기존 정답지에서 승계한다 — 라우트 자체는 이번 변경에서 안 바뀌었다
const old = JSON.parse(readFileSync(FIXTURE, 'utf8')) as {
  pages: { route: string }[];
};
const routes = [...new Set(old.pages.map((p) => p.route.replace(/\/$/, '') || '/'))];

async function main() {
  const pages: { route: string; headings: Heading[] }[] = [];
  let total = 0;
  let failed = 0;

  for (const route of routes) {
    let html: string;
    try {
      const res = await fetch(`${BASE}${route}`);
      if (res.status === 404 || res.redirected) {
        // 404 = 삭제된 라우트, redirected = 병합·이전된 라우트(따라가면 대상 페이지가
        // 두 번 기록된다) — 둘 다 정답지에서 제외
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      html = stripNonDocSubtrees(await res.text());
    } catch (e) {
      console.error(`  ✗ ${route} — ${(e as Error).message}. 개발 서버가 떠 있는지 확인`);
      failed += 1;
      continue;
    }

    const headings: Heading[] = [];

    // h1 합성 행 — 첫 h1 만 (페이지 제목)
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (h1) {
      const text = plainText(h1[1]);
      if (text) headings.push({ tag: 'h1', id: slugify(text), text });
    }

    // h2/h3/h4 — id 가 있는 것만, 문서 순서대로
    const re = /<h([234])[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
    for (const m of html.matchAll(re)) {
      const [, level, id, inner] = m;
      const span = inner.match(/<span[^>]*data-heading-text[^>]*>([\s\S]*?)<\/span>/);
      const text = plainText(span ? span[1] : inner);
      if (!text) continue;
      headings.push({ tag: `h${level}`, id: decodeEntities(id), text });
    }

    if (headings.length === 0) continue; // 헤딩 없는 페이지(리다이렉트 등)는 제외
    pages.push({ route, headings });
    total += headings.length;
  }

  if (failed > 0) {
    console.error(`\n${failed}개 라우트 실패 — 정답지를 덮어쓰지 않음`);
    process.exit(1);
  }

  pages.sort((a, b) => a.route.localeCompare(b.route));
  writeFileSync(
    FIXTURE,
    JSON.stringify(
      {
        source: `self-standard (rendered site, ${BASE}) — VitePress parity ended 2026-08-13, old anchors in anchor-aliases.ts`,
        pages,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`[docs headings-refresh] 페이지 ${pages.length} · 헤딩 ${total}개 기록`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
