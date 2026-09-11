/**
 * 파일 저장소 — `designs/*.md` 파일이 곧 데이터베이스.
 *
 * 발행 모델(단순화): 검증을 통과해 저장된 파일 = 즉시 발행(published).
 * draft 게이트 없음 — 멀티테넌트 노출 통제가 필요 없는 로컬 단일 관리자 전제.
 *
 * 캐시: 파일 mtime/size 가 그대로면 파싱 결과 재사용 (모듈 스코프 — next dev 재시작 시 초기화).
 * 손으로 넣은 검증 미통과 파일은 목록에서 조용히 제외(console.warn) — 정상 경로는 업로드 API 가
 * prepareDesignUpload 로 선검증 후 저장하므로 도달하지 않는 상태.
 */

import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync, renameSync, existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { parseDesignMd, type ParsedDesignSystem } from './design/designParser';
import {
  resolveFromList,
  parsedToItems,
  type DesignSystemMeta,
  type DesignItemMeta,
  type DesignItemFull,
  type FoundationData,
  type ResolveResult,
} from './design/designGenerators';

const DESIGNS_DIR = join(process.cwd(), 'designs');

/** 킷 전용 not-found 안내 (웹의 "관리자 설정 > 디자인 탭" 문구 대체) */
export const KIT_NOT_FOUND_MSG =
  '발행된 디자인 시스템이 없습니다. 킷 홈 화면(기본 http://localhost:3000)에서 DESIGN.md 를 업로드하세요.';

export interface StoredDesign {
  meta: DesignSystemMeta;
  parsed: ParsedDesignSystem;
  items: DesignItemFull[];
  raw: string;
}

interface CacheEntry {
  mtimeMs: number;
  size: number;
  stored: StoredDesign;
}

const cache = new Map<string, CacheEntry>(); // key = 파일명

function loadFile(file: string): StoredDesign | null {
  const full = join(DESIGNS_DIR, file);
  const st = statSync(full);
  const hit = cache.get(file);
  // 캐시 키 한계: mtime 보존 복사(cp -p 등)로 동일 mtime·동일 크기 파일을 손으로 바꿔치면
  // 스테일 파싱을 제공할 수 있다 — 정상 경로(업로드=tmp+rename, 새 mtime)는 면역. 서버 재시작으로 해소.
  if (hit && hit.mtimeMs === st.mtimeMs && hit.size === st.size) return hit.stored;

  const raw = readFileSync(full, 'utf8');
  const parsedResult = parseDesignMd(raw);
  if (!parsedResult.ok) {
    console.warn(`[PDS] designs/${file} 파싱 실패 — 목록에서 제외 (업로드 API 로 다시 등록하세요)`);
    cache.delete(file);
    return null;
  }
  const parsed = parsedResult.value;
  const iso = new Date(st.mtimeMs).toISOString();
  const stored: StoredDesign = {
    meta: {
      id: parsed.name, // 파일 저장소에선 name 이 곧 식별자
      name: parsed.name,
      title: parsed.title,
      description: parsed.description,
      version: parsed.version,
      status: 'published',
      contentHash: createHash('sha256').update(raw, 'utf8').digest('hex'),
      publishedAt: iso,
      updatedAt: iso,
    },
    parsed,
    items: parsedToItems(parsed),
    raw,
  };
  cache.set(file, { mtimeMs: st.mtimeMs, size: st.size, stored });
  return stored;
}

/** 발행본 전체 (이름순 정렬 — 웹 listPublishedDesignSystems 의 order('name') 등가) */
export function listStoredDesigns(): StoredDesign[] {
  if (!existsSync(DESIGNS_DIR)) return [];
  const candidates: Array<{ file: string; stored: StoredDesign }> = [];
  for (const file of readdirSync(DESIGNS_DIR)) {
    if (!file.endsWith('.md')) continue;
    try {
      const stored = loadFile(file);
      if (stored) candidates.push({ file, stored });
    } catch {
      /* 파일 경합(삭제 직후 등) — 다음 조회에서 수렴 */
    }
  }
  // 이름 중복 방어 — 파일명 규약({name}.md)을 벗어난 사본이 손으로 들어온 경우:
  // canonical 파일명 우선, 그 외엔 최신 mtime. 중복은 warn 1줄 (resolve 'multiple' 오탐 차단).
  const byName = new Map<string, { file: string; stored: StoredDesign }>();
  for (const c of candidates) {
    const name = c.stored.meta.name;
    const prev = byName.get(name);
    if (!prev) {
      byName.set(name, c);
      continue;
    }
    console.warn(
      `[PDS] designs/ 에 동일 이름(${name}) 파일 중복: ${prev.file} · ${c.file} — 규약 파일명(${name}.md) 우선 사용, 나머지는 정리하세요`,
    );
    const canonical = `${name}.md`;
    if (c.file === canonical) byName.set(name, c);
    else if (prev.file !== canonical && (c.stored.meta.updatedAt ?? '') > (prev.stored.meta.updatedAt ?? '')) {
      byName.set(name, c);
    }
  }
  return [...byName.values()]
    .map((c) => c.stored)
    .sort((a, b) => a.meta.name.localeCompare(b.meta.name, 'en-US'));
}

/** 0/1/N 판정 — 코어 resolveFromList 공유 (웹·브리지와 동일 정책) */
export function resolveStoredSystem(systemName?: string): ResolveResult {
  return resolveFromList(
    listStoredDesigns().map((d) => d.meta),
    systemName,
    KIT_NOT_FOUND_MSG,
  );
}

export function getStoredDesign(name: string): StoredDesign | null {
  return listStoredDesigns().find((d) => d.meta.name === name) ?? null;
}

export function listItems(design: StoredDesign): DesignItemMeta[] {
  return design.items.map(({ kind, name, title, description }) => ({ kind, name, title, description }));
}

/** 동명 리소스 공존 시 모호 방지 — component 우선, resource 폴백 (웹 getDesignItem 등가) */
export function getItem(design: StoredDesign, name: string): DesignItemFull | null {
  for (const kind of ['component', 'resource'] as const) {
    const hit = design.items.find((i) => i.kind === kind && i.name === name);
    if (hit) return hit;
  }
  return null;
}

export function getFoundation(design: StoredDesign): FoundationData {
  return {
    tokens: design.parsed.tokens,
    themes: design.parsed.themes,
    overviewMd: design.parsed.overviewMd,
  };
}

/**
 * 검증 통과본 저장 — tmp 쓰기 후 rename(원자 교체). 파일명 = `{parsed.name}.md`.
 * 호출자는 반드시 prepareDesignUpload 를 먼저 통과시킬 것 (이 함수는 재검증하지 않음).
 */
export function saveDesign(name: string, content: string): { replaced: boolean } {
  mkdirSync(DESIGNS_DIR, { recursive: true });
  const target = join(DESIGNS_DIR, `${name}.md`);
  const replaced = existsSync(target);
  const tmp = join(DESIGNS_DIR, `.${name}.md.tmp`);
  try {
    writeFileSync(tmp, content, 'utf8');
    renameSync(tmp, target);
  } catch (e) {
    try {
      unlinkSync(tmp); // 실패 잔재 정리 (없으면 무시)
    } catch {
      /* ignore */
    }
    throw e;
  }
  return { replaced };
}
