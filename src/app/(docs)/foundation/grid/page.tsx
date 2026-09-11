import type { Metadata } from 'next';
import { H2 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import SpecTable from '@/components/docs/SpecTable';
import { pageMeta } from '@/lib/docs/pages';
import { BREAKPOINTS, GRID_TERMS, SVG_COL_XS } from './grid.data';
import s from './grid.module.css';

const meta = pageMeta('/foundation/grid')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/foundation/grid.md` */
export default function GridPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>그리드는 콘텐츠를 배치하고 일관된 페이지 레이아웃을 만드는 데 사용해요.</PageLead>

      {/* H1 "Grid" 와 텍스트 중복 — VitePress 규칙대로 id="grid-1" 명시 (Heading.tsx 주석 참고) */}
      <H2 id="grid-1">Grid</H2>
      <p>레이아웃 그리드 구조에는 세 가지 요소가 있어요.</p>

      <div className={s.terms}>
        {GRID_TERMS.map((t) => (
          <div key={t.title} className={s.term}>
            <div className={s.termTitle}>{t.title}</div>
            <div className={s.termDesc}>{t.desc}</div>
          </div>
        ))}
      </div>

      <div className={s.svgWrap}>
        <svg
          viewBox="0 0 760 200"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Grid diagram showing columns, gutters, and margins"
        >
          {/* margin left */}
          <rect x="0" y="40" width="36" height="120" fill="var(--color-accent-normal)" opacity="0.12" rx="2" />
          {/* columns (12 cols, gutter=8, margin=36, total content=688, col=(688-11*8)/12=49.3) */}
          {SVG_COL_XS.map((x) => (
            <rect
              key={x}
              x={x}
              y="40"
              width="49"
              height="120"
              fill="var(--color-accent-normal)"
              opacity="0.65"
              rx="2"
            />
          ))}
          {/* margin right */}
          <rect x="712" y="40" width="36" height="120" fill="var(--color-accent-normal)" opacity="0.12" rx="2" />

          {/* label: Columns */}
          <line x1="378" y1="30" x2="378" y2="38" stroke="var(--docs-illus-mute)" strokeWidth="1" />
          <text x="378" y="22" textAnchor="middle" fontSize="11" fill="var(--docs-illus-mute)" fontFamily="sans-serif">
            Columns
          </text>

          {/* label: Gutters */}
          <line x1="574" y1="30" x2="574" y2="38" stroke="var(--docs-illus-mute)" strokeWidth="1" />
          <text x="574" y="22" textAnchor="middle" fontSize="11" fill="var(--docs-illus-mute)" fontFamily="sans-serif">
            Gutters
          </text>

          {/* label: Margins */}
          <line x1="730" y1="30" x2="730" y2="38" stroke="var(--docs-illus-mute)" strokeWidth="1" />
          <text x="730" y="22" textAnchor="middle" fontSize="11" fill="var(--docs-illus-mute)" fontFamily="sans-serif">
            Margins
          </text>
        </svg>
      </div>

      <H2>Breakpoints</H2>
      <p>
        각 Breakpoint는 최적의 사용자 경험을 보장하기 위해 웹사이트 레이아웃이 바뀌는 기준점이에요.
        반응형 디자인에서 중단점 범위는 해당 뷰포트 크기에 가장 적합한 열 수와 권장 여백 및 거터 너비를
        결정해요.
      </p>
      <SpecTable
        columns={[
          { key: 'token', header: 'Breakpoint', width: '28%' },
          { key: 'viewport', header: 'Viewport', width: '22%' },
          { key: 'columns', header: 'Columns', width: '15%' },
          { key: 'gutters', header: 'Gutters', width: '17%' },
          { key: 'margins', header: 'Margins', width: '18%' },
        ]}
        rows={BREAKPOINTS.map((b) => ({
          token: <span className={s.tokenName}>{b.token}</span>,
          viewport: b.viewport,
          columns: <span className={s.colsVal}>{b.columns}</span>,
          gutters: b.gutters,
          margins: b.margins,
        }))}
      />
    </>
  );
}
