import { H2, H3, H4 } from '@/components/docs/Heading';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import { DownloadIcon, IconButton, Tooltip } from '@polarisoffice/pds-react';
import SpecTable, { SpecVal } from '@/components/docs/SpecTable';
import UsageGrid from '@/components/docs/UsageGrid';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import { DemoCol, DemoRow, DemoSurface } from '@/components/docs/Demo';
import {
  TOOLTIP_ANATOMY,
  TOOLTIP_ANIMATION,
  TOOLTIP_ARROW_CASES,
  TOOLTIP_CONTAINER,
  TOOLTIP_TIMING_CASCADE,
  TOOLTIP_TIMING_DEFAULT,
  TOOLTIP_TYPOGRAPHY,
  TOOLTIP_USAGE,
} from './tooltip.data';

const PROP_COLUMNS = [
  { key: 'prop', header: '속성', width: '30%' },
  { key: 'value', header: '값', width: '36%' },
  { key: 'desc', header: '설명', width: '34%' },
];

/**
 * Tooltip — Design 탭.
 * 목차 표준화(2026-08-13): 원본이 Properties 아래 h3 로 두었던 Case 를 독립 H2 로 승격.
 * 텍스트 동일 = 앵커 id(case) 동일, 계층만 변경. 결손 보강으로 Anatomy 를 신설했다 —
 * 내용은 창작이 아니라 스펙 값의 재서술(tooltip.data.ts).
 *
 * 원본 12페이지 중 가이드 밀도가 가장 높은 페이지다(가이드 30%). 노출 정책의 타이밍 근거가
 * 특히 중요해서 표를 그대로 옮겼다 — 600ms 가 왜 600ms 인지가 적혀 있는 유일한 문서다.
 *
 * 디자인 검토 반영(2026-08-28): Case 의 화살표 포함/미포함을 실물 Tooltip(open 강제)로 렌더.
 */
export default function TooltipDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      {/* 실물 기반 도해(2026-08-19) — 패키지 Tooltip 을 open(문서용 컨트롤드 모드)으로
          강제 표시해 파트를 실측·콜아웃한다. 번호는 아래 legend(TOOLTIP_ANATOMY)와 같은 축.
          placement="left" 인 이유: 파트(컨테이너·텍스트·화살표)가 가로로 펼쳐져 top 배지의
          x 분리가 명확하고, 말풍선이 위쪽 콜아웃 영역을 침범하지 않는다.
          content 를 span 으로 감싼 것은 02 Text 를 셀렉터로 실측하기 위함(문자열이면 텍스트
          노드라 못 찍는다). 바깥 spacer 는 absolute 말풍선이 레이아웃 폭에 안 잡혀
          도해가 카드 중앙에서 밀리는 것을 보정하는 자리 확보용. */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: 'span[role="tooltip"]', anchor: 'left' },
          { n: '02', selector: 'span[role="tooltip"] > span' },
          { n: '03', selector: 'span[role="tooltip"] + svg' },
        ]}
      >
        <span style={{ display: 'inline-block', paddingLeft: 120 }}>
          <Tooltip content={<span>파일 다운로드</span>} placement="left" open>
            <IconButton aria-label="파일 다운로드" icon={<DownloadIcon />} />
          </Tooltip>
        </span>
      </AnatomyFigure>
      <Anatomy items={[...TOOLTIP_ANATOMY]} />

      <H2>Properties</H2>

      <H3>Position</H3>
      <p>
        기본 Position은 <strong>Top</strong>이에요. 화면 가장자리에 가려지는 경우 자동으로 반대 방향으로
        fallback해요. <TabSwitchLink to="code">네 방향을 코드와 함께 보기</TabSwitchLink>
      </p>

      <H3>Base</H3>
      <p>
        툴팁은 트리거 요소와 <strong>8px</strong> 간격을 두고 노출돼요. 이 간격은 요소와 툴팁 사이의
        시각적 여유를 확보하고, 마우스 이동 중 의도치 않은 닫힘을 막아요.
      </p>

      <H2>Case</H2>
      <p>
        툴팁에 화살표(Arrow)를 포함할지 여부는 트리거 요소와 툴팁의 관계가 맥락상 명확한지에 따라
        결정해요.
      </p>
      {/* 실물 프리뷰 (2026-08-28 디자인 검토 반영 — 텍스트로만 서술되던 두 갈래를 실물로).
          호버로만 뜨는 컴포넌트지만 Anatomy 와 같은 open(문서용 컨트롤드 모드)이 있어
          정적 재현 없이 진짜 패키지 Tooltip 을 항상 보이게 렌더한다 — 말풍선의 색·블러·
          radius·화살표가 스펙과 드리프트하지 않는다. 프리뷰는 그림이므로 toggle 의 inert
          결정(2026-08-19)을 따라 클릭·포커스를 막는다 — 살아있는 호버 데모는 Code 탭에.
          견본 값·레이블은 tooltip.data.ts(TOOLTIP_ARROW_CASES) 단일 소스 — Code 탭 Arrow
          예제와 같은 문구다. 면(DemoSurface)의 위 패딩이 absolute 말풍선 자리를 겸한다. */}
      <DemoSurface>
        <DemoRow gap="wide">
          {TOOLTIP_ARROW_CASES.map((c) => (
            <DemoCol key={c.id} label={c.label}>
              <span inert aria-hidden="true">
                <Tooltip content={c.content} arrow={c.arrow} open>
                  <IconButton aria-label={c.content} />
                </Tooltip>
              </span>
            </DemoCol>
          ))}
        </DemoRow>
      </DemoSurface>

      <H2>Guidelines</H2>
      <UsageGrid do={[...TOOLTIP_USAGE.do]} dont={[...TOOLTIP_USAGE.dont]} />

      <H3>노출 정책</H3>

      <H4>1. Default</H4>
      <SpecTable
        caption="툴팁 기본 노출 타이밍과 근거"
        columns={[
          { key: 'item', header: '항목', width: '28%' },
          { key: 'value', header: '값', width: '26%' },
          { key: 'reason', header: '사용 근거', width: '46%' },
        ]}
        rows={TOOLTIP_TIMING_DEFAULT.map((r) => ({
          item: r.item,
          value: <SpecVal>{r.value}</SpecVal>,
          reason: r.reason,
        }))}
      />

      <H4>2. 케스케이드 모드 (Cascade / 연속 호버)</H4>
      <p>
        사용자가 이미 툴팁 하나를 봤다면, 도구 탐색 중으로 판단하여 다음 툴팁은 즉시 표시해요.
      </p>
      <SpecTable
        caption="케스케이드 모드의 표시 지연"
        columns={[
          { key: 'state', header: '상태', width: '44%' },
          { key: 'delay', header: '표시 지연', width: '56%' },
        ]}
        rows={TOOLTIP_TIMING_CASCADE.map((r) => ({
          state: r.state,
          delay: <SpecVal>{r.delay}</SpecVal>,
        }))}
      />

      <H2>Specification</H2>

      <H3>Container</H3>
      <SpecTable
        caption="Tooltip 컨테이너 스펙"
        columns={PROP_COLUMNS}
        rows={TOOLTIP_CONTAINER.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />

      <H3>Typography</H3>
      <SpecTable
        caption="Tooltip 타이포그래피"
        columns={PROP_COLUMNS}
        rows={TOOLTIP_TYPOGRAPHY.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />

      <H3>Animation</H3>
      <SpecTable
        caption="Tooltip 애니메이션 타이밍"
        columns={PROP_COLUMNS}
        rows={TOOLTIP_ANIMATION.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />
    </>
  );
}
