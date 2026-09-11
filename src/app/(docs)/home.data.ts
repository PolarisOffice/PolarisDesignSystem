/**
 * 홈(소개) 본문 데이터 — 2026-08-24 seed-design.io/get-started 형 재설계.
 *
 * 구성: 정의 문단(INTRO) + 목표 3열(GOALS) + 섹션별 링크 카드(AREAS·ROLE_ROWS).
 * 문서 개수·하위 링크는 **여기 쓰지 않는다** — `PAGES`/`COMPONENT_GROUPS` 에서 파생해야
 * 문서가 늘어도 홈이 거짓말하지 않는다(page.tsx 참고).
 */
import { PDS_FIGMA_URL } from '@/lib/docs/package';

/** 'PDS란 무엇인가요?' 정의 문단 — GOALS 3개의 요지를 한 문장 체계로 합성 */
export const INTRO =
  'PDS는 폴라리스 서비스를 위한 통합 디자인 언어예요. 색·타이포그래피·간격 같은 시각 요소부터 버튼·모달 같은 컴포넌트까지, 제품을 이루는 결정을 피그마 원본에서 추출한 하나의 체계로 정리해 누가 만들어도 같은 품질의 경험이 나오도록 돕는 것이 목표예요.';

export interface DefRow {
  /** 왼쪽 주제어 — 132px 고정 열 */
  term: string;
  desc: string;
}

export const GOALS: DefRow[] = [
  {
    term: '브랜드 일관성',
    desc: '사내에서 만들어지는 서비스가 각자 다른 UI를 갖지 않도록 공통된 디자인 언어를 제공해요. 팀과 서비스 성격이 달라도 같은 기준에서 시작할 수 있어요.',
  },
  {
    term: '반복 결정 감소',
    desc: '버튼 색상, 여백, 인터랙션 같은 공통 결정을 PDS가 대신 정의해요. 각 팀은 UI 기초를 처음부터 고민하는 대신 서비스 고유의 문제 해결에 집중할 수 있어요.',
  },
  {
    term: '공통 언어',
    desc: '피그마 원본에서 추출한 토큰·스펙·가이드를 한 곳에 정리해요. 협업 과정에서 생기는 해석 차이를 줄이고 구현 정확도를 높여요.',
  },
];

export interface RoleLink {
  href: string;
  label: string;
  /** true 면 새 탭(피그마 등 외부) — 라벨 뒤에 ↗ 가 붙는다 */
  external?: boolean;
  /** true 면 이동 대신 "곧 공개" 토스트 — 공개 시 이 플래그만 걷어낸다 */
  comingSoon?: boolean;
}

export interface RoleRow extends DefRow {
  links: RoleLink[];
}

export const ROLE_ROWS: RoleRow[] = [
  {
    term: '디자이너',
    desc: '피그마 라이브러리에서 컴포넌트·색상·타이포를 그대로 가져다 화면을 구성해요. 값이 헷갈릴 땐 이 문서에서 원본 스펙을 확인해요.',
    // 피그마 라이브러리는 아직 비공개 — 공개되면 comingSoon 만 제거 (2026-08-31 요청)
    links: [{ href: PDS_FIGMA_URL, label: '피그마 라이브러리', external: true, comingSoon: true }],
  },
  {
    term: '개발자',
    desc: '색상값·사이즈·상태 스펙을 그대로 옮겨 구현해요. React·Vue·Next.js 어디서든 같은 토큰을 써요.',
    links: [
      { href: '/components/button', label: '컴포넌트 스펙' },
      { href: '/foundation/colors', label: '파운데이션 토큰' },
    ],
  },
  {
    term: 'PO · 관계자',
    desc: '디자인·개발 지식 없이도 이 문서를 AI 코딩 툴에 컨텍스트로 넘기거나 스킬 파일로 연결해 PDS 기준 결과물을 바로 만들어요.',
    links: [
      { href: '/ai', label: 'AI Integration' },
    ],
  },
];

export interface AreaRow extends DefRow {
  /** 분량·하위 링크를 파생할 라우트 접두 (PAGES 기준) */
  prefix: string;
  /** 분량 단위 — '문서' / '컴포넌트' */
  unit: string;
}

export const AREAS: AreaRow[] = [
  { term: '브랜드', prefix: '/brand/', unit: '문서', desc: '폴라리스오피스 로고 다운로드와 사용 가이드' },
  {
    term: '파운데이션',
    prefix: '/foundation/',
    unit: '문서',
    // 나열은 PAGES 순서와 맞춘다 — 문서가 늘면 여기도 같이 고친다(개수는 자동 파생이라 어긋나면 티가 난다)
    desc: '색상 토큰 · 타이포그래피 · UX Writing · 스페이싱 · 그리드 · 레이디어스 · 엘리베이션 · 모션 · 아이코노그래피',
  },
  {
    term: '컴포넌트',
    prefix: '/components/',
    unit: '컴포넌트',
    desc: '피그마 원본 기준으로 정의된 UI 컴포넌트 스펙',
  },
];
