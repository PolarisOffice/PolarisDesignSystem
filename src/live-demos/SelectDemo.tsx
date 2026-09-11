'use client';

import { useState } from 'react';

import { Select } from '@polarisoffice/pds-react';

import type { SelectSize } from '@polarisoffice/pds-react';

const OPTIONS = [
  { value: 'a', label: 'Text' },
  { value: 'b', label: 'Text' },
  { value: 'c', label: 'Text' },
  { value: 'd', label: 'Text' },
  { value: 'e', label: 'Text' },
];

const SIZES: SelectSize[] = ['lg', 'md', 'sm'];

/** 가이드 견본용 — 사이즈 3종을 늘어놓고 실제로 열어 볼 수 있게 한다 */
export default function SelectDemo() {
  const [value, setValue] = useState<Record<string, string | undefined>>({});
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {SIZES.map((s) => (
        <div key={s} style={{ width: 312 }}>
          <div style={{ fontSize: 12, color: 'var(--color-label-assistive, #9ea4aa)', marginBottom: 6 }}>
            {s.toUpperCase()}
          </div>
          <Select
            size={s}
            options={OPTIONS}
            value={value[s]}
            onChange={(v) => setValue((prev) => ({ ...prev, [s]: v }))}
          />
        </div>
      ))}
    </div>
  );
}
