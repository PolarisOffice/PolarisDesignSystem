'use client';

import type { ReactNode } from 'react';
import { Button, DownloadIcon, Tooltip } from '@polarisoffice/pds-react';
import { withBase } from '@/lib/basePath';

/**
 * 파일 다운로드 CTA — 시스템 Button(variant="default") 사용 (2026-08-24 피드백:
 * 손으로 그린 .btn 대신 실제 PDS 컴포넌트).
 *
 * pds Button 은 `<button>` 전용(href 폴리모피즘 없음 — 패키지 API 는 Figma 스펙을 따라
 * 최소로 유지)이라, 앵커 대신 프로그램 다운로드로 연결한다. download 앵커를 즉석 생성하는
 * 표준 패턴 — 새 탭 열림 없이 저장만 트리거된다.
 *
 * tooltip 을 주면 시스템 Tooltip(hover·focus)으로 보조 설명 한 줄을 띄운다 — 색 공간처럼
 * 라벨에 다 담기 힘든 용도 안내용 (2026-08-24 로고 매체별 전체 다운로드).
 *
 * comingSoon 을 주면 파일이 아직 공개 전인 상태 — 버튼을 비활성(disabled)으로 두고, 마우스를 올리면
 * 그 문구를 툴팁으로 띄운다(2026-09-04 로고 가이드 PDF 잠금, 시안 A). href 는 데이터에 유지하고
 * 공개되면 이 prop 만 걷어내면 원래 다운로드로 돌아온다.
 * ⚠️ disabled 버튼은 브라우저에 따라 마우스 이벤트를 삼켜 부모(Tooltip 래퍼)의 hover 가 안 잡힌다 —
 * 버튼에 pointer-events:none 을 줘서 hover 가 래퍼 span 에 직접 닿게 한다. 키보드 포커스는 disabled 라
 * 불가능하므로 툴팁은 포인터 전용이고, 잠금 이유는 툴팁 외 경로로는 전달되지 않는다(선택 시 인지한 한계).
 */
export default function DownloadButton({
  href,
  tooltip,
  icon = false,
  comingSoon,
  children,
}: {
  href: string;
  /** 보조 설명 한 줄 — 시스템 Tooltip 규칙대로 링크·버튼 금지 */
  tooltip?: string;
  /** 왼쪽 다운로드 아이콘 — 페이지 타이틀 옆 등 CTA 성격이 강한 자리에서만 켠다 (기본 없음) */
  icon?: boolean;
  /** 공개 전 안내 문구 — 있으면 버튼이 비활성이 되고 hover 시 이 문구가 툴팁으로 뜬다 (tooltip 보다 우선) */
  comingSoon?: string;
  children: ReactNode;
}) {
  const locked = Boolean(comingSoon);
  const button = (
    <Button
      variant="default"
      size={40}
      leftIcon={icon ? <DownloadIcon /> : undefined}
      disabled={locked}
      style={locked ? { pointerEvents: 'none' } : undefined}
      onClick={() => {
        const a = document.createElement('a');
        a.href = withBase(href);
        a.download = '';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }}
    >
      {children}
    </Button>
  );
  const tip = comingSoon ?? tooltip;
  if (!tip) return button;
  return (
    // showDelay 기본(600ms)은 "안 뜬다"로 읽힌다(2026-08-24 실사용 보고) — 안내성 툴팁이라 150ms
    <Tooltip content={tip} placement="bottom" showDelay={150}>
      {button}
    </Tooltip>
  );
}
