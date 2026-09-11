/**
 * 구 앵커 → 신 앵커 별칭 맵.
 *
 * 2026-08-13 Specification 하위 명명 통일(목차 감사)로 id 가 바뀐 앵커를
 * 여기서 구제한다 — 옛 딥링크(`#tablist` 등)로 들어와도 새 위치로 스크롤된다.
 *
 * 규칙:
 * - key 는 pathname, value 는 { 구 id: 신 id }. id 는 렌더된 앵커 문자열 그대로(영문이라 정규화 무관).
 * - HashRescue 가 hashIdCandidates 실패 후 마지막 수단으로 조회한다. 여기 등재된 별칭은
 *   지우지 않는다 — 링크는 문서 밖(슬랙·노션)에 살아 있다.
 */
import { slugify } from './slug';

export const ANCHOR_ALIASES: Record<string, Record<string, string>> = {
  // 2026-08-13 Color Palette 병합 → 2026-08-19 Roles 까지 /foundation/colors 로 최종 병합.
  // 구 URL 둘 다 308 로 이 페이지에 오고, 팔레트 패밀리 앵커(#po-blue 등)는 축약 섹션 하나로
  // 착지한다. Roles 의 헤딩 id 는 병합 후에도 동일하라 별칭 불필요. '사용 원칙'(한글 NFKD id)은
  // slugify 로 키를 만든다.
  '/foundation/colors': {
    'po-blue': 'palette-primitive',
    neutral: 'palette-primitive',
    'purple-ai': 'palette-primitive',
    red: 'palette-primitive',
    green: 'palette-primitive',
    orange: 'palette-primitive',
    yellow: 'palette-primitive',
    teal: 'palette-primitive',
    [slugify('사용 원칙')]: 'palette-primitive',
  },
  // 2026-08-21 홈 재설계('표제지' 안) + 2026-08-24 seed 형 재설계 — 구 딥링크 구제 체인
  '/': {
    [slugify('PDS 사용하기')]: slugify('역할별로 읽는 법'),
    [slugify('주요 구성')]: slugify('시스템 이해하기'),
    [slugify('문서의 구성')]: slugify('시스템 이해하기'),
    [slugify('PDS가 지향하는 목표')]: slugify('PDS란 무엇인가요?'),
  },
  // 2026-08-28 검토 반영 — 서체 섹션명을 서체 이름으로 표기('글꼴' → '프리텐다드')
  '/foundation/typography': {
    [slugify('글꼴')]: slugify('프리텐다드'),
  },
  // 2026-08-25 UX Writing 목차 3덩어리 재편 — H2 개명·강등으로 바뀐 id 구제
  '/foundation/writing': {
    [slugify('여섯 가지 원칙')]: slugify('원칙'),
    [slugify('문장 다듬기')]: slugify('문장'),
    [slugify('한국어 표기 규칙')]: slugify('표기 규칙'),
    [slugify('문체와 어미')]: slugify('문체'),
    [slugify('영문과 전문용어')]: slugify('영문'),
    [slugify('에러는 세 조각으로')]: slugify('에러'),
    [slugify('AI 기능 문구')]: slugify('AI 기능'),
    [slugify('제품 용어 사전')]: slugify('용어 사전'),
  },
  '/components/tabs': {
    tablist: 'container',
    'tab-item': 'item',
  },
  '/components/segment-control': {
    'segment-item': 'item',
    'count-badge-pill-only': 'count-badge',
  },
  '/components/toast': {
    'typography-color': 'typography',
  },
  '/components/select': {
    trigger: 'container',
    'menu-context-menu-item': 'menu',
  },
  '/components/context-menu': {
    'menu-list-container': 'container',
    'menu-item': 'item',
    // 2026-08-21 Case 표준화 — 구 'Case — Multi-column + Scroll' H2 를 'Case' 로 개칭
    [slugify('Case — Multi-column + Scroll')]: 'case',
  },
};

/** pathname 의 별칭 맵에서 신 id 를 찾는다. 없으면 null. */
export function resolveAnchorAlias(pathname: string, id: string): string | null {
  return ANCHOR_ALIASES[pathname]?.[id] ?? null;
}
