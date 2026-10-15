'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import {
  Chip,
  Button,
  FilterIcon,
  InputField,
  Pagination,
  SearchIcon,
  Select,
  Table,
  TableToolbar,
  type TableSort,
} from '@polarisoffice/pds-react';

import {
  BILL_COLUMNS,
  BILLS,
  MEMBER_COLUMNS,
  MEMBERS,
  TABLE_SAMPLE_COLUMNS,
  TABLE_SAMPLE_ROWS,
  TEAMS,
  type Member,
  type TableSampleRow,
} from './table.data';

/**
 * Code 탭 미리보기 중 상태가 필요한 것들 — 정렬·검색·선택·페이지.
 *
 * 서버 컴포넌트(`table.code.tsx`)에서는 함수 prop(onSortChange 등)을 넘길 수 없어서(RSC 경계)
 * 예제별로 완결해 둔다. popup.demo.tsx 와 같은 방식이다.
 * 정렬·필터·검색 계산은 앱 몫이라는 규칙을 그대로 보여 주려고, 계산도 여기서 직접 한다.
 */

/* ── 정렬 ─────────────────────────────────────────────── */

function sortRows(rows: Member[], sort: TableSort | null) {
  if (!sort) return rows;
  const key = sort.key as keyof Member;
  const sign = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => a[key].localeCompare(b[key], 'ko') * sign);
}

export function SortDemo() {
  const [sort, setSort] = useState<TableSort | null>({ key: 'joined', direction: 'desc' });
  const rows = useMemo(() => sortRows(MEMBERS.slice(0, 5), sort), [sort]);
  return (
    <Table<Member>
      aria-label="구성원"
      rowKey={(r) => r.id}
      sort={sort}
      onSortChange={setSort}
      columns={[
        { key: 'name', header: '이름', sortable: true },
        { key: 'team', header: '팀', sortable: true },
        { key: 'joined', header: '입사일', numeric: true, sortable: true, sortFirst: 'desc' },
      ]}
      rows={rows}
    />
  );
}

/* ── 검색·필터 툴바 ───────────────────────────────────── */

const TEAM_OPTIONS = [{ value: 'all', label: '전체 팀' }, ...TEAMS.map((t) => ({ value: t, label: t }))];

export function ToolbarDemo() {
  const [query, setQuery] = useState('');
  const [team, setTeam] = useState('all');
  const rows = MEMBERS.filter(
    (m) => (team === 'all' || m.team === team) && (query === '' || m.name.includes(query.trim())),
  );
  const filtered = team !== 'all' || query.trim() !== '';
  return (
    <div>
      <TableToolbar
        start={
          <>
            <div style={{ width: 240 }}>
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
            </div>
            <Select size="sm" width={140} options={TEAM_OPTIONS} value={team} onChange={setTeam} />
          </>
        }
        end={
          <span style={{ fontSize: 13, color: 'var(--color-label-alternative)' }}>
            {filtered ? `${MEMBERS.length}건 중 ${rows.length}건` : `총 ${MEMBERS.length}건`}
          </span>
        }
      />
      <div style={{ marginTop: 12 }}>
        <Table<Member> aria-label="구성원" rowKey={(r) => r.id} columns={MEMBER_COLUMNS} rows={rows} maxHeight={360} />
      </div>
    </div>
  );
}

/* ── 행 선택 ─────────────────────────────────────────── */

export function SelectionDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div>
      <TableToolbar
        end={<span style={{ fontSize: 13, color: 'var(--color-label-alternative)' }}>총 5건</span>}
        selection={{
          count: selected.length,
          actions: (
            <Button variant="default" size={24} onClick={() => setSelected([])}>
              내보내기
            </Button>
          ),
          onClear: () => setSelected([]),
        }}
      />
      <div style={{ marginTop: 12 }}>
        <Table<Member>
          aria-label="구성원"
          rowKey={(r) => r.id}
          selectedKeys={selected}
          onSelectedKeysChange={setSelected}
          columns={MEMBER_COLUMNS}
          rows={MEMBERS.slice(0, 5)}
        />
      </div>
    </div>
  );
}

/* ── 페이지 이동 ──────────────────────────────────────── */

export function PaginationDemo() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const rows = MEMBERS.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div>
      <Table<Member> aria-label="구성원" rowKey={(r) => r.id} columns={MEMBER_COLUMNS} rows={rows} />
      <div style={{ marginTop: 12 }}>
        <Pagination
          page={page}
          pageSize={pageSize}
          total={MEMBERS.length}
          onPageChange={setPage}
          pageSizeOptions={[5, 10]}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}

/* ── Design 탭 정적 미리보기 ──────────────────────────────
 * Design 탭은 그림이라(inert) 상태가 필요 없지만, 선택·페이지는 함수 prop 이 있어야 그려지고
 * 정렬은 rowKey(함수)가 없으면 개발 경고가 난다. 서버 컴포넌트에선 함수를 못 넘겨 여기 둔다. */

const noop = () => {};
const PREVIEW_ROWS = MEMBERS.slice(0, 4);
const PREVIEW_SORT: TableSort = { key: 'joined', direction: 'desc' };

export function SortPreview() {
  return (
    <Table<Member>
      rowKey={(r) => r.id}
      sort={PREVIEW_SORT}
      onSortChange={noop}
      columns={[
        { key: 'name', header: '이름', align: 'left', sortable: true },
        { key: 'team', header: '팀', align: 'left', sortable: true },
        { key: 'joined', header: '입사일', numeric: true, sortable: true },
      ]}
      rows={sortRows(PREVIEW_ROWS, PREVIEW_SORT)}
    />
  );
}

/** 필터가 4개 이상인 구성 — 필터는 버튼 안에 모으고, 적용한 조건은 아래 칩으로 */
export function ToolbarPreview() {
  const rows = MEMBERS.filter((m) => m.team === '개발' && m.status === '재직');
  return (
    <div>
      <TableToolbar
        start={
          <>
            <div style={{ width: 200 }}>
              <InputField size="sm" aria-label="이름 검색" placeholder="이름 검색" leftIcon={<SearchIcon />} />
            </div>
            <Button variant="default" size={32} leftIcon={<FilterIcon size={18} />}>
              필터
            </Button>
          </>
        }
        end={
          <span style={{ fontSize: 13, color: 'var(--color-label-alternative)' }}>
            {`${MEMBERS.length}건 중 ${rows.length}건`}
          </span>
        }
        below={
          <>
            <Chip onRemove={noop} removeLabel="팀: 개발 필터 해제">
              팀: 개발
            </Chip>
            <Chip onRemove={noop} removeLabel="상태: 재직 필터 해제">
              상태: 재직
            </Chip>
          </>
        }
      />
      <div style={{ marginTop: 12 }}>
        <Table<Member> columns={MEMBER_COLUMNS} rows={rows} />
      </div>
    </div>
  );
}

export function SelectionPreview() {
  return (
    <div>
      <TableToolbar
        selection={{
          count: 2,
          actions: (
            <Button variant="default" size={24}>
              내보내기
            </Button>
          ),
          onClear: noop,
        }}
      />
      <div style={{ marginTop: 12 }}>
        <Table<Member>
          rowKey={(r) => r.id}
          selectedKeys={['m1', 'm3']}
          onSelectedKeysChange={noop}
          columns={MEMBER_COLUMNS}
          rows={PREVIEW_ROWS}
        />
      </div>
    </div>
  );
}

export function PaginationPreview() {
  return (
    <div>
      <Table<Member> columns={MEMBER_COLUMNS} rows={MEMBERS.slice(0, 3)} />
      <div style={{ marginTop: 12 }}>
        <Pagination
          page={1}
          pageSize={3}
          total={MEMBERS.length}
          onPageChange={noop}
          pageSizeOptions={[3, 10]}
          onPageSizeChange={noop}
        />
      </div>
    </div>
  );
}

/** Anatomy 도해 견본 — 정렬 중인 열(06)과 선택 열(07)을 함께 보이려고 정렬·선택을 켠다 */
const ANATOMY_ROWS = [...TABLE_SAMPLE_ROWS].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
const ANATOMY_SORT: TableSort = { key: 'name', direction: 'asc' };

export function AnatomySample() {
  return (
    <Table<TableSampleRow>
      rowKey={(r) => r.name}
      sort={ANATOMY_SORT}
      onSortChange={noop}
      selectedKeys={[]}
      onSelectedKeysChange={noop}
      columns={TABLE_SAMPLE_COLUMNS.map((c) => (c.key === 'name' ? { ...c, sortable: true } : c))}
      rows={ANATOMY_ROWS}
    />
  );
}

/** 열 너비 조정 — 손잡이는 마우스를 올려야 보여서, 그림에선 첫 경계에 올린 모습을 덧그린다.
 *  막대 위치는 첫 열 width(160)와 같아야 한다 */
export function ResizePreview() {
  return (
    <div style={{ position: 'relative' }}>
      <Table<Member>
        rowKey={(r) => r.id}
        layout="fixed"
        columns={[
          { key: 'name', header: '이름', align: 'left', width: 160, resizable: true },
          { key: 'team', header: '팀', align: 'left', width: 120, resizable: true },
          { key: 'joined', header: '입사일', numeric: true, width: 140 },
        ]}
        rows={PREVIEW_ROWS}
      />
      <span
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 159,
          width: 2,
          background: 'var(--color-accent-normal)',
        }}
      />
    </div>
  );
}

/** 가로 스크롤 + 첫 열 고정 — 면을 표보다 좁게 잡아 오른쪽 흐림과 고정 열 경계선이 보이게 한다 */
export function ScrollPreview() {
  return (
    <div style={{ width: 360 }}>
      <Table<Member> rowKey={(r) => r.id} layout="fixed" stickyFirstColumn columns={MEMBER_COLUMNS} rows={PREVIEW_ROWS} />
    </div>
  );
}

/** 정렬 기준선 — 글자 열은 왼쪽 끝, 숫자 열은 오른쪽 끝에 점선을 긋는다.
 *  위치는 렌더된 헤더 칸에서 잰다(여백 값이 바뀌어도 그림이 따라온다) */
export function AlignPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<number[]>([]);
  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return;
    const measure = () => {
      const base = box.getBoundingClientRect().left;
      setLines(
        [...box.querySelectorAll('th')].map((th) => {
          const r = th.getBoundingClientRect();
          const cs = getComputedStyle(th);
          return cs.textAlign === 'right' || cs.textAlign === 'end'
            ? r.right - parseFloat(cs.paddingRight) - base
            : r.left + parseFloat(cs.paddingLeft) - base;
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <Table columns={BILL_COLUMNS} rows={BILLS} />
      {lines.map((x, i) => (
        <span
          key={i}
          style={{ position: 'absolute', top: 0, bottom: 0, left: x, borderLeft: '1px dashed var(--color-state-error)' }}
        />
      ))}
    </div>
  );
}
