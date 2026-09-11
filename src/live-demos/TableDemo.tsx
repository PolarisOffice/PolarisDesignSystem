'use client';

import { Table } from '@polarisoffice/pds-react';

/** 가이드 견본용 — Figma 는 헤더 '제목' + 데이터 '내용' 3×3 을 보여준다 */
type Row = { a: string; b: string; c: string };

const ROWS: Row[] = [
  { a: '내용', b: '내용', c: '내용' },
  { a: '내용', b: '내용', c: '내용' },
];

export default function TableDemo() {
  return (
    <Table<Row>
      columns={[
        { key: 'a', header: '제목' },
        { key: 'b', header: '제목' },
        { key: 'c', header: '제목' },
      ]}
      rows={ROWS}
    />
  );
}
