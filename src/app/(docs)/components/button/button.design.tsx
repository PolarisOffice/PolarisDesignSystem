import { Fragment } from 'react';
import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecToken, SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import { Button, DownloadIcon } from '@polarisoffice/pds-react';
import { CaseList, CaseBlock } from '@/components/docs/CaseList';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import Swatch from '@/components/docs/Swatch';
import {
  BUTTON_GHOST_VARIANTS,
  BUTTON_HIERARCHY,
  BUTTON_PAIRS,
  BUTTON_SIZES,
  BUTTON_SOLID_VARIANTS,
  BUTTON_STATE_DEMOS,
  BUTTON_TOKENS,
} from './button.data';
import s from './button.module.css';

/** State 프리뷰 그리드의 열 순서 — wanted DS states 그리드와 같은 축 */
const STATE_COLS = ['Normal', 'Hovered', 'Pressed', 'Disabled'] as const;

/**
 * Button — Design 탭 (정적 가이드).
 *
 * 원본(VitePress) 앵커를 그대로 유지한다: anatomy · properties · size · variant · state ·
 * guidelines · hierarchy · 버튼-조합 · 배치 · specification · size-1 · token.
 * Code 탭 앵커는 `code-` 접두를 써서 이 이름들과 겹치지 않는다.
 *
 * 처음엔 카탈로그성 데모(Variant/State 나열)를 Code 탭에만 두었으나, 디자인팀 검토
 * (2026-08-28 "버튼 스타일을 같이 보여주면 좋을 것 같음")로 Design 탭에도 실물 프리뷰를
 * 들였다: Variant 표 앞 밴드 · State 그리드 · Hierarchy 사례 견본. 전부 이미지가 아니라
 * 패키지 Button 실물 렌더라 토큰이 바뀌면 문서도 함께 바뀐다.
 */
export default function ButtonDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      {/* 실물 기반 도해(2026-08-19) — 손그림이 아니라 패키지 Button 을 렌더해 파트를
          실측·콜아웃한다. legend 가 "형태 3종"(기본·Right Icon·Left Icon) 축이므로
          견본도 3종을 나란히 두고 01=기본 버튼 전체, 02·03=아이콘을 가리킨다.
          번호는 아래 legend 와 같은 축 */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: 'button:nth-of-type(1)' },
          { n: '02', selector: 'button:nth-of-type(2) svg' },
          { n: '03', selector: 'button:nth-of-type(3) svg' },
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Button variant="primary">버튼</Button>
          <Button variant="primary" rightIcon={<DownloadIcon />}>
            버튼
          </Button>
          <Button variant="primary" leftIcon={<DownloadIcon />}>
            버튼
          </Button>
        </div>
      </AnatomyFigure>
      <Anatomy
        items={[
          { n: '01', title: '기본 버튼', desc: '아이콘 없이 레이블만 사용하는 기본 형태' },
          { n: '02', title: 'Right Icon', desc: '아이콘이 오른쪽에 위치. 시각적 균형에 따라 좌우 여백 조정 가능' },
          { n: '03', title: 'Left Icon', desc: '아이콘이 왼쪽에 위치. 시각적 균형에 따라 좌우 여백 조정 가능' },
        ]}
      />

      <H2>Properties</H2>
      <p>
        중요도와 맥락에 따라 Variant 와 Size 를 골라요.{' '}
        <TabSwitchLink to="code">전체 variant 를 코드와 함께 보기</TabSwitchLink>
      </p>

      <H3>Size</H3>
      <SpecTable
        caption="Button 사이즈별 치수"
        columns={[
          { key: 'size', header: 'Size', width: '12%' },
          { key: 'height', header: 'Height', width: '13%' },
          { key: 'pad', header: 'Padding(좌우)', width: '17%' },
          { key: 'font', header: 'Font', width: '12%' },
          { key: 'weight', header: 'Weight', width: '12%' },
          { key: 'radius', header: 'Radius', width: '12%' },
        ]}
        rows={BUTTON_SIZES.map((b) => ({
          size: <strong>{b.size}</strong>,
          height: <SpecVal>{`${b.height}px`}</SpecVal>,
          pad: <SpecVal>{`${b.padX}px`}</SpecVal>,
          font: <SpecVal>{`${b.fontSize}px`}</SpecVal>,
          weight: <SpecVal>{String(b.weight)}</SpecVal>,
          radius: <SpecVal>{`${b.radius}px`}</SpecVal>,
        }))}
      />

      <H3>Variant</H3>
      {/* 실물 밴드 + 스펙 표 짝(검토 반영 2026-08-28) — 표에 프리뷰 열을 넣는 안은
          SpecTable 이 table-layout: fixed 라 좁은 화면에서 버튼 셀이 찌그러져 기각.
          참고 예시(seed-design action-button#variant)처럼 버튼 아래 이름표를 단다 */}
      <div className={s.variantRows}>
        {BUTTON_SOLID_VARIANTS.map((v) => (
          <div key={v.name} className={s.variantRow}>
            <span className={s.variantRowHead}>
              <span className={s.variantRowKey}>Variant</span>
              <span className={s.variantChip}>{v.label}</span>
            </span>
            {/* 프리뷰 버튼은 32 사이즈 통일 (2026-08-28 피드백) */}
            <Button variant={v.name} size={32}>라벨</Button>
          </div>
        ))}
      </div>
      <SpecTable
        caption="Solid variant 별 색상과 용도"
        columns={[
          { key: 'variant', header: 'Variant', width: '14%' },
          { key: 'bg', header: '배경', width: '28%' },
          { key: 'fg', header: '텍스트', width: '28%' },
          { key: 'usage', header: '용도', width: '30%' },
        ]}
        rows={BUTTON_SOLID_VARIANTS.map((v) => ({
          variant: <strong>{v.label}</strong>,
          bg: <Swatch hex={v.bg} token={v.bgToken} />,
          fg: <Swatch hex={v.fg} token={v.fgToken} />,
          usage: v.usage,
        }))}
      />
      <div className={s.variantRows}>
        {BUTTON_GHOST_VARIANTS.map((v) => (
          <div key={v.name} className={s.variantRow}>
            <span className={s.variantRowHead}>
              <span className={s.variantRowKey}>Variant</span>
              <span className={s.variantChip}>{v.label}</span>
            </span>
            <Button variant={v.name} size={32}>라벨</Button>
          </div>
        ))}
      </div>
      <SpecTable
        caption="Ghost variant 별 색상과 용도"
        columns={[
          { key: 'variant', header: 'Ghost Variant', width: '16%' },
          { key: 'fg', header: '텍스트', width: '28%' },
          { key: 'border', header: '테두리', width: '28%' },
          { key: 'usage', header: '용도', width: '28%' },
        ]}
        rows={BUTTON_GHOST_VARIANTS.map((v) => ({
          variant: <strong>{v.label}</strong>,
          fg: <Swatch hex={v.fg} token={v.fgToken} />,
          border: <Swatch hex={v.border} token={v.borderToken} />,
          usage: v.usage,
        }))}
      />

      <H3>State</H3>
      <p>
        Button 의 Disabled 는 <strong>투명도가 아니라 색상 자체를 교체</strong>해요. 배경은{' '}
        <SpecToken>--color-fill-strong</SpecToken>, 텍스트는 <SpecToken>--color-label-assistive</SpecToken>
        를 써요. 컴포넌트마다 Disabled 처리 방식이 다른 것은 의도된 차이라 임의로 통일하지 않아요.
      </p>
      {/* 상태 프리뷰 그리드(검토 반영 2026-08-28) — 대표 3형태(채움·중립 채움·아웃라인).
          Hovered·Pressed 는 실제 인터랙션으로만 나타나므로 **표시용 상태 고정**:
          패키지 style.ts FACES 의 hover 색(세 변형 모두 배경만 바꾼다)을 style 로 박아
          렌더한다. Pressed 는 현 구현에 전용 색이 없어 Hovered 와 같다(아래 각주).
          Disabled 는 색 고정이 아니라 실제 disabled prop. 표시용 복제 버튼은 눌러도
          의미가 없으니 보조기기·탭 순서에서 뺀다 */}
      <div className={s.stateGridOuter}>
        <div className={s.stateGrid}>
          <span />
          {STATE_COLS.map((c) => (
            <span key={c} className={s.stateColLabel}>
              {c}
            </span>
          ))}
          {BUTTON_STATE_DEMOS.map((d) => {
            const fixedHover = { backgroundColor: `var(${d.hoverToken})` };
            return (
              <Fragment key={d.variant}>
                <span className={s.stateRowLabel}>{d.label}</span>
                <Button variant={d.variant} size={32}>버튼</Button>
                <Button variant={d.variant} size={32} style={fixedHover} tabIndex={-1} aria-hidden="true">
                  버튼
                </Button>
                <Button variant={d.variant} size={32} style={fixedHover} tabIndex={-1} aria-hidden="true">
                  버튼
                </Button>
                <Button variant={d.variant} size={32} disabled>
                  버튼
                </Button>
              </Fragment>
            );
          })}
        </div>
      </div>
      <p className={s.previewNote}>
        Hovered·Pressed 열은 상태 색을 고정해 둔 표시용 렌더예요. 현재 Button 은 Pressed 전용
        색을 두지 않아 눌린 동안에도 Hovered 색이 유지돼요.
      </p>

      <H2>Guidelines</H2>

      <H3>Hierarchy</H3>
      <CaseList>
        {BUTTON_HIERARCHY.map((h) => (
          <CaseBlock key={h.n} badge={h.n} title={h.title} sub={h.desc}>
            {/* 설명에 언급된 variant 의 실물 견본(검토 반영 2026-08-28) — 라벨은 데이터에서 */}
            <div className={s.hierarchyRow}>
              {h.examples.map((ex) => (
                <Button key={ex.variant} variant={ex.variant} size={32}>
                  {ex.label}
                </Button>
              ))}
            </div>
          </CaseBlock>
        ))}
      </CaseList>

      <H3>버튼 조합</H3>
      <p>짝을 이루는 조합은 아래 네 가지를 기본으로 써요.</p>
      {/* Hierarchy 와 같은 케이스 블록 + 실물 견본 (2026-08-28 피드백).
          견본 순서는 배치 규칙 그대로 보조 왼쪽, 주요 오른쪽 */}
      <CaseList>
        {BUTTON_PAIRS.map((p) => (
          <CaseBlock key={p.n} badge={p.n} title={p.title} sub={p.desc}>
            <div className={s.hierarchyRow}>
              {p.examples.map((ex) => (
                <Button key={ex.variant} variant={ex.variant} size={32}>
                  {ex.label}
                </Button>
              ))}
            </div>
          </CaseBlock>
        ))}
      </CaseList>

      <H3>배치</H3>
      {/* 2026-08-28 피드백 — 모바일도 가로 배치를 쓰는 경우가 있어 세로/가로 두 패턴을 병기 */}
      <div className={s.placementGrid}>
        <div className={s.placementBox}>
          <p className={s.placementLabel}>Desktop · 오른쪽이 주요 액션</p>
          <p className={s.placementOrder}>취소 · <strong>저장</strong></p>
        </div>
        <div className={s.placementBox}>
          <p className={s.placementLabel}>Mobile 세로 · 위가 주요 액션</p>
          <p className={s.placementOrder}><strong>저장</strong> ↑ / 취소 ↓</p>
        </div>
        <div className={s.placementBox}>
          <p className={s.placementLabel}>Mobile 가로 · 오른쪽이 주요 액션</p>
          <p className={s.placementOrder}>취소 · <strong>저장</strong></p>
        </div>
      </div>

      <H2>Specification</H2>

      {/* ⚠️ 원본에 `### Size` 가 Properties 와 Specification 두 번 나온다 → VitePress 가 두 번째에
          `-1` 을 붙인다. 렌더타임 카운터를 쓰면 StrictMode·스트리밍에서 서버/클라 값이 갈리므로
          명시적으로 박는다. */}
      <H3 id="size-1">Size</H3>
      <SpecTable
        caption="사이즈별 사용 맥락"
        columns={[
          { key: 'size', header: 'Size', width: '16%' },
          { key: 'usage', header: '용도', width: '84%' },
        ]}
        rows={BUTTON_SIZES.map((b) => ({
          size: <strong>{b.size}</strong>,
          usage: b.usage,
        }))}
      />

      <H3>Token</H3>
      <SpecTable
        caption="Button 이 쓰는 디자인 토큰"
        columns={[
          { key: 'token', header: 'Token', width: '38%' },
          { key: 'value', header: '값', width: '22%' },
          { key: 'usage', header: '용도', width: '40%' },
        ]}
        rows={BUTTON_TOKENS.map((t) => ({
          token: <SpecToken>{t.token}</SpecToken>,
          value: <Swatch hex={t.value} />,
          usage: t.usage,
        }))}
      />
    </>
  );
}
