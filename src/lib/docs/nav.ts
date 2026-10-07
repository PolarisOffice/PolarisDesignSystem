/**
 * 문서 사이트 네비게이션 — PDS `docs/.vitepress/config.js` 의 themeConfig 를 그대로 옮긴 것.
 *
 * 원본과 어긋나면 사이드바가 조용히 달라지므로, PDS config.js 가 바뀌면 여기도 함께 고친다.
 * 라벨은 **의도적으로 H1 과 다르다** (사이드바 "Color System" ↔ 페이지 H1 "컬러 시스템").
 * 그래서 라벨은 여기, 페이지 제목은 pages.ts 에 따로 둔다.
 */

import { COMPONENT_GROUPS } from './components-catalog';
import { isNew } from './changelog';
import { IS_EMBED } from '@/lib/basePath';
import { IS_HOSTED, HOSTED_KIT_TITLE } from '@/lib/hosting';

export interface NavNode {
  text: string;
  /** 링크가 있으면 이동 가능. 그룹이면서 링크인 노드도 있다(컴포넌트) */
  link?: string;
  /** (구) VitePress 의 collapsed — 평탄화 이후 미사용. 타입 하위호환으로만 유지 */
  collapsed?: boolean;
  items?: NavNode[];
  /** 항목 옆 배지 문구 — 현재는 이번 버전에 추가된 컴포넌트의 'New' 뿐 */
  badge?: string;
}

export interface TopNavItem {
  text: string;
  link: string;
  /** 원본의 activeMatch 정규식을 술어로 옮긴 것 */
  isActive: (pathname: string) => boolean;
}

/**
 * 상단 GNB — 섹션 4개(Wanted Montage 와 같은 수).
 *
 * 2026-09-18: Docs 한 덩어리 안에 파운데이션·컴포넌트가 함께 들어 있던 구조를
 * **섹션별 탭**으로 쪼갰다. 사이드바도 탭마다 갈라지므로 한 화면에 27행이 쏟아지던
 * 문제가 사라진다 — 아래 SIDEBARS 와 짝이다.
 *
 * 내 디자인 시스템(/kit — DESIGN.md 업로드 → 가이드 페이지 + MCP)은 같은 날 잠시 5번째 탭
 * `적용하기` 였다가 **AI Integration 의 사이드바 항목**으로 들어갔다: 하는 일이 "디자인 시스템을
 * AI 에 연결하는 길"이라 Skill 파일과 한 묶음이고, PAX 동봉본에는 없는 도구라 Foundation·
 * Component 와 같은 급의 탭으로 두면 무게가 안 맞았다(라벨도 혼자 한국어였다).
 * 그래서 GNB 는 동봉본과 킷이 같다 — 차이는 사이드바 항목 하나뿐(IS_EMBED).
 */
export const TOP_NAV: TopNavItem[] = [
  { text: 'Getting started', link: '/', isActive: (p) => p === '/' || p === '/terms' || p === '/changelog' },
  { text: 'Foundation', link: '/foundation', isActive: (p) => p.startsWith('/foundation') || p.startsWith('/brand') },
  { text: 'Component', link: '/components', isActive: (p) => p.startsWith('/components') },
  {
    text: 'AI Integration',
    link: '/ai',
    // /kit 와 거기서 만든 가이드(/guide/design/*)도 이 탭 소속
    isActive: (p) => p.startsWith('/ai') || p.startsWith('/kit') || p.startsWith('/guide'),
  },
];

/**
 * Getting started — 소개·변경 이력·이용약관.
 * Component 사이드바처럼 섹션 이름을 소제목으로 단다(2026-09-18) — 그룹 노드는 Sidebar 가
 * 접이식이 아니라 흐린 라벨로 렌더한다. 라벨은 영문(같은 날 결정 — Foundation·Component 사이드바와
 * 같은 결), 페이지 H1(pages.ts)은 한국어 그대로 — "라벨 ≠ H1" 은 이 파일 머리말의 원칙
 */
const GETTING_START_SIDEBAR: NavNode[] = [
  {
    text: 'Getting started',
    items: [
      { text: 'Introduction', link: '/' },
      { text: 'Changelog', link: '/changelog' },
      { text: 'Terms of Use', link: '/terms' },
    ],
  },
];

/**
 * 파운데이션 항목 — 사이드바와 파운데이션 랜딩 카드가 함께 쓰는 단일 소스.
 * 로고 에셋도 여기 둔다(브랜드 섹션이 로고 한 장뿐이라 탭을 따로 주지 않는다)
 */
export const FOUNDATION_LINKS: NavNode[] = [
  // 컬러 문서는 한 페이지(2026-08-19 최종): 개요+Roles+Palette 를 /foundation/colors 로
  // 병합 — 구 URL 2종은 next.config 308 + anchor-aliases 구제
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
  { text: 'Logo', link: '/brand/logo' },
];

/** 파운데이션 사이드바 — Overview(랜딩)는 소항목이 아니라 맨 위 단독 링크, 그 아래 섹션 소제목 + 항목(2026-09-18). 랜딩 카드(FOUNDATION_LINKS)엔 Overview 없음 */
const FOUNDATION_SIDEBAR: NavNode[] = [
  { text: 'Overview', link: '/foundation' },
  { text: 'Foundation', items: FOUNDATION_LINKS },
];

/**
 * 컴포넌트 — Figma 의 소분류(Feedback → Action → Overlay → Contents)로 묶는다.
 *
 * 2026-08-13 에 평탄화했던 이유는 사이드바 하나에 소개·파운데이션·컴포넌트가 다 들어와
 * 27행이었기 때문이다. 섹션 탭으로 갈라진 지금은 이 사이드바가 컴포넌트만 담으므로,
 * 디자인과 같은 분류를 보여 주는 편이 찾기 쉽다(2026-09-18).
 * 그룹은 접이식이 아니라 섹션 라벨로 렌더된다(Sidebar 의 items 분기).
 */
const COMPONENT_SIDEBAR: NavNode[] = [
  // 랜딩(/components)으로 가는 Overview — 소분류 그룹들 위 맨 상위 단독 링크(Foundation 과 같은 꼴)
  { text: 'Overview', link: '/components' },
  ...COMPONENT_GROUPS.map((g) => ({
    text: g.label,
    items: g.items.map((c) => ({
      text: c.name,
      link: `/components/${c.slug}`,
      badge: isNew(c.since) ? 'New' : undefined,
    })),
  })),
];


/**
 * AI Integration 은 원본대로 **별도 페이지**다 — 좌측 사이드바에 같이 나오지 않는다
 * (2026-08-25: 한 번 MAIN_SIDEBAR 에 합쳤다가 "페이지 다시 따로 분리해" 피드백으로 원복).
 * `/ai/*` 방문 시엔 이 축소판(소개·Skill 파일)만 뜬다 — VitePress 멀티 사이드바 원 구조.
 */
const AI_SIDEBAR: NavNode[] = [
  {
    text: 'AI Integration',
    items: [
      // 2026-08-25: 스킬 다운로드만 남기기로 해서 소개 페이지·llms.txt 카드가 사라졌다
      { text: 'Skill 파일', link: '/ai' },
      // 내 디자인 시스템 — 업로드 도구는 PAX 동봉본에 실리지 않으므로(build-pds-docs STRIP_DIRS)
      // 거기선 항목도 뺀다. 죽은 링크를 남기지 않기 위한 유일한 분기.
      // 공개 서버(IS_HOSTED)에선 같은 경로가 업로드 없는 "MCP 연결" 안내라 이름만 바뀐다(hosting.ts)
      ...(IS_EMBED ? [] : [{ text: IS_HOSTED ? HOSTED_KIT_TITLE : '내 디자인 시스템', link: '/kit' }]),
    ],
  },
];

/**
 * 경로 접두사별 사이드바 — VitePress 의 멀티 사이드바.
 * 선택 규칙은 **가장 긴 접두사 일치** (원본과 동일).
 */
const SIDEBARS: { prefix: string; nodes: NavNode[] }[] = [
  { prefix: '/ai', nodes: AI_SIDEBAR },
  { prefix: '/kit', nodes: AI_SIDEBAR },
  { prefix: '/components', nodes: COMPONENT_SIDEBAR },
  { prefix: '/foundation', nodes: FOUNDATION_SIDEBAR },
  // 로고 에셋은 파운데이션 탭 소속 — /brand/logo 에서도 같은 사이드바가 떠야 자리를 잃지 않는다
  { prefix: '/brand', nodes: FOUNDATION_SIDEBAR },
  { prefix: '/', nodes: GETTING_START_SIDEBAR },
];

export function sidebarFor(pathname: string): NavNode[] {
  const hit = [...SIDEBARS]
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find((s) => pathname === s.prefix || pathname.startsWith(s.prefix === '/' ? '/' : `${s.prefix}/`));
  return hit?.nodes ?? GETTING_START_SIDEBAR;
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
