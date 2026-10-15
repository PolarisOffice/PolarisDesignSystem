import { Button, Table, TableEmpty, type TableColumn } from '@polarisoffice/pds-react';

import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { PDS_PACKAGE } from '@/lib/docs/package';

import { BILL_COLUMNS, BILLS, MEMBER_COLUMNS, MEMBERS, NOTE_COLUMNS, NOTES, type Member } from './table.data';
import { PaginationDemo, SelectionDemo, SortDemo, ToolbarDemo } from './table.demo';

const IMPORT = `import { Table } from '${PDS_PACKAGE}';`;

// Figma 표 샘플과 같은 자리표시 문구 — 임의 문구를 넣지 않는다
type Row = { name: string; type: string; date: string };

const columns: TableColumn<Row>[] = [
  { key: 'name', header: '제목' },
  { key: 'type', header: '제목' },
  { key: 'date', header: '제목' },
];

const rows: Row[] = [
  { name: '내용', type: '내용', date: '내용' },
  { name: '내용', type: '내용', date: '내용' },
];

// 공유 열의 maxWidth 는 auto 레이아웃 말줄임용 — 끌기 상한(maxWidth)이 되지 않게 뺀다(resizable 이면 fixed 레이아웃)
const resizeColumns: TableColumn<Member>[] = MEMBER_COLUMNS.map((c) => ({ ...c, maxWidth: undefined, resizable: true }));

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'base',
    title: 'Base',
    desc: '헤더 행 + 데이터 행. 헤더는 항상 넣어요.',
    previewName: 'Table',
    preview: <Table columns={columns} rows={rows} />,
    code: `${IMPORT}

<Table
  columns={[
    { key: 'name', header: '제목' },
    { key: 'type', header: '제목' },
    { key: 'date', header: '제목' },
  ]}
  rows={[
    { name: '내용내용내용', type: '내용내용내용', date: '내용내용내용' },
    { name: '내용내용내용', type: '내용내용내용', date: '내용내용내용' },
  ]}
/>`,
  },
  {
    id: 'column-divider',
    title: 'Column Divider',
    desc: '열 수가 많거나 데이터 구분이 필요할 때만 켜요. 기본은 끔.',
    previewName: 'Table',
    preview: <Table columnDivider columns={columns} rows={rows} />,
    code: `${IMPORT}

<Table columnDivider columns={columns} rows={rows} />`,
  },
  {
    id: 'long-text',
    title: 'Long Text',
    desc: "긴 텍스트는 2줄까지 보이고 말줄임해요. 잘린 칸에 마우스를 올리면 전체가 보여요. 이메일·경로 같은 짧은 식별자는 lines 1, 문장 전체가 필요하면 lines 'all'. lines 1 은 열 폭이 정해져야 잘려요(layout fixed 또는 maxWidth 와 함께).",
    previewName: 'Table',
    preview: <Table aria-label="메모" layout="fixed" columns={NOTE_COLUMNS} rows={NOTES} />,
    code: `${IMPORT}

const text = '다음 분기 디자인 시스템 개편 일정과 표 컴포넌트 개선 범위를 정리했어요. 검토 후 의견을 남겨 주세요.';

<Table
  aria-label="메모"
  layout="fixed"
  columns={[
    { key: 'clamp2', header: '기본 (2줄)', width: 200 },
    { key: 'clamp1', header: '1줄', lines: 1, width: 200 },
    { key: 'full', header: '제한 없음', lines: 'all', width: 200 },
  ]}
  rows={[{ clamp2: text, clamp1: text, full: text }]}
/>`,
  },
  {
    id: 'numeric',
    title: 'Numeric',
    desc: '숫자·날짜 열은 numeric 을 켜요. 오른쪽 정렬, 자릿수가 맞는 숫자, 줄바꿈 없음. 글자 열은 align 을 안 주면 가운데라서 left 를 직접 줘요.',
    previewName: 'Table',
    preview: <Table aria-label="결제 내역" columns={BILL_COLUMNS} rows={BILLS} />,
    code: `${IMPORT}

<Table
  aria-label="결제 내역"
  columns={[
    { key: 'item', header: '항목', align: 'left' },
    { key: 'qty', header: '수량', numeric: true },
    { key: 'amount', header: '금액', numeric: true },
    { key: 'date', header: '결제일', numeric: true },
  ]}
  rows={[
    { item: '팀 요금제', qty: '12', amount: '1,188,000원', date: '2026.09.01' },
    { item: '저장 공간 추가', qty: '3', amount: '29,700원', date: '2026.09.14' },
  ]}
/>`,
  },
  {
    id: 'sort',
    title: 'Sort',
    desc: '헤더를 눌러 정렬해요. 오름차순, 내림차순, 해제 순으로 돌아요. 표는 상태만 알려 주고 정렬 계산은 앱이 해요.',
    previewName: 'Table',
    preview: <SortDemo />,
    code: `${IMPORT}
import type { TableSort } from '${PDS_PACKAGE}';
import { useMemo, useState } from 'react';

const [sort, setSort] = useState<TableSort | null>({ key: 'joined', direction: 'desc' });

const sorted = useMemo(() => {
  if (!sort) return members;
  const key = sort.key as keyof Member;
  const sign = sort.direction === 'asc' ? 1 : -1;
  return [...members].sort((a, b) => a[key].localeCompare(b[key], 'ko') * sign);
}, [members, sort]);

<Table
  aria-label="구성원"
  rowKey={(row) => row.id}
  sort={sort}
  onSortChange={setSort}
  columns={[
    { key: 'name', header: '이름', sortable: true },
    { key: 'team', header: '팀', sortable: true },
    { key: 'joined', header: '입사일', numeric: true, sortable: true, sortFirst: 'desc' },
  ]}
  rows={sorted}
/>`,
  },
  {
    id: 'toolbar',
    title: 'Toolbar',
    desc: '검색·필터는 표 위 툴바에 둬요. 툴바와 표 사이는 12px. 필터가 3개 이하면 툴바에 바로, 4개 이상이면 필터 버튼과 적용 칩으로 보여 줘요. 조건이 바뀌면 앱이 1페이지로 되돌리고 선택을 풀어요.',
    previewName: 'TableToolbar',
    preview: <ToolbarDemo />,
    code: `import { InputField, SearchIcon, Select, Table, TableToolbar } from '${PDS_PACKAGE}';
import { useState } from 'react';

const [query, setQuery] = useState('');
const [team, setTeam] = useState('all');
// 실제 앱에서는 검색어를 300ms 디바운스한 값으로 걸러요
const filtered = members.filter(
  (m) => (team === 'all' || m.team === team) && m.name.includes(query.trim()),
);

<TableToolbar
  start={
    <>
      <InputField
        size="sm"
        aria-label="이름 검색"
        placeholder="이름 검색"
        leftIcon={<SearchIcon />}
        clearable
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClear={() => setQuery('')}
      />
      <Select
        size="sm"
        width={140}
        options={[
          { value: 'all', label: '전체 팀' },
          { value: '디자인', label: '디자인' },
          { value: '개발', label: '개발' },
        ]}
        value={team}
        onChange={setTeam}
      />
    </>
  }
  // 조건이 없으면 '총 N건', 있으면 'N건 중 M건'
  end={<span>{query || team !== 'all' ? \`\${members.length}건 중 \${filtered.length}건\` : \`총 \${members.length}건\`}</span>}
  // 필터가 4개 이상이면 start 에 필터 버튼을 두고, 적용한 조건은 below 에 칩으로:
  // below={<Chip onRemove={() => setTeam('all')} removeLabel="팀: 개발 필터 해제">팀: 개발</Chip>}
/>
<div style={{ marginTop: 12 }}>
  <Table aria-label="구성원" rowKey={(row) => row.id} columns={columns} rows={filtered} />
</div>`,
  },
  {
    id: 'selection',
    title: 'Selection',
    desc: '행을 고르면 툴바 첫 줄이 일괄 작업 줄로 바뀌어요. 헤더 체크박스는 지금 페이지만 골라요. 정렬·선택을 쓰면 rowKey 를 꼭 줘요.',
    previewName: 'Table',
    preview: <SelectionDemo />,
    code: `import { Button, Table, TableToolbar } from '${PDS_PACKAGE}';
import { useState } from 'react';

const [selected, setSelected] = useState<string[]>([]);

<TableToolbar
  selection={{
    count: selected.length,
    actions: <Button variant="default" size={24}>내보내기</Button>,
    onClear: () => setSelected([]),
  }}
/>
<div style={{ marginTop: 12 }}>
  <Table
    aria-label="구성원"
    rowKey={(row) => row.id}
    selectedKeys={selected}
    onSelectedKeysChange={setSelected}
    columns={columns}
    rows={members}
  />
</div>`,
  },
  {
    id: 'empty-loading',
    title: 'Empty & Loading',
    desc: '결과가 없으면 emptyState 에 TableEmpty 를 넣어요. 처음 불러오는 동안은 loading 으로 스켈레톤 행을 보여 줘요.',
    previewName: 'Table',
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Table<Member>
          aria-label="검색 결과"
          columns={MEMBER_COLUMNS}
          rows={[]}
          emptyState={
            <TableEmpty
              title="검색 결과가 없어요"
              description="다른 검색어를 입력하거나 필터를 바꿔 보세요."
              action={<Button variant="default" size={32}>필터 초기화</Button>}
            />
          }
        />
        <Table<Member> aria-label="구성원" columns={MEMBER_COLUMNS} rows={[]} loading skeletonRows={3} />
      </div>
    ),
    code: `import { Button, Table, TableEmpty } from '${PDS_PACKAGE}';

<Table
  aria-label="검색 결과"
  columns={columns}
  rows={filtered}
  loading={isLoading}
  emptyState={
    <TableEmpty
      title="검색 결과가 없어요"
      description="다른 검색어를 입력하거나 필터를 바꿔 보세요."
      action={<Button variant="default" size={32} onClick={resetFilters}>필터 초기화</Button>}
    />
  }
/>`,
  },
  {
    id: 'resizable',
    title: 'Resizable',
    desc: '헤더 오른쪽 경계를 끌어 열 너비를 바꿔요. 방향키로도, 두 번 누르면 내용에 맞춰요. 열마다 숫자 width 를 줘요.',
    previewName: 'Table',
    preview: <Table<Member> aria-label="구성원" columns={resizeColumns} rows={MEMBERS.slice(0, 3)} />,
    code: `${IMPORT}

<Table
  aria-label="구성원"
  columns={[
    { key: 'name', header: '이름', width: 120, resizable: true },
    { key: 'email', header: '이메일', lines: 1, width: 220, resizable: true },
    { key: 'team', header: '팀', width: 100, resizable: true },
    { key: 'joined', header: '입사일', numeric: true, width: 120, resizable: true },
  ]}
  rows={members}
/>`,
  },
  {
    id: 'pagination',
    title: 'Pagination',
    desc: '표 아래 12px 에 Pagination 을 둬요. 페이지 크기를 바꾸면 앱이 1페이지로 되돌려요(onPageSizeChange 에서 page 를 1로).',
    previewName: 'Pagination',
    preview: <PaginationDemo />,
    code: `import { Pagination, Table } from '${PDS_PACKAGE}';
import { useState } from 'react';

const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const pageRows = members.slice((page - 1) * pageSize, page * pageSize);

<Table aria-label="구성원" rowKey={(row) => row.id} columns={columns} rows={pageRows} />
<div style={{ marginTop: 12 }}>
  <Pagination
    page={page}
    pageSize={pageSize}
    total={members.length}
    onPageChange={setPage}
    pageSizeOptions={[10, 20, 50]}
    onPageSizeChange={(size) => {
      setPageSize(size);
      setPage(1);
    }}
  />
</div>`,
  },
  {
    id: 'scroll-sticky',
    title: 'Scroll & Sticky',
    desc: 'maxHeight 를 주면 헤더는 고정되고 본문만 스크롤해요. 열이 많으면 stickyFirstColumn 으로 첫 열도 고정해요.',
    previewName: 'Table',
    preview: <Table<Member> aria-label="구성원" maxHeight={280} stickyFirstColumn columns={MEMBER_COLUMNS} rows={MEMBERS} />,
    code: `${IMPORT}

<Table
  aria-label="구성원"
  maxHeight={280}
  stickyFirstColumn
  columns={columns}
  rows={members}
/>`,
  },
];

export default function TableCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
