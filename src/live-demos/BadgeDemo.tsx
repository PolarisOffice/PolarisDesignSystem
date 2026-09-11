'use client';

import { useState } from 'react';

import { Badge } from '@polarisoffice/pds-react';

/** 가이드 견본용 — Figma 의 Status = Default / Selected 두 변형. 문구는 'Text' */
export default function BadgeDemo() {
  const [on, setOn] = useState(true);
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge>Text</Badge>
      <Badge selected>Text</Badge>
      <Badge selected={on} onClick={() => setOn((v) => !v)}>
        Text
      </Badge>
    </div>
  );
}
