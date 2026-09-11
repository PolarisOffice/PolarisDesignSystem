'use client';

import { Credit } from '@polarisoffice/pds-react';

/** 가이드 견본용 — Figma 의 Property 1 = true / false 두 변형 */
export default function CreditDemo() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Credit value={10} />
      <Credit value={10} available={false} />
    </div>
  );
}
