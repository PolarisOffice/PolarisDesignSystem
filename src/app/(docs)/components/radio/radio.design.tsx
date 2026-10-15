import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import { Radio } from '@polarisoffice/pds-react';
import { CaseList, CaseBlock } from '@/components/docs/CaseList';
import { DemoCol, DemoRow, DemoSurface } from '@/components/docs/Demo';
import { RADIO_ANATOMY, RADIO_CASES, RADIO_GUIDELINES, RADIO_SIZES, RADIO_SPEC } from './radio.data';
import s from './radio.module.css';

const SPEC_COLUMNS = [
  { key: 'prop', header: '속성', width: '32%' },
  { key: 'value', header: '값', width: '34%' },
  { key: 'desc', header: '설명', width: '34%' },
];

/**
 * Radio — Design 탭. 2026-10-12 Checkbox & Radio 페이지에서 분리했다.
 * Specification H3 는 'Ring · Dot' — 제목 h1 'Radio' 와 같은 글자면 슬러그가 겹친다. 구 /components/checkbox#radio
 * 딥링크는 anchor-aliases 가 여기로 보낸다.
 * Case 프리뷰는 Checkbox 페이지와 같은 규칙(그림이라 inert, 살아있는 데모는 Code 탭).
 */
export default function RadioDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      <p>원형 링 안에 점을 그려요. 그룹 안에서 하나만 선택돼요.</p>
      <AnatomyFigure
        parts={[
          { n: '01', selector: 'span[aria-hidden="true"]', anchor: 'left' },
          { n: '02', selector: 'span[aria-hidden="true"] > svg' },
          { n: '03', selector: 'label > span:last-of-type' },
        ]}
      >
        <Radio label="Basic" checked />
      </AnatomyFigure>
      <Anatomy items={[...RADIO_ANATOMY]} />

      <H2>Properties</H2>

      {/* 2026-10-12 'Base' 한 문단을 옵션별로 나눴다(Checkbox 와 같은 방식). 상태 모습은 Case 01 에 있다 */}
      <H3>Size</H3>
      <p>표처럼 작은 글자 옆에는 작은 크기를 써요. 그룹에 크기를 정하면 안의 항목에 모두 적용돼요.</p>
      <DemoSurface>
        <DemoRow gap="wide">
          {RADIO_SIZES.map((t) => (
            <DemoCol key={t.size} label={t.size}>
              <span inert aria-hidden="true">
                <Radio size={t.size} checked />
              </span>
            </DemoCol>
          ))}
        </DemoRow>
      </DemoSurface>

      <H3>State</H3>
      <p>미선택·선택·비활성 세 상태예요. 부분 선택은 없어요. 모습은 아래 Case 01 에 있어요.</p>

      <H2>Case</H2>
      <CaseList>
        {RADIO_CASES.map((c) => (
          <CaseBlock key={c.n} badge={c.n} title={c.title} sub={c.desc}>
            {/* 표시 전용이라 name 배선 없이 checked 로만 상태를 고정한다 */}
            <div
              className={c.layout === 'column' ? `${s.casePreview} ${s.casePreviewColumn}` : s.casePreview}
              inert
              aria-hidden="true"
            >
              {c.sample.map((item, i) => (
                <Radio key={i} label={item.label} checked={item.checked ?? false} disabled={item.disabled} />
              ))}
            </div>
          </CaseBlock>
        ))}
      </CaseList>

      <H2>Guidelines</H2>
      <ul>
        {RADIO_GUIDELINES.map((g, i) => (
          <li key={i}>{g}</li>
        ))}
      </ul>
    </>
  );
}

/** Specification — 치수·토큰 표. Code 탭 끝에 놓는다(2026-10-12: Design 탭은 쓰임새, Code 탭은 구현 값).
 *  헤딩 id 는 Design 탭에 있을 때와 같아서 옛 딥링크(#specification 등)는 DocTabs 가 Code 탭을 열어 준다. */
export function RadioSpecification() {
  return (
    <>
      <H2>Specification</H2>
      <p>Disabled 는 투명도 60% 예요. PDS 에서 가장 높은 값이고, 컴포넌트마다 다른 건 의도예요.</p>

      {/* Design 탭 Properties 에도 Size 가 있다 — id 를 따로 박는다 */}
      <H3 id="size-1">Size</H3>
      <SpecTable
        caption="Radio 사이즈별 치수"
        columns={[
          { key: 'size', header: 'Size', width: '12%' },
          { key: 'ring', header: 'Ring', width: '20%' },
          { key: 'dot', header: 'Dot', width: '16%' },
          { key: 'hit', header: '터치 영역', width: '20%' },
          { key: 'use', header: '쓰는 자리', width: '32%' },
        ]}
        rows={RADIO_SIZES.map((t) => ({
          size: <strong>{t.size}</strong>,
          ring: <SpecVal>{t.ring}</SpecVal>,
          dot: <SpecVal>{t.dot}</SpecVal>,
          hit: <SpecVal>{t.hit}</SpecVal>,
          use: t.use,
        }))}
      />

      <H3>Ring · Dot</H3>
      <SpecTable
        caption="Radio 치수와 색상"
        columns={SPEC_COLUMNS}
        rows={RADIO_SPEC.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />
    </>
  );
}
