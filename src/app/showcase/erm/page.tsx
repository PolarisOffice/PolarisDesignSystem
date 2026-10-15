'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Button,
  DownloadIcon,
  InputField,
  Pagination,
  SearchIcon,
  Select,
  Table,
  TableEmpty,
  TableToolbar,
  type TableColumn,
  type TableSort,
} from '@polarisoffice/pds-react';
import '@polarisoffice/pds-react/tokens.css';

import { DEPARTMENTS, GRADES, RISKS, STATUSES, gradeOf, scoreOf, type Grade, type Risk, type Status } from './erm.data';
import s from './erm.module.css';

/**
 * ERM(전사 리스크 관리) 시안 — 리스크 대장 화면.
 *
 * 패키지(@polarisoffice/pds-react 1.2.0)의 Table·TableToolbar·Pagination 을 실제 업무 화면에 놓아 본다:
 *  · 긴 제목·대응 계획은 2줄까지 보이고 말줄임, 마우스를 올리면 전체가 툴팁으로
 *  · 검색 + 필터 3개(부서·등급·상태). 필터가 3개 이하라 툴바에 바로 둔다(4개 이상일 때만 필터 버튼 + 적용 칩)
 *  · 리스크·점수·조치 기한 열 정렬, 열 너비 조정(헤더 경계를 끌기), 행 선택과 일괄 작업, 페이지 이동, 빈 상태
 * 정렬·필터·검색 계산은 앱 몫이라는 Table 규칙대로 여기서 직접 한다. 데이터는 지어낸 견본이다.
 */

type Row = Risk & { score: number; grade: Grade };

const ALL = 'all';
const SEARCH_ID = 'erm-search';

const ROWS: Row[] = RISKS.map((r) => ({ ...r, score: scoreOf(r), grade: gradeOf(r) }));

const withAll = (label: string, values: readonly string[]) => [
  { value: ALL, label },
  ...values.map((v) => ({ value: v, label: v })),
];
const DEPT_OPTIONS = withAll('전체 부서', DEPARTMENTS);
const GRADE_OPTIONS = withAll('전체 등급', GRADES);
const STATUS_OPTIONS = withAll('전체 상태', STATUSES);

const DOT_CLASS: Record<Grade, string> = { 높음: s.dotHigh, 중간: s.dotMid, 낮음: '' };
const STATUS_CLASS: Record<Status, string | undefined> = {
  조치중: s.statusDoing,
  모니터링: undefined,
  지연: s.statusLate,
  완료: s.statusDone,
};

const COLUMNS: Array<TableColumn<Row>> = [
  { key: 'title', header: '리스크', align: 'left', width: 232, sortable: true, resizable: true },
  { key: 'plan', header: '대응 계획', align: 'left', width: 272, resizable: true },
  { key: 'dept', header: '부서', align: 'left', width: 104, resizable: true },
  {
    id: 'grade',
    header: '등급',
    align: 'left',
    width: 92,
    resizable: true,
    render: (r) => (
      <span className={s.grade}>
        <span className={`${s.dot} ${DOT_CLASS[r.grade]}`} aria-hidden="true" />
        {r.grade}
      </span>
    ),
  },
  { key: 'score', header: '점수', numeric: true, width: 104, sortable: true, sortFirst: 'desc', resizable: true },
  { key: 'owner', header: '담당자', align: 'left', width: 92, resizable: true },
  {
    id: 'status',
    header: '상태',
    align: 'left',
    width: 108,
    resizable: true,
    render: (r) => <span className={STATUS_CLASS[r.status]}>{r.status}</span>,
  },
  { key: 'due', header: '조치 기한', numeric: true, width: 128, sortable: true },
];

function sortRows(rows: Row[], sort: TableSort | null) {
  if (!sort) return rows;
  const sign = sort.direction === 'asc' ? 1 : -1;
  const key = sort.key as 'title' | 'score' | 'due';
  return [...rows].sort((a, b) => {
    const diff = key === 'score' ? a.score - b.score : a[key].localeCompare(b[key], 'ko');
    // 같은 값이면 번호순 — 정렬을 바꿔도 순서가 흔들리지 않게
    return diff !== 0 ? diff * sign : a.id.localeCompare(b.id);
  });
}

export default function ErmPage() {
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState(ALL);
  const [grade, setGrade] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [sort, setSort] = useState<TableSort | null>({ key: 'score', direction: 'desc' });
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 표에 반영하는 검색어 — 입력을 멈추고 0.3초 뒤(Table 가이드). 한글은 조합 중 낱자모를 거쳐서
  // 글자마다 거르면 표가 빈 상태로 깜빡인다. 지울 때는 바로 반영한다
  const [keyword, setKeyword] = useState('');
  useEffect(() => {
    const t = setTimeout(
      () => {
        setKeyword(query.trim());
        setPage(1);
      },
      query === '' ? 0 : 300,
    );
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const k = keyword.toLowerCase();
    return ROWS.filter(
      (r) =>
        (dept === ALL || r.dept === dept) &&
        (grade === ALL || r.grade === grade) &&
        (status === ALL || r.status === status) &&
        (k === '' || r.title.toLowerCase().includes(k) || r.plan.toLowerCase().includes(k)),
    );
  }, [dept, grade, status, keyword]);
  const sorted = useMemo(() => sortRows(filtered, sort), [filtered, sort]);
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);
  const isFiltered = dept !== ALL || grade !== ALL || status !== ALL || keyword !== '';

  // 조건이 바뀌면 첫 페이지로 — 걸러진 결과가 지금 페이지보다 짧을 수 있다(검색어는 위 effect 가 한다)
  const change = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };
  const reset = () => {
    setQuery('');
    setDept(ALL);
    setGrade(ALL);
    setStatus(ALL);
    setPage(1);
    // 조건이 바뀌면 선택도 푼다(Table 가이드) — 요약 칸은 행을 고른 채로도 눌려서, 안 풀면 화면에 없는 행이 선택된 채 남는다
    setSelected([]);
  };
  // 필터 초기화·선택 해제 버튼은 누르면 사라진다 — 키보드 포커스를 검색 입력으로 돌려준다.
  // 선택 바가 떠 있는 동안엔 검색 입력이 화면에 없다(바가 1행을 대신한다) — 다시 그려진 다음 프레임에 잡는다
  const focusSearch = () => requestAnimationFrame(() => document.getElementById(SEARCH_ID)?.focus());

  const stats = [
    { label: '전체 리스크', value: ROWS.length, on: !isFiltered, apply: reset },
    {
      label: '높음 등급',
      value: ROWS.filter((r) => r.grade === '높음').length,
      on: grade === '높음' && dept === ALL && status === ALL && keyword === '',
      apply: () => {
        reset();
        setGrade('높음');
      },
    },
    {
      label: '지연',
      value: ROWS.filter((r) => r.status === '지연').length,
      alert: true,
      on: status === '지연' && dept === ALL && grade === ALL && keyword === '',
      apply: () => {
        reset();
        setStatus('지연');
      },
    },
    {
      label: '조치중',
      value: ROWS.filter((r) => r.status === '조치중').length,
      on: status === '조치중' && dept === ALL && grade === ALL && keyword === '',
      apply: () => {
        reset();
        setStatus('조치중');
      },
    },
  ];

  return (
    <main className={s.page}>
      <p className={s.crumb}>리스크 관리 / 리스크 대장</p>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>리스크 대장</h1>
          <p className={s.lead}>전사 리스크를 등급과 조치 기한으로 살펴보고 대응 상황을 챙겨요.</p>
        </div>
        <div className={s.actions}>
          <Button variant="default" size={40} leftIcon={<DownloadIcon size={18} />}>
            내보내기
          </Button>
          <Button variant="primary" size={40}>
            리스크 등록
          </Button>
        </div>
      </div>

      <div className={s.stats}>
        {stats.map((st) => (
          <button
            key={st.label}
            type="button"
            className={st.on ? `${s.stat} ${s.statOn}` : s.stat}
            aria-current={st.on ? 'true' : undefined}
            onClick={st.apply}
          >
            <span className={s.statLabel}>{st.label}</span>
            <span className={st.alert ? `${s.statValue} ${s.statAlert}` : s.statValue}>{st.value}</span>
          </button>
        ))}
      </div>

      <TableToolbar
        start={
          <>
            <div style={{ width: 240 }}>
              <InputField
                id={SEARCH_ID}
                size="sm"
                aria-label="리스크와 대응 계획 검색"
                placeholder="리스크 · 대응 계획 검색"
                leftIcon={<SearchIcon />}
                clearable
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClear={() => setQuery('')}
              />
            </div>
            {/* Select 는 이름을 받지 않는다(버튼엔 고른 값만 읽힌다) — 무슨 필터인지 묶음 이름으로 알린다 */}
            <div role="group" aria-label="부서 필터">
              <Select size="sm" width={128} options={DEPT_OPTIONS} value={dept} onChange={change(setDept)} />
            </div>
            <div role="group" aria-label="등급 필터">
              <Select size="sm" width={128} options={GRADE_OPTIONS} value={grade} onChange={change(setGrade)} />
            </div>
            <div role="group" aria-label="상태 필터">
              <Select size="sm" width={128} options={STATUS_OPTIONS} value={status} onChange={change(setStatus)} />
            </div>
            {isFiltered && (
              <Button
                variant="ghost"
                size={32}
                onClick={() => {
                  reset();
                  focusSearch();
                }}
              >
                필터 초기화
              </Button>
            )}
          </>
        }
        end={
          <span className={s.count}>
            {isFiltered ? `${ROWS.length}건 중 ${sorted.length}건` : `총 ${ROWS.length}건`}
          </span>
        }
        selection={{
          count: selected.length,
          actions: (
            <>
              <Button variant="default" size={24}>
                담당자 변경
              </Button>
              <Button variant="default" size={24}>
                내보내기
              </Button>
            </>
          ),
          onClear: () => {
            setSelected([]);
            focusSearch();
          },
        }}
      />

      <div className={s.tableWrap}>
        <Table<Row>
          caption="리스크 대장"
          layout="fixed"
          stickyFirstColumn
          rowKey={(r) => r.id}
          columns={COLUMNS}
          rows={pageRows}
          sort={sort}
          onSortChange={change(setSort)}
          selectedKeys={selected}
          onSelectedKeysChange={setSelected}
          emptyState={
            <TableEmpty
              title="조건에 맞는 리스크가 없어요"
              description="검색어나 필터를 바꿔 보세요."
              action={
                <Button
                  variant="default"
                  size={32}
                  onClick={() => {
                    reset();
                    focusSearch();
                  }}
                >
                  필터 초기화
                </Button>
              }
            />
          }
        />
      </div>

      <div className={s.pager}>
        <Pagination
          page={page}
          pageSize={pageSize}
          total={sorted.length}
          onPageChange={setPage}
          pageSizeOptions={[10, 20, 50]}
          onPageSizeChange={change(setPageSize)}
        />
      </div>
    </main>
  );
}
