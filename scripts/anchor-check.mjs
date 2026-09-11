/**
 * 앵커 회귀 검사 — **렌더된 페이지**의 앵커 id 가 원본 VitePress 와 일치하는지 확인한다.
 *
 * `docs:slug-check` 와 역할이 다르다. 그쪽은 slugify **함수**를 정답지와 대조할 뿐이라,
 * 헤딩이 Code 탭으로 넘어가거나 `data-docs-body` 가 빠져도 초록으로 통과한다. 이 검사는
 * 실제 HTML 을 받아 비교하므로 그런 이동을 잡는다.
 *
 * 함께 검사하는 것:
 *  · Design 탭(기본 상태)에 원본 앵커가 전부 있는가
 *  · **Code 탭 헤딩 id 가 전부 `code-` 접두인가** — 2026-08-25 규칙 변경. 과거엔 Code 탭에 id
 *    자체를 금지했으나(목차 오염), Code 탭 목차를 살리면서 CodeExample 이 `code-` 접두 id 를
 *    달게 됐다(src/components/docs/CodeExample.tsx). 접두가 Design 탭 id 와의 충돌을 막고
 *    Toc 는 활성 탭만 스캔한다. 따라서 검사할 것은 '없는가'가 아니라 '접두가 붙었는가'다.
 *
 * 실행: 개발 서버를 띄운 상태에서 `npm run docs:anchor-check`
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.DOCS_BASE_URL ?? 'http://localhost:3000';
const fixture = JSON.parse(
  readFileSync(join(process.cwd(), 'src/lib/docs/__fixtures__/headings.json'), 'utf8'),
);

/**
 * 아직 전체 이식이 끝나지 않은 페이지 — 앵커 누락을 실패로 세지 않고 남은 개수만 보고한다.
 * **이식이 끝나면 목록에서 지운다.** 여기 남아 있는 동안은 그 페이지가 미완성이라는 뜻이다.
 */
const IN_PROGRESS = new Set([
  // (비어 있음 — 32페이지 전체 이식 완료. 새 미완성 페이지가 생기면 여기 등록)
]);

let checked = 0;
let failed = 0;
const notes = [];
const pending = [];

for (const page of fixture.pages) {
  // 원본 route 는 /components/ 처럼 끝에 슬래시가 붙기도 한다 — 우리 라우트는 슬래시 없음
  const route = page.route.replace(/\/$/, '') || '/';
  let html;
  try {
    const res = await fetch(`${BASE}${route}`);
    if (res.status === 404) continue; // 아직 이식 안 된 페이지는 건너뛴다
    if (!res.ok) {
      notes.push(`  ${route} — HTTP ${res.status}`);
      failed += 1;
      continue;
    }
    html = await res.text();
  } catch (e) {
    notes.push(`  ${route} — 요청 실패 (${e.message}). 개발 서버가 떠 있는지 확인`);
    failed += 1;
    continue;
  }

  checked += 1;
  const expected = page.headings.filter((h) => h.tag !== 'h1').map((h) => h.id);
  const rendered = [...html.matchAll(/<h([234])[^>]*\sid="([^"]+)"/g)].map((m) => m[2]);

  const missing = expected.filter((id) => !rendered.includes(id));
  if (missing.length) {
    if (IN_PROGRESS.has(route)) {
      pending.push(`  ${route} — 남은 앵커 ${missing.length}/${expected.length}`);
    } else {
      failed += 1;
      notes.push(`  ${route} — 누락 앵커 ${missing.length}건: ${missing.map(encodeURIComponent).join(', ')}`);
    }
  }

  // Code 패널 헤딩은 `code-` 접두여야 한다 — 접두 없는 id 는 Design 탭과 충돌해 목차가 조용히 깨진다
  const codePanel = html.match(/data-tabpanel="code"[\s\S]*?(?=data-tabpanel="|<\/main)/);
  if (codePanel) {
    const bare = [...codePanel[0].matchAll(/<h[234][^>]*\sid="([^"]+)"/g)]
      .map((m) => m[1])
      .filter((id) => !id.startsWith('code-'));
    if (bare.length) {
      failed += 1;
      notes.push(`  ${route} — Code 탭 헤딩에 code- 접두가 없다: ${bare.join(', ')}`);
    }
  }
}

console.log('[docs anchor-check]');
console.log(`  페이지 ${checked}개 검사 (미이식 404 는 건너뜀)`);
if (pending.length) {
  console.log(`  이식 진행 중 ${pending.length}개 — 실패로 세지 않음:`);
  console.log(pending.join('\n'));
}
if (failed > 0) {
  console.error(`\n${failed}건 실패:`);
  console.error(notes.join('\n'));
  process.exit(1);
}
console.log('\n렌더된 앵커가 원본과 일치');
