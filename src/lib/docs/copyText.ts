/**
 * 클립보드 복사 — clipboard API 는 secure context 전용이라 사내 http 배포(192.168.*)에서
 * 실패한다. execCommand 폴백까지 합쳐 성공 여부를 돌려준다 (AnchorLink·CodePanel 공용).
 */
export async function copyText(text: string): Promise<boolean> {
  if (window.isSecureContext && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* 권한 거부 등 — 폴백으로 진행 */
    }
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}
