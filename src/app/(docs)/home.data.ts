/**
 * 홈(소개) 본문 데이터 — 2026-08-24 seed-design.io/get-started 형 재설계.
 *
 * 구성: 정의 문단(INTRO) + 목표 3열(GOALS) + 섹션별 링크 카드(AREAS). 역할별 읽는 법은 2026-09-18 삭제.
 * 문서 개수·하위 링크는 **여기 쓰지 않는다** — `PAGES`/`COMPONENT_GROUPS` 에서 파생해야
 * 문서가 늘어도 홈이 거짓말하지 않는다(page.tsx 참고).
 */
import { PDS_FIGMA_URL } from '@/lib/docs/package';

/** 'PDS란 무엇인가요?' 정의 문단 — 한 문장(2026-09-18 문구 축약: 리드와 겹치던 첫 문장·"피그마 원본" 언급 삭제) */
export const INTRO = '색·타이포그래피·간격부터 버튼·모달까지, 제품을 이루는 결정을 하나의 체계로 정리했어요.';

export interface DefRow {
  /** 왼쪽 주제어 — 132px 고정 열 */
  term: string;
  desc: string;
}

export const GOALS: DefRow[] = [
  {
    term: '브랜드 일관성',
    desc: '팀과 서비스가 달라도 같은 기준에서 시작해 UI가 제각각이 되지 않아요.',
  },
  {
    term: '반복 결정 감소',
    desc: '버튼 색·여백·인터랙션 같은 공통 결정은 PDS가 맡고, 팀은 서비스 고유 문제에 집중해요.',
  },
  {
    term: '공통 언어',
    desc: '토큰·스펙·가이드를 한 곳에 두어 해석 차이를 줄이고 구현 정확도를 높여요.',
  },
];

export interface AreaRow extends DefRow {
  /** 분량·하위 링크를 파생할 라우트 접두 (PAGES 기준) */
  prefix: string;
  /** 분량 단위 — '문서' / '컴포넌트' */
  unit: string;
}

export const AREAS: AreaRow[] = [
  { term: '브랜드', prefix: '/brand/', unit: '문서', desc: '로고 다운로드와 사용 기준' },
  {
    term: '파운데이션',
    prefix: '/foundation/',
    unit: '문서',
    // 전부 나열하지 않는다 — 개수는 카드 메타("문서 N개")가 자동 파생(2026-09-18 문구 축약)
    desc: '색·글자·간격·그리드·모션 같은 시각 기초와 규칙',
  },
  {
    term: '컴포넌트',
    prefix: '/components/',
    unit: '컴포넌트',
    desc: 'UI 컴포넌트 스펙과 사용 규칙',
  },
];
