import { H2, H3 } from '@/components/docs/Heading';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import { SegmentControl } from '@polarisoffice/pds-react';
import SpecTable, { SpecToken, SpecVal } from '@/components/docs/SpecTable';
import UsageGrid from '@/components/docs/UsageGrid';
import { CaseList, CaseBlock } from '@/components/docs/CaseList';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import {
  SEG_ANATOMY,
  SEG_CASES,
  SEG_CONTAINER,
  SEG_COUNT_BADGE,
  SEG_ITEM,
  SEG_PILL_SAMPLE_ITEMS,
  SEG_TOKEN_CORRECTIONS,
  SEG_VS_TABS,
} from './segment-control.data';
import s from './segment-control.module.css';

/**
 * Segment Control — Design 탭.
 * 원본 앵커: properties · variant · layout · size · state · case · guidelines · 언제-써요 ·
 *            variant-선택 · 단일-선택-원칙 · specification · container · segment-item ·
 *            count-badge-pill-only
 *
 * 명명 통일(2026-08-13 목차 감사): Anatomy 신설(스펙 유도), Specification 하위
 * segment-item→item · count-badge-pill-only→count-badge("Pill 전용"은 본문 산문으로 이동).
 * 구 앵커는 anchor-aliases.ts 가 구제한다.
 *
 * tabs 와 함께 원본에서 실제로 동작하던 두 페이지 중 하나(슬라이딩 인디케이터). 그 동작은
 * Code 탭 = 패키지 몫이고 여기엔 스펙만 남긴다.
 */
export default function SegmentControlDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      {/* 실물 기반 도해(2026-08-19) — 손그림이 아니라 패키지 SegmentControl 을 렌더해
          파트를 실측·콜아웃한다. 견본은 Pill: Count Badge 가 Pill 전용이라 세 파트가
          전부 보이는 유일한 변형이다. 번호는 아래 legend(SEG_ANATOMY)와 같은 축 */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: 'div[role="tablist"]', anchor: 'left' },
          { n: '02', selector: 'button[role="tab"][aria-selected="true"]' },
          { n: '03', selector: 'button[role="tab"]:nth-of-type(2) > span:last-of-type' },
        ]}
      >
        {/* 견본 값은 Case 01 프리뷰와 단일 소스(segment-control.data.ts) */}
        <SegmentControl items={SEG_PILL_SAMPLE_ITEMS} defaultValue="all" />
      </AnatomyFigure>
      <Anatomy items={[...SEG_ANATOMY]} />

      <H2>Properties</H2>

      <H3>Variant</H3>
      <p>
        Pill 은 필터링(Count badge 로 결과 수 표시), Filled 는 리스트/그리드 같은 뷰 전환, Outlined 는 배경이
        이미 채워진 영역의 2차 컨트롤이에요. <TabSwitchLink to="code">코드로 보기</TabSwitchLink>
      </p>

      <H3>Layout</H3>
      <p>
        base 는 fill 로 두고 전체 width 를 조절해요. Fill 은 옵션 5개 이하일 때만, 많아지면 Hug 예요.
      </p>

      <H3>Size</H3>
      <p>
        같은 화면에선 사이즈를 통일해요. SM 은 좁은 패널·툴바에 써요.
      </p>

      <H3>State</H3>
      <p>Enabled · Selected · Disabled. Segment Control 의 Disabled 는 투명도 35% 예요.</p>

      <H2>Case</H2>
      <p>base 는 fill 로 두고 전체 width 를 조절해요. 높이도 같아요.</p>
      <CaseList>
        {SEG_CASES.map((c) => (
          <CaseBlock key={c.n} badge={c.n} title={c.title} sub={c.desc}>
            {/* 실물 프리뷰(2026-08-28, toggle 패턴) — 프리뷰는 그림이므로 inert 로 클릭·포커스를
                막는다. 견본 값은 segment-control.data.ts sample 단일 소스 */}
            <div className={s.casePreview} inert aria-hidden="true">
              <SegmentControl
                variant={c.sample.variant}
                items={c.sample.items}
                defaultValue={c.sample.defaultValue}
              />
            </div>
          </CaseBlock>
        ))}
      </CaseList>

      <H2>Guidelines</H2>

      <H3>언제 써요</H3>
      <p>
        고르는 순간 같은 화면이 바뀌어야 해요. 페이지 이동이 아니라 결과를 거르거나 표시 방식을 바꾸는
        용도이고, 옵션 2~5개일 때 가장 좋아요.
      </p>
      <UsageGrid do={[...SEG_VS_TABS.do]} dont={[...SEG_VS_TABS.dont]} />

      <H3>Variant 선택</H3>
      <p>
        Count badge 가 필요하면 Pill 이에요. Fill 레이아웃은 옵션 5개 이하일 때만, 많아지면 Hug 예요.
      </p>

      <H3>단일 선택 원칙</H3>
      <p>
        항상 하나만 선택돼요. 복수 선택은 Checkbox 나 Filter Chip 이에요.
      </p>

      <H2>Specification</H2>

      <H3>Container</H3>
      <SpecTable
        caption="Segment Control 컨테이너 스펙"
        columns={[
          { key: 'prop', header: '속성', width: '34%' },
          { key: 'filled', header: 'Filled / Outlined', width: '33%' },
          { key: 'pill', header: 'Pill', width: '33%' },
        ]}
        rows={SEG_CONTAINER.map((r) => ({
          prop: r.prop,
          filled: <SpecVal>{r.filled}</SpecVal>,
          pill: <SpecVal>{r.pill}</SpecVal>,
        }))}
      />

      <H3>Item</H3>
      <SpecTable
        caption="Segment Item 상태별 스펙"
        columns={[
          { key: 'prop', header: '속성', width: '25%' },
          { key: 'state', header: 'State', width: '17%' },
          { key: 'filled', header: 'Filled', width: '29%' },
          { key: 'outlined', header: 'Outlined', width: '29%' },
        ]}
        rows={SEG_ITEM.map((r) => ({
          prop: r.prop,
          state: r.state,
          filled: <SpecVal>{r.filled}</SpecVal>,
          outlined: <SpecVal>{r.outlined}</SpecVal>,
        }))}
      />

      <H3>Count Badge</H3>
      <p>Count badge 는 Pill 전용이에요.</p>
      <SpecTable
        caption="Count badge 스펙 (Pill 전용)"
        columns={[
          { key: 'prop', header: '속성', width: '34%' },
          { key: 'selected', header: 'Selected', width: '33%' },
          { key: 'enabled', header: 'Enabled', width: '33%' },
        ]}
        rows={SEG_COUNT_BADGE.map((r) => ({
          prop: r.prop,
          selected: <SpecVal>{r.selected}</SpecVal>,
          enabled: <SpecVal>{r.enabled}</SpecVal>,
        }))}
      />
      <p className="kit-muted">
        ⚠️ 위 표의{' '}
        {SEG_TOKEN_CORRECTIONS.map((c) => (
          <span key={c.wrong}>
            <SpecToken>{c.wrong}</SpecToken> → <SpecToken>{c.right}</SpecToken>
          </span>
        ))}{' '}
        중 앞쪽 이름은 <code>tokens.css</code> 에 실존하지 않아요(Figma 원본 표기 오류). 구현 시 교정값을
        써요.
      </p>
    </>
  );
}
