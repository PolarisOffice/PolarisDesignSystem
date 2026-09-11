'use client';

import { toast, Button } from '@polarisoffice/pds-react';

import { TOAST_VARIANTS } from './toast.data';

/**
 * 토스트는 명령형 API 라 화면에 펼쳐 둘 대상이 없다 — 눌러서 띄워 보게 한다.
 * `Toaster` 는 첫 호출 때 자동 마운트되므로 페이지에 따로 심지 않는다.
 *
 * 데모 전체를 클라이언트 파일에 완결해 둔다 — 서버 컴포넌트에서 이벤트 핸들러를
 * prop 으로 넘길 수 없기 때문이다(RSC 경계).
 */
export function VariantDemo() {
  return (
    <>
      {TOAST_VARIANTS.map((v) => (
        <Button key={v.name} variant="gray" size={40} onClick={() => toast[v.name](v.usage)}>
          {v.label}
        </Button>
      ))}
    </>
  );
}

export function PositionDemo() {
  return (
    <>
      <Button
        variant="gray"
        size={40}
        onClick={() => toast.success('변경 사항이 저장되었습니다.', { position: 'top' })}
      >
        top
      </Button>
      <Button
        variant="gray"
        size={40}
        onClick={() => toast.error('파일 업로드에 실패했습니다.', { position: 'bottom' })}
      >
        bottom
      </Button>
    </>
  );
}

export function DurationDemo() {
  return (
    <Button
      variant="gray"
      size={40}
      onClick={() => toast.success('링크가 클립보드에 복사되었습니다.', { duration: 3000 })}
    >
      3,000ms
    </Button>
  );
}
