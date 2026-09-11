'use client';

import { useState } from 'react';

import { Checkbox, Radio, SegmentControl, Tabs, Toggle } from '@polarisoffice/pds-react';

const row = { display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' } as const;

/** Figma: Status = off / on, 그리고 라벨이 든 넓은 변형 */
export function ToggleDemo() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  const [c, setC] = useState(true);
  return (
    <div style={row}>
      <Toggle checked={a} onChange={setA} aria-label="기본 토글" />
      <Toggle checked={b} onChange={setB} aria-label="켜진 토글" />
      <Toggle checked={c} onChange={setC} label="Text" aria-label="라벨 토글" />
      <Toggle checked={false} onChange={() => {}} disabled aria-label="비활성 토글" />
    </div>
  );
}

/** Figma: status = unchecked / checked / indeterminate + disabled */
export function CheckboxDemo() {
  const [on, setOn] = useState(false);
  return (
    <div style={row}>
      <Checkbox checked={on} onChange={setOn} />
      <Checkbox checked />
      <Checkbox indeterminate />
      <Checkbox checked disabled />
      <Checkbox checked={on} onChange={setOn} label="Text" />
    </div>
  );
}

/** Figma: status = default / blue / purple */
export function RadioDemo() {
  const [v, setV] = useState('a');
  return (
    <div style={row}>
      <Radio name="demo" value="a" checked={v === 'a'} onChange={() => setV('a')} />
      <Radio name="demo" value="b" checked={v === 'b'} onChange={() => setV('b')} />
      <Radio name="demo2" value="c" checked tone="ai" onChange={() => {}} />
      <Radio name="demo3" value="d" checked disabled onChange={() => {}} />
      <Radio name="demo" value="e" checked={v === 'e'} onChange={() => setV('e')} label="Text" />
    </div>
  );
}

/** Figma: Type = Primary / Secondary × Status = Default / hover / Active */
export function TabDemo() {
  const [p, setP] = useState('a');
  const [s, setS] = useState('a');
  const items = [
    { value: 'a', label: 'Text' },
    { value: 'b', label: 'Text' },
    { value: 'c', label: 'Text' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--color-label-assistive, #9ea4aa)', marginBottom: 6 }}>Primary</div>
        <Tabs items={items} value={p} onChange={setP} variant="primary" />
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--color-label-assistive, #9ea4aa)', marginBottom: 6 }}>Secondary</div>
        <Tabs items={items} value={s} onChange={setS} variant="secondary" />
      </div>
    </div>
  );
}

/** Figma: Type = solid-round / Primary / secondary × Status */
export function SegmentDemo() {
  const [a, setA] = useState('a');
  const [b, setB] = useState('a');
  const [c, setC] = useState('a');
  const plain = [
    { value: 'a', label: 'Text', count: 'num' },
    { value: 'b', label: 'Text', count: 'num' },
  ];
  const boxed = [
    { value: 'a', label: 'Text' },
    { value: 'b', label: 'Text' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={row}>
        <span style={{ fontSize: 12, color: 'var(--color-label-assistive, #9ea4aa)', width: 64 }}>pill</span>
        <SegmentControl items={plain} value={a} onChange={setA} variant="pill" />
      </div>
      <div style={row}>
        <span style={{ fontSize: 12, color: 'var(--color-label-assistive, #9ea4aa)', width: 64 }}>filled</span>
        <SegmentControl items={boxed} value={b} onChange={setB} variant="filled" />
      </div>
      <div style={row}>
        <span style={{ fontSize: 12, color: 'var(--color-label-assistive, #9ea4aa)', width: 64 }}>outlined</span>
        <SegmentControl items={boxed} value={c} onChange={setC} variant="outlined" />
      </div>
    </div>
  );
}
