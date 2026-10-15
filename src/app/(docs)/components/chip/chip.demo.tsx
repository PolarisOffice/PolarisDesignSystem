'use client';

import { useState } from 'react';

import {
  Button,
  Chip,
  FilterIcon,
  InputField,
  SearchIcon,
  TableToolbar,
  UserIcon,
  type ChipSize,
  type ChipType,
} from '@polarisoffice/pds-react';

/**
 * Chip 페이지에서 함수 prop 이 필요한 것들 — × (onRemove)와 누르기(onClick)는 함수라 서버 컴포넌트
 * (chip.design.tsx · chip.code.tsx)에서 넘길 수 없다(RSC 경계). table.demo.tsx 와 같은 방식이다.
 */

const noop = () => {};
const TEAMS = ['디자인', '개발', '기획', '마케팅'];

/** Design 탭 정지 그림용 — 옵션을 불리언으로 받아 실물 Chip 을 그린다. 눌러도 아무 일도 없다 */
export function ChipFigure({
  children,
  type,
  size,
  icon = false,
  remove = false,
  selected,
  check,
  className,
}: {
  children: React.ReactNode;
  type?: ChipType;
  size?: ChipSize;
  icon?: boolean;
  remove?: boolean;
  selected?: boolean;
  /** 선택 칩이 켜졌을 때의 체크 표시 — false 면 뺀다 */
  check?: boolean;
  className?: string;
}) {
  return (
    <Chip
      type={type}
      size={size}
      selected={selected}
      checkIcon={check}
      className={className}
      leftIcon={icon ? <UserIcon size={size === 'sm' ? 14 : 16} /> : undefined}
      onRemove={remove ? noop : undefined}
      removeLabel={remove ? '해제' : undefined}
    >
      {children}
    </Chip>
  );
}

/** Case 01 — 표 툴바의 칩 줄. 필터 버튼 안에 모은 조건을 아래 줄에 칩으로 보여 준다 */
export function ChipFilterCase() {
  return (
    <div style={{ width: 420, maxWidth: '100%' }}>
      <TableToolbar
        start={
          <>
            <div style={{ width: 180 }}>
              <InputField size="sm" aria-label="이름 검색" placeholder="이름 검색" leftIcon={<SearchIcon />} />
            </div>
            <Button variant="default" size={32} leftIcon={<FilterIcon size={18} />}>
              필터
            </Button>
          </>
        }
        below={
          <>
            <Chip onRemove={noop}>팀: 디자인</Chip>
            <Chip onRemove={noop}>상태: 재직</Chip>
          </>
        }
      />
    </div>
  );
}

/** Case 02 — 여러 개 고르기의 정지 그림(둘이 켜진 상태) */
export function ChipToggleCase() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      {TEAMS.map((t, i) => (
        <Chip key={t} type="select" selected={i === 0 || i === 2} onClick={noop}>
          {t}
        </Chip>
      ))}
    </div>
  );
}

/* ── Code 탭 살아있는 예제 ─────────────────────────────── */

/** × 를 누르면 그 칩이 사라진다. 다 지우면 견본이 비지 않게 처음으로 되돌린다 */
export function ChipRemoveDemo() {
  const all = ['팀: 디자인', '상태: 재직'];
  const [chips, setChips] = useState(all);
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      {chips.map((c) => (
        <Chip key={c} onRemove={() => setChips((v) => (v.length > 1 ? v.filter((x) => x !== c) : all))}>
          {c}
        </Chip>
      ))}
    </div>
  );
}

/** 눌러서 켜고 끈다 — 여러 개가 함께 켜질 수 있다. check={false} 면 체크 표시 없이 색만 바뀐다 */
export function ChipToggleDemo({ check }: { check?: boolean }) {
  const [on, setOn] = useState<string[]>(['디자인']);
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      {TEAMS.map((t) => (
        <Chip
          key={t}
          type="select"
          checkIcon={check}
          selected={on.includes(t)}
          onClick={() => setOn((v) => (v.includes(t) ? v.filter((x) => x !== t) : [...v, t]))}
        >
          {t}
        </Chip>
      ))}
    </div>
  );
}
