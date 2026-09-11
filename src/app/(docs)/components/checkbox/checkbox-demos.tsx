'use client';

import { useState } from 'react';
import { Checkbox } from '@polarisoffice/pds-react';

/**
 * Checkbox 그룹 라이브 데모 — 「전체 선택」상태 로직은 훅이 필요해서 서버 컴포넌트인
 * checkbox.code.tsx 에 인라인할 수 없다(클라이언트 경계). 코드 스니펫과 같은 로직.
 */
export function CheckboxGroupDemo() {
  const [items, setItems] = useState([true, false, false]);
  const all = items.every(Boolean);
  const some = items.some(Boolean) && !all;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Checkbox
        label="전체 선택"
        checked={all}
        indeterminate={some}
        onChange={(next) => setItems(items.map(() => next))}
      />
      {items.map((on, i) => (
        <Checkbox
          key={i}
          label={`항목 ${i + 1}`}
          checked={on}
          onChange={(next) => setItems(items.map((v, j) => (i === j ? next : v)))}
        />
      ))}
    </div>
  );
}
