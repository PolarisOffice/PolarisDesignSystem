'use client';

import { useState } from 'react';

import { Chip } from '@polarisoffice/pds-react';

const CHIPS = ['팀: 디자인', '상태: 재직'];

/** 가이드 견본용 — 선택 칩(눌러서 켜고 끔) 하나와, × 로 지우는 조건 칩 둘. 다 지우면 견본이 비지 않게 처음으로 되돌린다 */
export default function ChipDemo() {
  const [on, setOn] = useState(true);
  const [chips, setChips] = useState(CHIPS);
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <Chip type="select" selected={on} onClick={() => setOn((v) => !v)}>
        디자인
      </Chip>
      {chips.map((c) => (
        <Chip key={c} onRemove={() => setChips((v) => (v.length > 1 ? v.filter((x) => x !== c) : CHIPS))}>
          {c}
        </Chip>
      ))}
    </div>
  );
}
