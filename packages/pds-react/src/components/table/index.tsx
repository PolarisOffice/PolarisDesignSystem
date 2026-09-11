'use client';

import { color, font, radius } from '../../tokens.js';

import type { CSSProperties, ReactNode } from 'react';
import type { TableProps } from './types.js';

/**
 * PDS docs/components/table.md + Figma `Component/Contents → Table` 실측.
 *
 * 셀 padding 은 최소 24/16 을 지키고, 그 이상은 콘텐츠 길이를 보고 정한다.
 * 화면 너비가 충분하지 않으면(모바일) 표 자체를 쓰지 않는다.
 */
const CELL_PAD_X = 24;
const CELL_PAD_Y = 16;

const cellBase: CSSProperties = {
  boxSizing: 'border-box',
  padding: `${CELL_PAD_Y}px ${CELL_PAD_X}px`,
  fontFamily: font.family,
  fontSize: font.body1Size,
  fontWeight: 500,
  lineHeight: 1.5,
  borderBottom: `1px solid ${color.lineNeutral}`,
  whiteSpace: 'nowrap',
};

export function Table<Row>({ columns, rows, columnDivider = false, rowKey, className }: TableProps<Row>) {
  const divider = columnDivider ? `1px solid ${color.lineNeutral}` : undefined;

  return (
    <div
      className={className}
      style={{
        border: `1px solid ${color.lineNeutral}`,
        borderRadius: radius.lg,
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th
                key={i}
                scope="col"
                style={{
                  ...cellBase,
                  // 헤더는 회색 단계로 데이터 행과 구분한다
                  background: color.fillNeutral,
                  color: color.labelNeutral,
                  textAlign: c.align ?? 'center',
                  ...(divider && i > 0 ? { borderLeft: divider } : null),
                }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={rowKey?.(row, r) ?? r}>
              {columns.map((c, i) => (
                <td
                  key={i}
                  style={{
                    ...cellBase,
                    background: color.backgroundBase,
                    color: color.labelNormal,
                    textAlign: c.align ?? 'center',
                    // 마지막 행의 아래 선은 컨테이너 보더와 겹친다
                    ...(r === rows.length - 1 ? { borderBottom: 'none' } : null),
                    ...(divider && i > 0 ? { borderLeft: divider } : null),
                  }}
                >
                  {c.render ? c.render(row, r) : (row[c.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
