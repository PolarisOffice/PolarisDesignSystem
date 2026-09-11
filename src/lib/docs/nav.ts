/**
 * 문서 사이트 네비게이션 — PDS `docs/.vitepress/config.js` 의 themeConfig 를 그대로 옮긴 것.
 *
 * 원본과 어긋나면 사이드바가 조용히 달라지므로, PDS config.js 가 바뀌면 여기도 함께 고친다.
 * 라벨은 **의도적으로 H1 과 다르다** (사이드바 "Color System" ↔ 페이지 H1 "컬러 시스템").
 * 그래서 라벨은 여기, 페이지 제목은 pages.ts 에 따로 둔다.
 */

import { COMPONENT_GROUPS } from './components-catalog';

export interface NavNode {
  text: string;
  /** 링크가 있으면 이동 가능. 그룹이면서 링크인 노드도 있다(컴포넌트) */
  link?: string;
  /** (구) VitePress 의 collapsed — 평탄화 이후 미사용. 타입 하위호환으로만 유지 */
  collapsed?: boolean;
  items?: NavNode[];
}

export interface TopNavItem {
  text: string;
  link: string;
  /** 원본의 activeMatch 정규식을 술어로 옮긴 것 */
  isActive: (pathname: string) => boolean;
}

/** 상단 GNB — 원본 `nav`. Docs 는 소개(홈)로 착지(2026-08-25 — 구 '시작하기' 페이지 폐지) */
export const TOP_NAV: TopNavItem[] = [
  // activeMatch: '^(?!/ai)' — /ai 로 시작하지 않는 모든 경로
  { text: 'Docs', link: '/', isActive: (p) => !p.startsWith('/ai') && !p.startsWith('/kit') && !p.startsWith('/guide') },
  // activeMatch: '^/ai/'
  { text: 'AI Integration', link: '/ai', isActive: (p) => p.startsWith('/ai') },
];

/**
 * 내 디자인 시스템 — DESIGN.md 업로드 창구(/kit) + 거기서 만든 가이드(/guide/design/*).
 * PDS 문서를 "읽는" 탭들과 성격이 달라(도구) GNB 탭이 아니라 헤더 우측 유틸리티 영역에
 * 필 버튼으로 둔다(2026-08-31 위계 재검토 — 구 2026-08-27 GNB 복귀 결정을 대체).
 */
export const KIT_NAV_LINK: TopNavItem = {
  text: '내 디자인 시스템',
  link: '/kit',
  isActive: (p) => p.startsWith('/kit') || p.startsWith('/guide'),
};

const MAIN_SIDEBAR: NavNode[] = [
  // ⚠️ 원본 config.js 와 의도적으로 다른 배치(2026-08-13, Seed Design 참고 결정):
  // 사이드바에서 **접기 계층을 없애고 평탄화**했다 — 항목이 총 27행뿐이라 접기가 항해를
  // 돕기보다 위계만 흐렸다. 그룹은 접이식이 아니라 **섹션 라벨**로 렌더된다(Sidebar 참고).
  //  · 개요>소개 → 최상단 단독 링크
  //  · 파운데이션>Color 하위 3장 → 파운데이션 바로 아래로 (원본 유일의 3단 중첩 제거)
  //  · 컴포넌트 Actions/Feedback/Overlay/Contents 4분류 → 평탄화. 분류는 /components
  //    목록 페이지 카드 그룹이 담당 (components-catalog.ts 에서 파생 — 어긋날 수 없음)
  //  · 리소스>다운로드 → 2026-08-19 페이지 자체 폐지(/resources → / 308). Figma 링크는 헤더 아이콘이 담당
  // URL·페이지 구성은 전부 그대로다. 링크 집합 검증: npm run docs:link-check
  { text: '소개', link: '/' },
  // 이용약관 — 소개 바로 아래 단독 링크 + 푸터 링크(DocsFooter) 두 곳에서 진입 (2026-09-04).
  // 문서 흐름 밖(pages.ts standalone)이라 이전/다음 카드에는 나오지 않는다
  { text: '이용약관', link: '/terms' },
  {
    text: '브랜드',
    // 2026-08-25: 브랜드 컬러·서체 페이지 폐지(내용이 파운데이션 Color·Typography 와 중복) —
    // 브랜드 섹션엔 로고 에셋만 남는다
    items: [{ text: '로고 에셋', link: '/brand/logo' }],
  },
  {
    text: '파운데이션',
    items: [
      // 컬러 문서는 한 페이지(2026-08-19 최종): 개요+Roles+Palette 를 /foundation/colors 로
      // 병합 — 개요/Roles 역할 구분이 독자에게 혼란이라는 결정. 구 URL 2종은 next.config 308 +
      // anchor-aliases 구제
      { text: 'Color', link: '/foundation/colors' },
      { text: 'Typography', link: '/foundation/typography' },
      // 2026-08-25: 글자의 '모양'(Typography) 다음에 글자의 '내용'(UX Writing)
      { text: 'UX Writing', link: '/foundation/writing' },
      { text: 'Spacing', link: '/foundation/spacing' },
      { text: 'Grid', link: '/foundation/grid' },
      { text: 'Radius', link: '/foundation/radius' },
      { text: 'Elevation', link: '/foundation/elevation' },
      { text: 'Motion', link: '/foundation/motion' },
      { text: 'Iconography', link: '/foundation/iconography' },
    ],
  },
  {
    // 라벨만 — /components 목록 페이지는 2026-08-19 숨김(라벨 클릭 불가, 라우트는 308)
    text: '컴포넌트',
    items: COMPONENT_GROUPS.flatMap((g) =>
      g.items.map((c) => ({ text: c.name, link: `/components/${c.slug}` })),
      // 사이드바는 그룹 구분 없이 평탄하므로 전역 이름 오름차순 (2026-08-13)
    ).sort((a, b) => a.text.localeCompare(b.text, 'en')),
  },
];

/**
 * AI Integration 은 원본대로 **별도 페이지**다 — 좌측 사이드바에 같이 나오지 않는다
 * (2026-08-25: 한 번 MAIN_SIDEBAR 에 합쳤다가 "페이지 다시 따로 분리해" 피드백으로 원복).
 * `/ai/*` 방문 시엔 이 축소판(소개·Skill 파일)만 뜬다 — VitePress 멀티 사이드바 원 구조.
 */
const AI_SIDEBAR: NavNode[] = [
  // 2026-08-25: 스킬 다운로드만 남기기로 해서 소개 페이지·llms.txt 카드가 사라졌다 —
  // 그룹 대신 단독 링크 1개(Sidebar 의 items 없는 분기가 '소개' 링크와 동일하게 렌더한다)
  { text: 'Skill 파일', link: '/ai' },
];

/**
 * 경로 접두사별 사이드바 — VitePress 의 멀티 사이드바.
 * 선택 규칙은 **가장 긴 접두사 일치** (원본과 동일).
 */
const SIDEBARS: { prefix: string; nodes: NavNode[] }[] = [
  { prefix: '/ai', nodes: AI_SIDEBAR },
  { prefix: '/', nodes: MAIN_SIDEBAR },
];

export function sidebarFor(pathname: string): NavNode[] {
  const hit = [...SIDEBARS]
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find((s) => pathname === s.prefix || pathname.startsWith(s.prefix === '/' ? '/' : `${s.prefix}/`));
  return hit?.nodes ?? MAIN_SIDEBAR;
}

/** 해당 서브트리 안에 이 경로가 있는지 — 활성 조상 자동 펼침 판정에 쓴다 */
export function subtreeContains(node: NavNode, pathname: string): boolean {
  if (node.link === pathname) return true;
  return (node.items ?? []).some((child) => subtreeContains(child, pathname));
}

/** 사이드바를 링크 순서대로 평탄화 — prev/next 파생용 */
export function flattenLinks(nodes: NavNode[]): { text: string; link: string }[] {
  const out: { text: string; link: string }[] = [];
  const walk = (list: NavNode[]) => {
    for (const n of list) {
      // 그룹 헤더의 link(예: 컴포넌트 → /components)도 순서에 포함한다 — 원본 docFooter 동작과 동일
      if (n.link) out.push({ text: n.text, link: n.link });
      if (n.items) walk(n.items);
    }
  };
  walk(nodes);
  return out;
}

/** 우측 목차 라벨 — 원본 `outline.label` */
export const OUTLINE_LABEL = '이 페이지';
/** 원본 `footer.message` */
export const FOOTER_MESSAGE = 'Polaris Office Design System';
