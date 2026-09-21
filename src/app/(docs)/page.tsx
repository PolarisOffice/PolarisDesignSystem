import type { Metadata } from 'next';
import Link from 'next/link';
import { H2 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import { PAGES, pageMeta, SITE_TITLE } from '@/lib/docs/pages';
import { AREAS, GOALS, INTRO } from './home.data';
import s from './home.module.css';
import { withBase } from '@/lib/basePath';

const meta = pageMeta('/')!;
// title.template 은 **하위** 세그먼트에만 적용된다. 이 페이지는 (docs)/layout.tsx 와 같은
// 세그먼트라 템플릿이 안 걸리므로 원본 VitePress 와 동일한 문자열을 직접 쓴다.
export const metadata: Metadata = {
  title: { absolute: `${meta.title} | ${SITE_TITLE}` },
  description: meta.description,
};

/**
 * `/` — PDS 소개. 원본: PDS `docs/index.md`.
 *
 * 2026-08-24 재설계: seed-design.io/get-started 형태 — 표제 아래 **풀폭 히어로 그래픽**,
 * 본문은 H2 섹션마다 **면(fill) 링크 카드 2열 그리드**. 카드는 제목+→ / 한 줄 설명의
 * 단일 프리미티브만 쓴다 (구 표제지(Colophon) 안의 정의 행은 은퇴 — home.module.css 참고).
 *
 * 문서 개수·하위 링크는 여기 하드코딩하지 않는다 — `PAGES` 에서 파생해야 문서가 늘어도
 * 홈이 거짓말하지 않는다.
 */

/** 하위 문서는 PAGES 에서 파생 — 문서가 늘어도 홈이 거짓말하지 않는다 */
const childPages = (prefix: string) => PAGES.filter((p) => !p.hidden && p.path.startsWith(prefix));

export default function HomePage() {
  return (
    <div className={s.page}>
      <h1 className={s.title}>{SITE_TITLE}</h1>
      <PageLead>
        폴라리스 서비스 전반에 일관된 경험을 만드는 디자인 언어이자 명세예요.
      </PageLead>

      {/* 히어로 — 장식 그래픽이라 대체텍스트 없음. 실제 파일은 public/home-hero.svg
          (2026-09-21 초기 그라디언트 SVG 로 복귀 — 9/18 에 넣었던 곡선 일러스트(jpg)는 그레인 질감이
          사이트의 평면 언어와 안 맞아 뺐다. 새 그래픽은 디자이너가 별도 제작 예정) */}
      <div className={s.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element -- 정적 SVG 배너: 최적화 대상 아님 */}
        {/* 높이는 SVG 원본(620)이 아니라 띠로 자른 표시 비율 — 아래 .hero img 의 aspect-ratio 와 같은 값.
            CSS 가 오기 전에도 같은 자리를 예약해 레이아웃이 튀지 않게 한다 */}
        <img src={withBase('/home-hero.svg')} alt="" width={1600} height={340} />
      </div>

      <H2>PDS란 무엇인가요?</H2>
      <p className={s.intro}>{INTRO}</p>
      <div className={s.goals}>
        {GOALS.map((g) => (
          <div key={g.term} className={s.goal}>
            {/* 카드 제목은 목차 위계가 아니다 — h3(20px 급)와 어긋나는 16px 제목이라
                헤딩에서 강등(2026-08-28 위계 통일). 시각은 .goalTitle 이 그대로 유지 */}
            <p className={s.goalTitle}>{g.term}</p>
            <p>{g.desc}</p>
          </div>
        ))}
      </div>

      <H2>시스템 이해하기</H2>
      {/* 3열 — AREAS 는 정확히 3개라 2열이면 컴포넌트 카드가 다음 행에 혼자 남아 그리드 stretch
          짝이 없어 다른 두 카드보다 짧아 보였다(2026-08-25 피드백). 3열이면 한 행에 다 들어가
          grid 기본 align-items:stretch 로 셋 다 자동으로 같은 높이가 된다. */}
      <div className={`${s.grid} ${s.areaGrid}`}>
        {AREAS.map((a) => {
          const pages = childPages(a.prefix);
          const first = pages[0];
          return (
            <Link key={a.term} href={first?.path ?? a.prefix} className={s.card}>
              <span className={s.cardHead}>
                {a.term}
                <span className={s.arrow} aria-hidden="true">
                  →
                </span>
              </span>
              <span className={s.cardDesc}>{a.desc}</span>
              <span className={s.cardMeta}>
                {a.unit} {pages.length}개
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
