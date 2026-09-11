/**
 * PDS 컴포넌트 npm 패키지 연결점 — **이 파일 하나가 전부다.**
 *
 * 실제 동작하는 컴포넌트는 이 문서 사이트가 아니라 `packages/pds-react` 패키지가 제공한다
 * (`@polarisoffice/pds-react`, 2026-08-26 1.0.0 발행). 문서는 정적 가이드이고, 각 컴포넌트
 * 페이지의 Code 탭이 그 패키지의 미리보기와 코드를 보여준다.
 *
 * 새 컴포넌트를 패키지에 추가하면 할 일은 `*.code.tsx` 에 `preview:` 추가 + 아래 목록에 슬러그
 * 추가뿐이다. `page.tsx` 와 `*.design.tsx` 는 다시 열지 않는다.
 *
 * ⚠️ `src/lib/design/` 에 두면 안 된다 — 부모 레포 생성기가 allowlist 밖 파일을 지운다.
 */

/**
 * npm 패키지명. 소스는 이 저장소 `PDS/packages/pds-react` 에 있고,
 * 킷은 워크스페이스로 직접 참조한다(발행 전에도 최신 소스가 그대로 붙는다).
 */
export const PDS_PACKAGE = '@polarisoffice/pds-react';

/** 설치 안내 코드블록 (패키지 배포 후에만 노출) */
export const PDS_INSTALL = `npm i ${PDS_PACKAGE}`;

/**
 * 라이브 미리보기 스위치. 패키지가 실제로 설치되기 전까지 false.
 *
 * 코드 *문자열* 은 이 값과 무관하게 항상 보여준다 — 문자열이라 패키지가 없어도 정직하고,
 * 지금 다 써두면 배포일에 preview 만 얹으면 된다.
 *
 * ⚠️ `: boolean` 표기를 지우지 말 것. 지우면 TypeScript 가 리터럴 타입 `false` 로 좁혀서
 *    `if (PDS_PREVIEW_ENABLED)` 의 본문이 도달 불가로 판정되고, 나중에 true 로 바꾸는 순간
 *    반대 분기가 전부 타입 에러가 된다.
 */
export const PDS_PREVIEW_ENABLED: boolean = true;

/**
 * npm 레지스트리 발행 여부 — 미리보기(위)와 분리된 스위치.
 * 2026-08-26 1.0.0 발행 완료(@polarisoffice/pds-react). CodeTabShell 이 이 값으로 설치
 * 스니펫 노출을 게이트한다 — 발행 전엔 404 나는 npm i 를 띄우지 않기 위해 false 였다.
 */
export const PDS_ON_NPM: boolean = true;

/**
 * 라이브 미리보기가 실제로 배선된 컴포넌트 슬러그 — **여기가 단일 소스다.**
 * 컴포넌트 하나를 패키지에 구현하고 `*.code.tsx` 에 preview 를 달면 이 목록에 슬러그를
 * 추가한다 → 해당 페이지의 Code 탭 '준비 중' 뱃지가 떨어지고 셸 안내가 베타 문구로 바뀐다.
 * 나머지 페이지는 목록에 없는 동안 뱃지·준비 중 안내를 유지한다.
 */
export const PDS_LIVE_COMPONENTS: ReadonlySet<string> = new Set([
  'button',
  'checkbox',
  'toggle',
  'tooltip',
  'input',
  'select',
  'table',
  'segment-control',
  'context-menu',
  'popup',
  'toast',
  'tabs',
]);

/** 이 컴포넌트의 Code 탭이 실물을 렌더하는가 — 전역 스위치 AND 개별 배선 */
export function isComponentLive(slug: string): boolean {
  return PDS_PREVIEW_ENABLED && PDS_LIVE_COMPONENTS.has(slug);
}

/** Figma 원본 파일 — 코드 옆에 두는 게 사내 디자인 시스템에선 실제로 가장 쓸모 있다 */
export const PDS_FIGMA_URL = 'https://www.figma.com/design/WYHAWNLrCGhbo4Ude41TYl';

/**
 * 문서 최근 업데이트 일자 — 푸터 "업데이트 YYYY.MM.DD" 표기(2026-08-28 검토 벤치마크).
 * 콘텐츠가 의미 있게 갱신된 릴리즈 때 손으로 올린다 — 빌드 날짜 자동화는 내용 없는
 * 재빌드에도 날짜가 바뀌어 거짓 신호라 쓰지 않는다.
 */
export const PDS_UPDATED = '2026.08.28';
