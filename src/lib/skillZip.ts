/**
 * 스킬 번들 zip 조립 (킷 셸 — 직접 작성, 생성물 아님).
 *
 * 생성은 코어 사본 buildSkillBundle(순수·결정적)이 담당하고, 여기는 zip 바이트만.
 * 웹(designSkillBundle.ts assembleSkillZip)과 동작 등가를 수동 유지 — 고정 mtime,
 * 루트 폴더 = 스킬 이름({skillName}/SKILL.md). 킷은 Storage 가 없어 온디맨드 조립만
 * (저장 없음 — 파일 저장소=designs/*.md 가 유일한 정본이라 drift 자체가 불가).
 */

import JSZip from 'jszip';
import { buildSkillBundle, type DesignSystemMeta, type FoundationData, type DesignItemFull } from './design/designGenerators';

export async function buildSkillZipBuffer(
  system: DesignSystemMeta,
  foundation: FoundationData,
  items: DesignItemFull[],
): Promise<Buffer> {
  const bundle = buildSkillBundle(system, foundation, items);
  const zip = new JSZip();
  const date = new Date(0); // 결정성 — 같은 발행본이면 바이트 동일
  const root = bundle.skillName;
  zip.file(`${root}/SKILL.md`, bundle.skillMd, { date });
  for (const r of bundle.references) zip.file(`${root}/references/${r.filename}`, r.content, { date });
  return zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
}
