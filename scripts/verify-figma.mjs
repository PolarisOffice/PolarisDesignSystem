/**
 * Figma 대조 검증 — 쇼케이스에 실제로 렌더된 값을 읽어 figma/spec.json 과 맞춘다.
 *
 * 왜 필요한가: 치수·색을 눈으로 대조하다 보면 놓친다(radio 점 크기, segment 폭이
 * 그렇게 새 나갔다). 기대값은 Figma MCP 로 읽은 것만 spec.json 에 적고, 여기서는
 * **브라우저가 실제로 그린 값**과 비교한다 — 코드가 아니라 결과를 본다.
 *
 * 실행: npm run verify:figma   (쇼케이스가 떠 있어야 한다)
 *      BASE=http://localhost:3000 로 주소 변경 가능
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SPEC = JSON.parse(readFileSync(join(ROOT, 'packages/pds-react/figma/spec.json'), 'utf8'));
const BASE = process.env.BASE || 'http://localhost:3000';

const fails = [];
const passes = [];

const check = (label, actual, expected) => {
  const ok = String(actual) === String(expected);
  (ok ? passes : fails).push({ label, actual, expected, ok });
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e)));

await page.goto(`${BASE}/showcase`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);

/* ── Button: size 축 ── */
for (const [size, exp] of Object.entries(SPEC.button.sizes)) {
  const got = await page.evaluate((h) => {
    const b = [...document.querySelectorAll('button')].find((x) => x.offsetHeight === Number(h) && x.textContent === '버튼');
    if (!b) return null;
    const cs = getComputedStyle(b);
    return { height: b.offsetHeight, padding: cs.padding, fontSize: cs.fontSize, fontWeight: cs.fontWeight, borderRadius: cs.borderRadius };
  }, exp.height);
  if (!got) { fails.push({ label: `button/size ${size}`, actual: '못 찾음', expected: exp.height }); continue; }
  for (const k of Object.keys(exp)) check(`button/size ${size}/${k}`, got[k], exp[k]);
}

/* ── Button: variant 색 ── */
for (const [v, exp] of Object.entries(SPEC.button.variants)) {
  const got = await page.evaluate((bg) => {
    const b = [...document.querySelectorAll('button')].find((x) => getComputedStyle(x).backgroundColor === bg && x.offsetHeight === 48);
    return b ? { backgroundColor: getComputedStyle(b).backgroundColor, color: getComputedStyle(b).color } : null;
  }, exp.backgroundColor);
  if (!got) { fails.push({ label: `button/${v}`, actual: '못 찾음', expected: exp.backgroundColor }); continue; }
  check(`button/${v}/bg`, got.backgroundColor, exp.backgroundColor);
  check(`button/${v}/color`, got.color, exp.color);
}

/* ── Input ── */
{
  const got = await page.evaluate(() => {
    const inp = document.querySelector('input[type="text"], input:not([type])');
    const box = inp?.closest('div');
    if (!box) return null;
    const cs = getComputedStyle(box);
    return { height: box.offsetHeight, borderRadius: cs.borderRadius, fontSize: getComputedStyle(inp).fontSize };
  });
  if (got) {
    check('input/height', got.height, SPEC.input.height);
    check('input/borderRadius', got.borderRadius, SPEC.input.borderRadius);
    check('input/fontSize', got.fontSize, SPEC.input.fontSize);
  } else fails.push({ label: 'input', actual: '못 찾음', expected: '-' });
}

/* ── Toggle ── */
{
  const got = await page.evaluate(() => {
    const sw = [...document.querySelectorAll('[role="switch"]')];
    // 꺼짐 트랙을 재려면 aria-checked=false 를 명시해 골라야 한다 — 폭만 보면 켜진 것이 잡힌다
    const plain = sw.find((s) => s.offsetWidth === 35 && s.getAttribute('aria-checked') === 'false');
    const on = sw.find((s) => s.getAttribute('aria-checked') === 'true');
    return plain ? { w: plain.offsetWidth, h: plain.offsetHeight, off: getComputedStyle(plain).backgroundColor, on: on ? getComputedStyle(on).backgroundColor : null } : null;
  });
  if (got) {
    check('toggle/width', got.w, SPEC.toggle.width);
    check('toggle/height', got.h, SPEC.toggle.height);
    check('toggle/on', got.on, SPEC.toggle.on);
    check('toggle/off', got.off, SPEC.toggle.off);
  } else fails.push({ label: 'toggle', actual: '못 찾음', expected: '-' });
}

/* ── Checkbox / Radio ── */
{
  const got = await page.evaluate(() => {
    const cb = [...document.querySelectorAll('input[type=checkbox]')].map((i) => i.parentElement?.querySelector('span[aria-hidden]')).filter(Boolean);
    const on = cb.find((b) => getComputedStyle(b).backgroundColor === 'rgb(29, 127, 249)');
    const rad = [...document.querySelectorAll('input[type=radio]')].find((r) => r.checked);
    const ring = rad?.parentElement?.querySelector('span[aria-hidden]');
    const dot = ring?.firstElementChild;
    return {
      cbBox: on?.offsetWidth, cbRadius: on ? getComputedStyle(on).borderRadius : null,
      ringBox: ring?.offsetWidth, ringBorder: ring ? getComputedStyle(ring).borderTopWidth : null,
      dot: dot ? +dot.getBoundingClientRect().width.toFixed(1) : null,
    };
  });
  check('checkbox/box', got.cbBox, SPEC.checkbox.box);
  check('checkbox/borderRadius', got.cbRadius, SPEC.checkbox.borderRadius);
  check('radio/box', got.ringBox, SPEC.radio.box);
  check('radio/borderWidth', got.ringBorder, SPEC.radio.borderWidth);
  check('radio/dot', got.dot, SPEC.radio.dot);
}

/* ── Tab ── */
{
  const got = await page.evaluate(() => {
    const t = [...document.querySelectorAll('[role="tab"]')].filter((x) => x.offsetHeight === 60);
    const act = t.find((x) => x.getAttribute('aria-selected') === 'true');
    return act ? { h: act.offsetHeight, color: getComputedStyle(act).color, fw: getComputedStyle(act).fontWeight, fs: getComputedStyle(act).fontSize } : null;
  });
  if (got) {
    check('tab/height', got.h, SPEC.tab.height);
    check('tab/fontSize', got.fs, SPEC.tab.fontSize);
    check('tab/primaryActive/color', got.color, SPEC.tab.primaryActive.color);
    check('tab/primaryActive/fontWeight', got.fw, SPEC.tab.primaryActive.fontWeight);
  } else fails.push({ label: 'tab', actual: '못 찾음', expected: '-' });
}

/* ── Segment: 폭 불변이 규칙 ── */
{
  const got = await page.evaluate(() => {
    const t = [...document.querySelectorAll('[role="tab"]')].filter((x) => x.offsetHeight === 48);
    const sel = t.filter((x) => x.getAttribute('aria-selected') === 'true');
    const idle = t.filter((x) => x.getAttribute('aria-selected') !== 'true');
    // outlined 의 선택 면은 버튼이 아니라 형제 인디케이터가 그린다 — 그림자도 거기 붙는다
    const outlinedInd = [...document.querySelectorAll('span[aria-hidden="true"]')].find((el) => {
      const c = getComputedStyle(el);
      return c.position === 'absolute' && c.boxShadow !== 'none' && el.offsetHeight > 20;
    });
    return { h: t[0]?.offsetHeight, selW: sel.map((x) => x.offsetWidth), idleW: idle.map((x) => x.offsetWidth),
      selRadius: sel[0] ? getComputedStyle(sel[0]).borderRadius : null,
      idleRadius: idle[0] ? getComputedStyle(idle[0]).borderRadius : null,
      outlinedShadow: outlinedInd ? getComputedStyle(outlinedInd).boxShadow : null };
  });
  check('segment/boxHeight', got.h, SPEC.segment.boxHeight);
  check('segment/activeRadius', got.selRadius, SPEC.segment.activeRadius);
  check('segment/idleRadius', got.idleRadius, SPEC.segment.idleRadius);
  check('segment/outlinedShadow', got.outlinedShadow, SPEC.segment.outlinedShadow);
  const widths = [...got.selW, ...got.idleW];
  check('segment/폭 불변(선택해도 안 변함)', new Set(widths).size, 1);
}

/* ── Select ── */
for (const [size, exp] of Object.entries(SPEC.select.sizes)) {
  const got = await page.evaluate((h) => {
    const b = [...document.querySelectorAll('button[aria-haspopup="listbox"]')].find((x) => x.offsetHeight === Number(h));
    return b ? { height: b.offsetHeight, borderRadius: getComputedStyle(b).borderRadius, fontSize: getComputedStyle(b).fontSize } : null;
  }, exp.height);
  if (!got) { fails.push({ label: `select/${size}`, actual: '못 찾음', expected: exp.height }); continue; }
  for (const k of Object.keys(exp)) check(`select/${size}/${k}`, got[k], exp[k]);
}

/* ── Menu Item ── */
{
  const got = await page.evaluate(() => {
    const m = document.querySelector('[role="menu"]');
    const it = m?.querySelector('[role="menuitem"]');
    return m && it ? { h: it.offsetHeight, radius: getComputedStyle(it).borderRadius, fs: getComputedStyle(it).fontSize,
      menuMaxH: getComputedStyle(m).maxHeight, menuRadius: getComputedStyle(m).borderRadius, menuPad: getComputedStyle(m).padding, shadow: getComputedStyle(m).boxShadow } : null;
  });
  if (got) {
    check('menuItem/height', got.h, SPEC.menuItem.height);
    check('menuItem/borderRadius', got.radius, SPEC.menuItem.borderRadius);
    check('menuItem/fontSize', got.fs, SPEC.menuItem.fontSize);
    check('contextMenu/borderRadius', got.menuRadius, SPEC.menuItem.menuRadius);
    check('contextMenu/padding', got.menuPad, SPEC.menuItem.menuPadding);
    check('contextMenu/shadow', got.shadow, SPEC.menuItem.menuShadow);
    check('contextMenu/maxHeight', got.menuMaxH, SPEC.menuItem.menuMaxHeight);
  } else fails.push({ label: 'menuItem', actual: '못 찾음', expected: '-' });
}

/* ── Table ── */
{
  const got = await page.evaluate(() => {
    const t = document.querySelector('table');
    const box = t?.parentElement;
    const th = t?.querySelector('th'), td = t?.querySelector('td');
    return t ? { radius: getComputedStyle(box).borderRadius, pad: getComputedStyle(th).padding, fs: getComputedStyle(th).fontSize,
      headerBg: getComputedStyle(th).backgroundColor, headerColor: getComputedStyle(th).color,
      cellBg: getComputedStyle(td).backgroundColor, cellColor: getComputedStyle(td).color } : null;
  });
  if (got) {
    check('table/containerRadius', got.radius, SPEC.table.containerRadius);
    check('table/cellPadding', got.pad, SPEC.table.cellPadding);
    check('table/fontSize', got.fs, SPEC.table.fontSize);
    check('table/headerBg', got.headerBg, SPEC.table.headerBg);
    check('table/headerColor', got.headerColor, SPEC.table.headerColor);
    check('table/cellColor', got.cellColor, SPEC.table.cellColor);
  } else fails.push({ label: 'table', actual: '못 찾음', expected: '-' });
}

/* ── Badge / Credit ── */
{
  const got = await page.evaluate(() => {
    const els = [...document.querySelectorAll('span,button')].filter((e) => e.children.length === 0 && e.textContent?.trim() === 'Text');
    const idle = els.find((e) => getComputedStyle(e).backgroundColor === 'rgb(242, 244, 246)');
    const sel = els.find((e) => getComputedStyle(e).backgroundColor === 'rgb(217, 234, 255)');
    const credits = [...document.querySelectorAll('span')].filter((e) => e.textContent?.trim() === '10' && e.querySelector('svg'));
    return {
      idleColor: idle ? getComputedStyle(idle).color : null, idleRadius: idle ? getComputedStyle(idle).borderRadius : null,
      idlePad: idle ? getComputedStyle(idle).padding : null, selColor: sel ? getComputedStyle(sel).color : null,
      creditOn: credits[0] ? { bg: getComputedStyle(credits[0]).backgroundColor, color: getComputedStyle(credits[0]).color } : null,
      creditOff: credits[1] ? { bg: getComputedStyle(credits[1]).backgroundColor, color: getComputedStyle(credits[1]).color } : null,
    };
  });
  check('badge/idle/color', got.idleColor, SPEC.badge.idle.color);
  check('badge/idle/radius', got.idleRadius, SPEC.badge.borderRadius);
  check('badge/idle/padding', got.idlePad, SPEC.badge.padding);
  check('badge/selected/color', got.selColor, SPEC.badge.selected.color);
  if (got.creditOn) {
    check('credit/available/bg', got.creditOn.bg, SPEC.credit.available.backgroundColor);
    check('credit/available/color', got.creditOn.color, SPEC.credit.available.color);
  }
  if (got.creditOff) check('credit/unavailable/color', got.creditOff.color, SPEC.credit.unavailable.color);
}

/* ── Dim ── */
{
  const got = await page.evaluate(() => {
    const d = [...document.querySelectorAll('[aria-busy]')].find((x) => getComputedStyle(x).position === 'absolute');
    return d ? { bg: getComputedStyle(d).backgroundColor, spinner: d.querySelector('svg')?.getAttribute('width') } : null;
  });
  if (got) {
    check('dim/backgroundColor', got.bg, SPEC.dim.backgroundColor);
    check('dim/spinner', got.spinner, SPEC.dim.spinner);
  }
}

/* ── 상호작용이 필요한 것: Toast · Popup · Tooltip ── */
await page.locator('button', { hasText: '성공' }).first().click();
await page.waitForTimeout(500);
{
  const got = await page.evaluate(() => {
    const t = document.querySelector('[role="status"][aria-live]');
    if (!t) return null;
    const cs = getComputedStyle(t);
    return { h: t.offsetHeight, radius: cs.borderRadius, bg: cs.backgroundColor, blur: cs.backdropFilter, shadow: cs.boxShadow,
      offset: getComputedStyle(t.parentElement).bottom };
  });
  if (got) {
    check('toast/height', got.h, SPEC.toast.height);
    check('toast/borderRadius', got.radius, SPEC.toast.borderRadius);
    check('toast/backgroundColor', got.bg, SPEC.toast.backgroundColor);
    check('toast/backdropFilter', got.blur, SPEC.toast.backdropFilter);
    check('toast/boxShadow', got.shadow, SPEC.toast.boxShadow);
    check('toast/edgeOffset', got.offset, `${SPEC.toast.edgeOffset}px`);
  } else fails.push({ label: 'toast', actual: '못 찾음', expected: '-' });
}
await page.waitForTimeout(3200);

await page.locator('button', { hasText: 'TWO BTN' }).first().click();
await page.waitForTimeout(500);
{
  const got = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    if (!d) return null;
    const cs = getComputedStyle(d);
    const acts = [...d.querySelectorAll('button')].filter((b) => b.getAttribute('aria-label') !== '닫기');
    return { w: d.offsetWidth, radius: cs.borderRadius, shadow: cs.boxShadow, dim: getComputedStyle(d.parentElement).backgroundColor,
      titleFs: getComputedStyle(d.querySelector('h2')).fontSize, btnH: acts[0]?.offsetHeight,
      // 내용폭이면 버튼 두 개 합이 패널 안쪽 폭보다 확실히 작다
      btnHugs: acts.length > 1 ? acts.reduce((a, b) => a + b.offsetWidth, 0) < d.offsetWidth - 64 : undefined };
  });
  if (got) {
    check('popup/width', got.w, SPEC.popup.width);
    check('popup/borderRadius', got.radius, SPEC.popup.borderRadius);
    check('popup/boxShadow', got.shadow, SPEC.popup.boxShadow);
    check('popup/dim', got.dim, SPEC.popup.dim);
    check('popup/titleFontSize', got.titleFs, SPEC.popup.titleFontSize);
    // 웹 변형은 ONE·TWO 모두 32px (모바일이 48/45 로 갈렸던 축이 사라졌다)
    check('popup/buttonHeight', got.btnH, SPEC.popup.buttonHeight);
    // 버튼은 내용폭 + 우측 정렬 — 전체폭 균등 분할(모바일)과 구분하는 축
    check('popup/buttonHugs(전체폭 아님)', got.btnHugs, true);
  } else fails.push({ label: 'popup', actual: '못 찾음', expected: '-' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
}

await page.locator('button', { hasText: 'top' }).first().hover();
await page.waitForTimeout(900);
{
  const got = await page.evaluate(() => {
    const t = document.querySelector('[role="tooltip"]');
    if (!t) return null;
    const cs = getComputedStyle(t);
    return { radius: cs.borderRadius, pad: cs.padding, fs: cs.fontSize, bg: cs.backgroundColor, blur: cs.backdropFilter, maxW: cs.maxWidth };
  });
  if (got) {
    check('tooltip/borderRadius', got.radius, SPEC.tooltip.borderRadius);
    check('tooltip/padding', got.pad, SPEC.tooltip.padding);
    check('tooltip/fontSize', got.fs, SPEC.tooltip.fontSize);
    check('tooltip/backgroundColor', got.bg, SPEC.tooltip.backgroundColor);
    check('tooltip/backdropFilter', got.blur, SPEC.tooltip.backdropFilter);
    check('tooltip/maxWidth', got.maxW, SPEC.tooltip.maxWidth);
  } else fails.push({ label: 'tooltip', actual: '못 찾음', expected: '-' });
}

await browser.close();

/* ── 보고 ── */
console.log(`\n검사 ${passes.length + fails.length}건 — 통과 ${passes.length} / 불일치 ${fails.length}`);
if (pageErrors.length) console.log(`\n콘솔 에러 ${pageErrors.length}건:\n  ${pageErrors.slice(0, 3).join('\n  ')}`);
if (fails.length) {
  console.log('\n디자인과 다른 값:');
  for (const f of fails) console.log(`  ✗ ${f.label}\n      기대(Figma) ${f.expected}\n      실제(렌더)  ${f.actual}`);
  process.exit(1);
}
console.log('\n전부 Figma 값과 일치합니다.');
