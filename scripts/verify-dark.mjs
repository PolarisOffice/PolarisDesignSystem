/**
 * 다크 모드 대조 검증 — 라이트에서 멀쩡한데 다크에서만 무너지는 조합을 잡는다.
 *
 * 왜 별도 스크립트인가: verify-figma 는 라이트 한 테마만 본다. 2026-08-25 에 다섯
 * 컴포넌트가 다크에서 깨진 채 발견됐는데, 원인이 전부 **짝이 안 맞는 토큰**이었다.
 * 다크에서 뒤집히는 색(label-inverse·background-base·action-normal)과 안 뒤집히는
 * 색(static-white·accent-normal·layer-overlay)을 잘못 조합하면, 라이트에서는 둘 다
 * 흰색이라 똑같이 보이고 다크에서만 갈라진다. 눈으로는 못 잡고 라이트 검사로도 못 잡는다.
 *
 * 무엇을 보는가: 전경/배경 쌍의 대비비를 두 테마에서 각각 재고, **낮은 쪽이 하한 밑으로
 * 떨어지는지**만 본다. 사고는 전부 한쪽 테마에서 대비가 1.0 근처로 무너지는 형태였다
 * (흰 배경에 흰 글자). 브랜드 색 자체가 낮은 대비인 경우(Primary 3.85)는 두 테마가
 * 같은 값이라 하한만 넘으면 통과한다 — 그건 접근성 과제지 다크 모드 결함이 아니다.
 *
 * 실행: npm run verify:dark   (문서 사이트가 떠 있어야 한다)
 *      BASE=http://localhost:3000 로 주소 변경 가능
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:3000';

/**
 * 어느 한 테마에서 이 밑으로 떨어지면 실패 — 글자가 배경에 묻힌 수준(WCAG 대형 텍스트 하한).
 *
 * 낙차(테마 간 배수)는 **판정에 쓰지 않는다.** 반투명 표면(툴팁·토스트의 layer-overlay)은
 * 페이지 배경 위에 합성되므로 같은 토큰을 써도 두 테마의 수치가 구조적으로 갈린다 —
 * 낙차로 잡으면 정상인 것들이 계속 걸린다. 실제 사고(흰 배경에 흰 글자)는 전부 바닥값이
 * 1.0 근처로 떨어졌으므로 바닥값만으로 충분히 잡힌다. 낙차는 참고용으로 표에만 찍는다.
 */
const FLOOR = 3.0;

/* ── 대비비 (WCAG 상대휘도) ─────────────────────────────────────── */
const lum = (r, g, b) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const nums = (s) => (s.match(/\d+(\.\d+)?/g) || []).map(Number);
/** 반투명 색은 페이지 배경 위에 합성해서 실제로 보이는 색을 구한다 */
const flatten = (c, page) => {
  const a = nums(c);
  if (a.length < 4 || a[3] === 1) return a.slice(0, 3);
  const b = nums(page);
  return [0, 1, 2].map((i) => Math.round(a[i] * a[3] + b[i] * (1 - a[3])));
};
const contrast = (fg, bg, page) => {
  const A = flatten(fg, page);
  const B = flatten(bg, page);
  if (A.length < 3 || B.length < 3) return null;
  const [hi, lo] = [lum(...A), lum(...B)].sort((x, y) => y - x);
  return +((hi + 0.05) / (lo + 0.05)).toFixed(2);
};

/* ── 검사 대상 ──────────────────────────────────────────────────
 * 각 항목은 페이지에서 (전경, 배경) 한 쌍을 집는다. probe 는 브라우저 안에서 돈다.
 * 배경이 별도 요소인 경우(세그먼트의 움직이는 인디케이터)를 위해 쌍으로 반환한다.
 */
const TARGETS = [
  {
    name: '버튼 black',
    url: '/components/button?tab=code',
    probe: () => {
      const el = [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Black');
      if (!el) return null;
      const s = getComputedStyle(el);
      return { fg: s.color, bg: s.backgroundColor };
    },
  },
  {
    name: '버튼 primary',
    url: '/components/button?tab=code',
    probe: () => {
      const el = [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Primary');
      if (!el) return null;
      const s = getComputedStyle(el);
      return { fg: s.color, bg: s.backgroundColor };
    },
  },
  {
    name: '토글 손잡이(ON)',
    url: '/components/toggle?tab=code',
    probe: () => {
      const sw = [...document.querySelectorAll('[role="switch"]')].find((e) => e.getAttribute('aria-checked') === 'true');
      const knob = sw?.querySelector('span, div');
      if (!sw || !knob) return null;
      return { fg: getComputedStyle(knob).backgroundColor, bg: getComputedStyle(sw).backgroundColor };
    },
  },
  {
    name: '툴팁 글자',
    url: '/components/tooltip?tab=code',
    hover: () => {
      const t = [...document.querySelectorAll('figure button, figure span')].find((e) => e.offsetWidth > 0 && e.offsetHeight > 0);
      if (!t) return null;
      const r = t.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    },
    probe: () => {
      const t = document.querySelector('[role="tooltip"]');
      if (!t) return null;
      const s = getComputedStyle(t);
      return { fg: s.color, bg: s.backgroundColor };
    },
  },
  {
    name: '메뉴 항목',
    url: '/components/context-menu?tab=code',
    probe: () => {
      const m = document.querySelector('[role="menu"]');
      const it = m?.querySelector('[role="menuitem"]');
      if (!m || !it) return null;
      return { fg: getComputedStyle(it).color, bg: getComputedStyle(m).backgroundColor };
    },
  },
  {
    name: '세그먼트 선택',
    url: '/components/segment-control?tab=code',
    probe: () => {
      // ⚠️ 반드시 Code 패널 안으로 좁힌다 — 문서의 Design/Code 탭도 role="tab" 이라 문서 순서상
      // 먼저 잡힌다(2026-08-25 이전엔 이 프로브가 세그먼트가 아니라 **문서 탭**을 재고 있었다.
      // DocTabs 가 PDS Tabs 로 바뀌며 인디케이터 span 이 생기자 fg==bg 로 드러났다).
      const sel = document.querySelector('[data-tabpanel="code"] [role="tab"][aria-selected="true"]');
      if (!sel) return null;
      // 선택 면은 형제 인디케이터가 그린다 — 버튼 자신의 배경은 transparent 다
      const ind = sel.parentElement?.querySelector('span[aria-hidden="true"]');
      const bg = ind ? getComputedStyle(ind).backgroundColor : getComputedStyle(document.body).backgroundColor;
      return { fg: getComputedStyle(sel).color, bg };
    },
  },
  {
    name: '토스트 글자',
    url: '/components/toast?tab=code',
    probe: () => {
      const t = document.querySelector('[role="status"], [role="alert"]');
      if (!t) return null;
      // 컨테이너의 color 는 페이지에서 상속받은 값이다 — 실제 글자를 그리는 요소를 찾는다
      const msg = [...t.querySelectorAll('span, p, div')].find((e) => e.textContent?.trim() && !e.children.length) ?? t;
      return { fg: getComputedStyle(msg).color, bg: getComputedStyle(t).backgroundColor };
    },
  },
];

/* ── 실행 ───────────────────────────────────────────────────────── */
const browser = await chromium.launch();
const measured = [];
const missing = [];

for (const theme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 1300, height: 1000 }, colorScheme: theme });
  for (const t of TARGETS) {
    await page.goto(BASE + t.url, { waitUntil: 'domcontentloaded' });
    await page.evaluate((v) => document.documentElement.setAttribute('data-theme', v), theme);
    await page.waitForTimeout(2200);
    if (t.hover) {
      const at = await page.evaluate(t.hover);
      if (at) {
        await page.mouse.move(at.x, at.y);
        await page.waitForTimeout(900);
      }
    }
    const got = await page.evaluate(t.probe);
    const pageBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    if (!got) {
      missing.push(`${t.name} (${theme})`);
      continue;
    }
    measured.push({ name: t.name, theme, ...got, ratio: contrast(got.fg, got.bg, pageBg) });
  }
  await page.close();
}
await browser.close();

/* ── 판정 ───────────────────────────────────────────────────────── */
const fails = [];
const rows = [];
for (const t of TARGETS) {
  const L = measured.find((m) => m.name === t.name && m.theme === 'light');
  const D = measured.find((m) => m.name === t.name && m.theme === 'dark');
  if (!L || !D || L.ratio == null || D.ratio == null) continue;
  const gap = Math.max(L.ratio, D.ratio) / Math.min(L.ratio, D.ratio);
  const worst = Math.min(L.ratio, D.ratio);
  const ok = worst >= FLOOR;
  rows.push({ name: t.name, L: L.ratio, D: D.ratio, gap: +gap.toFixed(2), ok });
  if (!ok) {
    fails.push({
      name: t.name,
      why: `${worst < L.ratio || worst === D.ratio ? '다크' : '라이트'}에서 대비 ${worst} — 묻힘 (하한 ${FLOOR})`,
      light: `${L.fg} on ${L.bg} = ${L.ratio}`,
      dark: `${D.fg} on ${D.bg} = ${D.ratio}`,
    });
  }
}

console.log('');
console.log('  항목                라이트    다크    낙차');
console.log('  ' + '─'.repeat(46));
for (const r of rows) {
  console.log(
    `  ${r.ok ? '✓' : '✗'} ${r.name.padEnd(16)} ${String(r.L).padStart(6)}  ${String(r.D).padStart(6)}  ${String(r.gap).padStart(5)}배`,
  );
}
console.log('');

// 못 찾은 대상은 **실패다**. 통과로 넘기면 셀렉터가 낡아 검사가 조용히 비어도 초록으로 뜬다 —
// 실제로 세그먼트 프로브가 엉뚱한 요소를 재고 있던 사고를 이번(2026-08-25)에 겪었다.
if (missing.length) {
  console.log(`  못 찾은 대상 ${missing.length}건: ${missing.join(', ')}`);
  console.log('  → 프로브 셀렉터가 페이지 구조와 어긋났다. 고치기 전까지 이 항목은 검사되지 않는다.\n');
}

if (fails.length || missing.length) {
  console.log(`  다크 모드 대조 ${rows.length}건 — 불일치 ${fails.length} · 못 찾음 ${missing.length}\n`);
  for (const f of fails) {
    console.log(`  ✗ ${f.name} — ${f.why}`);
    console.log(`      라이트  ${f.light}`);
    console.log(`      다크    ${f.dark}`);
  }
  console.log('');
  console.log('  대개 원인은 짝이 안 맞는 토큰이다. 다크에서 뒤집히는 색과 안 뒤집히는 색을');
  console.log('  섞어 쓰면 라이트에서는 같은 흰색이라 안 보이다가 다크에서만 갈라진다.');
  console.log('    뒤집힘   label-inverse · background-base · action-normal · layer-surface');
  console.log('    고정     static-white · static-black · accent-normal · layer-overlay');
  process.exit(1);
}

console.log(`  다크 모드 대조 ${rows.length}건 — 전부 통과 (하한 ${FLOOR})`);
console.log('  낙차 열은 참고용이다 — 반투명 표면은 페이지 배경 위에 합성되므로 같은 토큰이어도 갈린다.');
console.log('');
