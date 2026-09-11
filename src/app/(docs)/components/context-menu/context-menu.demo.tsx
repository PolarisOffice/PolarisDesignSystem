'use client';

import { useState } from 'react';

import { Menu, MenuItem, MenuDivider } from '@polarisoffice/pds-react';

/**
 * 메뉴는 눌러서 고르는 물건이라 `selected` 를 고정해 두면 성질이 안 보인다 —
 * 실제로 골라지게 상태를 쥔다.
 *
 * 데모를 클라이언트 파일에 완결해 둔다 (서버 컴포넌트에서 이벤트 핸들러를
 * prop 으로 넘길 수 없다).
 */
const WIDTH = 200;

export function BaseDemo() {
  const [picked, setPicked] = useState(1);
  return (
    <div style={{ width: WIDTH }}>
      <Menu>
        {[0, 1, 2].map((i) => (
          <MenuItem key={i} selected={picked === i} onClick={() => setPicked(i)}>
            Text
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

/**
 * Figma `ContextMenu` 의 Scroll 축 case1 — 체크 슬롯 없이 레이블만.
 * 고르는 목록이 아니라 **실행 메뉴**(열기·이름 바꾸기 같은 동작)에 쓴다.
 * 폭 152 는 Figma 견본값이고, 실제로는 부모 폭을 채운다(base 는 fill).
 */
export function Case1Demo() {
  return (
    <div style={{ width: 152 }}>
      <Menu>
        {Array.from({ length: 7 }, (_, i) => (
          <MenuItem key={i} hideCheck onClick={() => {}}>
            Text
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

/**
 * case2 — 각 항목에 하위 메뉴 화살표. 체크 슬롯은 없다(고르는 목록이 아니다).
 * 화살표는 "여기서 더 들어간다" 는 신호라 실제 하위 메뉴가 있을 때만 붙인다.
 */
export function Case2Demo() {
  return (
    <div style={{ width: 152 }}>
      <Menu>
        {Array.from({ length: 7 }, (_, i) => (
          <MenuItem key={i} hideCheck hasSubmenu onClick={() => {}}>
            Text
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export function DividerDemo() {
  const [picked, setPicked] = useState(0);
  return (
    <div style={{ width: WIDTH }}>
      <Menu>
        <MenuItem selected={picked === 0} onClick={() => setPicked(0)}>
          Text
        </MenuItem>
        <MenuDivider />
        <MenuItem selected={picked === 1} onClick={() => setPicked(1)}>
          Text
        </MenuItem>
      </Menu>
    </div>
  );
}

export function ScrollDemo() {
  const [picked, setPicked] = useState(0);
  const items = Array.from({ length: 12 }, (_, i) => ({ id: i, label: `Text ${i + 1}` }));
  return (
    <div style={{ width: WIDTH }}>
      <Menu>
        {items.map((item) => (
          <MenuItem key={item.id} selected={picked === item.id} onClick={() => setPicked(item.id)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
