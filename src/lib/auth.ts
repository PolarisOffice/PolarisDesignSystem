/**
 * 접근 게이트 2종 — /api/mcp·/api/upload 에 적용 (가이드 페이지·다운로드는 항상 공개).
 *
 * 1) checkSameOrigin — 브라우저 교차 출처 차단(CSRF).
 *    악성 웹페이지가 preflight 없는 simple request 로 localhost 킷에 쓰기/호출하는 것을 막는다.
 *    Origin 헤더가 **있을 때만** 검증 — curl·Claude Code MCP 클라이언트 등 비브라우저는
 *    Origin 을 안 보내므로 통과한다(브라우저는 교차 출처 POST 에 Origin 을 반드시 첨부).
 * 2) checkKitAuth — env `DESIGN_KIT_TOKEN` 미설정이면 무인증(로컬 개인용 기본),
 *    설정 시 Bearer 요구. 빈 값 설정은 설정 오류로 간주해 fail-closed(전부 거부 + 경고).
 * 3) checkAllowedHost — DNS rebinding 방어. 악성 페이지가 자기 도메인을 127.0.0.1 로 재바인딩하면
 *    Origin.host === Host 라 same-origin 검사가 통과한다 — Host 헤더 자체를 허용목록과 대조해 막는다.
 *    /api/mcp 는 MCP transport 의 allowedHosts 로, /api/upload 는 이 함수로 같은 목록을 쓴다.
 */

import { timingSafeEqual } from 'node:crypto';

/**
 * 허용 호스트 — 무토큰 모드의 쓰기 경계. 포트 변경·팀 서버(도메인 접속) 시 env 로 확장:
 * DESIGN_KIT_ALLOWED_HOSTS=myhost:4000,design.example.com
 */
const DEFAULT_ALLOWED_HOSTS = ['localhost:3000', '127.0.0.1:3000', '[::1]:3000'];
export const ALLOWED_HOSTS: string[] = (() => {
  const fromEnv = (process.env.DESIGN_KIT_ALLOWED_HOSTS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_ALLOWED_HOSTS;
})();

export function checkAllowedHost(request: Request): boolean {
  const host = request.headers.get('host');
  return !!host && ALLOWED_HOSTS.includes(host);
}

export function hostForbidden(): Response {
  return Response.json(
    { error: 'host_not_allowed — 허용되지 않은 Host 입니다. 포트·도메인을 바꿨다면 DESIGN_KIT_ALLOWED_HOSTS 를 설정하세요.' },
    { status: 403 },
  );
}

export function checkSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // 비브라우저 클라이언트
  const host = request.headers.get('host');
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false; // 'null'(sandboxed iframe 등) 포함 파싱 불가 Origin = 교차 출처 취급
  }
}

export function crossOriginForbidden(): Response {
  return Response.json(
    { error: 'cross_origin_forbidden — 브라우저 교차 출처 요청은 허용되지 않습니다.' },
    { status: 403 },
  );
}

export function checkKitAuth(request: Request): boolean {
  const raw = process.env.DESIGN_KIT_TOKEN;
  if (raw === undefined) return true; // 무인증 기본
  const token = raw.trim();
  if (!token) {
    console.warn(
      '[PDS] DESIGN_KIT_TOKEN 이 빈 값입니다 — 설정 오류로 간주해 요청을 거부합니다. 무인증으로 쓰려면 변수를 제거하세요.',
    );
    return false; // fail-closed — 빈 값을 "무인증"으로 조용히 해석하지 않는다
  }
  const header = request.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  const given = Buffer.from(match[1]);
  const expected = Buffer.from(token);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export function unauthorized(): Response {
  return Response.json(
    { error: 'unauthorized — DESIGN_KIT_TOKEN 이 설정된 서버입니다. Authorization: Bearer <토큰> 을 첨부하세요.' },
    { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } },
  );
}
