import type { AssetFormats } from '@/lib/docs/assetFiles';
import s from './AssetCard.module.css';

/**
 * 에셋 다운로드 버튼 묶음 — SVG(원본) + AI(일러스트레이터, 파일이 있을 때만).
 *
 * PNG 는 2026-08-21 제외했다(요청) — 한때 브라우저 canvas 로 즉석 변환해 내려주었으나 로고 배포
 * 포맷을 SVG·AI 로 한정한다. 되살릴 일이 생기면 §16 이력을 참고할 것.
 *
 * AI 는 파생 불가(바이너리)라 `public/` 에 실제 파일이 있을 때만 버튼이 뜬다 — 규약은 assetFiles.ts.
 */
export default function AssetDownload({ formats }: { formats: AssetFormats }) {
  return (
    <span className={s.formats}>
      <a className={s.download} href={formats.svg} download>
        SVG
      </a>
      {formats.ai && (
        <a className={s.formatBtn} href={formats.ai} download>
          AI
        </a>
      )}
      {formats.aiPrint && (
        <a className={s.formatBtn} href={formats.aiPrint} download>
          AI · 인쇄용
        </a>
      )}
    </span>
  );
}
