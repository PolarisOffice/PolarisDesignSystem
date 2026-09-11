import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import UsageGrid from '@/components/docs/UsageGrid';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import { CaseList, CaseBlock } from '@/components/docs/CaseList';
import { DemoCol, DemoRow, DemoSurface } from '@/components/docs/Demo';
import { Menu, MenuDivider, MenuItem } from '@polarisoffice/pds-react';
import {
  MENU_ANATOMY,
  MENU_CASES,
  MENU_ITEM_COMMON,
  MENU_ITEM_STATEFUL,
  MENU_LIST_SPEC,
  MENU_MULTI_COLUMNS,
  MENU_SCROLL_ITEMS,
  MENU_USAGE,
} from './context-menu.data';
import s from './context-menu.module.css';

/**
 * Context & Menu Item — Design 탭.
 * 목차 표준화(2026-08-13): 원본이 Properties 아래 h3 로 두었던 'Case — Multi-column + Scroll' 을
 * 독립 H2 로 승격. 텍스트 동일 = 앵커 id 동일, 계층만 변경.
 *
 * 명명 통일(2026-08-13): Specification 하위 menu-list-container→container · menu-item→item.
 * 구 앵커는 anchor-aliases.ts 가 구제한다.
 *
 * 디자인 검토 반영(2026-08-28): 텍스트로만 서술되던 Multi-column + Scroll 에 실물 프리뷰.
 */
export default function ContextMenuDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      {/* 실물 기반 도해(2026-08-19) — 패키지 Menu/MenuItem/MenuDivider 를 렌더해 파트를
          실측·콜아웃한다. 번호는 아래 legend(MENU_ANATOMY)와 같은 축. 컨테이너는 관통을
          피해 left, Divider 는 아이템 top 콜아웃과 겹치지 않게 right 앵커.
          폭은 규칙("고정 px 금지 — 부모가 정한다")대로 래퍼 div 가 정한다 */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: '[role="menu"]', anchor: 'left' },
          { n: '02', selector: '[role="menuitem"]' },
          { n: '03', selector: '[role="separator"]', anchor: 'right' },
        ]}
      >
        <div style={{ width: 220 }}>
          <Menu>
            <MenuItem selected>자동 저장</MenuItem>
            <MenuItem>맞춤법 검사</MenuItem>
            <MenuDivider />
            <MenuItem>환경 설정</MenuItem>
          </Menu>
        </div>
      </AnatomyFigure>
      <Anatomy items={[...MENU_ANATOMY]} />

      <H2>Properties</H2>

      <H3>State</H3>
      <p>
        메뉴 아이템은 세 가지 상태를 가져요. <strong>Default</strong>는 아직 상호작용이 없는 기본 상태,{' '}
        <strong>Hover</strong>는 포인터가 올라왔을 때 배경을 채워 피드백을 전달,{' '}
        <strong>Selected</strong>는 현재 선택된 값을 굵은 글씨로 명시해요.{' '}
        <TabSwitchLink to="code">코드로 보기</TabSwitchLink>
      </p>

      <H3>Base — Single List</H3>
      <p>
        가장 기본적인 단일 목록 형태예요. 너비는 고정하지 않고 부모 컨테이너 기준 <strong>fill</strong>로
        채워 사용하며, 컨텍스트에 따라 전체 폭을 조절해요.
      </p>

      {/* 표준 명칭 'Case' 로 개칭(2026-08-21, Figma 1054:24690 case1·case2 추가 반영).
          구 앵커 'Case — Multi-column + Scroll' 은 anchor-aliases 가 구제한다. */}
      <H2>Case</H2>

      <H3>아이템 구성</H3>
      <p>
        아이템은 세 가지 구성으로 사용해요. <strong>Case 1·2 는 한 메뉴 안에서 혼용</strong>될 수
        있어요. 체브론은 하위 메뉴가 있는 항목에만 붙어요. 반면 <strong>Case 3 선택 목록은 거의
        단독</strong>으로 쓰고, 명령·하위 메뉴 항목과 한 목록에 섞지 않아요.
      </p>
      {/* 버튼 Hierarchy 형 케이스 블록 (2026-08-28 피드백 — "그레이박스로 싸서 위계 분리").
          견본은 MENU_CASES.sample 단일 소스, 실물 Menu/MenuItem 렌더 */}
      <CaseList>
        {MENU_CASES.map((c) => (
          <CaseBlock key={c.n} badge={c.n} title={c.title} sub={c.desc}>
            <div className={s.caseMenu} inert aria-hidden="true">
              <Menu>
                {c.sample.map((item) => (
                  <MenuItem
                    key={item.label}
                    hideCheck={!item.check}
                    hasSubmenu={item.submenu}
                    selected={item.selected}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </CaseBlock>
        ))}
      </CaseList>

      <H3>Multi-column + Scroll</H3>
      <p>
        항목 수가 많을 때 두 가지 방식으로 대응해요. <strong>멀티 컬럼</strong>은 옵션을 병렬로 나열해
        선택 범위를 한눈에 보여줄 때, <strong>스크롤</strong>은 목록 길이를 제한하면서 전체 항목을 탐색할 수
        있게 할 때 사용해요.
      </p>
      {/* 실물 프리뷰 (2026-08-28 디자인 검토 반영 — 텍스트로만 서술되던 두 방식을 실물로).
          멀티 컬럼: 패키지에 컬럼 prop 이 없어 진짜 Menu 컨테이너 안에 진짜 MenuItem 을
          열 묶음으로 배치한 **조합**이다(재구현 아님 — 컨테이너의 radius·패딩·그림자와
          아이템 스타일 전부 실물, 열 간격만 css 로 재현하며 값 출처는 module.css 주석).
          스크롤: Menu 기본 max-height(228 — 소스 주석대로 7개 + 패딩)를 그대로 둔 12개
          목록이라 8번째부터 잘린다 — 그림(inert/aria-hidden, toggle 패턴)이라 직접 굴려볼
          수는 없어 레이블이 노출 수를 밝히고, 살아있는 스크롤은 Demo 탭에. 견본 레이블은
          context-menu.data.ts 단일 소스('Text N' — ScrollDemo·Figma 와 동일, 창작 없음). */}
      <DemoSurface>
        <DemoRow gap="wide">
          <DemoCol label="멀티 컬럼">
            <div inert aria-hidden="true">
              <Menu width="max-content">
                <div className={s.columns}>
                  {MENU_MULTI_COLUMNS.map((col, ci) => (
                    <div key={ci} className={s.column}>
                      {col.map((label, i) => (
                        <MenuItem key={label} selected={ci === 0 && i === 0}>
                          {label}
                        </MenuItem>
                      ))}
                    </div>
                  ))}
                </div>
              </Menu>
            </div>
          </DemoCol>
          <DemoCol label={`스크롤 (${MENU_SCROLL_ITEMS.length}개 중 7개 노출)`}>
            <div className={s.scrollBox} inert aria-hidden="true">
              <Menu>
                {MENU_SCROLL_ITEMS.map((label, i) => (
                  <MenuItem key={label} selected={i === 0}>
                    {label}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </DemoCol>
        </DemoRow>
      </DemoSurface>

      <H2>Guidelines</H2>
      <UsageGrid do={[...MENU_USAGE.do]} dont={[...MENU_USAGE.dont]} />

      <H2>Specification</H2>

      <H3>Container</H3>
      <SpecTable
        caption="메뉴 리스트 컨테이너 스펙"
        columns={[
          { key: 'prop', header: '속성', width: '32%' },
          { key: 'value', header: '값', width: '38%' },
          { key: 'desc', header: '설명', width: '30%' },
        ]}
        rows={MENU_LIST_SPEC.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />

      <H3>Item</H3>
      <SpecTable
        caption="메뉴 아이템 상태별 스펙"
        columns={[
          { key: 'prop', header: '속성', width: '25%' },
          { key: 'default', header: 'Default', width: '25%' },
          { key: 'hover', header: 'Hover', width: '25%' },
          { key: 'selected', header: 'Selected', width: '25%' },
        ]}
        rows={MENU_ITEM_STATEFUL.map((r) => ({
          prop: r.prop,
          default: <SpecVal>{r.default}</SpecVal>,
          hover: <SpecVal>{r.hover}</SpecVal>,
          selected: <SpecVal>{r.selected}</SpecVal>,
        }))}
      />
      <SpecTable
        caption="메뉴 아이템 공통 치수"
        columns={[
          { key: 'prop', header: '속성', width: '40%' },
          { key: 'value', header: '값', width: '60%' },
        ]}
        rows={MENU_ITEM_COMMON.map((r) => ({ prop: r.prop, value: <SpecVal>{r.value}</SpecVal> }))}
      />
    </>
  );
}
