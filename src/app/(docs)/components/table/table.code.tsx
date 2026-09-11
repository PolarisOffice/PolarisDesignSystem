import { Table, type TableColumn } from '@polarisoffice/pds-react';

import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { PDS_PACKAGE } from '@/lib/docs/package';

const IMPORT = `import { Table } from '${PDS_PACKAGE}';`;

// Figma 표 샘플과 같은 자리표시 문구 — 임의 문구를 넣지 않는다
type Row = { name: string; type: string; date: string };

const columns: TableColumn<Row>[] = [
  { key: 'name', header: '제목' },
  { key: 'type', header: '제목' },
  { key: 'date', header: '제목' },
];

const rows: Row[] = [
  { name: '내용', type: '내용', date: '내용' },
  { name: '내용', type: '내용', date: '내용' },
];

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'base',
    title: 'Base',
    desc: '헤더 행 + 데이터 행. 헤더는 항상 포함해 컨텍스트를 제공해요.',
    previewName: 'Table',
    preview: <Table columns={columns} rows={rows} />,
    code: `${IMPORT}

<Table
  columns={[
    { key: 'name', header: '제목' },
    { key: 'type', header: '제목' },
    { key: 'date', header: '제목' },
  ]}
  rows={[
    { name: '내용내용내용', type: '내용내용내용', date: '내용내용내용' },
    { name: '내용내용내용', type: '내용내용내용', date: '내용내용내용' },
  ]}
/>`,
  },
  {
    id: 'column-divider',
    title: 'Column Divider',
    desc: '열 수가 많거나 데이터 구분이 필요할 때만 켜요. 기본은 끔.',
    previewName: 'Table',
    preview: <Table columnDivider columns={columns} rows={rows} />,
    code: `${IMPORT}

<Table columnDivider columns={columns} rows={rows} />`,
  },
];

export default function TableCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
