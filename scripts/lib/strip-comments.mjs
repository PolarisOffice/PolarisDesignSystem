/**
 * 배포물 주석 제거 — 소스(정본)에는 내부 메모를 자유롭게 남기고, 배포되는 파일에서만 걷어낸다.
 *
 * 왜(2026-09-01, 정보보호팀 이관 전 검토): npm dist·오프라인 스킬 zip 에 Figma 파일 키·작업 메모·
 * 사고 이력 같은 사내용 주석이 그대로 실렸다. 소스에서 지우면 유지보수 맥락이 사라지므로
 * 배포 단계에서 제거한다.
 *
 * 규칙 (TypeScript 파서 기반 — JSX 텍스트 안의 `//`·문자열 안의 `/*` 는 주석이 아니라 안전):
 *  - mode 'all'          : 모든 주석 제거 (.js 실행 코드)
 *  - mode 'public-jsdoc' : export 된 선언과 그 멤버(prop)에 붙은 JSDoc(`/** … *​/`)만 남김 — 소비자·AI 가
 *                          prop 의미를 읽는 유일한 설명이라 유지. 그 외(파일 머리 설명·`//`·`/* *​/`)는 제거 (.d.ts·zip 소스)
 *  - css                 : 모든 주석 제거
 * `'use client'` 는 문자열 디렉티브라 영향 없음.
 */
import ts from 'typescript';

const JSDOC_RE = /^\/\*\*[^*]/;

function isExportish(node) {
  if (!node) return false;
  if (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) return true;
  if (ts.isExportAssignment(node) || ts.isExportDeclaration(node)) return true;
  return false;
}
/** 노드가 export 된 interface/type/class/enum 의 멤버인가 (prop 설명 JSDoc 보존용) */
function isMemberOfExported(node) {
  let p = node.parent;
  while (p && !ts.isSourceFile(p)) {
    if (ts.isInterfaceDeclaration(p) || ts.isTypeAliasDeclaration(p) || ts.isClassDeclaration(p) || ts.isEnumDeclaration(p)) return isExportish(p);
    p = p.parent;
  }
  return false;
}

export function stripTsComments(code, filename, mode = 'public-jsdoc') {
  if (mode === 'all' && /\.jsx?$/.test(filename)) {
    // 실행 코드는 컴파일러에게 맡긴다 — removeComments 가 모든 주석을 확실히 걷고 'use client' 디렉티브는 남긴다
    return ts.transpileModule(code, {
      compilerOptions: { removeComments: true, target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.Preserve },
      fileName: filename,
    }).outputText;
  }
  const kind = /\.tsx$/.test(filename) ? ts.ScriptKind.TSX : /\.jsx$/.test(filename) ? ts.ScriptKind.JSX : /\.js$/.test(filename) ? ts.ScriptKind.JS : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true, kind);
  const text = sf.text;
  /** pos → 보존 여부. 같은 위치의 trivia 는 여러 조상 노드가 공유하므로 처음(가장 바깥) 판정을 쓴다 */
  const decisions = new Map();
  const consider = (ranges, node) => {
    for (const r of ranges ?? []) {
      if (decisions.has(r.pos)) continue;
      const src = text.slice(r.pos, r.end);
      const keep = mode === 'public-jsdoc' && JSDOC_RE.test(src) && (isExportish(node) || isMemberOfExported(node));
      decisions.set(r.pos, { ...r, keep });
    }
  };
  // getChildren 은 구두점 토큰까지 돌려준다 — `a: 1, // 메모` 처럼 쉼표 뒤 같은 줄 주석은
  // 앞 노드의 trailing 도, 다음 노드의 leading 도 아니어서(줄바꿈 전) 토큰 뒤 trailing 으로만 잡힌다.
  const walk = (node, owner) => {
    const isToken = node.kind < ts.SyntaxKind.FirstNode; // 구두점·키워드 토큰
    const decisionNode = isToken ? owner : node;
    if (node.kind !== ts.SyntaxKind.JsxText) {
      consider(ts.getLeadingCommentRanges(text, node.getFullStart()), decisionNode);
      consider(ts.getTrailingCommentRanges(text, node.getEnd()), decisionNode);
    }
    for (const c of node.getChildren(sf)) walk(c, isToken ? owner : node);
  };
  walk(sf, sf);
  // 파일 끝 주석
  consider(ts.getLeadingCommentRanges(text, sf.endOfFileToken.getFullStart()), sf.endOfFileToken);

  const drops = [...decisions.values()].filter((d) => !d.keep).sort((a, b) => a.pos - b.pos);
  let out = '';
  let cursor = 0;
  for (const d of drops) {
    out += text.slice(cursor, d.pos);
    cursor = d.end;
    // 줄 주석이 차지하던 줄바꿈은 남겨 두고, 뒤따르는 공백만 정리
  }
  out += text.slice(cursor);
  // 주석만 있던 줄이 빈 줄로 남는다 — 연속 빈 줄 3+ → 2, 공백만 있는 줄 → 빈 줄
  return out.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '');
}

export function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '');
}
