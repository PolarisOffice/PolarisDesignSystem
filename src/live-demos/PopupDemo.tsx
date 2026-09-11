'use client';

import { useState } from 'react';

import { Button, Popup } from '@polarisoffice/pds-react';

import { demoTrigger } from './trigger';

/**
 * 가이드 견본용 Popup 데모 — 킷 셸 전용(패키지에 들어가지 않는다).
 *
 * Popup 은 화면을 덮는 것이 그 자체로 규칙이라, 타일 안에 정적으로 눕히면
 * 딤·차단·Esc 같은 진짜 성질이 보이지 않는다. 그래서 여는 버튼을 두고
 * **실제로 띄운다**.
 *
 * 케이스와 문구는 Figma `Component/Feedback → Popup` 을 그대로 따른다.
 */
type Case = 'one' | 'one-x' | 'one-dont' | 'two' | 'two-dont';

const CASES: Array<{ key: Case; label: string; note: string }> = [
  { key: 'one', label: 'ONE BTN', note: "버튼 레이블이 '닫기' 인 경우 & Alert과 같은 정보성 모달인 경우" },
  { key: 'one-x', label: 'ONE BTN + X BTN', note: "버튼 레이블이 '닫기' 가 아닌 경우 (ex.~하러가기)" },
  { key: 'one-dont', label: 'ONE BTN 다시보지않기 케이스', note: '' },
  { key: 'two', label: 'TWO BTN', note: '우측에 위계가 더 높은 CTA버튼을 배치한다.' },
  { key: 'two-dont', label: 'TWO BTN 다시보지않기 케이스', note: '' },
];

export default function PopupDemo() {
  const [open, setOpen] = useState<Case | null>(null);
  const [dont, setDont] = useState(false);
  const close = () => setOpen(null);

  const one = <Button variant="primary" size={48} onClick={close}>버튼</Button>;
  const two = (
    <>
      <Button variant="default" size={48} onClick={close}>버튼</Button>
      <Button variant="primary" size={48} onClick={close}>버튼</Button>
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {CASES.map((c) => (
        <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" style={{ ...demoTrigger, minWidth: 240 }} onClick={() => setOpen(c.key)}>
            {c.label}
          </button>
          {c.note && <span style={{ fontSize: 13, color: 'var(--color-label-assistive, #9ea4aa)' }}>{c.note}</span>}
        </div>
      ))}

      {/* 레이블이 '닫기' 라 X 를 두지 않는다 — 닫는 수단(Esc·딤)은 유지 */}
      {open === 'one' && (
        <Popup title="Title" onClose={close} closable={false} footer={one}>
          Body
        </Popup>
      )}
      {open === 'one-x' && (
        <Popup title="Title" onClose={close} footer={one}>
          Body
        </Popup>
      )}
      {open === 'one-dont' && (
        <Popup title="Title" onClose={close} footer={one} dontShowAgain={dont} onDontShowAgainChange={setDont}>
          Body
        </Popup>
      )}
      {open === 'two' && (
        <Popup title="Title" onClose={close} footer={two}>
          Body
        </Popup>
      )}
      {open === 'two-dont' && (
        <Popup title="Title" onClose={close} footer={two} dontShowAgain={dont} onDontShowAgainChange={setDont}>
          Body
        </Popup>
      )}
    </div>
  );
}
