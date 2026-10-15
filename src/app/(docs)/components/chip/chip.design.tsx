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
  CHIP_ANATOMY,
  CHIP_CASES,
  CHIP_COLOR_SPEC,
  CHIP_SIZES,
  CHIP_SIZE_SPEC,
  CHIP_TYPES,
  CHIP_USAGE,
  CHIP_VS_BADGE,
} from './chip.data';
import { ChipFigure, ChipFilterCase, ChipToggleCase } from './chip.demo';
import s from './chip.module.css';

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
 * Chip — Design 탭 (2026-10-13 신설).
 * 목차는 표준 골격(Anatomy → Properties → Case → Guidelines). Properties 는 고를 수 있는 옵션을
 * 그림과 '언제 고르나' 한 줄로 보여 준다(Type → Size → State → 그 밖의 옵션 순). 치수·토큰은 Code 탭 Specification.
 * 2026-10-14 Type 을 맨 앞에 뒀다 — 조건 칩과 선택 칩은 하는 일이 달라서, 옵션을 한 줄로 늘어놓으면
 * '모든 칩이 선택도 되고 지워지기도 한다'로 읽힌다. State·Check 는 선택 칩, Remove 는 조건 칩에만 있다.
 * 그림은 전부 실물 Chip 이고 눌리지 않는다 — × 와 누르기는 함수 prop 이라 chip.demo.tsx(클라이언트)가 그린다.
 */
export default function ChipDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      <p>
        알약 모양 면 안에 라벨을 넣어요. 앞 아이콘과 × 는 필요할 때만 붙여요. 위는 조건 칩, 아래는 켜진 선택
        칩이에요.
      </p>
      {/* 라벨은 글자 노드라 잴 수 없어 span 으로 감싼다(data-part). 번호는 아래 목록(CHIP_ANATOMY)과 같은 축 */}
      <AnatomyFigure
        // 칩은 높이 28 이라 원촌으로는 번호 넷이 붙는다 — 견본을 키운다(toggle 과 같은 방식)
        scale={2}
        parts={[
          { n: '01', selector: '.chip-anatomy', anchor: 'left' },
          { n: '02', selector: '.chip-anatomy span[aria-hidden="true"]', anchor: 'bottom' },
          { n: '03', selector: '[data-part="label"]', anchor: 'top' },
          { n: '04', selector: '.chip-anatomy > button', anchor: 'bottom' },
        ]}
      >
        <ChipFigure icon remove className="chip-anatomy">
          <span data-part="label">김하늘</span>
        </ChipFigure>
      </AnatomyFigure>
      <AnatomyFigure
        scale={2}
        parts={[
          { n: '01', selector: '.chip-anatomy-select', anchor: 'left' },
          { n: '02', selector: '.chip-anatomy-select span[aria-hidden="true"]', anchor: 'bottom' },
          { n: '03', selector: '[data-part="label-select"]', anchor: 'top' },
        ]}
      >
        <ChipFigure type="select" selected className="chip-anatomy-select">
          <span data-part="label-select">디자인</span>
        </ChipFigure>
      </AnatomyFigure>
      <Anatomy items={[...CHIP_ANATOMY]} />

      <H2>Properties</H2>
      <p>
        <TabSwitchLink to="code">코드로 보기</TabSwitchLink>
      </p>

      <H3>Type</H3>
      <p>칩은 두 종류예요. 하는 일이 달라서 모양도 달라요.</p>
      <Options
        items={[
          { label: CHIP_TYPES[0].name, node: <ChipFigure remove>팀: 디자인</ChipFigure> },
          {
            label: CHIP_TYPES[1].name,
            node: (
              <span className={s.pair}>
                <ChipFigure type="select" selected>
                  디자인
                </ChipFigure>
                <ChipFigure type="select">개발</ChipFigure>
              </span>
            ),
          },
        ]}
      />
      <SpecTable
        caption="칩 종류와 하는 일"
        columns={[
          { key: 'name', header: '종류', width: '24%' },
          { key: 'desc', header: '하는 일', width: '76%' },
        ]}
        rows={CHIP_TYPES.map((t) => ({ name: <strong>{t.name}</strong>, desc: t.desc }))}
      />

      <H3>Size</H3>
      <p>기본 크기와 작은 크기 두 단계예요. 두 종류 모두 같아요. 작은 크기는 표 셀 안처럼 좁은 곳에 써요.</p>
      <Options
        items={CHIP_SIZES.map((t) => ({
          label: t.size,
          node: (
            <span className={s.pair}>
              <ChipFigure size={t.size} remove>
                팀: 디자인
              </ChipFigure>
              <ChipFigure size={t.size} type="select" selected>
                디자인
              </ChipFigure>
            </span>
          ),
        }))}
      />

      <H3>State</H3>
      <p>선택 칩에만 있어요. 기본과 선택됨 두 상태예요. 켜지면 파란색으로 바뀌어요.</p>
      <Options
        items={[
          { label: '기본', node: <ChipFigure type="select">디자인</ChipFigure> },
          {
            label: '선택됨',
            node: (
              <ChipFigure type="select" selected>
                디자인
              </ChipFigure>
            ),
          },
        ]}
      />

      <H3>Check</H3>
      <p>
        선택 칩이 켜지면 앞에 체크 표시가 붙어요. 색을 구분하기 어려워도 켜진 걸 알 수 있어요. 칩이 많아 자리가
        좁으면 뺄 수 있어요.
      </p>
      <Options
        items={[
          {
            label: '체크 있음',
            node: (
              <ChipFigure type="select" selected>
                디자인
              </ChipFigure>
            ),
          },
          {
            label: '체크 없음',
            node: (
              <ChipFigure type="select" selected check={false}>
                디자인
              </ChipFigure>
            ),
          },
        ]}
      />

      <H3>Icon</H3>
      <p>라벨 앞에 아이콘을 붙일 수 있어요. 글자만으로는 무엇에 대한 칩인지 알기 어려울 때 써요.</p>
      <Options
        items={[
          { label: '아이콘 없음', node: <ChipFigure>김하늘</ChipFigure> },
          { label: '아이콘 있음', node: <ChipFigure icon>김하늘</ChipFigure> },
        ]}
      />

      <H3>Remove</H3>
      <p>조건 칩에만 있어요. 오른쪽 × 로 칩을 지워요. 걸린 조건을 바로 풀 수 있어야 할 때 달아요.</p>
      <Options
        items={[
          { label: '× 없음', node: <ChipFigure>팀: 디자인</ChipFigure> },
          { label: '× 있음', node: <ChipFigure remove>팀: 디자인</ChipFigure> },
        ]}
      />

      <H2>Case</H2>
      <CaseList>
        {CHIP_CASES.map((c) => (
          <CaseBlock key={c.n} badge={c.n} title={c.title} sub={c.desc}>
            <div className={s.casePreview} inert aria-hidden="true">
              {c.id === 'filter' ? <ChipFilterCase /> : <ChipToggleCase />}
            </div>
          </CaseBlock>
        ))}
      </CaseList>

      <H2>Guidelines</H2>
      <UsageGrid do={[...CHIP_USAGE.do]} dont={[...CHIP_USAGE.dont]} />

      <H3>Chip vs Badge</H3>
      <p>
        둘 다 알약 모양이에요. 걸린 조건을 보여 주거나 아이콘·체크가 필요하면 Chip 을, 글자만 있는 굵은 태그면
        Badge 를 써요.
      </p>
      <SpecTable
        caption="Chip 과 Badge 를 고르는 기준"
        columns={[
          { key: 'item', header: '', width: '22%' },
          { key: 'chip', header: 'Chip', width: '42%' },
          { key: 'badge', header: 'Badge', width: '36%' },
        ]}
        rows={CHIP_VS_BADGE.map((r) => ({ item: <strong>{r.item}</strong>, chip: r.chip, badge: r.badge }))}
      />
    </>
  );
}

/** Specification — 치수·토큰 표. Code 탭 끝에 놓는다(Design 탭은 쓰임새, Code 탭은 구현 값) */
export function ChipSpecification() {
  return (
    <>
      <H2>Specification</H2>

      {/* Design 탭 Properties 에도 Size 가 있다 — id 를 따로 박는다(button 과 같은 방식) */}
      <H3 id="size-1">Size</H3>
      <SpecTable
        caption="Chip 크기별 치수"
        columns={[
          { key: 'prop', header: '', width: '34%' },
          { key: 'md', header: 'MD', width: '33%' },
          { key: 'sm', header: 'SM', width: '33%' },
        ]}
        rows={CHIP_SIZE_SPEC.map((r) => ({
          prop: <strong>{r.prop}</strong>,
          md: <SpecVal>{r.md}</SpecVal>,
          sm: <SpecVal>{r.sm}</SpecVal>,
        }))}
      />

      <H3>Color</H3>
      <SpecTable
        caption="Chip 종류·상태별 색"
        columns={[
          { key: 'state', header: '종류 · 상태', width: '18%' },
          { key: 'bg', header: '배경', width: '24%' },
          { key: 'text', header: '글자·아이콘', width: '20%' },
          { key: 'border', header: '테두리', width: '16%' },
          { key: 'remove', header: '×', width: '22%' },
        ]}
        rows={CHIP_COLOR_SPEC.map((r) => ({
          state: <strong>{r.state}</strong>,
          bg: <SpecVal>{r.bg}</SpecVal>,
          text: <SpecVal>{r.text}</SpecVal>,
          border: <SpecVal>{r.border}</SpecVal>,
          remove: <SpecVal>{r.remove}</SpecVal>,
        }))}
      />
    </>
  );
}
