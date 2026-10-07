/**
 * POST /api/upload — DESIGN.md 업로드 (검증 통과 = 즉시 발행).
 * 게이트 순서: 공개 서버 모드(403, NEXT_PUBLIC_DESIGN_KIT_HOSTED) → Host 허용목록(403, DNS rebinding) → same-origin(403, CSRF)
 *   → 토큰 옵션(401) → Content-Length 사전 거절(413) → JSON → 본문 바이트 재검증(413 — chunked 등 Content-Length 부재 요청 커버)
 *   → 개수 캡(400) → prepareDesignUpload(400 {issues}) → 저장.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prepareDesignUpload } from '@/lib/design/designGenerators';
import { lintDesignSystem } from '@/lib/design/designLint';
import { DESIGN_RAW_MAX_BYTES, DESIGN_SYSTEMS_PER_TENANT_MAX } from '@/lib/design/designConstants';
import { saveDesign, getStoredDesign, listStoredDesigns } from '@/lib/store';
import { checkKitAuth, unauthorized, checkSameOrigin, crossOriginForbidden, checkAllowedHost, hostForbidden } from '@/lib/auth';
import { IS_HOSTED, uploadDisabled } from '@/lib/hosting';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 공개 서버 모드 — 어떤 요청이든 업로드 자체를 받지 않는다(화면엔 업로드가 없지만 API 가 권위 게이트)
  if (IS_HOSTED) return uploadDisabled();
  // /api/mcp 와 같은 Host 허용목록 — same-origin 검사는 DNS rebinding 아래서 무력하므로 먼저 건다.
  if (!checkAllowedHost(req)) return hostForbidden();
  if (!checkSameOrigin(req)) return crossOriginForbidden();
  if (!checkKitAuth(req)) return unauthorized();

  // 본문을 읽기 전 크기 사전 거절 — 빠른 실패용. Content-Length 없는 요청(chunked 등)은
  // 통과하므로 아래 본문 바이트 재검증이 권위 게이트다. margin 은 JSON 이스케이프
  // 오버헤드(개행→\n 등) 여유분.
  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > DESIGN_RAW_MAX_BYTES + 65536) {
    return NextResponse.json({ error: 'DESIGN.md 는 512KB 이하여야 합니다.' }, { status: 413 });
  }

  let body: { content?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
  const content = typeof body.content === 'string' ? body.content : '';
  if (!content.trim()) {
    return NextResponse.json({ error: 'DESIGN.md 내용이 비어 있습니다.' }, { status: 400 });
  }
  if (Buffer.byteLength(content, 'utf8') > DESIGN_RAW_MAX_BYTES) {
    return NextResponse.json({ error: 'DESIGN.md 는 512KB 이하여야 합니다.' }, { status: 413 });
  }

  const prep = prepareDesignUpload(content);
  if (!prep.ok) {
    return NextResponse.json({ error: prep.error, issues: prep.issues }, { status: prep.status });
  }

  // 개수 캡 — 재업로드(동명 교체)는 카운트 무관. 킷엔 삭제 UI 가 없으므로 정리 방법을 안내.
  const exists = getStoredDesign(prep.parsed.name) !== null;
  if (!exists && listStoredDesigns().length >= DESIGN_SYSTEMS_PER_TENANT_MAX) {
    return NextResponse.json(
      {
        error: `디자인 시스템은 최대 ${DESIGN_SYSTEMS_PER_TENANT_MAX}개입니다. designs/ 폴더에서 안 쓰는 .md 파일을 삭제한 뒤 다시 업로드하세요.`,
      },
      { status: 400 },
    );
  }

  const { replaced } = saveDesign(prep.parsed.name, prep.content);
  return NextResponse.json(
    {
      ok: true,
      name: prep.parsed.name,
      version: prep.parsed.version,
      replaced,
      componentCount: prep.parsed.components.length,
      resourceCount: prep.parsed.resources.length,
      contentHash: prep.contentHash,
      compatNotes: prep.compatNotes,
      lintReport: lintDesignSystem(prep.parsed), // 품질 진단 (advisory)
    },
    { status: replaced ? 200 : 201 },
  );
}
