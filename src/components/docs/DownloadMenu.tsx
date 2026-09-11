'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button, DownloadIcon, Menu, MenuItem } from '@polarisoffice/pds-react';
import { withBase } from '@/lib/basePath';

/** download 앵커 즉석 생성 — 새 탭 없이 저장만 트리거 (DownloadButton 과 같은 패턴) */
function saveFile(href: string) {
  const a = document.createElement('a');
  a.href = withBase(href);
  a.download = '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const CHEVRON = (
  <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
    <path
      d="M1 2.5 L4 5.5 L7 2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface DownloadMenuItem {
  label: ReactNode;
  href: string;
}

/**
 * 여러 파일 중 하나를 골라 받는 드롭다운 CTA — 시스템 Button(트리거) + 시스템 Menu(선택지).
 * 카드 안(Po26Actions '화면용')·페이지 타이틀 옆(로고 '전체 다운로드') 양쪽에서 재사용
 * (2026-08-24 도입 → 2026-08-25 공용 컴포넌트로 추출).
 *
 * 메뉴는 **document.body 포털 + fixed 좌표**로 띄운다 — 카드·그리드 등 조상의 스태킹
 * 컨텍스트에 갇혀 이웃 요소 아래로 깔리는 것을 방지한다(2026-08-24 실사고). fixed 라 스크롤
 * 시 좌표가 낡으므로 스크롤·리사이즈에는 닫는다.
 */
export default function DownloadMenu({
  label,
  items,
  size = 40,
  variant = 'default',
  menuWidth = 160,
  icon = false,
}: {
  label: ReactNode;
  items: DownloadMenuItem[];
  size?: 24 | 32 | 40 | 48 | 54 | 64;
  variant?: 'primary' | 'default';
  menuWidth?: number;
  /** 왼쪽 다운로드 아이콘 — 페이지 타이틀 옆 등 CTA 성격이 강한 자리에서만 켠다 (기본 없음) */
  icon?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;
    // 메뉴 오른쪽 끝을 트리거 오른쪽 끝에 정렬
    setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const closeNow = () => setOpen(false);
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', closeNow, true);
    window.addEventListener('resize', closeNow);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', closeNow, true);
      window.removeEventListener('resize', closeNow);
    };
  }, [open]);

  return (
    <>
      <span ref={triggerRef} style={{ display: 'inline-flex' }}>
        <Button
          variant={variant}
          size={size}
          aria-haspopup="menu"
          aria-expanded={open}
          leftIcon={icon ? <DownloadIcon /> : undefined}
          rightIcon={CHEVRON}
          onClick={toggle}
        >
          {label}
        </Button>
      </span>
      {open &&
        pos &&
        createPortal(
          <div ref={menuRef} style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 1000 }}>
            <Menu width={menuWidth}>
              {items.map((it) => (
                <MenuItem
                  key={it.href}
                  label={it.label}
                  hideCheck
                  onClick={() => {
                    saveFile(it.href);
                    setOpen(false);
                  }}
                />
              ))}
            </Menu>
          </div>,
          document.body,
        )}
    </>
  );
}
