import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import { Checkbox, Radio } from '@polarisoffice/pds-react';
import { CaseList, CaseBlock } from '@/components/docs/CaseList';
import {
  CHECKBOX_ANATOMY,
  CHECKBOX_CASES,
  CHECKBOX_GUIDELINES,
  CHECKBOX_SPEC,
  RADIO_SPEC,
} from './checkbox.data';
import s from './checkbox.module.css';

const SPEC_COLUMNS = [
  { key: 'prop', header: '속성', width: '32%' },
  { key: 'value', header: '값', width: '34%' },
  { key: 'desc', header: '설명', width: '34%' },
];

/**
 * Checkbox & Radio — Design 탭.
 * 원본 앵커: anatomy · case · specification · checkbox · radio
 *
 * 결손 보강(2026-08-13 목차 감사): 원본에 없던 Properties(Base) · Guidelines 를 신설했다.
 * 내용은 창작이 아니라 Case 설명·스펙 값의 재서술이다(checkbox.data.ts).
 *
 * 실물 프리뷰(2026-08-28, 디자인팀장 검토 "여기도 프리뷰 필요"): Case 4건에 패키지
 * Checkbox·Radio 를 그대로 렌더한다. 프리뷰는 그림이므로 AnatomyFigure 의 inert 결정
 * (2026-08-19)을 따라 클릭·포커스를 막는다 — 살아있는 데모는 Code 탭에 있다.
 * 같은 검토에서 Case 상단의 코드 탭 이동 링크는 제거했다(케이스마다 실물이 붙어 역할 소멸).
 */
export default function CheckboxDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      <p>
        둘은 컨트롤 모양만 달라요. 체크박스는 6px 라운드 박스, 라디오는 원형이에요.
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

      <H3>Base</H3>
      <p>
        Checkbox 는 미선택·선택·부분 선택·비활성 네 상태, Radio 는 부분 선택이 없는 세 상태예요. 컨트롤
        21×21px(터치 32×32), Disabled 는 투명도 60% 예요.
      </p>

      <H2>Case</H2>
      <CaseList>
        {CHECKBOX_CASES.map((c) => (
          <CaseBlock key={c.n} badge={c.n} title={c.title} sub={c.desc}>
            {/* 실물 프리뷰 — 단독(01·02)은 desc 의 상태 열거 순서, 그룹(03·04)은 Code 탭
                데모 구성 그대로(checkbox.data.ts sample). Radio 는 표시 전용이라 name
                배선 없이 checked 로만 상태를 고정한다 */}
            <div
              className={c.layout === 'column' ? `${s.casePreview} ${s.casePreviewColumn}` : s.casePreview}
              inert
              aria-hidden="true"
            >
              {c.sample.map((item, i) =>
                c.control === 'radio' ? (
                  <Radio key={i} label={item.label} checked={item.checked ?? false} disabled={item.disabled} />
                ) : (
                  <Checkbox
                    key={i}
                    label={item.label}
                    checked={item.checked ?? false}
                    indeterminate={item.indeterminate}
                    disabled={item.disabled}
                  />
                ),
              )}
            </div>
          </CaseBlock>
        ))}
      </CaseList>

      <H2>Guidelines</H2>
      <ul>
        {CHECKBOX_GUIDELINES.map((g, i) => (
          <li key={i}>{g}</li>
        ))}
      </ul>

      <H2>Specification</H2>
      <p>
        Disabled 는 투명도 60% 예요. PDS 에서 가장 높은 값이고, 컴포넌트마다 다른 건 의도예요.
      </p>

      <H3>Checkbox</H3>
      <SpecTable
        caption="Checkbox 치수와 색상"
        columns={SPEC_COLUMNS}
        rows={CHECKBOX_SPEC.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />

      <H3>Radio</H3>
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
