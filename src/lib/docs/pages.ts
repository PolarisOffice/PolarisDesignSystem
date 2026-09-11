/**
 * 문서 페이지 메타 — 라우트별 H1 제목과 설명.
 *
 * 사이드바 라벨은 여기가 아니라 nav.ts 에 있다. 원본에서 **둘이 의도적으로 다르기 때문**이다
 * (사이드바 "Color System" ↔ H1 "컬러 시스템", 사이드바 "다운로드" ↔ H1 "리소스").
 * `title` 값은 VitePress 빌드 산출물의 실제 H1 에서 뽑았다.
 *
 * 용도: <title> 메타, prev/next 라벨, 검색·목록 UI.
 */

export interface PageMeta {
  /** 라우트 경로 (trailing slash 없음) */
  path: string;
  /** 페이지 H1 */
  title: string;
  /** <title>/메타 설명. 없으면 사이트 설명으로 폴백 */
  description?: string;
  /** 숨김 페이지 — 라우트는 next.config 308 로 막혀 있고 검색 색인에서도 제외한다 (사이드바·홈 링크는 별도 제거) */
  hidden?: boolean;
  /** 문서 흐름 밖 페이지 — 이전/다음 카드를 그리지 않고, 다른 페이지의 이전/다음 이웃에서도 건너뛴다 (이용약관) */
  standalone?: boolean;
}

export const SITE_TITLE = 'Polaris Design System';
export const SITE_DESCRIPTION = '폴라리스 서비스 전반의 컴포넌트 스펙을 정의한 디자인 명세 문서';

export const PAGES: PageMeta[] = [
  { path: '/', title: '소개', description: SITE_DESCRIPTION },

  { path: '/brand/logo', title: '로고 에셋', description: '폴라리스오피스 로고 다운로드와 사용 가이드' },

  { path: '/foundation/colors', title: '컬러 시스템', description: '색상 철학 · 토큰 문법 · Semantic 역할 토큰 전체 · 포맷/플랜/AI 맥락 색 · Primitive 팔레트' },
  { path: '/foundation/typography', title: 'Typography', description: '글꼴과 타입 스케일' },
  { path: '/foundation/writing', title: 'UX Writing', description: '문구 원칙 · 보이스와 톤 · 한국어 표기 규칙 · 제품 용어 사전' },
  { path: '/foundation/spacing', title: 'Spacing', description: '4px 기반 간격 스케일' },
  { path: '/foundation/grid', title: 'Grid', description: '그리드와 브레이크포인트' },
  { path: '/foundation/radius', title: 'Radius', description: '모서리 반경 토큰' },
  { path: '/foundation/elevation', title: 'Elevation', description: '그림자와 z-index 스케일' },
  { path: '/foundation/motion', title: 'Motion', description: 'duration·easing 토큰' },
  { path: '/foundation/iconography', title: 'Iconography', description: '아이콘 스타일과 그리드' },

  // 컴포넌트 목록 페이지는 2026-08-19 숨김(→ /components/button 308). 분류 데이터(components-catalog.ts)는 사이드바가 계속 쓴다
  { path: '/components', title: '컴포넌트', description: 'PDS 컴포넌트 12종', hidden: true },
  { path: '/components/button', title: 'Button', description: '행동을 유도하거나 기능을 실행하는 버튼' },
  { path: '/components/tabs', title: 'Tabs', description: '같은 층위의 화면을 전환하는 탭' },
  { path: '/components/segment-control', title: 'Segment Control', description: '한 영역 안에서 보기를 전환' },
  { path: '/components/input', title: 'Input Field', description: '텍스트 입력 필드' },
  { path: '/components/toggle', title: 'Toggle', description: '켜짐/꺼짐 전환' },
  { path: '/components/checkbox', title: 'Checkbox & Radio', description: '다중 선택과 단일 선택' },
  { path: '/components/toast', title: 'Toast', description: '짧게 나타났다 사라지는 알림' },
  { path: '/components/popup', title: 'Popup', description: '집중이 필요한 확인·입력' },
  { path: '/components/tooltip', title: 'Tooltip', description: '보조 설명' },
  { path: '/components/context-menu', title: 'Context & Menu Item', description: '맥락 메뉴와 메뉴 항목' },
  { path: '/components/select', title: 'Select', description: '목록에서 하나를 고르는 드롭다운' },
  { path: '/components/table', title: 'Table', description: '표 형식 데이터' },

  { path: '/ai', title: 'Skill 파일', description: 'PDS 스킬 파일 다운로드와 AI 툴 설치 안내' },
  { path: '/terms', title: '이용약관', description: 'PDS 이용 조건 — 코드·문서는 Apache-2.0, 브랜드 자산은 별도 라이선스', standalone: true },
];

const BY_PATH = new Map(PAGES.map((p) => [p.path, p]));

export function pageMeta(path: string): PageMeta | undefined {
  return BY_PATH.get(path);
}
