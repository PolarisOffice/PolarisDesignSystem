/**
 * 공개 서버 모드 — 킷을 모두가 보는 도메인(예: pds.polarisoffice.com)으로 서빙할 때의 스위치.
 *
 * 킷의 저장소는 `designs/*.md` 파일이라, 공개 서버에서 업로드를 받으면 **남이 올린 파일이 모두에게
 * 보이고**(단일 관리자 전제가 깨진다) Vercel 같은 서버리스에선 파일 쓰기 자체가 실패한다. 그래서
 * 환경변수 하나로 업로드를 끄고, "내 디자인 시스템"(/kit) 페이지는 업로드 없이 **MCP 연결 안내**로 바꾼다
 * (업로드가 있었다는 흔적을 남기지 않는다 — 2026-10-07 결정). 가이드 페이지·DESIGN.md 다운로드·MCP(read-only)는 그대로 공개.
 *
 *   NEXT_PUBLIC_DESIGN_KIT_HOSTED=1
 *
 * NEXT_PUBLIC_ 인 이유: 사이드바 항목 이름(nav.ts)·페이지 제목(pages.ts)은 클라이언트 컴포넌트가 읽는 정적 표라
 * 빌드 때 박혀야 한다 — PAX 동봉 빌드의 `NEXT_PUBLIC_PDS_EMBED`(basePath.ts)와 같은 방식. 비밀값이 아니다.
 * 빌드타임 상수라 값을 바꾸면 다시 빌드(dev 는 재시작)해야 한다. 로컬·자가호스팅(기본, 미설정)은 동작 무변경.
 */
export const IS_HOSTED = process.env.NEXT_PUBLIC_DESIGN_KIT_HOSTED === '1';

/** 킷 소스 저장소 — 공개 서버 모드의 플러그인 설치 안내(저장소를 받아 .mcp.json 주소를 바꾼다)에 쓰는 링크 */
export const KIT_REPO_URL = 'https://github.com/PolarisOffice/PolarisDesignSystem';

/** 공개 서버 모드의 /kit 페이지 이름 — 사이드바(nav.ts)·메타(pages.ts)·H1 이 같은 값을 쓴다 */
export const HOSTED_KIT_TITLE = 'MCP 연결';
export const HOSTED_KIT_DESCRIPTION = 'PDS 를 AI 에 MCP 로 연결하는 방법 — 주소 하나, 명령 한 줄';

export function uploadDisabled(): Response {
  return Response.json(
    { error: 'upload_disabled — 이 서버는 공개 배포본이라 DESIGN.md 업로드를 받지 않습니다.', repo: KIT_REPO_URL },
    { status: 403 },
  );
}

/**
 * 접속한 주소 그대로의 origin — MCP 주소 안내용. 프록시(Vercel 등) 뒤에서는 요청이 http 로 들어오므로
 * `x-forwarded-proto` 를 우선한다(없으면 http — 로컬 기본). 다른 PC(192.168.x:3100)에서 열었으면 그 주소가 복사돼야 한다.
 */
export function publicOrigin(headers: { get(name: string): string | null }): string {
  const host = headers.get('host') ?? 'localhost:3000';
  const proto = headers.get('x-forwarded-proto')?.split(',')[0]?.trim() || 'http';
  return `${proto}://${host}`;
}

/** PDS 일반 문의 — AX추진팀 (2026-09-04 지정). 이용약관 §5·§9, 요청 폼의 메일 대안이 같은 값을 쓴다 */
export const GENERAL_CONTACT = { team: 'AX추진팀', email: 'vibeops_admin@polarisoffice.com' };

/** 요청 팝업 두 종류 — 페이지 제목 옆 "개선 요청"(그 페이지), 사이드바 맨 아래 "요청·제안하기"(새 컴포넌트·개선·아이디어 무엇이든). 팝업과 /api/request 가 같은 값을 쓴다 */
export const REQUEST_TYPES = [
  { value: 'improve', label: '개선 요청' },
  { value: 'suggest', label: '요청·제안' },
] as const;
export type RequestType = (typeof REQUEST_TYPES)[number]['value'];
/** 요청 내용 최대 글자 수 — 팝업과 서버 검증이 같은 값 */
export const REQUEST_CONTENT_MAX = 2000;
/** 보낸 페이지 경로 — 같은 사이트 경로만(`//host` 같은 프로토콜 상대 주소 금지). 카드 "페이지 열기" 버튼 주소가 된다 */
export const REQUEST_FROM_RE = /^\/(?!\/)\S{0,299}$/;
/** Teams 채널 메시지 한 건 한도(약 28KB, 1000 단위로 보수적으로) — 웹훅에 보내는 카드 JSON 전체가 이 안에 들어야 한다.
 *  팝업은 첨부 이미지를 이 안에 들 때까지 줄이고, 서버는 넘으면 413 으로 막는다 */
export const REQUEST_CARD_MAX_BYTES = 28 * 1000;
/** 첨부 이미지 1장 — 원본은 이 형식·크기까지만 받고, 브라우저에서 JPEG 로 다시 그려 카드에 data URI 로 넣는다(저장하지 않는다) */
export const REQUEST_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const REQUEST_IMAGE_FILE_MAX = 10 * 1024 * 1024;

/**
 * 공개 문서 사이트 — PAX 동봉본(IS_EMBED)에는 /api/request 가 없어서(build-pds-docs 가 src/app/api 를 뺀다)
 * 요청 버튼이 이 사이트의 같은 페이지를 `?request=<type>` 으로 새 탭에 연다. 그 페이지가 팝업을 바로 띄운다.
 */
export const PUBLIC_SITE_URL = 'https://pds.polarisoffice.com';
