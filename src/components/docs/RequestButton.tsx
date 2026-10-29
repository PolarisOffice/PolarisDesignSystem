'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { Button, Popup, toast } from '@polarisoffice/pds-react';
import { IS_EMBED } from '@/lib/basePath';
import { pageMeta } from '@/lib/docs/pages';
import {
  GENERAL_CONTACT,
  PUBLIC_SITE_URL,
  REQUEST_CARD_MAX_BYTES,
  REQUEST_CONTENT_MAX,
  REQUEST_IMAGE_FILE_MAX,
  REQUEST_IMAGE_TYPES,
  REQUEST_TYPES,
  type RequestType,
} from '@/lib/hosting';
import s from './RequestButton.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IMAGE_TOO_BIG = '이미지가 커서 줄였는데도 보낼 수 없어요.';
const IMAGE_BROKEN = '이미지를 열 수 없어요. 다른 파일로 해 주세요.';
/** api/request buildMessage 에서 입력값을 뺀 카드 고정 부분의 크기(Image 칸 포함 실측 약 1.1KB) + 여유 */
const CARD_BASE_BYTES = 2048;
/** 긴 변(px) × JPEG 품질 순서로 낮춰 가며 카드 한도 안에 드는 첫 결과를 쓴다 */
const IMAGE_SIDES = [1024, 800, 640, 512, 400, 320];
// 글자 많은 전체 화면 스크린샷 실측: 400px·0.7 = 24KB, 512px·0.3 = 21KB — 같은 크기면 품질을 먼저 낮춰 더 크게 남긴다
const IMAGE_QUALITIES = [0.7, 0.55, 0.4, 0.3];

const utf8Bytes = (v: string) => new TextEncoder().encode(v).length;

function checkImage(file: File): string {
  if (!REQUEST_IMAGE_TYPES.includes(file.type)) return 'PNG, JPG, WEBP 이미지만 첨부할 수 있어요.';
  if (file.size > REQUEST_IMAGE_FILE_MAX) return '10MB보다 작은 이미지만 첨부할 수 있어요.';
  return '';
}

/**
 * 첨부 이미지를 canvas 로 다시 그려 JPEG data URI 로 — 다시 그리면 촬영 위치 같은 메타데이터도 빠진다.
 * budget(글자 수 = 바이트, base64 는 ASCII) 안에 들 때까지 줄이고, 가장 작게 해도 넘으면 null.
 */
async function shrinkToJpeg(file: File, budget: number): Promise<string | null> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    let lastWidth = 0;
    for (const side of IMAGE_SIDES) {
      const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * scale));
      if (width === lastWidth) continue; // 원본이 작으면 같은 크기를 다시 그리지 않는다
      lastWidth = width;
      canvas.width = width;
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      ctx.fillStyle = '#fff'; // 투명한 PNG 가 JPEG 에서 검게 바뀌지 않게
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      for (const quality of IMAGE_QUALITIES) {
        const uri = canvas.toDataURL('image/jpeg', quality);
        if (uri.length <= budget) return uri;
      }
    }
    return null;
  } finally {
    bitmap.close();
  }
}
const COPY: Record<RequestType, { placeholder: string; sub: (page: string) => string }> = {
  improve: { placeholder: '어떤 점이 아쉬웠나요?', sub: (page) => `${page} 페이지` },
  suggest: {
    placeholder: '예: 설정 화면에 쓸 목록 컴포넌트가 필요해요.\n예: 다크 모드에서 표 글자가 흐려요.',
    sub: () => '필요한 컴포넌트, 고칠 점, 새 아이디어 무엇이든 알려 주세요.',
  },
};

/**
 * 요청 버튼 + 팝업 — 페이지 제목 옆 "개선 요청"(layout), 사이드바 맨 아래 "요청·제안하기"(Sidebar).
 * 입력은 내용·이메일(선택)·이미지 1장(선택)이고 어느 페이지에서 보냈는지는 자동으로 붙는다. 보내면 팝업을 닫고 토스트만.
 * 이미지는 파일 선택·붙여넣기·끌어다 놓기로 받고, 보낼 때 카드 한도(Teams 약 28KB) 안에 들도록 줄여 data URI 로 싣는다.
 *
 * 팝업은 PDS Popup 이라 본문이 `<p>` 안에 들어간다 — 그래서 본문엔 phrasing 요소(textarea·input·span)만 둔다.
 * 닫아도 쓰던 내용은 남긴다(딤을 잘못 눌러 날아가지 않게). 비우는 건 보낸 뒤뿐이다.
 * PAX 동봉본(IS_EMBED)엔 API 가 없어 공개 사이트의 같은 페이지를 `?request=<type>` 으로 새 탭에 연다.
 */
export default function RequestButton({ type, className, children }: { type: RequestType; className?: string; children: ReactNode }) {
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  /** 스팸 막이(honeypot) — 사람은 못 보는 칸. 채워져 오면 서버가 보내지 않고 성공처럼 답한다 */
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'fallback'>('idle');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  const attach = (file?: File) => {
    if (!file) return;
    const problem = checkImage(file);
    setError(problem);
    if (!problem) setImageFile(file);
  };

  useEffect(() => {
    if (!imageFile) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // 팝업이 열려 있는 동안 이미지 붙여넣기·끌어다 놓기를 받는다. 끌어다 놓은 파일이 브라우저 탭을 바꾸지 않게 막는다.
  // 글자가 함께 있는 붙여넣기(엑셀 셀 등)는 그대로 글로 넣는다
  useEffect(() => {
    if (!open) return;
    const onPaste = (e: ClipboardEvent) => {
      const data = e.clipboardData;
      if (!data || data.types.includes('text/plain')) return;
      const file = Array.from(data.files).find((f) => f.type.startsWith('image/'));
      if (!file) return;
      e.preventDefault();
      attach(file);
    };
    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) e.preventDefault();
    };
    const onDrop = (e: DragEvent) => {
      const file = e.dataTransfer?.files[0];
      if (!file) return;
      e.preventDefault();
      attach(file);
    };
    window.addEventListener('paste', onPaste);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('paste', onPaste);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, [open]);

  // 동봉본·외부 링크가 ?request=<type> 으로 열면 팝업을 바로 띄운다. 주소에서는 지워 새로고침 때 다시 뜨지 않게
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('request') !== type) return;
    url.searchParams.delete('request');
    window.history.replaceState(window.history.state, '', url);
    setOpen(true);
  }, [type]);

  const label = REQUEST_TYPES.find((t) => t.value === type)!.label;
  const pageTitle = pageMeta(pathname)?.title ?? pathname;

  if (IS_EMBED) {
    return (
      <a className={className} href={`${PUBLIC_SITE_URL}${pathname}?request=${type}`} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  const close = () => {
    setOpen(false);
    setError('');
    triggerRef.current?.focus();
  };

  const send = async () => {
    if (state === 'sending') return;
    if (!content.trim()) return setError('내용을 적어 주세요.');
    if (email.trim() && !EMAIL_RE.test(email.trim())) return setError('이메일 주소를 다시 확인해 주세요.');
    setError('');
    setState('sending');
    let image = '';
    if (imageFile) {
      // 서버 카드의 나머지 칸 크기를 빼고 남은 만큼이 이미지 몫 — 페이지 주소는 카드에 두 번(칸·버튼) 들어간다
      const pageUrl = `${window.location.origin}${pathname}`;
      const budget =
        REQUEST_CARD_MAX_BYTES -
        CARD_BASE_BYTES -
        utf8Bytes(JSON.stringify(content.trim())) -
        utf8Bytes(email.trim()) -
        utf8Bytes(pageTitle) -
        2 * utf8Bytes(pageUrl);
      try {
        image = (await shrinkToJpeg(imageFile, budget)) ?? '';
      } catch {
        setState('idle');
        return setError(IMAGE_BROKEN);
      }
      if (!image) {
        setState('idle');
        return setError(IMAGE_TOO_BIG);
      }
    }
    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content, email, page: pathname, website, ...(image && { image }) }),
      });
      if (res.ok) {
        setContent('');
        setImageFile(null);
        setState('idle');
        close();
        toast.success('보냈어요. 고마워요!');
      } else if (res.status === 400) {
        setState('idle');
        setError('입력한 내용을 다시 확인해 주세요.');
      } else if (res.status === 413 && image) {
        setState('idle');
        setError(IMAGE_TOO_BIG);
      } else {
        setState('fallback'); // 웹훅 미설정 503·전송 실패 502·429 — 메일로 대신 보내게 한다
      }
    } catch {
      setState('fallback');
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  };

  const mailto = () => {
    const page = `${window.location.origin}${pathname}`;
    const body = [
      content.trim(),
      '',
      `페이지: ${page}`,
      email.trim() && `이메일: ${email.trim()}`,
      imageFile && '(첨부할 이미지는 이 메일에 직접 붙여 주세요)',
    ]
      .filter((l) => l !== '' && l !== null)
      .join('\n');
    return `mailto:${GENERAL_CONTACT.email}?subject=${encodeURIComponent(`[PDS] ${label}`)}&body=${encodeURIComponent(body)}`;
  };

  const mac = typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent);

  return (
    <>
      <button ref={triggerRef} type="button" className={className} onClick={() => setOpen(true)} aria-haspopup="dialog">
        {children}
      </button>
      {open &&
        createPortal(
          <Popup
            open
            className={s.popup}
            title={label}
            onClose={close}
            footer={
              <>
                <Button variant="default" onClick={close}>
                  취소
                </Button>
                <Button onClick={send} loading={state === 'sending'}>
                  보내기
                </Button>
              </>
            }
          >
            <span className={s.sub}>{COPY[type].sub(pageTitle)}</span>
            <textarea
              className={error && !content.trim() ? `${s.textarea} ${s.invalid}` : s.textarea}
              aria-label={label}
              placeholder={COPY[type].placeholder}
              maxLength={REQUEST_CONTENT_MAX}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError('');
              }}
              onKeyDown={onKeyDown}
              autoFocus
            />
            <input
              className={s.input}
              type="email"
              aria-label="답 받을 이메일 (선택)"
              placeholder="답이 필요하면 이메일 (선택)"
              autoComplete="email"
              maxLength={100}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <span className={s.attach}>
              {preview ? (
                <>
                  <img
                    className={s.thumb}
                    src={preview}
                    alt="첨부한 이미지"
                    onError={() => {
                      setImageFile(null);
                      setError(IMAGE_BROKEN);
                    }}
                  />
                  <Button variant="default" size={24} onClick={() => setImageFile(null)}>
                    지우기
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="default" size={32} onClick={() => fileRef.current?.click()}>
                    이미지 첨부
                  </Button>
                  <span className={s.attachHint}>붙여넣거나 끌어다 놓아도 돼요</span>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept={REQUEST_IMAGE_TYPES.join(',')}
                hidden
                onChange={(e) => {
                  attach(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </span>
            <span className={s.attachNote}>첨부한 이미지는 저장하지 않고 팀즈 채널로만 전달해요.</span>
            <input
              className={s.trap}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            {error ? (
              <span className={s.error} role="alert">
                {error}
              </span>
            ) : state === 'fallback' ? (
              <span className={s.note} role="alert">
                지금은 바로 보낼 수 없어요. <a href={mailto()}>메일로 보내기</a>
              </span>
            ) : (
              <span className={s.hint}>{mac ? '⌘' : 'Ctrl'} Enter로 바로 보내기</span>
            )}
          </Popup>,
          document.body,
        )}
    </>
  );
}
