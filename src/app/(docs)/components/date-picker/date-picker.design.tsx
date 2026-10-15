import type { ReactNode } from 'react';
import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import UsageGrid from '@/components/docs/UsageGrid';
import { CaseList, CaseBlock } from '@/components/docs/CaseList';
import { DemoCol, DemoRow, DemoSurface } from '@/components/docs/Demo';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import {
  DATE_PICKER_ANATOMY,
  DATE_PICKER_CASES,
  DATE_PICKER_COLOR_SPEC,
  DATE_PICKER_DAY_STATES,
  DATE_PICKER_MODES,
  DATE_PICKER_SIZE_SPEC,
  DATE_PICKER_USAGE,
} from './date-picker.data';
import { CalendarFigure, DatePickerFigure, DatePickerInputCase } from './date-picker.demo';
import s from './date-picker.module.css';

/** 옵션 그림 한 벌 — 이름표 아래 실물. Design 탭 그림이라 눌리지 않는다(inert) */
function Options({ items }: { items: { label: string; node: ReactNode }[] }) {
  return (
    <DemoSurface>
      <DemoRow gap="wide">
        {items.map((it) => (
          <DemoCol key={it.label} label={it.label}>
            <span inert aria-hidden="true">
              {it.node}
            </span>
          </DemoCol>
        ))}
      </DemoRow>
    </DemoSurface>
  );
}

/**
 * Date Picker — Design 탭 (2026-10-14 신설).
 * 목차는 표준 골격(Anatomy → Properties → Case → Guidelines). 치수·토큰은 Code 탭 Specification.
 * 그림은 전부 실물이고 눌리지 않는다. 달력은 팝오버 대신 입력칸 아래 제자리에 펼쳐 그린다.
 */
export default function DatePickerDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      <p>입력칸을 누르면 아래에 달력이 열려요. 기간을 고를 때는 달력 왼쪽에 빠른 선택이 붙어요.</p>
      <AnatomyFigure
        parts={[
          { n: '01', selector: '.dp-anatomy input', anchor: 'top' },
          { n: '02', selector: '.dp-anatomy [role="group"]', anchor: 'left' },
          { n: '03', selector: '.dp-anatomy [aria-live]', anchor: 'top' },
          { n: '04', selector: '.dp-anatomy button[aria-current="date"]', anchor: 'bottom' },
        ]}
      >
        <div className="dp-anatomy">
          <DatePickerFigure mode="range" />
        </div>
      </AnatomyFigure>
      <Anatomy items={[...DATE_PICKER_ANATOMY]} />

      <H2>Properties</H2>
      <p>
        <TabSwitchLink to="code">코드로 보기</TabSwitchLink>
      </p>

      <H3>Mode</H3>
      <p>날짜 하나를 받을지, 기간을 받을지 골라요.</p>
      <Options
        items={DATE_PICKER_MODES.map((m) => ({ label: m.name, node: <DatePickerFigure mode={m.mode} /> }))}
      />
      <SpecTable
        caption="Date Picker 모드와 하는 일"
        columns={[
          { key: 'name', header: '모드', width: '24%' },
          { key: 'desc', header: '하는 일', width: '76%' },
        ]}
        rows={DATE_PICKER_MODES.map((m) => ({ name: <strong>{m.name}</strong>, desc: m.desc }))}
      />

      <H3>Size</H3>
      <p>입력칸 크기는 Input Field 와 같은 네 단계예요. 같은 줄의 다른 입력과 크기를 맞춰요. 달력 크기는 그대로예요.</p>
      <Options
        items={(['lg', 'md', 'sm', 'xs'] as const).map((size) => ({
          label: size,
          node: <DatePickerFigure size={size} open={false} />,
        }))}
      />

      <H3>Day</H3>
      <p>하루 칸은 상태에 따라 모양이 달라요.</p>
      <DemoSurface>
        <div className={s.casePreview} inert aria-hidden="true">
          <CalendarFigure mode="range" />
        </div>
      </DemoSurface>
      <SpecTable
        caption="하루 칸 상태"
        columns={[
          { key: 'name', header: '상태', width: '24%' },
          { key: 'desc', header: '모양', width: '76%' },
        ]}
        rows={DATE_PICKER_DAY_STATES.map((d) => ({ name: <strong>{d.name}</strong>, desc: d.desc }))}
      />

      <H2>Case</H2>
      <CaseList>
        {DATE_PICKER_CASES.map((c) => (
          <CaseBlock key={c.n} badge={c.n} title={c.title} sub={c.desc}>
            <div className={s.casePreview} inert aria-hidden="true">
              {c.id === 'input' ? <DatePickerInputCase /> : <DatePickerFigure mode={c.id} />}
            </div>
          </CaseBlock>
        ))}
      </CaseList>

      <H2>Guidelines</H2>
      <UsageGrid do={[...DATE_PICKER_USAGE.do]} dont={[...DATE_PICKER_USAGE.dont]} />
    </>
  );
}

/** Specification — 치수·토큰 표. Code 탭 끝에 놓는다 */
export function DatePickerSpecification() {
  return (
    <>
      <H2>Specification</H2>

      {/* Design 탭 Properties 에도 Size 가 있다 — id 를 따로 박는다(chip 과 같은 방식) */}
      <H3 id="size-1">Size</H3>
      <SpecTable
        caption="Date Picker 치수"
        columns={[
          { key: 'prop', header: '', width: '34%' },
          { key: 'value', header: '값', width: '66%' },
        ]}
        rows={DATE_PICKER_SIZE_SPEC.map((r) => ({ prop: <strong>{r.prop}</strong>, value: <SpecVal>{r.value}</SpecVal> }))}
      />

      <H3>Color</H3>
      <SpecTable
        caption="Date Picker 부분별 색"
        columns={[
          { key: 'part', header: '부분', width: '24%' },
          { key: 'bg', header: '배경', width: '26%' },
          { key: 'text', header: '글자', width: '26%' },
          { key: 'etc', header: '그 밖', width: '24%' },
        ]}
        rows={DATE_PICKER_COLOR_SPEC.map((r) => ({
          part: <strong>{r.part}</strong>,
          bg: <SpecVal>{r.bg}</SpecVal>,
          text: <SpecVal>{r.text}</SpecVal>,
          etc: <SpecVal>{r.etc}</SpecVal>,
        }))}
      />
    </>
  );
}
