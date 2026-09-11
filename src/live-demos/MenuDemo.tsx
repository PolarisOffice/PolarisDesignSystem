'use client';

import { useState } from 'react';

import { Menu, MenuItem } from '@polarisoffice/pds-react';

/**
 * 가이드 견본용 — Figma 는 MenuItem 을 Default·Hover·Selected 세 상태로 보여준다.
 * Hover 는 마우스를 올려야 보이므로 여기서는 컨테이너 안에 실제로 늘어놓는다.
 * 문구는 디자인대로 'Text'.
 */
export default function MenuDemo() {
  const [selected, setSelected] = useState('a');
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <Menu width={152}>
        <MenuItem label="Text" selected={selected === 'a'} onClick={() => setSelected('a')} />
        <MenuItem label="Text" selected={selected === 'b'} onClick={() => setSelected('b')} />
        <MenuItem label="Text" selected={selected === 'c'} onClick={() => setSelected('c')} />
        <MenuItem label="Text" hasSubmenu hideCheck />
        <MenuItem label="Text" disabled hideCheck />
      </Menu>
    </div>
  );
}
