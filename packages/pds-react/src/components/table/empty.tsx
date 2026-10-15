import { color, font } from '../../tokens.js';

import type { TableEmptyProps } from './types.js';

/**
 * 표가 비었을 때의 안내 — Table 의 emptyState 에 넣는다.
 * 일러스트 없이 제목·설명·액션만 둔다.
 */
export function TableEmpty({ title, description, action }: TableEmptyProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: font.family,
        lineHeight: 1.5,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: font.body2Size, fontWeight: 700, color: color.labelNormal }}>{title}</div>
      {description && (
        <div style={{ marginTop: 4, fontSize: font.body3Size, fontWeight: 400, color: color.labelAlternative }}>
          {description}
        </div>
      )}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
