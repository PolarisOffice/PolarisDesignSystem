import type { ReactNode } from 'react';
import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecToken, SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import UsageGrid from '@/components/docs/UsageGrid';
import { Button, Table, TableEmpty } from '@polarisoffice/pds-react';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import {
  MEMBER_COLUMNS,
  MEMBERS,
  NOTE_COLUMNS,
  NOTES,
  TABLE_ANATOMY,
  TABLE_SAMPLE_COLUMNS,
  TABLE_SAMPLE_ROWS,
  TABLE_SPEC_AROUND,
  TABLE_SPEC_CONTAINER,
  TABLE_SPEC_HEADER,
  TABLE_SPEC_SELECTION,
  TABLE_SPEC_STATE,
  TABLE_USAGE,
} from './table.data';
import { AlignPreview, AnatomySample, PaginationPreview, ResizePreview, ScrollPreview, SelectionPreview, SortPreview, ToolbarPreview } from './table.demo';
import s from './table.module.css';

/** 기능 절 실물 미리보기 — 그림이라 inert, 표는 내용 너비로(caseFigure). 좁은 화면에선 면(casePreview)을 옆으로 밀어 본다 */
function Preview({ children }: { children: ReactNode }) {
  return (
    <div className={s.casePreview}>
      <div className={s.caseFigure} inert aria-hidden="true">
        {children}
      </div>
    </div>
  );
}

/** Specification 묶음 하나 — 토큰명이 값 자리에 오는 행이 섞여 있어 칩만 구분한다 */
function Spec({ caption, rows }: { caption: string; rows: ReadonlyArray<{ prop: string; value: string; desc: string }> }) {
  return (
    <SpecTable
      caption={caption}
      columns={[
        { key: 'prop', header: '속성', width: '28%' },
        { key: 'value', header: '값', width: '40%' },
        { key: 'desc', header: '설명', width: '32%' },
      ]}
      rows={rows.map((r) => ({
        prop: r.prop,
        value: r.value.startsWith('--') ? <SpecToken>{r.value}</SpecToken> : <SpecVal>{r.value}</SpecVal>,
        desc: r.desc,
      }))}
    />
  );
}

/**
 * Table — Design 탭.
 * 목차 표준화(2026-08-13): 원본이 Guidelines 아래 h3 로 두었던 Case 를 독립 H2 로 승격해
 * Properties 다음에 배치. 텍스트 동일 = 앵커 id(case·guidelines) 동일, 계층·순서만 변경.
 *
 * 1.2.0 기능 절(2026-10-08): Properties 아래 기능마다 '언제 쓰나 / 어떻게 보이나' 를 짧게 두고,
 * 실물 미리보기를 붙인다. 전부 정지 그림이다(2026-10-12: Design 탭은 보는 곳, 만져 보는 건 Code 탭) —
 * Resizable 은 손잡이를 덧그리고 Scroll & Sticky 는 면을 좁혀 흐림을 보인다. Row Click 은 호버라 글만.
 * 수치는 Code 탭 끝 Specification 에 맡긴다. 함수 prop 이 필요한 미리보기는
 * table.demo.tsx 에 있다.
 */
export default function TableDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      {/* 실물 기반 도해 — 패키지 Table 을 렌더해 파트를 실측·콜아웃한다.
          번호는 아래 legend(TABLE_ANATOMY)와 같은 축. 파트가 서로 포개져 있어
          (Container ⊃ Row ⊃ Cell) 앵커를 좌·우·상·하·중앙으로 분리했다:
          01 Container=left(외곽 좌변) · 02 Header=top · 03 Row=right(1행 우변)
          · 04 Divider=1행 둘째 셀 bottom(구분선 위의 점, 첫 셀은 선택 열) · 05 Cell=1행 끝 셀 center
          · 06 Sort Icon=정렬 중인 헤더의 아이콘 · 07 Selection=선택 열 헤더 top */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: 'div:has(> table)', anchor: 'left' },
          { n: '02', selector: 'thead tr' },
          { n: '03', selector: 'tbody tr:first-of-type', anchor: 'right' },
          { n: '04', selector: 'tbody tr:first-of-type td:nth-of-type(2)', anchor: 'bottom' },
          { n: '05', selector: 'tbody tr:first-of-type td:last-of-type', anchor: 'center' },
          { n: '06', selector: 'thead th[aria-sort] svg' },
          { n: '07', selector: 'thead th:first-of-type' },
        ]}
      >
        <AnatomySample />
      </AnatomyFigure>
      <Anatomy items={[...TABLE_ANATOMY]} />

      <H2>Properties</H2>

      <H3>Basic</H3>
      <p>
        헤더 행 + 데이터 행이에요. 헤더와 본문 글자는 같은 크기이고, 헤더는 크기가 아니라 배경색과 글자색으로
        구분해요. 행 사이는 구분선으로 나누고, 열 너비는 내용 길이에 맞춰요.{' '}
        <TabSwitchLink to="code">코드로 보기</TabSwitchLink>
      </p>
      <Preview>
        <Table columns={TABLE_SAMPLE_COLUMNS} rows={TABLE_SAMPLE_ROWS} />
      </Preview>

      <H3>Column Divider</H3>
      <p>열이 많거나 데이터 구분이 필요할 때만 켜요.</p>
      <Preview>
        <Table columnDivider columns={TABLE_SAMPLE_COLUMNS} rows={TABLE_SAMPLE_ROWS} />
      </Preview>

      <H3>Long Text</H3>
      <p>
        긴 텍스트는 2줄까지 보이고 말줄임해요. 잘린 칸에 마우스를 올리면 툴팁으로 전체가 보여요. 이메일·경로 같은
        짧은 식별자는 한 줄로, 문장 전체가 필요하면 줄 제한 없이 보여 줘요. 한국어는 단어 중간에서 끊지 않아요.
      </p>
      <Preview>
        <Table layout="fixed" columns={NOTE_COLUMNS} rows={NOTES} />
      </Preview>

      <H3>Align</H3>
      <p>
        글자 열은 왼쪽으로 맞춰요. 금액·수량·날짜 같은 숫자 열은 자릿수를 비교하기 쉽게 오른쪽으로 맞춰요.
      </p>
      <Preview>
        <AlignPreview />
      </Preview>

      {/* 2026-10-12 Properties 에는 생김새 옵션(Basic·Column Divider·Long Text·Align)만 두고, 기능 8개는
          Case 아래로 옮겼다(Case = 이럴 땐 이렇게 쓴다). 제목 글자가 같아 앵커 id 는 그대로다 */}
      <H2>Case</H2>
      <p>
        여러 항목을 같은 기준으로 비교하거나 찾아볼 때 표를 써요. 항목이 적거나 좁은 화면(모바일)이면 표 대신
        목록이나 카드로 보여 줘요.
      </p>

      <H3>Sort</H3>
      <p>
        헤더 칸 전체가 정렬 버튼이고, 누를 때마다 오름차순, 내림차순, 해제 순으로 돌아요. 날짜처럼 최신순이 먼저인
        열은 내림차순부터 시작하고, 늘 정렬돼 있어야 하면 해제 단계를 빼요. 한 번에 한 열만 정렬해요.
      </p>
      <p>
        정렬 중인 열만 화살표가 늘 보이고, 나머지 열은 마우스를 올리거나 키보드로 포커스할 때 ↕ 가 보여요. 터치
        기기에선 늘 보여요.
      </p>
      <Preview>
        <SortPreview />
      </Preview>

      <H3>Toolbar</H3>
      <p>
        검색·필터는 표 위 툴바에 둬요. 필터가 3개 이하면 툴바에 바로, 4개 이상이면 필터 버튼과 적용 칩으로 보여
        줘요. 건수는 &apos;총 N건&apos;, 걸러졌으면 &apos;N건 중 M건&apos;이에요.
      </p>
      <p>
        검색은 입력을 멈추고 0.3초 뒤에 반영해요. 조건이 바뀌면 1페이지로 돌아가고 선택을 풀어요.
      </p>
      <Preview>
        <ToolbarPreview />
      </Preview>

      <H3>Selection</H3>
      <p>
        여러 행에 같은 작업(내보내기·삭제 등)을 할 때 맨 앞에 체크박스 열을 붙여요. 행을 고르면 툴바 첫 줄이 일괄
        작업 줄로 바뀌어요. 첫 줄과 높이가 같아 표가 밀리지 않아요. 적용 칩 줄은 일괄 작업 중엔 보이지 않지만 자리는 남아서, 행을 골라도 표가 움직이지 않아요.
      </p>
      <p>헤더 체크박스는 지금 페이지의 행만 골라요. 고를 수 없는 행은 체크박스가 꺼져요.</p>
      <Preview>
        <SelectionPreview />
      </Preview>

      <H3>Empty &amp; Loading</H3>
      <p>
        데이터가 없어도 헤더는 남기고 표 안에서 안내해요. 처음부터 없을 때(데이터 없음)와 검색·필터로 걸러져 없을
        때(결과 없음)는 문구를 나눠요. 결과 없음에는 &apos;필터 초기화&apos; 같은 버튼을 둘 수 있어요. 일러스트는
        넣지 않아요.
      </p>
      <p>첫 로딩은 스켈레톤 행으로, 다시 불러올 땐 기존 행을 흐리게 두고 조작만 막아요.</p>
      <Preview>
        <div className={s.previewStack}>
          <Table
            columns={MEMBER_COLUMNS}
            rows={[]}
            emptyState={<TableEmpty title="아직 구성원이 없어요" description="구성원을 초대하면 여기에 보여요." />}
          />
          <Table
            columns={MEMBER_COLUMNS}
            rows={[]}
            emptyState={
              <TableEmpty
                title="검색 결과가 없어요"
                description="다른 검색어를 입력하거나 필터를 바꿔 보세요."
                action={
                  <Button variant="default" size={32}>
                    필터 초기화
                  </Button>
                }
              />
            }
          />
          <Table columns={MEMBER_COLUMNS} rows={[]} loading skeletonRows={3} />
          <Table columns={MEMBER_COLUMNS} rows={MEMBERS.slice(0, 3)} loading />
        </div>
      </Preview>

      <H3>Resizable</H3>
      <p>
        내용 길이가 들쭉날쭉해 사용자가 직접 넓혀 볼 열에만 켜요. 헤더 오른쪽 경계를 끌거나 방향키로 바꾸고, 경계를
        두 번 누르면 내용 폭에 맞춰요. 마지막 열은 남는 폭을 받아요. 터치 기기에선 핸들이 보이지 않아요.
      </p>
      <Preview>
        <ResizePreview />
      </Preview>

      <H3>Pagination</H3>
      <p>
        행이 한 화면을 넘으면 표 아래에 Pagination 을 둬요. 건수, 페이지 크기, 이전·다음으로 이뤄져요. 건수는
        &apos;12건 중 1–3&apos; 처럼 지금 보이는 범위예요. 페이지 크기를 바꾸면 1페이지로 돌아가요.
      </p>
      <Preview>
        <PaginationPreview />
      </Preview>

      <H3>Scroll &amp; Sticky</H3>
      <p>
        표가 넘치면 잘라내지 않고 가로로 스크롤해요. 더 볼 내용이 있는 쪽 가장자리는 흐려져요. 행이 많으면 헤더를
        고정하고, 열이 많으면 첫 열을 고정해 어느 행인지 놓치지 않게 해요. 첫 열을
        고정하면 왼쪽은 흐림 대신 경계선으로 구분해요.
      </p>
      <Preview>
        <ScrollPreview />
      </Preview>

      <H3>Row Click</H3>
      <p>
        행을 눌러 상세로 가는 표에서만 행이 눌려요. 이때만 행에 호버 배경과 손가락 커서가 생기고
        Enter·Space 로도 열려요. 행 안의 버튼·링크·체크박스를 누를 땐 행 클릭이 일어나지 않아요.
      </p>

      <H2>Guidelines</H2>
      <UsageGrid do={[...TABLE_USAGE.do]} dont={[...TABLE_USAGE.dont]} />
    </>
  );
}

/** Specification — 치수·토큰 표. Code 탭 끝에 놓는다(2026-10-12: Design 탭은 쓰임새, Code 탭은 구현 값).
 *  헤딩 id 는 Design 탭에 있을 때와 같아서 옛 딥링크(#specification 등)는 DocTabs 가 Code 탭을 열어 준다. */
export function TableSpecification() {
  return (
    <>
      <H2>Specification</H2>

      <H3>Container &amp; Cell</H3>
      <Spec caption="Table 컨테이너·셀 치수와 색상" rows={TABLE_SPEC_CONTAINER} />

      <H3>Header &amp; Sort</H3>
      <Spec caption="헤더·정렬 아이콘" rows={TABLE_SPEC_HEADER} />

      <H3>Selection &amp; Resize</H3>
      <Spec caption="선택 열·열 너비 조정" rows={TABLE_SPEC_SELECTION} />

      <H3>Toolbar &amp; Pagination</H3>
      <Spec caption="표 위 툴바·표 아래 Pagination 간격" rows={TABLE_SPEC_AROUND} />

      <H3>Empty, Loading &amp; Scroll</H3>
      <Spec caption="빈 상태·로딩·가로 스크롤" rows={TABLE_SPEC_STATE} />
    </>
  );
}
