import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecToken, SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import { Toggle } from '@polarisoffice/pds-react';
import { CaseList, CaseBlock } from '@/components/docs/CaseList';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import Swatch from '@/components/docs/Swatch';
import {
  TOGGLE_ANATOMY,
  TOGGLE_CASES,
  TOGGLE_GUIDELINES,
  TOGGLE_SIZES,
  TOGGLE_STATES,
  TOGGLE_TOKENS,
} from './toggle.data';
import s from './toggle.module.css';

/**
 * Toggle — Design 탭.
 * 원본 앵커: properties · base · case · specification · size · token
 *
 * 결손 보강(2026-08-13 목차 감사): 원본에 없던 Anatomy · Guidelines 를 신설했다.
 * 내용은 창작이 아니라 같은 페이지의 리드 문장·Case 설명·스펙 값의 재서술이다(toggle.data.ts).
 *
 * 실물 프리뷰(2026-08-28, 디자인팀장 검토 "여기도 프리뷰 필요"): Base 표와 Case 에 패키지
 * Toggle 을 그대로 렌더한다. 프리뷰는 그림이므로 AnatomyFigure 의 inert 결정(2026-08-19)을
 * 따라 클릭·포커스를 막는다 — 살아있는 데모는 Code 탭에 있다.
 */

/** Base 표의 상태명 → 실물 props — 표의 값과 실물이 같은 행에서 대조되게 한다 */
const STATE_PREVIEW: Record<(typeof TOGGLE_STATES)[number]['state'], { checked: boolean; disabled?: boolean }> = {
  ON: { checked: true },
  OFF: { checked: false },
  Disabled: { checked: false, disabled: true },
};
export default function ToggleDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      {/* 실물 기반 도해(2026-08-19 파일럿) — 손그림이 아니라 패키지 Toggle 을 렌더해
          파트를 실측·콜아웃한다. 번호는 아래 legend(TOGGLE_ANATOMY)와 같은 축 */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: 'button[role="switch"]', anchor: 'left' },
          { n: '02', selector: 'button[role="switch"] > span' },
          { n: '03', selector: 'label > span:last-of-type' },
        ]}
      >
        <Toggle label="알림 받기" description="앱 알림을 받을 수 있습니다" defaultChecked />
      </AnatomyFigure>
      <Anatomy items={[...TOGGLE_ANATOMY]} />

      <H2>Properties</H2>

      <H3>Base</H3>
      <p>
        ON / OFF / Disabled 세 상태예요. Disabled 는 투명도 38% 이고, 컴포넌트마다 다른 건 의도예요.{' '}
        <TabSwitchLink to="code">코드로 보기</TabSwitchLink>
      </p>
      <SpecTable
        caption="Toggle 상태별 실물과 트랙 색상"
        columns={[
          { key: 'state', header: 'State', width: '14%' },
          { key: 'preview', header: 'Preview', width: '18%' },
          { key: 'track', header: 'Track 색상', width: '34%' },
          { key: 'desc', header: '설명', width: '34%' },
        ]}
        rows={TOGGLE_STATES.map((row) => ({
          state: <strong>{row.state}</strong>,
          preview: (
            <span className={s.statePreview} inert aria-hidden="true">
              <Toggle {...STATE_PREVIEW[row.state]} />
            </span>
          ),
          track:
            row.track.startsWith('#') ? <Swatch hex={row.track} token={row.trackToken} /> : <SpecVal>{row.track}</SpecVal>,
          desc: row.desc,
        }))}
      />

      <H2>Case</H2>
      <CaseList>
        {TOGGLE_CASES.map((c) => (
          <CaseBlock key={c.n} badge={c.n} title={c.title} sub={c.desc}>
            {/* 실물 프리뷰 — CaseList 섹션이 이미 조용한 면(fill-neutral)이라 상자를 두르지 않는다 */}
            <div className={s.casePreview} inert aria-hidden="true">
              <Toggle checked={c.sample.checked ?? false} label={c.sample.label} description={c.sample.description} />
            </div>
          </CaseBlock>
        ))}
      </CaseList>

      <H2>Guidelines</H2>
      <ul>
        {TOGGLE_GUIDELINES.map((g, i) => (
          <li key={i}>{g}</li>
        ))}
      </ul>

      <H2>Specification</H2>

      <H3>Size</H3>
      <SpecTable
        caption="Toggle 사이즈별 치수"
        columns={[
          { key: 'size', header: 'Size', width: '16%' },
          { key: 'width', header: 'Width', width: '21%' },
          { key: 'height', header: 'Height', width: '21%' },
          { key: 'thumb', header: 'Thumb', width: '21%' },
          { key: 'offset', header: 'Thumb Offset', width: '21%' },
        ]}
        rows={TOGGLE_SIZES.map((t) => ({
          size: <strong>{t.size}</strong>,
          width: <SpecVal>{t.width}</SpecVal>,
          height: <SpecVal>{t.height}</SpecVal>,
          thumb: <SpecVal>{t.thumb}</SpecVal>,
          offset: <SpecVal>{t.offset}</SpecVal>,
        }))}
      />

      <H3>Token</H3>
      <SpecTable
        caption="Toggle 이 쓰는 디자인 토큰"
        columns={[
          { key: 'prop', header: '속성', width: '30%' },
          { key: 'token', header: 'Token', width: '38%' },
          { key: 'value', header: 'Value', width: '32%' },
        ]}
        rows={TOGGLE_TOKENS.map((t) => ({
          prop: t.prop,
          token: t.token === '—' ? '—' : <SpecToken>{t.token}</SpecToken>,
          value: t.value.startsWith('#') ? <Swatch hex={t.value} /> : <SpecVal>{t.value}</SpecVal>,
        }))}
      />
    </>
  );
}
