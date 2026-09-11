'use client';

import { Tooltip } from '@polarisoffice/pds-react';

import { demoTrigger } from './trigger';

const PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const;

/**
 * 가이드 견본용 — 툴팁은 호버해야 보이므로 방향별로 늘어놓는다.
 * 첫 호버 600ms → 이어지는 호버 100ms 인 케스케이드도 여기서 체감된다.
 * 문구는 Figma 견본대로 "Text" 를 쓴다 — 지어내지 않는다.
 */
export default function TooltipDemo() {
  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', padding: '28px 8px' }}>
      {PLACEMENTS.map((p) => (
        <Tooltip key={p} content="Text" placement={p}>
          <button type="button" style={demoTrigger}>
            {p}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
