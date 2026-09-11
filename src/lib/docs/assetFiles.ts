import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * 에셋 파생 파일 탐지 (서버 전용).
 *
 * 규약: SVG 원본과 **같은 폴더·같은 이름**에 파생 파일을 두면 카드에 버튼이 자동으로 붙는다.
 *   `/logos/{이름}.svg`       ← 원본(항상 존재)
 *   `/logos/{이름}.ai`        ← 화면용(RGB) 일러스트레이터 원본
 *   `/logos/{이름}-print.ai`  ← 인쇄용(CMYK) 원본
 * (2026-09-04 현재 이 규약을 타는 카드는 없다 — 로고 페이지는 po-2026 패키지 데이터로 버튼을 직접 그린다.
 *  AssetCard 의 href 경로에서만 호출되므로 그 경로를 쓰는 페이지가 생기면 다시 살아난다.)
 *
 * .ai 는 바이너리라 저장소에 있는 것만 노출한다 — 파일을 `public/` 에 넣는 즉시 버튼이 생기고,
 * 없으면 버튼 자체를 그리지 않는다(죽은 링크 금지). 존재 검사는 빌드/요청 시 서버에서 한다.
 */
export interface AssetFormats {
  svg: string;
  ai?: string;
  aiPrint?: string;
}

const PUBLIC_DIR = join(process.cwd(), 'public');

function has(publicPath: string): boolean {
  return existsSync(join(PUBLIC_DIR, publicPath.replace(/^\//, '')));
}

/** `/logos/group/primary-logo.svg` → 존재하는 파생 파일만 담은 포맷 목록 */
export function assetFormats(svgPath: string): AssetFormats {
  const base = svgPath.replace(/\.svg$/i, '');
  return {
    svg: svgPath,
    ...(has(`${base}.ai`) ? { ai: `${base}.ai` } : null),
    ...(has(`${base}-print.ai`) ? { aiPrint: `${base}-print.ai` } : null),
  };
}
