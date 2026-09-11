/**
 * GET /api/guide/design-content?name={name} — 가이드 마크다운 (?raw=1 은 DESIGN.md 원문 다운로드).
 * 경로·응답 형태는 VibeAgent 웹과 미러 — DesignGuideView(verbatim 사본)의 다운로드 버튼이 이 경로를 가리킴.
 * 가이드는 읽기 전용 쇼케이스라 토큰 게이트 미적용(공개).
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildGuideMarkdown, skillZipFilename } from '@/lib/design/designGenerators';
import { DESIGN_NAME_RE } from '@/lib/design/designConstants';
import { getStoredDesign, getFoundation } from '@/lib/store';
import { buildSkillZipBuffer } from '@/lib/skillZip';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') ?? '';
  if (!DESIGN_NAME_RE.test(name)) {
    return NextResponse.json({ error: '잘못된 이름 형식입니다.' }, { status: 400 });
  }
  const design = getStoredDesign(name);
  if (!design) {
    return NextResponse.json({ error: '디자인 시스템을 찾을 수 없습니다.' }, { status: 404 });
  }

  // ?skill=1 — 생성 스킬 번들(zip). 킷은 Storage 없이 온디맨드 조립 (웹과 동일 생성기 = 산출 동일)
  if (req.nextUrl.searchParams.get('skill') === '1') {
    const zip = await buildSkillZipBuffer(design.meta, getFoundation(design), design.items);
    return new NextResponse(new Uint8Array(zip), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${skillZipFilename(design.meta.name)}"`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      },
    });
  }

  if (req.nextUrl.searchParams.get('raw') === '1') {
    return new NextResponse(design.raw, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': 'attachment; filename="DESIGN.md"',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      },
    });
  }

  const markdown = buildGuideMarkdown(design.meta, getFoundation(design), design.items);
  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    },
  });
}
