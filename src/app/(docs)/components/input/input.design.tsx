import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecToken, SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import { InputField, UserIcon } from '@polarisoffice/pds-react';
import UsageGrid from '@/components/docs/UsageGrid';
import { CaseList, CaseBlock } from '@/components/docs/CaseList';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import Swatch from '@/components/docs/Swatch';
import {
  INPUT_ANATOMY,
  INPUT_BORDER_STATES,
  INPUT_CASES,
  INPUT_CONTAINER,
  INPUT_ICON,
  INPUT_TYPES,
  INPUT_TYPOGRAPHY,
  INPUT_USAGE,
  type InputSample,
} from './input.data';
import s from './input.module.css';

/**
 * Input Field — Design 탭.
 * 원본 앵커: anatomy · properties · base · size · type · case · guidelines ·
 *            placeholder-vs-labeled · specification · container · border-color-by-state ·
 *            typography · icon
 *
 * 원본 12페이지 중 가장 크다(609줄). `## Type` H2 는 이 페이지에만 있는 구조다.
 *
 * 실물 프리뷰(2026-08-28, 디자인팀장 검토 "여기도 프리뷰 필요"): Type·Case 에 패키지
 * InputField 를 그대로 렌더한다(견본 값은 input.data.ts sample — Code 탭·Anatomy 재사용).
 * 프리뷰는 그림이므로 AnatomyFigure 의 inert 결정(2026-08-19)을 따라 클릭·포커스를 막는다 —
 * 살아있는 데모는 Code 탭에 있다. Case 01(Active)만 프리뷰가 없다(사유는 data 주석).
 */

/** Type·Case 공용 프리뷰 — data 의 sample 을 그대로 실물 props 로 옮긴다(표시 전용).
 *  activeBorder 는 Active 케이스 전용 표시용 고정(테두리만 accent) — input.data.ts 주석 참고 */
function SamplePreview({ sample, activeBorder }: { sample: InputSample; activeBorder?: boolean }) {
  return (
    <div
      className={activeBorder ? `${s.casePreview} ${s.activeCase}` : s.casePreview}
      inert
      aria-hidden="true"
    >
      <InputField
        label={sample.label}
        placeholder={sample.placeholder}
        defaultValue={sample.value}
        type={sample.type}
        error={sample.error}
        leftIcon={sample.userIcon ? <UserIcon /> : undefined}
      />
    </div>
  );
}
export default function InputDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      {/* 실물 기반 도해(2026-08-19) — 패키지 InputField 를 렌더해 파트를 실측·콜아웃한다.
          견본은 Error 상태의 비밀번호 필드 — Title(raised)·좌우 아이콘·오류 문구까지
          5개 파트가 정적 렌더에 모두 실존하는 조합이다. 번호는 아래 legend(INPUT_ANATOMY)와 같은 축 */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: ':scope > div > div', anchor: 'left' },
          { n: '02', selector: 'label' },
          { n: '03', selector: ':scope > div > div > span[aria-hidden]' },
          { n: '04', selector: 'button[aria-label]' },
          { n: '05', selector: '[role="alert"]', anchor: 'left' },
        ]}
      >
        <InputField
          label="비밀번호"
          type="password"
          defaultValue="pds1234"
          error="8자 이상 입력해 주세요"
          leftIcon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
              <rect x="3.75" y="8.25" width="10.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6.25 8.25V5.75a2.75 2.75 0 0 1 5.5 0v2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          }
          style={{ width: 320 }}
        />
      </AnatomyFigure>
      <Anatomy items={[...INPUT_ANATOMY]} />

      <H2>Properties</H2>

      <H3>Base</H3>
      <p>
        Placeholder 만 있는 Simple 형태와 Title 이 함께 있는 Labeled 형태가 기본이에요.{' '}
        <TabSwitchLink to="code">코드로 보기</TabSwitchLink>
      </p>

      <H3>Size</H3>
      <p>
        MD(52px)가 기본값이며 폼 입력에 써요. SM 은 공간이 제한된 곳에 사용해요. Input 의 Disabled 는
        투명도 35% 예요.
      </p>

      <H2>Type</H2>
      <CaseList>
        {INPUT_TYPES.map((t) => (
          <CaseBlock key={t.n} badge={t.n} title={t.title} sub={t.desc}>
            <SamplePreview sample={t.sample} />
          </CaseBlock>
        ))}
      </CaseList>

      <H2>Case</H2>
      <CaseList>
        {INPUT_CASES.map((c) => (
          <CaseBlock key={c.n} badge={c.n} title={c.title} sub={c.desc}>
            {c.sample && <SamplePreview sample={c.sample} activeBorder={c.activeBorder} />}
          </CaseBlock>
        ))}
      </CaseList>

      <H2>Guidelines</H2>
      <UsageGrid do={[...INPUT_USAGE.do]} dont={[...INPUT_USAGE.dont]} />

      <H3>Placeholder vs Labeled</H3>
      <p>
        <strong>Placeholder only</strong> (Simple): 짧은 단일 입력 (검색창, 인라인 필터). 레이블 공간이 없는
        경우.
      </p>
      <p>
        <strong>Labeled</strong>: 폼 입력처럼 입력 후에도 어떤 필드인지 확인이 필요한 경우. 입력 완료 후
        title label이 남아 컨텍스트를 유지해요.
      </p>

      <H2>Specification</H2>

      <H3>Container</H3>
      <SpecTable
        caption="Input 컨테이너 스펙"
        columns={[
          { key: 'prop', header: '속성', width: '34%' },
          { key: 'value', header: '값', width: '30%' },
          { key: 'desc', header: '설명', width: '36%' },
        ]}
        rows={INPUT_CONTAINER.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />

      <H3>Border Color by State</H3>
      <SpecTable
        caption="상태별 테두리 색"
        columns={[
          { key: 'state', header: 'State', width: '22%' },
          { key: 'token', header: 'Token', width: '38%' },
          { key: 'raw', header: 'Raw Value', width: '40%' },
        ]}
        rows={INPUT_BORDER_STATES.map((r) => ({
          state: <strong>{r.state}</strong>,
          token: <SpecToken>{r.token}</SpecToken>,
          raw: r.raw.startsWith('#') ? <Swatch hex={r.raw} /> : <SpecVal>{r.raw}</SpecVal>,
        }))}
      />

      <H3>Typography</H3>
      <SpecTable
        caption="Input 타이포그래피"
        columns={[
          { key: 'el', header: '요소', width: '26%' },
          { key: 'size', header: 'Size', width: '16%' },
          { key: 'weight', header: 'Weight', width: '16%' },
          { key: 'color', header: 'Color Token', width: '42%' },
        ]}
        rows={INPUT_TYPOGRAPHY.map((r) => ({
          el: r.el,
          size: <SpecVal>{r.size}</SpecVal>,
          weight: r.weight,
          color: <SpecVal>{r.color}</SpecVal>,
        }))}
      />

      <H3>Icon</H3>
      <SpecTable
        caption="Input 아이콘 스펙"
        columns={[
          { key: 'prop', header: '속성', width: '34%' },
          { key: 'value', header: '값', width: '34%' },
          { key: 'desc', header: '설명', width: '32%' },
        ]}
        rows={INPUT_ICON.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />
    </>
  );
}
