import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecToken, SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import UsageGrid from '@/components/docs/UsageGrid';
import { Table } from '@polarisoffice/pds-react';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import {
  TABLE_ANATOMY,
  TABLE_SAMPLE_COLUMNS,
  TABLE_SAMPLE_ROWS,
  TABLE_SPEC,
  TABLE_USAGE,
} from './table.data';
import s from './table.module.css';

/**
 * Table — Design 탭.
 * 목차 표준화(2026-08-13): 원본이 Guidelines 아래 h3 로 두었던 Case 를 독립 H2 로 승격해
 * Properties 다음에 배치. 텍스트 동일 = 앵커 id(case·guidelines) 동일, 계층·순서만 변경.
 */
export default function TableDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      {/* 실물 기반 도해 — 패키지 Table 을 렌더해 파트를 실측·콜아웃한다.
          번호는 아래 legend(TABLE_ANATOMY)와 같은 축. 파트가 서로 포개져 있어
          (Container ⊃ Row ⊃ Cell) 앵커를 좌·우·상·하·중앙으로 분리했다:
          01 Container=left(외곽 좌변) · 02 Header=top · 03 Row=right(1행 우변)
          · 04 Divider=1행 첫 셀 bottom(구분선 위의 점) · 05 Cell=1행 끝 셀 center */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: 'div:has(> table)', anchor: 'left' },
          { n: '02', selector: 'thead tr' },
          { n: '03', selector: 'tbody tr:first-of-type', anchor: 'right' },
          { n: '04', selector: 'tbody tr:first-of-type td:first-of-type', anchor: 'bottom' },
          { n: '05', selector: 'tbody tr:first-of-type td:last-of-type', anchor: 'center' },
        ]}
      >
        {/* 견본 값은 Case 프리뷰와 단일 소스(table.data.ts) */}
        <Table columns={TABLE_SAMPLE_COLUMNS} rows={TABLE_SAMPLE_ROWS} />
      </AnatomyFigure>
      <Anatomy items={[...TABLE_ANATOMY]} />

      <H2>Properties</H2>

      <H3>Base</H3>
      <p>
        헤더 행과 데이터 행으로 구성된 기본 형태예요. 헤더는 배경색으로 데이터 행과 구분하고, 행 사이는
        구분선으로 나눠요. <TabSwitchLink to="code">코드로 보기</TabSwitchLink>
      </p>

      <H3>Column Divider</H3>
      <p>열 구분선이 필요한 경우 사용해요. 열 수가 많거나 데이터 구분이 필요할 때 적용해요.</p>

      <H2>Case</H2>
      <p>
        padding은 최소 <strong>24/16을 유지</strong>하며 그 이상 너비 조절은 콘텐츠의 길이를 고려하여
        설정한다. 열 구분선은 필요에 따라 추가할 수 있으나, 반드시 필요한 경우를 제외하고 사용을 지양한다.
        화면 너비가 충분하지 않은 경우엔 테이블 사용을 지양한다. (모바일)
      </p>
      {/* 실물 프리뷰(2026-08-28, toggle 패턴) — 위 서술의 두 형태(기본 / 열 구분선)를 실물로 보인다.
          라벨은 Properties 의 H3 이름(Base·Column Divider) 재사용, 견본 값은 Anatomy 도해와
          단일 소스(table.data.ts). 프리뷰는 그림이므로 inert 로 클릭·포커스를 막는다 */}
      <div className={s.casePreview} inert aria-hidden="true">
        <figure className={s.caseFigure}>
          <figcaption className={s.caseLabel}>Base</figcaption>
          <Table columns={TABLE_SAMPLE_COLUMNS} rows={TABLE_SAMPLE_ROWS} />
        </figure>
        <figure className={s.caseFigure}>
          <figcaption className={s.caseLabel}>Column Divider</figcaption>
          <Table columnDivider columns={TABLE_SAMPLE_COLUMNS} rows={TABLE_SAMPLE_ROWS} />
        </figure>
      </div>

      <H2>Guidelines</H2>
      <UsageGrid do={[...TABLE_USAGE.do]} dont={[...TABLE_USAGE.dont]} />

      <H2>Specification</H2>
      <SpecTable
        caption="Table 치수와 색상"
        columns={[
          { key: 'prop', header: '속성', width: '28%' },
          { key: 'value', header: '값', width: '40%' },
          { key: 'desc', header: '설명', width: '32%' },
        ]}
        rows={TABLE_SPEC.map((r) => ({
          prop: r.prop,
          // 토큰명이 값 자리에 오는 행이 섞여 있다 — 원본 표기 그대로 두되 칩만 구분한다
          value: r.value.startsWith('--') ? <SpecToken>{r.value}</SpecToken> : <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />
    </>
  );
}
