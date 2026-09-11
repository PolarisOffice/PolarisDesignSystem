import { notFound, redirect } from 'next/navigation';
import DesignGuideView from '@/components/design/DesignGuideView';
import { getStoredDesign, getFoundation } from '@/lib/store';
import { DESIGN_NAME_RE } from '@/lib/design/designConstants';
import { liveComponentsFor, PDS_SYSTEM_NAME } from '@/live-components';

export const dynamic = 'force-dynamic';

/**
 * /guide/design/[name] — 디자인 시스템 비주얼 가이드.
 * 렌더는 DesignGuideView(생성 사본 — VibeAgent 웹과 verbatim 동일)가 담당.
 * 토큰 스와치·샘플 화면은 검증된 토큰 값만 사용 — 업로드 코드 실행 없음(XSS 불변식).
 */
export default async function DesignGuideDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name: rawName } = await params;
  let name: string;
  try {
    name = decodeURIComponent(rawName);
  } catch {
    notFound(); // 잘못된 퍼센트 시퀀스(%zz 등) — 500 대신 404 (웹 원본과 동일 처리)
  }
  if (!DESIGN_NAME_RE.test(name)) notFound();
  // PDS 는 문서 사이트(/)가 정본 — 범용 가이드 뷰는 중복이라 홈으로 보낸다(2026-08-27).
  // 다른 시스템(샘플·사용자 업로드)은 이 범용 뷰가 유일한 화면이다.
  if (name === PDS_SYSTEM_NAME) redirect('/');

  const design = getStoredDesign(name);
  if (!design) notFound();
  const foundation = getFoundation(design);

  return (
    <DesignGuideView
      system={{
        name: design.meta.name,
        title: design.meta.title,
        description: design.meta.description,
        version: design.meta.version,
        publishedAt: design.meta.publishedAt,
        contentHash: design.meta.contentHash,
      }}
      tokens={foundation.tokens}
      themes={foundation.themes}
      items={design.items}
      liveComponents={liveComponentsFor(design.meta.name)}
    />
  );
}
