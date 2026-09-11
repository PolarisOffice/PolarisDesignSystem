/**
 * 슬러그 이식 회귀 검증 — 우리 slugify 가 VitePress 가 실제로 뱉은 앵커 id 와 **바이트 단위로**
 * 일치하는지 확인한다.
 *
 * 정답지: src/lib/docs/__fixtures__/headings.json (VitePress 빌드 산출 HTML 에서 추출).
 * 갱신: PDS 에서 `npm run docs:build` 후 `node scripts/extract-headings.mjs`.
 *
 * 이 테스트가 잡는 것 — 한글 앵커의 NFKD 조합형 자모 문제. NFC 를 만드는 일반 슬러그 라이브러리로
 * 갈아끼우면 화면·주소창에서는 똑같아 보이지만 여기서 즉시 실패한다.
 *
 * 실행: npm run docs:slug-check
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createUniqueSlugger, slugify } from '../src/lib/docs/slug';

interface Heading {
  tag: string;
  id: string;
  text: string;
}
interface Page {
  route: string;
  headings: Heading[];
}

const fixture = JSON.parse(
  readFileSync(join(process.cwd(), 'src/lib/docs/__fixtures__/headings.json'), 'utf8'),
) as { pages: Page[] };

let checked = 0;
let failed = 0;
const failures: string[] = [];

for (const page of fixture.pages) {
  // 페이지 단위로 슬러거를 새로 만든다 — markdown-it-anchor 의 중복 카운터도 페이지 스코프다
  const slug = createUniqueSlugger();
  for (const h of page.headings) {
    const got = slug(h.text);
    checked += 1;
    if (got !== h.id) {
      failed += 1;
      if (failures.length < 15) {
        failures.push(
          `  ${page.route} <${h.tag}> "${h.text}"\n` +
            `    기대 ${JSON.stringify(h.id)}\n` +
            `    실제 ${JSON.stringify(got)}`,
        );
      }
    }
  }
}

console.log('[docs slug-check]');
console.log(`  헤딩 ${checked}개 대조 (페이지 ${fixture.pages.length})`);

// 한글 앵커가 조합형(NFC 아님)인지 직접 확인 — 이식의 핵심 불변식
const koreanSample = '버튼 조합';
const koreanSlug = slugify(koreanSample);
const isDecomposed = koreanSlug !== koreanSlug.normalize('NFC');
console.log(
  `  한글 조합형 유지: ${isDecomposed ? '✓' : '✗'} (${JSON.stringify(koreanSample)} → ${encodeURIComponent(koreanSlug)})`,
);
if (!isDecomposed) {
  failed += 1;
  failures.push('  한글 슬러그가 NFC 로 합성됨 — NFKD 분해가 유실되면 기존 딥링크가 전부 깨진다');
}

if (failed > 0) {
  console.error(`\n${failed}건 불일치:`);
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('\n모든 앵커 일치');
