/**
 * PAX 동봉(embed) 빌드 지원 — scripts/build-pds-docs.mjs 가 export 빌드에서
 * NEXT_PUBLIC_BASE_PATH·NEXT_PUBLIC_PDS_EMBED 를 주입한다.
 * 스탠드얼론 킷에선 둘 다 미설정이라 전부 no-op — 킷 동작 무변경.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const IS_EMBED = process.env.NEXT_PUBLIC_PDS_EMBED === '1';
/**
 * raw `<img src>`·`<a href>` 절대경로에 basePath 접두.
 * `<Link>`·`next/image` 는 Next 가 basePath 를 자동 처리하므로 이 헬퍼가 필요 없다 —
 * 정적 문자열을 그대로 DOM 에 꽂는 자리에만 쓴다.
 */
export const withBase = (p: string): string => (p.startsWith('/') ? `${BASE_PATH}${p}` : p);
