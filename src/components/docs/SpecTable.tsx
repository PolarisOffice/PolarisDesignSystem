import type { ReactNode } from 'react';
import s from './SpecTable.module.css';

export interface SpecColumn {
  /** rows 의 키 */
  key: string;
  header: ReactNode;
  /** 컬럼 폭 — 원본의 `<th style="width:18%">` 을 대체한다(<colgroup> 으로 렌더) */
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export type SpecRow = Record<string, ReactNode>;

interface SpecTableProps {
  columns: SpecColumn[];
  rows: SpecRow[];
  /** 스크린리더용 표 설명 */
  caption?: string;
}

/**
 * PDS 문서의 스펙 표 — 원본 9개 래퍼 이름을 하나로 흡수한다(SpecTable.module.css 주석 참고).
 *
 * 컬럼 폭은 `columns[].width` → `<colgroup>` 으로 나간다. 원본은 이걸 `<th style="width:…">`
 * 로 120여 곳에 인라인으로 박아 두었는데, 그것만으로 전체 인라인 스타일의 ~13% 였다.
 */
export default function SpecTable({ columns, rows, caption }: SpecTableProps) {
  const alignClass = (a?: SpecColumn['align']) =>
    a === 'center' ? s.alignCenter : a === 'right' ? s.alignRight : undefined;

  return (
    <div className={s.outer}>
      <table className={s.table}>
        {caption && <caption className="sr-only">{caption}</caption>}
        {columns.some((c) => c.width) && (
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={c.width ? { width: c.width } : undefined} />
            ))}
          </colgroup>
        )}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={alignClass(c.align)} scope="col">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} className={alignClass(c.align)}>
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 토큰명 칩 — 원본 `.spec-token` (181회) */
export function SpecToken({ children }: { children: ReactNode }) {
  return <code className={s.token}>{children}</code>;
}

/** 값 칩(hex·px) — 원본 `.spec-val` (325회). 문서에서 가장 많이 쓰이는 인라인 요소 */
export function SpecVal({ children }: { children: ReactNode }) {
  return <code className={s.val}>{children}</code>;
}
