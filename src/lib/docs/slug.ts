/**
 * VitePress 헤딩 슬러그 — **문자 단위 정확 이식**.
 *
 * 원본: vitepress@1.6.4 `dist/node/chunk-D3CUZ4fa.js:17687-17690`
 * (VitePress 는 `@mdit-vue/shared` 의 slugify 를 그대로 쓴다.)
 *
 * ⚠️ 이 함수를 "GitHub 스타일" 슬러그 라이브러리로 대체하면 **한글 앵커가 전부 조용히 깨진다.**
 * `.normalize('NFKD')` 가 한글 음절을 U+1100 계열 조합 자모로 분해하는데, 그 자모들은
 * 결합문자 범위(U+0300–U+036F)가 아니라서 rCombining 에 걸리지 않고 그대로 id 에 남는다.
 * 즉 VitePress 의 한글 앵커는 NFC 가 아니라 **조합형 자모열**이다:
 *
 *   "버튼 조합" → 화면 표기는 `버튼-조합` 이지만 실제 바이트는
 *                %E1%84%87%E1%85%A5%E1%84%90…  (NFC 인 %EB%B2%84%ED%8A%BC… 이 아님)
 *
 * 주소창에서는 구분이 불가능하고 페이지도 정상 열리는데 **스크롤만 안 된다.** 기존 문서의
 * 딥링크 호환이 목적이므로 이 동작을 그대로 보존한다. 회귀 검증: `npm run docs:slug-check`.
 *
 * 부수 효과(원본과 동일): `—`(U+2014)·`·`(U+00B7) 는 rSpecial 목록에 없어 id 에 살아남는다.
 */

/**
 * 문자 범위 정규식을 코드포인트로 조립한다.
 * 정규식 리터럴에 범위를 직접 적으면 소스 파일에 NUL 같은 실제 제어문자가 박혀 편집기·diff 가
 * 깨지므로, 눈에 보이지 않는 범위는 반드시 이 헬퍼로 만든다.
 */
const charRange = (from: number, to: number) =>
  new RegExp(`[${String.fromCharCode(from)}-${String.fromCharCode(to)}]`, 'g');

const rControl = charRange(0x0000, 0x001f); // 제어문자
const rCombining = charRange(0x0300, 0x036f); // 결합 발음기호 (한글 조합 자모는 여기 없음 — 위 경고 참고)
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g;

export function slugify(str: string): string {
  return str
    .normalize('NFKD')
    .replace(rCombining, '')
    .replace(rControl, '')
    .replace(rSpecial, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase();
}

/**
 * 페이지 내 중복 슬러그 처리 — markdown-it-anchor 의 `uniqueSlugStartIndex: 1` 동작.
 * 같은 슬러그가 다시 나오면 `-1`, `-2` … 를 붙인다.
 *
 * ⚠️ **렌더 타임에 쓰지 말 것.** React 19 StrictMode 이중 렌더 + 스트리밍에서 카운터가
 * 서버/클라이언트 간에 갈려 hydration 불일치를 만든다. 이 팩토리는 **이식 코드모드 전용**이며,
 * 산출된 페이지에는 명시적 `id="…-1"` 이 박혀 나가야 한다.
 * (실제 충돌 1건: button 의 `### Size` ×2. typeface 사례는 2026-08-25 페이지 폐지로 소멸)
 */
export function createUniqueSlugger(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text);
    const n = seen.get(base);
    if (n === undefined) {
      seen.set(base, 0);
      return base;
    }
    const next = n + 1;
    seen.set(base, next);
    return `${base}-${next}`;
  };
}

/**
 * 해시 문자열 하나에서 **조회해 볼 id 후보들**을 만든다.
 *
 * 우리 앵커 id 는 VitePress 와 동일하게 NFKD 조합형 자모다(위 경고 참고). 그런데 사용자가
 * 붙여넣는 URL 은 출처에 따라 정규화 형태가 다르다 — macOS 는 NFD, Windows·대부분의 웹은 NFC.
 * 형태가 어긋나면 `getElementById` 가 조용히 실패하고 **에러 없이 스크롤만 안 된다.**
 *
 * HashRescue(스크롤 구제)와 DocTabs(해시가 어느 탭 소유인지 판정)가 **같은 후보 목록**을 써야
 * 둘의 판정이 어긋나지 않으므로 여기 한 곳에 둔다.
 */
export function hashIdCandidates(rawHash: string): string[] {
  const raw = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
  if (!raw) return [];

  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    /* 잘못된 퍼센트 시퀀스(%zz 등) — 원문 그대로 시도한다 */
  }

  const candidates = [decoded, decoded.normalize('NFKD'), decoded.normalize('NFC'), decoded.normalize('NFD'), raw];
  return [...new Set(candidates)];
}

/** 헤딩 원문에서 마크다운·인라인 HTML 을 걷어낸 뒤 슬러그화 (markdown-it inline 렌더 결과 근사) */
export function slugifyHeading(raw: string): string {
  const plain = raw
    .replace(/<[^>]+>/g, '') // 인라인 태그 (<strong> 등)
    .replace(/`([^`]*)`/g, '$1') // 인라인 코드
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크
    .trim();
  return slugify(plain);
}
