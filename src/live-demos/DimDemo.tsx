'use client';

import { Dim } from '@polarisoffice/pds-react';

/** 가이드 견본용 — Figma 의 loading=True / loading=false 두 변형 */
export default function DimDemo() {
  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      {[true, false].map((loading) => (
        <div
          key={String(loading)}
          style={{
            position: 'relative',
            width: 300,
            height: 200,
            borderRadius: 8,
            overflow: 'hidden',
            background: 'var(--color-fill-normal, #f2f4f6)',
          }}
        >
          <Dim loading={loading} />
        </div>
      ))}
    </div>
  );
}
