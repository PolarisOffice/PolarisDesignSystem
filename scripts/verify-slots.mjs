/**
 * 구멍 명세 ↔ 패키지 대조.
 *
 * docs/slots.md 는 사람이 읽고 figma/slots.json 은 템플릿이 읽는다. 둘 다 손으로
 * 적으므로 컴포넌트가 바뀌면 조용히 어긋난다 — 여기서 **패키지가 실제로 내보내는
 * 것·실제로 지원하는 축**과 맞춰 본다.
 *
 * 실행: npm run verify:slots
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const slots = JSON.parse(readFileSync(join(ROOT, 'packages/pds-react/figma/slots.json'), 'utf8'));
const pkg = await import(join(ROOT, 'packages/pds-react/dist/index.js'));

/** 상호작용(호버·포커스·선택)으로 결정돼 prop 으로 선언하지 않는 축 */
const INTERACTION_AXES = new Set(['state', 'status']);

const fails = [];
let checks = 0;

for (const [key, spec] of Object.entries(slots)) {
  if (key.startsWith('_')) continue;

  // 1) 명세가 가리키는 컴포넌트가 패키지에 있는가
  checks++;
  const C = pkg[spec.component];
  if (!C) { fails.push(`${key}: 패키지에 '${spec.component}' export 가 없습니다`); continue; }

  // 2) 컨테이너(ContextMenu 등)도 확인
  if (spec.container) {
    checks++;
    if (!pkg[spec.container.component]) fails.push(`${key}: 컨테이너 '${spec.container.component}' export 가 없습니다`);
  }

  // 3) 명세의 축 값이 컴포넌트가 지원한다고 알린 값과 같은가
  const sup = C.supportedProps ?? {};
  for (const [axis, values] of Object.entries(spec.axes ?? {})) {
    const declared = sup[axis];
    if (!Array.isArray(declared)) {
      // 상호작용으로 결정되는 축은 코드가 선언하지 않는다 — 정상.
      // 그 외에 선언이 없다는 건 **prop 이름이 어긋났다**는 뜻이라 잡는다
      // (예: 코드가 type → variant 로 개명됐는데 명세는 그대로).
      if (INTERACTION_AXES.has(axis)) continue;
      checks++;
      fails.push(
        `${key}/${axis}: 컴포넌트가 이 축을 선언하지 않습니다 — prop 이름이 바뀌었을 수 있습니다` +
          `\n      코드가 선언한 축: ${Object.keys(sup).filter((k) => k !== 'acceptsChildren').join(', ') || '(없음)'}`,
      );
      continue;
    }
    checks++;
    const d = declared.map(String);
    const w = values.map(String);
    const missing = w.filter((v) => !d.includes(v));
    const extra = d.filter((v) => !w.includes(v));
    if (missing.length || extra.length) {
      fails.push(
        `${key}/${axis}: 명세와 컴포넌트 선언이 다릅니다` +
          (missing.length ? `\n      명세에만: ${missing.join(', ')}` : '') +
          (extra.length ? `\n      코드에만: ${extra.join(', ')}` : ''),
      );
    }
  }
}

// 4) 패키지가 내보내는데 명세에 없는 컴포넌트
const named = new Set(Object.values(slots).filter((s) => s.component).map((s) => s.component));
for (const s of Object.values(slots)) if (s.container) named.add(s.container.component);
const exported = Object.entries(pkg)
  .filter(([n, v]) => typeof v === 'function' && /^[A-Z]/.test(n))
  .map(([n]) => n);
const unlisted = exported.filter((n) => !named.has(n));
checks++;
if (unlisted.length) fails.push(`명세에 없는 export: ${unlisted.join(', ')}`);

console.log(`\n슬롯 명세 대조 ${checks}건 — ${fails.length ? `불일치 ${fails.length}` : '전부 일치'}`);
if (fails.length) {
  console.log('');
  for (const f of fails) console.log(`  ✗ ${f}`);
  process.exit(1);
}
const total = Object.entries(slots).filter(([k]) => !k.startsWith('_'))
  .reduce((a, [, s]) => a + (s.axes ? Object.values(s.axes).reduce((x, v) => x * v.length, 1) : s.cases ? Object.keys(s.cases).length : 1), 0);
console.log(`컴포넌트 ${named.size}종 · 구멍 조합 ${total}개\n`);
