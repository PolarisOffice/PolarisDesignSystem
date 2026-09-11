/**
 * 내부 링크 감사 — 렌더된 전 페이지의 내부 href 를 수집해 대상 라우트·앵커 실존을 확인한다.
 *
 * 원본 VitePress 는 `ignoreDeadLinks: true` 로 깨진 링크를 **가리고** 있었다. 이식은 그 빚을
 * 드러낼 기회다: 여기서 실패하는 링크는 우리가 만든 회귀일 수도, 원본부터 깨져 있던 것일 수도
 * 있다 — 실패 메시지의 경로를 원본 md 와 대조해 판별한다.
 *
 * 검사 범위:
 *  · 같은 오리진의 <a href> 전부 (외부 http(s) 링크는 네트워크를 타지 않으므로 제외)
 *  · 라우트: 200 또는 308(리다이렉트면 최종 도착지가 200)
 *  · 해시: 대상 페이지 HTML 에 해당 id 실존 (NFKD 조합형 그대로 비교)
 *  · 정적 에셋(.svg/.zip/.ttf 등): 200
 *
 * 실행: 개발 서버를 띄운 상태에서 `npm run docs:link-check`
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.DOCS_BASE_URL ?? 'http://localhost:3000';
const fixture = JSON.parse(
  readFileSync(join(process.cwd(), 'src/lib/docs/__fixtures__/headings.json'), 'utf8'),
);
const ROUTES = fixture.pages.map((p) => p.route.replace(/\/$/, '') || '/');

/** href 수집 (SSR HTML 기준 — 클라이언트 전용 링크는 없다, 전 페이지 정적) */
function collectHrefs(html) {
  return [...html.matchAll(/<a\s[^>]*href="([^"]+)"/g)].map((m) => m[1]);
}

const pageHtml = new Map(); // route → html (앵커 검사 재사용)
async function fetchPage(route) {
  if (pageHtml.has(route)) return pageHtml.get(route);
  const res = await fetch(`${BASE}${route}`, { redirect: 'follow' });
  const entry = { status: res.status, html: res.ok ? await res.text() : '' };
  pageHtml.set(route, entry);
  return entry;
}

let checked = 0;
const failures = [];

for (const route of ROUTES) {
  const page = await fetchPage(route);
  if (page.status !== 200) {
    failures.push(`  ${route} — 페이지 자체가 HTTP ${page.status}`);
    continue;
  }

  for (const href of collectHrefs(page.html)) {
    // 외부·특수 스킴은 제외
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    checked += 1;

    const [pathAndQuery, rawHash] = href.split('#');
    const path = (pathAndQuery.split('?')[0] || route).replace(/\/$/, '') || '/';

    // 앵커만 있는 링크(#foo)는 현재 페이지 대상
    const targetRoute = pathAndQuery === '' ? route : path;

    // 정적 에셋
    if (/\.(svg|png|zip|ttf|otf|pdf|css)$/i.test(targetRoute)) {
      const res = await fetch(`${BASE}${encodeURI(targetRoute)}`, { method: 'HEAD' });
      if (res.status !== 200) failures.push(`  ${route} → ${href} — 에셋 HTTP ${res.status}`);
      continue;
    }

    const target = await fetchPage(targetRoute);
    if (target.status !== 200) {
      failures.push(`  ${route} → ${href} — HTTP ${target.status}`);
      continue;
    }

    if (rawHash) {
      let id = rawHash;
      try {
        id = decodeURIComponent(rawHash);
      } catch {
        /* 원문 그대로 */
      }
      // id 는 NFKD 조합형일 수 있다 — HTML 에는 그 형태 그대로 박혀 있으므로 단순 포함 검사
      if (!target.html.includes(`id="${id}"`)) {
        failures.push(`  ${route} → ${href} — 앵커 #${encodeURIComponent(id)} 없음`);
      }
    }
  }
}

console.log('[docs link-check]');
console.log(`  페이지 ${ROUTES.length}개에서 내부 링크 ${checked}건 검사`);
if (failures.length) {
  console.error(`\n${failures.length}건 실패:`);
  console.error([...new Set(failures)].join('\n'));
  process.exit(1);
}
console.log('\n깨진 내부 링크 없음');
