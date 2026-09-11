import type { ReactNode } from 'react';

export interface PopupProps {
  /** 열림 상태. false 면 아무것도 그리지 않는다 */
  open?: boolean;
  /** 제목. 한 줄로 끝내고, 길어지면 본문으로 내린다 */
  title: ReactNode;
  /** 본문 — 무엇이 일어나는지 사실만 적는다 */
  children?: ReactNode;
  /**
   * 버튼 영역. 최대 2개까지만 넣는다 — 3개 이상이면 화면 설계를 다시 본다.
   * 개수에 따라 높이가 정해진다(하나 48px · 둘 45px, 디자인 스펙).
   */
  footer?: ReactNode;
  /**
   * 우상단 X. **버튼 레이블이 '닫기'가 아닐 때만** 켠다 — 확인 버튼이 곧
   * 닫기인 정보성 모달에는 두지 않는다(PDS 규칙). 버튼이 둘이면 취소 수단이
   * 이미 있으므로 무시된다.
   */
  /**

   * 우상단 X 버튼. **기본 꺼짐** — 버튼 레이블이 '닫기'/'확인' 이면 그 버튼이

   * 이미 닫는 수단이라 X 를 넣지 않는다. 레이블이 다른 액션일 때만 켠다.

   * 버튼이 둘이면 취소 수단이 이미 있어 켜도 그려지지 않는다.

   */

  closable?: boolean;
  /** 닫는 방법. Esc·딤 클릭이 여기 연결된다 */
  onClose?: () => void;
  /** '다시 보지 않기' 체크 상태. 넘기면 체크박스가 보인다 */
  dontShowAgain?: boolean;
  onDontShowAgainChange?: (checked: boolean) => void;
  /** 접근성 — 제목을 가리키는 id 를 직접 주고 싶을 때만 */
  id?: string;
  className?: string;
}
