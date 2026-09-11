'use client';

import { useState } from 'react';

import { Toast } from '@polarisoffice/pds-react';

import { demoTrigger } from './trigger';

/** 가이드 견본용 — Toast 는 화면 가장자리에 고정되므로 실제로 띄워 보여준다 */
export default function ToastDemo() {
  const [shown, setShown] = useState<null | 'success' | 'error'>(null);
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button type="button" style={demoTrigger} onClick={() => setShown('success')}>
        성공 알림 띄우기
      </button>
      <button type="button" style={demoTrigger} onClick={() => setShown('error')}>
        실패 알림 띄우기
      </button>
      {shown && (
        <Toast
          type={shown}
          message={
            shown === 'success'
              ? '성공 메세지를 전달하는 토스트 팝업입니다.'
              : '실패 메세지를 전달하는 토스트 팝업입니다.'
          }
          onClose={() => setShown(null)}
        />
      )}
    </div>
  );
}
