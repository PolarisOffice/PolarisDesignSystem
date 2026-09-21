import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';

import { TwoBtnDemo, OneBtnDemo, CloseXDemo, DontShowAgainDemo } from './popup.demo';

const IMPORT = `import { Popup, Button } from '${PDS_PACKAGE}';`;

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'two-btn',
    title: 'TWO BTN',
    desc: '되돌릴 수 없는 액션 전 확인. 취소 수단을 두고 오른쪽에 주요 CTA 를 놓아요.',
    previewName: 'Popup',
    preview: (
      <DemoRow>
        <TwoBtnDemo />
      </DemoRow>
    ),
    code: `${IMPORT}
import { useState } from 'react';

const [open, setOpen] = useState(false);
const close = () => setOpen(false);
const remove = () => { /* 삭제 처리 */ close(); };

<Button variant="delete" onClick={() => setOpen(true)}>삭제</Button>

<Popup
  open={open}
  onClose={close}
  title="정말 삭제할까요?"
  footer={
    <>
      <Button variant="default" onClick={close}>취소</Button>
      <Button variant="delete" onClick={remove}>삭제</Button>
    </>
  }
>
  삭제된 데이터는 복구할 수 없습니다.
</Popup>`,
  },
  {
    id: 'one-btn',
    title: 'ONE BTN',
    desc: "반드시 인지해야 하는 정보 전달. '닫기'/'확인' 레이블이면 X 버튼은 넣지 않아요.",
    previewName: 'Popup',
    preview: (
      <DemoRow>
        <OneBtnDemo />
      </DemoRow>
    ),
    code: `${IMPORT}

<Popup
  open={open}
  onClose={close}
  title="서비스 점검 안내"
  footer={<Button variant="primary" onClick={close}>확인</Button>}
>
  6월 30일 02:00–04:00 서비스 점검이 예정되어 있습니다.
</Popup>`,
  },
  {
    id: 'close-x',
    title: 'Close (X)',
    desc: "버튼 레이블이 '닫기'가 아닌 다른 액션일 때만 X 를 켜요.",
    previewName: 'Popup',
    preview: (
      <DemoRow>
        <CloseXDemo />
      </DemoRow>
    ),
    code: `${IMPORT}

<Popup
  open={open}
  onClose={close}
  closable
  title="Title"
  footer={<Button variant="primary">하러가기</Button>}
>
  Body 내용이 들어가는 영역입니다.
</Popup>`,
  },
  {
    id: 'dont-show-again',
    title: '다시 보지 않기',
    desc: '정보성 팝업에만 제공해요. 이 옵션이 있으면 X 버튼도 함께 필요해요.',
    previewName: 'Popup',
    preview: (
      <DemoRow>
        <DontShowAgainDemo />
      </DemoRow>
    ),
    code: `${IMPORT}

<Popup
  open={open}
  onClose={close}
  closable
  title="Title"
  dontShowAgain
  onDontShowAgainChange={setSkip}
  footer={<Button variant="primary">확인</Button>}
>
  Body 내용이 들어가는 영역입니다.
</Popup>`,
  },
];

export default function PopupCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}
