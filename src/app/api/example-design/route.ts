/**
 * GET /api/example-design — 저작 시작점 템플릿(examples/DESIGN.md, aurora 샘플) 다운로드.
 *
 * 2026-10-07 까지는 샘플이 designs/aurora.md 로 서빙 목록에도 들어 있어 /api/guide/design-content?name=aurora&raw=1 로
 * 받았다. 공개 서버(pds.polarisoffice.com)의 MCP·가이드에 PDS 외 샘플이 섞여 나오는 걸 피하려고 서빙 목록에서 빼고,
 * 템플릿은 이 경로로만 내려준다(/kit 의 "샘플 DESIGN.md 내려받기"). 항상 공개 — 가이드·다운로드와 같은 읽기 전용 쇼케이스.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  let raw: string;
  try {
    raw = readFileSync(join(process.cwd(), 'examples', 'DESIGN.md'), 'utf8');
  } catch {
    return NextResponse.json({ error: 'example_not_found' }, { status: 404 });
  }
  return new NextResponse(raw, {
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
