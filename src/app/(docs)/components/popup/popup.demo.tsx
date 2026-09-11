'use client';

import { useState } from 'react';

import { Popup, Button } from '@polarisoffice/pds-react';

/**
 * 팝업은 화면 전체를 덮는 fixed 오버레이라 문서 안에 펼쳐 둘 수 없다 — 트리거로 열어 보게 한다.
 *
 * 데모는 각 예제별로 완결해 둔다. 서버 컴포넌트(`popup.code.tsx`)에서
 * 함수 prop 을 넘길 수 없기 때문이다(RSC 경계).
 */
function Trigger({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="gray" size={40} onClick={onClick}>
      {label}
    </Button>
  );
}

export function TwoBtnDemo() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Trigger label="삭제 확인 열기" onClick={() => setOpen(true)} />
      <Popup
        open={open}
        onClose={close}
        title="정말 삭제할까요?"
        footer={
          <>
            {/* Figma Web 변형의 보조 버튼은 Default(흰 배경 + line-neutral 보더) */}
            <Button variant="default" onClick={close}>
              취소
            </Button>
            <Button variant="delete" onClick={close}>
              삭제
            </Button>
          </>
        }
      >
        삭제된 데이터는 복구할 수 없습니다.
      </Popup>
    </>
  );
}

export function OneBtnDemo() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Trigger label="안내 팝업 열기" onClick={() => setOpen(true)} />
      <Popup
        open={open}
        onClose={close}
        title="서비스 점검 안내"
        footer={
          <Button variant="primary" onClick={close}>
            확인
          </Button>
        }
      >
        6월 30일 02:00–04:00 서비스 점검이 예정되어 있습니다.
      </Popup>
    </>
  );
}

export function CloseXDemo() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Trigger label="팝업 열기" onClick={() => setOpen(true)} />
      <Popup
        open={open}
        onClose={close}
        closable
        title="Title"
        footer={
          <Button variant="primary" onClick={close}>
            하러가기
          </Button>
        }
      >
        Body 내용이 들어가는 영역입니다.
      </Popup>
    </>
  );
}

export function DontShowAgainDemo() {
  const [open, setOpen] = useState(false);
  const [skip, setSkip] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Trigger label="팝업 열기" onClick={() => setOpen(true)} />
      <Popup
        open={open}
        onClose={close}
        closable
        title="Title"
        dontShowAgain={skip}
        onDontShowAgainChange={setSkip}
        footer={
          <Button variant="primary" onClick={close}>
            확인
          </Button>
        }
      >
        Body 내용이 들어가는 영역입니다.
      </Popup>
    </>
  );
}
