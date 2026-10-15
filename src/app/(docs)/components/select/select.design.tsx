import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecToken, SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import { Select, type SelectSize } from '@polarisoffice/pds-react';
import UsageGrid from '@/components/docs/UsageGrid';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import Swatch from '@/components/docs/Swatch';
import {
  SELECT_ANATOMY,
  SELECT_MENU_SPEC,
  SELECT_SAMPLE,
  SELECT_SIZES,
  SELECT_STATES,
  SELECT_TRIGGER_SPEC,
  SELECT_USAGE,
} from './select.data';
import s from './select.module.css';

const SPEC_COLUMNS = [
  { key: 'prop', header: '속성', width: '32%' },
  { key: 'value', header: '값', width: '38%' },
  { key: 'desc', header: '설명', width: '30%' },
];

/**
 * Select — Design 탭.
 * 원본 앵커: anatomy · properties · state · size · guidelines · specification ·
 *            trigger · menu-context-menu-item
 *
 * 명명 통일(2026-08-13 목차 감사): Specification 하위 trigger→container ·
 * menu-context-menu-item→menu(참조 관계는 본문 산문으로 이동). 구 앵커는 anchor-aliases.ts 가 구제.
 *
 * 실물 프리뷰(2026-08-28, 디자인팀장 검토 "여기도 프리뷰 필요"): State 표에 Preview 열,
 * Size 표에 Preview 행 — 패키지 Select 를 접힌 기본 상태로 그대로 렌더한다(견본 값은
 * select.data.ts SELECT_SAMPLE, Anatomy 견본과 단일 소스). 프리뷰는 그림이므로
 * AnatomyFigure 의 inert 결정(2026-08-19)을 따라 클릭·포커스를 막는다 — 살아있는 데모는
 * Code 탭에 있다. Open 상태만 프리뷰가 없다(사유는 data 주석).
 */

/** Size 표 Preview 행의 실물 — 짧은 선택값(문서)으로 네 치수를 같은 행에서 대조한다 */
function SizePreview({ size }: { size: SelectSize }) {
  return (
    <span className={s.cellPreview} inert aria-hidden="true">
      <Select size={size} options={[...SELECT_SAMPLE.options]} value="a" />
    </span>
  );
}

export default function SelectDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      {/* 실물 기반 도해(2026-08-19) — 패키지 Select 를 닫힌 기본 상태로 렌더해 파트를
          실측·콜아웃한다. 번호는 아래 legend(SELECT_ANATOMY)와 같은 축.
          트리거 DOM: button[aria-haspopup="listbox"] > span(텍스트) + span(셰브런) */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: 'button[aria-haspopup="listbox"]', anchor: 'left' },
          { n: '02', selector: 'button[aria-haspopup="listbox"] > span:first-of-type' },
          { n: '03', selector: 'button[aria-haspopup="listbox"] > span:last-of-type' },
        ]}
      >
        {/* 견본 값은 SELECT_SAMPLE — 표 프리뷰(2026-08-28 신설)와 단일 소스 */}
        <Select width={260} placeholder={SELECT_SAMPLE.placeholder} options={[...SELECT_SAMPLE.options]} />
      </AnatomyFigure>
      <Anatomy items={[...SELECT_ANATOMY]} />

      <H2>Properties</H2>

      <H3>State</H3>
      <p>
        상태에 따라 테두리 색이 바뀌어요. Disabled 는 글자와 아이콘만 흐려지고 배경과 모서리는
        그대로예요. <TabSwitchLink to="code">코드로 보기</TabSwitchLink>
      </p>
      <SpecTable
        caption="Select 상태별 실물"
        columns={[
          { key: 'state', header: 'State', width: '18%' },
          { key: 'preview', header: 'Preview', width: '32%' },
          { key: 'desc', header: '설명', width: '50%' },
        ]}
        rows={SELECT_STATES.map((r) => ({
          state: <strong>{r.state}</strong>,
          // Open(preview=null)은 '—' — open 이 내부 상태라 정적 렌더 불가(data 주석 참고)
          preview: r.preview ? (
            <span className={s.cellPreview} inert aria-hidden="true">
              <Select
                options={[...SELECT_SAMPLE.options]}
                placeholder={SELECT_SAMPLE.placeholder}
                value={r.preview.value}
                disabled={r.preview.disabled}
              />
            </span>
          ) : (
            '—'
          ),
          desc: r.desc,
        }))}
      />

      <H3>Size</H3>
      <p>
        Input Field 와 같은 4단계예요. 같은 높이의 Button 과 한 줄에 맞춰 써요.
      </p>
      <SpecTable
        caption="Select 사이즈별 실물과 쓰는 자리"
        columns={[
          { key: 'size', header: 'Size', width: '16%' },
          { key: 'preview', header: '실물', width: '34%' },
          { key: 'use', header: '쓰는 자리', width: '50%' },
        ]}
        rows={[
          { size: <strong>LG</strong>, preview: <SizePreview size="lg" />, use: '폼. 기본 크기예요' },
          { size: <strong>MD</strong>, preview: <SizePreview size="md" />, use: '검색' },
          { size: <strong>SM</strong>, preview: <SizePreview size="sm" />, use: '표 툴바, 촘촘한 화면' },
          { size: <strong>XS</strong>, preview: <SizePreview size="xs" />, use: '표 셀 안처럼 좁은 곳' },
        ]}
      />

      <H2>Guidelines</H2>
      <UsageGrid do={[...SELECT_USAGE.do]} dont={[...SELECT_USAGE.dont]} />
    </>
  );
}

/** Specification — 치수·토큰 표. Code 탭 끝에 놓는다(2026-10-12: Design 탭은 쓰임새, Code 탭은 구현 값).
 *  헤딩 id 는 Design 탭에 있을 때와 같아서 옛 딥링크(#specification 등)는 DocTabs 가 Code 탭을 열어 준다. */
export function SelectSpecification() {
  return (
    <>
      <H2>Specification</H2>

      {/* Design 탭 Properties 에도 Size 가 있다 — id 를 따로 박는다(button 과 같은 방식) */}
      <H3 id="size-1">Size</H3>
      <SpecTable
        caption="Select 사이즈별 치수"
        columns={[
          { key: 'prop', header: '', width: '20%' },
          { key: 'lg', header: 'LG', width: '20%' },
          { key: 'md', header: 'MD', width: '20%' },
          { key: 'sm', header: 'SM', width: '20%' },
          { key: 'xs', header: 'XS', width: '20%' },
        ]}
        rows={SELECT_SIZES.map((r) => ({
          prop: <strong>{r.prop}</strong>,
          lg: <SpecVal>{r.lg}</SpecVal>,
          md: <SpecVal>{r.md}</SpecVal>,
          sm: <SpecVal>{r.sm}</SpecVal>,
          xs: <SpecVal>{r.xs}</SpecVal>,
        }))}
      />

      <H3>Container</H3>
      <SpecTable
        caption="Select 트리거 스펙"
        columns={SPEC_COLUMNS}
        rows={SELECT_TRIGGER_SPEC.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />

      <H3>Border Color by State</H3>
      <SpecTable
        caption="상태별 테두리 색"
        columns={[
          { key: 'state', header: 'State', width: '30%' },
          { key: 'border', header: 'Border', width: '70%' },
        ]}
        rows={SELECT_STATES.map((r) => ({
          state: <strong>{r.state}</strong>,
          border: (
            <>
              <SpecToken>{r.token}</SpecToken> <Swatch hex={r.border} />
            </>
          ),
        }))}
      />

      <H3>Menu</H3>
      <p>메뉴 목록과 항목은 Context &amp; Menu Item 스펙을 그대로 써요.</p>
      <SpecTable
        caption="Select 메뉴 스펙"
        columns={SPEC_COLUMNS}
        rows={SELECT_MENU_SPEC.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />
    </>
  );
}
