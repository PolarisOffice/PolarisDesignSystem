import { H2, H3 } from '@/components/docs/Heading';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import SpecTable, { SpecToken, SpecVal } from '@/components/docs/SpecTable';
import UsageGrid from '@/components/docs/UsageGrid';
import { Tabs } from '@polarisoffice/pds-react';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import {
  TABLIST_SPEC,
  TABS_ANATOMY,
  TABS_ALTERNATIVES,
  TABS_SAMPLE_DEFAULT,
  TABS_SAMPLE_ITEMS,
  TABS_STATE_SAMPLE_DEFAULT,
  TABS_STATE_SAMPLE_ITEMS,
  TABS_VARIANT_USAGE,
  TAB_ITEM_SPEC,
  TAB_TOKEN_CORRECTIONS,
} from './tabs.data';
import s from './tabs.module.css';

/**
 * Tabs — Design 탭.
 * 원본 앵커: properties · variant · layout · size · state · guidelines · variant-선택 ·
 *            fill과-hug-레이아웃 · 탭-수-제한 · 2-depth-탭-구조 · 탭-vs-다른-컴포넌트 ·
 *            specification · tablist · tab-item
 *
 * 명명 통일(2026-08-13 목차 감사): Anatomy 신설(스펙 유도), Specification 하위
 * tablist→container · tab-item→item. 구 앵커는 anchor-aliases.ts 가 구제한다.
 *
 * 원본에서 실제로 동작하던 두 페이지 중 하나다(슬라이딩 인디케이터). 그 동작은 Design 탭이 아니라
 * Code 탭 — 즉 패키지 컴포넌트의 몫이다. 여기엔 전환 시간(150ms) 같은 **스펙**만 남긴다.
 */
export default function TabsDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      {/* 실물 기반 도해 — 패키지 Tabs 를 렌더해 파트를 실측·콜아웃한다(번호는 아래 legend 와 같은 축).
          Indicator·Divider 는 별도 엘리먼트가 아니라 각각 선택 탭·tablist 의 하단 보더라
          anchor='bottom' 으로 그 선 위에 점을 찍는다. hug + 고정폭 래퍼는 Divider 가
          탭 아이템 밖까지 이어짐을 보여 주고, 콜아웃 리더선이 탭을 관통하지 않게 한다 */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: '[role="tablist"] > button:first-of-type' },
          { n: '02', selector: 'button[aria-selected="true"]', anchor: 'bottom' },
          { n: '03', selector: '[role="tablist"]', anchor: 'bottom' },
        ]}
      >
        {/* 400px 는 콜아웃 리더선이 탭을 관통하지 않게 벌려 주는 무대 폭이다. hug 탭은
            fit-content 라 그냥 두면 무대 왼쪽에 붙어(실측 −129px) 회색 박스 안에서
            치우쳐 보이므로 무대 안에서 가운데로 놓는다 */}
        <div style={{ width: 400, display: 'flex', justifyContent: 'center' }}>
          {/* 견본 값은 Properties 유형 프리뷰와 단일 소스(tabs.data.ts) */}
          <Tabs layout="hug" defaultValue={TABS_SAMPLE_DEFAULT} items={TABS_SAMPLE_ITEMS} />
        </div>
      </AnatomyFigure>
      <Anatomy items={[...TABS_ANATOMY]} />

      <H2>Properties</H2>
      <p>
        Variant(Primary·Secondary) · Layout(Fill·Hug) · Size(Medium·Small) · State 네 축으로 구성돼요.{' '}
        <TabSwitchLink to="code">전체 조합을 코드와 함께 보기</TabSwitchLink>
      </p>

      <H3>Variant</H3>
      <p>
        Primary 는 페이지 최상단 메인 네비게이션, Secondary 는 섹션 안 서브 카테고리에 써요. 선택 탭은 하단
        2px 선으로 표시해요.
      </p>
      {/* 실물 프리뷰(2026-08-28, toggle 패턴) — 텍스트로만 서술되던 유형 축을 실물로 보인다.
          프리뷰는 그림이므로 inert 로 클릭·포커스를 막고, 폭 없는 컨테이너의 fill 어긋남
          이슈(tabs.code.tsx 2026-08-28 주석) 때문에 layout="hug" 를 명시한다.
          견본 값은 Anatomy 도해와 단일 소스(tabs.data.ts) */}
      <div className={s.typePreview} inert aria-hidden="true">
        <figure className={s.previewCol}>
          <figcaption className={s.previewLabel}>Primary</figcaption>
          <Tabs variant="primary" layout="hug" items={TABS_SAMPLE_ITEMS} defaultValue={TABS_SAMPLE_DEFAULT} />
        </figure>
        <figure className={s.previewCol}>
          <figcaption className={s.previewLabel}>Secondary</figcaption>
          <Tabs variant="secondary" layout="hug" items={TABS_SAMPLE_ITEMS} defaultValue={TABS_SAMPLE_DEFAULT} />
        </figure>
      </div>

      <H3>Layout</H3>
      <p>
        Fill 은 탭 너비를 균등 분할하고, Hug 는 레이블 길이에 맞춰요.
      </p>
      {/* 등분(fill) vs 레이블 폭(hug)의 차이는 같은 폭 위에서만 드러난다 — 둘 다 고정 폭
          무대(.layoutStage, Anatomy 래퍼와 같은 400px)에 올려 대조한다 */}
      <div className={s.typePreview} inert aria-hidden="true">
        <figure className={s.previewCol}>
          <figcaption className={s.previewLabel}>Fill</figcaption>
          <div className={s.layoutStage}>
            <Tabs layout="fill" items={TABS_SAMPLE_ITEMS} defaultValue={TABS_SAMPLE_DEFAULT} />
          </div>
        </figure>
        <figure className={s.previewCol}>
          <figcaption className={s.previewLabel}>Hug</figcaption>
          <div className={s.layoutStage}>
            <Tabs layout="hug" items={TABS_SAMPLE_ITEMS} defaultValue={TABS_SAMPLE_DEFAULT} />
          </div>
        </figure>
      </div>

      <H3>Size</H3>
      <p>
        Medium(44px) · Small(40px) 두 단계예요.
      </p>
      <div className={s.typePreview} inert aria-hidden="true">
        <figure className={s.previewCol}>
          <figcaption className={s.previewLabel}>Medium</figcaption>
          <Tabs size="medium" layout="hug" items={TABS_SAMPLE_ITEMS} defaultValue={TABS_SAMPLE_DEFAULT} />
        </figure>
        <figure className={s.previewCol}>
          <figcaption className={s.previewLabel}>Small</figcaption>
          <Tabs size="small" layout="hug" items={TABS_SAMPLE_ITEMS} defaultValue={TABS_SAMPLE_DEFAULT} />
        </figure>
      </div>

      <H3>State</H3>
      <p>Enabled · Selected · Disabled. Tabs 의 Disabled 는 투명도 35% 예요.</p>
      {/* 선택=전체 로 Selected(전체)·Enabled(문서)·Disabled(보관함) 세 상태가 한 번에 보인다 */}
      <div className={s.typePreview} inert aria-hidden="true">
        <Tabs layout="hug" items={TABS_STATE_SAMPLE_ITEMS} defaultValue={TABS_STATE_SAMPLE_DEFAULT} />
      </div>

      <H2>Guidelines</H2>

      <H3>Variant 선택</H3>
      <UsageGrid do={[...TABS_VARIANT_USAGE.do]} dont={[...TABS_VARIANT_USAGE.dont]} />

      <H3>Fill과 Hug 레이아웃</H3>
      <p>
        Fill 은 탭이 3~5개이고 균등한 무게가 필요할 때, Hug 는 6개 이상이거나 레이블 길이가 제각각일 때 써요.
        억지로 균등 분할하면 짧은 탭이 어색하게 넓어져요.
      </p>

      <H3>탭 수 제한</H3>
      <p>
        2~7개로 유지해요. 8개를 넘으면 한눈에 안 들어오니 Hug + 가로 스크롤을 검토해요.
      </p>

      <H3>2 Depth 탭 구조</H3>
      <p>
        1차 분류는 Primary, 2차 분류는 Secondary 예요. Primary 아래 Secondary 까지가 최대 깊이고, 3 depth 는
        쓰지 않아요.
      </p>

      <H3>탭 vs 다른 컴포넌트</H3>
      <p>
        탭은 같은 계층의 콘텐츠를 오갈 때만 써요. 아래 상황은 다른 컴포넌트 몫이에요.
      </p>
      <SpecTable
        caption="탭 대신 쓸 컴포넌트"
        columns={[
          { key: 'situation', header: '상황', width: '58%' },
          { key: 'alternative', header: '대안', width: '42%' },
        ]}
        rows={TABS_ALTERNATIVES.map((r) => ({ situation: r.situation, alternative: <strong>{r.alternative}</strong> }))}
      />

      <H2>Specification</H2>

      <H3>Container</H3>
      <SpecTable
        caption="Tablist 치수"
        columns={[
          { key: 'prop', header: '속성', width: '32%' },
          { key: 'value', header: '값', width: '32%' },
          { key: 'desc', header: '설명', width: '36%' },
        ]}
        rows={TABLIST_SPEC.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />

      <H3>Item</H3>
      <SpecTable
        caption="Tab Item 상태별 색상"
        columns={[
          { key: 'prop', header: '속성', width: '26%' },
          { key: 'state', header: 'State', width: '16%' },
          { key: 'primary', header: 'Primary', width: '29%' },
          { key: 'secondary', header: 'Secondary', width: '29%' },
        ]}
        rows={TAB_ITEM_SPEC.map((r) => ({
          prop: r.prop,
          state: r.state,
          primary: <SpecVal>{r.primary}</SpecVal>,
          secondary: <SpecVal>{r.secondary}</SpecVal>,
        }))}
      />
      <p className="kit-muted">
        ⚠️ 위 표의 토큰명 중 다음 두 개는 <code>tokens.css</code> 에 실존하지 않아요(Figma 원본 표기 오류).
        구현 시에는 교정값을 써요:{' '}
        {TAB_TOKEN_CORRECTIONS.map((c, i) => (
          <span key={c.wrong}>
            {i > 0 && ' · '}
            <SpecToken>{c.wrong}</SpecToken> → <SpecToken>{c.right}</SpecToken>
          </span>
        ))}
      </p>
    </>
  );
}
