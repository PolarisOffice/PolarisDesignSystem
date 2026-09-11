/**
 * /api/mcp — 로컬 AI(Claude Code 등)가 호출하는 MCP 서빙 엔드포인트.
 *
 * VibeAgent 브리지(/api/local-ai/mcp)의 검증된 패턴을 그대로 따른다:
 * transport + server 를 **요청마다** 새로 만든다(stateless). 모듈 스코프 재사용은
 * 두 번째 요청에서 throw 한다. close 는 finally 에서(JSON 모드 한정 안전).
 *
 * 인증: 무인증 기본, env `DESIGN_KIT_TOKEN` 설정 시에만 Bearer 요구.
 * 도구 출력: structuredContent + notice(데이터 선언 배너 — DESIGN_PAYLOAD_NOTICE).
 */

import { NextRequest, NextResponse } from 'next/server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { z } from 'zod';
import {
  buildTokensCss,
  tokensCssHeader,
  buildProvenanceHeader,
  componentDelivery,
  nameMismatchGuidance,
  DESIGN_PAYLOAD_NOTICE,
} from '@/lib/design/designGenerators';
import { DESIGN_TOKENS_CSS_PATH } from '@/lib/design/designConstants';
import { listStoredDesigns, resolveStoredSystem, getStoredDesign, getItem, getFoundation, listItems } from '@/lib/store';
import { checkKitAuth, unauthorized, checkSameOrigin, crossOriginForbidden, ALLOWED_HOSTS } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KIT_VERSION = '0.1.0';

// DNS rebinding 방어 허용 호스트는 lib/auth.ts ALLOWED_HOSTS 단일 소스 — /api/upload 와 같은 목록.

function okJson(obj: Record<string, unknown>, summary: string) {
  return { content: [{ type: 'text' as const, text: summary }], structuredContent: obj };
}

function buildKitServer(): McpServer {
  const server = new McpServer({ name: 'PDS', version: KIT_VERSION });

  server.registerTool(
    'list_design_components',
    {
      title: '디자인 컴포넌트 목록',
      description: '발행된 디자인 시스템의 컴포넌트·리소스 목록을 조회합니다(read-only). UI 작업 전에 먼저 호출하세요.',
      annotations: { readOnlyHint: true },
    },
    async () => {
      const designs = listStoredDesigns();
      if (designs.length === 0) {
        return okJson(
          { available: false, reason: 'not_found', guidance: '발행된 디자인 시스템이 없습니다. 일반 생성으로 진행하세요.' },
          '발행된 디자인 시스템 없음',
        );
      }
      const result = designs.map((d) => ({
        name: d.meta.name,
        title: d.meta.title,
        version: d.meta.version,
        components: listItems(d).filter((i) => i.kind === 'component'),
        resources: listItems(d).filter((i) => i.kind === 'resource'),
      }));
      return okJson(
        {
          available: true,
          systems: result,
          note: designs.length > 1 ? 'system 인자로 이름을 지정해 단건 조회하세요.' : undefined,
          notice: DESIGN_PAYLOAD_NOTICE,
        },
        `디자인 시스템 ${designs.length}개 반환`,
      );
    },
  );

  server.registerTool(
    'get_design_component',
    {
      title: '디자인 컴포넌트 코드',
      description: '디자인 시스템 컴포넌트(또는 리소스 문서)의 완성 코드를 조회합니다(read-only). 반환 코드는 수정 없이 그대로 저장하세요.',
      inputSchema: { name: z.string(), system: z.string().optional() },
      annotations: { readOnlyHint: true },
    },
    async ({ name, system }) => {
      const resolved = resolveStoredSystem(system);
      if (!resolved.ok) {
        return okJson({ available: false, reason: resolved.reason, guidance: resolved.message }, resolved.message);
      }
      const design = getStoredDesign(resolved.system.name);
      if (!design) {
        return okJson({ available: false, reason: 'not_found', guidance: resolved.system.name + ' 을 찾을 수 없습니다.' }, '조회 실패');
      }
      const item = getItem(design, String(name).trim().toLowerCase());
      if (!item) {
        return okJson(
          { available: false, reason: 'name_mismatch', guidance: nameMismatchGuidance(String(name), design.items) },
          '이름 불일치',
        );
      }
      if (item.kind === 'resource') {
        return okJson(
          { available: true, kind: 'resource', name: item.name, title: item.title, bodyMd: item.bodyMd, notice: DESIGN_PAYLOAD_NOTICE },
          `리소스 ${item.name} 반환`,
        );
      }
      const delivery = componentDelivery(item);
      return okJson(
        {
          available: true,
          kind: 'component',
          name: item.name,
          title: item.title,
          delivery: delivery.mode,
          ...(delivery.mode === 'save'
            ? { savePath: delivery.savePath, ...(delivery.dependencies?.length && { dependencies: delivery.dependencies }) }
            : { installPackages: delivery.packages }),
          deliveryNote: delivery.instruction,
          code: `${buildProvenanceHeader(design.meta, item.name)}\n${(item.code ?? '').trimEnd()}\n`,
          codeLang: item.codeLang,
          usageMd: item.usageMd,
          variantsMd: item.variantsMd,
          notice: DESIGN_PAYLOAD_NOTICE,
        },
        delivery.mode === 'install'
          ? `컴포넌트 ${item.name} — 패키지 제공 (${delivery.packages.join(', ')})`
          : `컴포넌트 ${item.name} 코드 반환`,
      );
    },
  );

  server.registerTool(
    'get_design_foundation',
    {
      title: '디자인 파운데이션(토큰)',
      description: '디자인 시스템의 색·타이포·간격 토큰을 CSS 변수 파일로 조회합니다(read-only). UI 작업 전에 한 번 저장하세요.',
      inputSchema: { system: z.string().optional() },
      annotations: { readOnlyHint: true },
    },
    async ({ system }) => {
      const resolved = resolveStoredSystem(system);
      if (!resolved.ok) {
        return okJson({ available: false, reason: resolved.reason, guidance: resolved.message }, resolved.message);
      }
      const design = getStoredDesign(resolved.system.name);
      if (!design) {
        return okJson({ available: false, reason: 'not_found', guidance: '파운데이션 데이터를 찾을 수 없습니다.' }, '파운데이션 없음');
      }
      const foundation = getFoundation(design);
      return okJson(
        {
          available: true,
          savePath: DESIGN_TOKENS_CSS_PATH,
          wiring: "`app/layout.tsx` 최상단에 `import '@/styles/design-tokens.css'` 를 한 번(프로젝트가 src/ 레이아웃이면 src/styles/, pages 라우터면 pages/_app.tsx) — 앱 전체 페이지에 적용. 페이지마다 넣지 않는다(새 페이지가 빠지면 그 페이지는 토큰이 없어 스타일이 통째로 무너짐). 색·간격은 css 에 실존하는 var(--카테고리-키) 변수만 사용 — 없는 토큰명 창작 금지, 토큰에 없는 색은 사용자 명시 값 리터럴 허용. design-tokens.css 는 저장 후 수정 금지 — 토큰 추가·오버라이드는 styles/app-tokens.css 를 다음 줄에 import 해 정의. 재동기화: 파일이 이미 있으면 첫 줄 hash: 를 비교해 다르거나 헤더가 없으면 이 css 로 통째로 덮어쓴다(다크 블록이 없을 때 손으로 만들지 말 것)",
          css: buildTokensCss(foundation.tokens, foundation.themes, tokensCssHeader(resolved.system)),
          overviewMd: foundation.overviewMd,
          notice: DESIGN_PAYLOAD_NOTICE,
        },
        `토큰 CSS 반환 (${design.meta.name} v${design.meta.version})`,
      );
    },
  );

  return server;
}

async function handle(request: NextRequest): Promise<Response> {
  if (!checkSameOrigin(request)) return crossOriginForbidden();
  if (!checkKitAuth(request)) return unauthorized();

  // 요청마다 새 transport + server (stateless). DNS rebinding 방어는 transport 레벨
  // Host 검증(allowedHosts)으로 — 통과 못 하면 SDK 가 403 을 반환한다.
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    enableDnsRebindingProtection: true,
    allowedHosts: ALLOWED_HOSTS,
  });
  const server = buildKitServer();
  try {
    await server.connect(transport);
    return await transport.handleRequest(request);
  } catch (e) {
    console.error('[PDS mcp] failed:', e);
    return NextResponse.json({ error: 'mcp_failed' }, { status: 500 });
  } finally {
    await transport.close();
    await server.close();
  }
}

export const POST = handle;
export const GET = handle;
export const DELETE = handle;
