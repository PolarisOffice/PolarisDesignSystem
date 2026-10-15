import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import { Checkbox } from '@polarisoffice/pds-react';
import { CaseList, CaseBlock } from '@/components/docs/CaseList';
import { DemoCol, DemoRow, DemoSurface } from '@/components/docs/Demo';
import {
  CHECKBOX_ANATOMY,
  CHECKBOX_CASES,
  CHECKBOX_GUIDELINES,
  CHECKBOX_SIZES,
  CHECKBOX_SPEC,
  CHECKBOX_VARIANT_SPEC,
} from './checkbox.data';
import s from './checkbox.module.css';

const SPEC_COLUMNS = [
  { key: 'prop', header: '속성', width: '32%' },
  { key: 'value', header: '값', width: '34%' },
  { key: 'desc', header: '설명', width: '34%' },
];

/**
 * Checkbox — Design 탭.
 * 원본 앵커: anatomy · case · specification · checkbox. 2026-10-12 radio 를 /components/radio 로 분리하고
 * Specification H3 'Checkbox' 를 'Box' 로 바꿨다(제목 h1 과 같은 글자라 슬러그가 겹친다). 구 #checkbox·#radio
 * 딥링크는 anchor-aliases 가 구제한다.
 *
 * 결손 보강(2026-08-13 목차 감사): 원본에 없던 Properties(Base) · Guidelines 를 신설했다.
 * 내용은 창작이 아니라 Case 설명·스펙 값의 재서술이다(checkbox.data.ts).
 *
 * 실물 프리뷰(2026-08-28, 디자인팀장 검토 "여기도 프리뷰 필요"): Case 에 패키지
 * Checkbox 를 그대로 렌더한다. 프리뷰는 그림이므로 AnatomyFigure 의 inert 결정
 * (2026-08-19)을 따라 클릭·포커스를 막는다 — 살아있는 데모는 Code 탭에 있다.
 * 같은 검토에서 Case 상단의 코드 탭 이동 링크는 제거했다(케이스마다 실물이 붙어 역할 소멸).
 */
export default function CheckboxDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      <p>
        모서리가 둥근 박스 안에 체크를 그려요. 면 없이 체크만 그리는 체크형도 있어요(아래 Case 03).
      </p>
      {/* 실물 기반 도해(2026-08-19) — 패키지 Checkbox 를 렌더해 파트를 실측·콜아웃한다.
          번호는 아래 legend(CHECKBOX_ANATOMY)와 같은 축. Icon 은 Control 안에 겹치므로
          anchor 를 left/top 으로 분리(토글 트랙·노브 패턴) */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: 'span[aria-hidden="true"]', anchor: 'left' },
          { n: '02', selector: 'span[aria-hidden="true"] > svg' },
          { n: '03', selector: 'label > span:last-of-type' },
        ]}
      >
        <Checkbox label="이용약관에 동의합니다" defaultChecked />
      </AnatomyFigure>
      <Anatomy items={[...CHECKBOX_ANATOMY]} />

      <H2>Properties</H2>

      {/* 2026-10-12 'Base' 한 문단을 옵션별로 나눴다(Properties = 어떤 옵션이 있나). 그림은 정지 그림(inert).
          상태 모습은 Case 01 이 이미 보여 줘서 State 에는 그림을 또 두지 않는다 */}
      <H3>Variant</H3>
      <p>
        모양은 둘이에요. 네모(기본)와 체크형(면 없이 체크 표시만). 쓰는 자리는 아래 Case 03 과 Guidelines 에 있어요.
      </p>
      <DemoSurface>
        <DemoRow gap="wide">
          <DemoCol label="네모">
            <span inert aria-hidden="true">
              <Checkbox variant="box" checked />
            </span>
          </DemoCol>
          <DemoCol label="체크형">
            <span inert aria-hidden="true">
              <Checkbox variant="check" checked />
            </span>
          </DemoCol>
        </DemoRow>
      </DemoSurface>

      <H3>Size</H3>
      <p>표처럼 작은 글자 옆에는 작은 크기를 써요.</p>
      <DemoSurface>
        <DemoRow gap="wide">
          {CHECKBOX_SIZES.map((t) => (
            <DemoCol key={t.size} label={t.size}>
              <span inert aria-hidden="true">
                <Checkbox size={t.size} checked />
              </span>
            </DemoCol>
          ))}
        </DemoRow>
      </DemoSurface>

      <H3>State</H3>
      <p>미선택·선택·부분 선택·비활성 네 상태예요. 모습은 아래 Case 01 에 있어요.</p>

      <H2>Case</H2>
      <CaseList>
        {CHECKBOX_CASES.map((c) => (
          <CaseBlock key={c.n} badge={c.n} title={c.title} sub={c.desc}>
            {/* 실물 프리뷰 — 단독(01)은 desc 의 상태 열거 순서, 그룹(02)은 Code 탭
                데모 구성 그대로(checkbox.data.ts sample) */}
            {c.context ? (
              // 모양은 쓰는 자리와 함께 봐야 차이가 읽힌다 — 메뉴 흉내(글자가 앞, 체크가 끝)
              <div className={s.casePreview} inert aria-hidden="true">
                <div className={s.contextCard}>
                  {c.context.head && <div className={s.contextHead}>{c.context.head}</div>}
                  {c.context.rows.map((row) => (
                    <div key={row.label} className={s.contextRow}>
                      {row.label}
                      <Checkbox variant={c.variant} checked={row.checked ?? false} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={c.layout === 'column' ? `${s.casePreview} ${s.casePreviewColumn}` : s.casePreview}
                inert
                aria-hidden="true"
              >
                {c.sample.map((item, i) => (
                  <Checkbox
                    key={i}
                    variant={c.variant}
                    label={item.label}
                    checked={item.checked ?? false}
                    indeterminate={item.indeterminate}
                    disabled={item.disabled}
                  />
                ))}
              </div>
            )}
          </CaseBlock>
        ))}
      </CaseList>

      <H2>Guidelines</H2>
      <ul>
        {CHECKBOX_GUIDELINES.map((g, i) => (
          <li key={i}>{g}</li>
        ))}
      </ul>
    </>
  );
}

/** Specification — 치수·토큰 표. Code 탭 끝에 놓는다(2026-10-12: Design 탭은 쓰임새, Code 탭은 구현 값).
 *  헤딩 id 는 Design 탭에 있을 때와 같아서 옛 딥링크(#specification 등)는 DocTabs 가 Code 탭을 열어 준다. */
export function CheckboxSpecification() {
  return (
    <>
      <H2>Specification</H2>
      <p>
        Disabled 는 투명도 60% 예요. PDS 에서 가장 높은 값이고, 컴포넌트마다 다른 건 의도예요.
      </p>

      {/* Design 탭 Properties 에도 Size 가 있다 — id 를 따로 박는다(button 과 같은 방식) */}
      <H3 id="size-1">Size</H3>
      <SpecTable
        caption="Checkbox 사이즈별 치수"
        columns={[
          { key: 'size', header: 'Size', width: '12%' },
          { key: 'box', header: 'Box', width: '20%' },
          { key: 'hit', header: '터치 영역', width: '20%' },
          { key: 'radius', header: 'Radius', width: '24%' },
          { key: 'use', header: '쓰는 자리', width: '24%' },
        ]}
        rows={CHECKBOX_SIZES.map((t) => ({
          size: <strong>{t.size}</strong>,
          box: <SpecVal>{t.box}</SpecVal>,
          hit: <SpecVal>{t.hit}</SpecVal>,
          radius: <SpecVal>{t.radius}</SpecVal>,
          use: t.use,
        }))}
      />

      <H3>Box</H3>
      <SpecTable
        caption="Checkbox 치수와 색상"
        columns={SPEC_COLUMNS}
        rows={CHECKBOX_SPEC.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />

      <H3>Check</H3>
      <SpecTable
        caption="check 모양이 box 와 다른 점"
        columns={SPEC_COLUMNS}
        rows={CHECKBOX_VARIANT_SPEC.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />
    </>
  );
}
