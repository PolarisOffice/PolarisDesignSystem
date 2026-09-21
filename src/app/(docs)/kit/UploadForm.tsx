'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import s from './kit.module.css';

interface Issue { layer?: string; path?: string; message: string }
/** 검증 계층 키 → 사람이 읽는 라벨 (서버 issues[].layer 는 내부 식별자) */
const LAYER_LABEL: Record<string, string> = { structure: '구조', security: '보안', tokens: '토큰', prose: '본문', code: '코드', frontmatter: '머리말' };
interface LintFinding { rule: string; severity: 'warning' | 'info'; path: string; message: string }
interface UploadOk {
  name: string; version: string; replaced: boolean;
  componentCount: number; resourceCount: number;
  compatNotes: string[]; lintReport: LintFinding[];
}

/** DESIGN.md 드롭/선택 → POST /api/upload. 실패 시 issues[] 인라인 표시. */
export default function UploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [token, setToken] = useState('');
  const [needsToken, setNeedsToken] = useState(false);
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<UploadOk | null>(null);

  const upload = async (file: File) => {
    if (!/\.md$/i.test(file.name)) { setError('md 파일만 올릴 수 있어요.'); setIssues(null); setSuccess(null); return; }
    setBusy(true); setIssues(null); setError(null); setSuccess(null);
    try {
      const content = await file.text();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch('/api/upload', { method: 'POST', headers, body: JSON.stringify({ content }) });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setNeedsToken(true);
        setError('이 서버에는 업로드 토큰이 설정돼 있어요. 토큰을 입력한 뒤 파일을 다시 선택해 주세요.');
        return;
      }
      if (!res.ok) {
        setIssues(Array.isArray(data.issues) ? data.issues : null);
        setError(typeof data.error === 'string' ? data.error : `업로드 실패 (HTTP ${res.status})`);
        return;
      }
      setSuccess({
        name: typeof data.name === 'string' ? data.name : '(이름 미상)',
        version: typeof data.version === 'string' ? data.version : '',
        replaced: data.replaced === true,
        componentCount: typeof data.componentCount === 'number' ? data.componentCount : 0,
        resourceCount: typeof data.resourceCount === 'number' ? data.resourceCount : 0,
        compatNotes: Array.isArray(data.compatNotes) ? data.compatNotes : [],
        lintReport: Array.isArray(data.lintReport) ? data.lintReport : [],
      });
      router.refresh();
    } catch {
      setError('업로드 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) void upload(file);
  };

  return (
    <div>
      {needsToken && (
        <div className={s.tokenRow}>
          <input
            type="password"
            aria-label="업로드 토큰 (DESIGN_KIT_TOKEN)"
            placeholder="DESIGN_KIT_TOKEN"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
      )}
      <div
        role="button"
        tabIndex={0}
        className={s.dropzone}
        data-over={over ? 'true' : undefined}
        data-busy={busy ? 'true' : undefined}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !busy) { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files?.[0]; if (f && !busy) void upload(f); }}
      >
        {/* 2026-09-21 재설계 — 점선 상자에 글만 있던 것을 아이콘 + 제목 + 힌트로. 영역 전체가 버튼(선택 알약은 뺐다) */}
        <svg className={s.dropIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 16V4M7 9l5-5 5 5" />
          <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        </svg>
        <span className={s.dropTitle}>{busy ? '올리는 중…' : 'DESIGN.md 를 여기에 놓으세요'}</span>
        <span className={s.dropHint}>
          검증을 통과하면 바로 발행돼요. getdesign.md 계열 <code>DESIGN.md</code> 도 그대로 올릴 수 있어요.
        </span>
        <input ref={inputRef} type="file" accept=".md" aria-label="DESIGN.md 파일 선택" onChange={onFile} disabled={busy} hidden />
      </div>

      {error && (
        <div className={`${s.notice} ${s.noticeError}`} role="alert">
          <strong>{error}</strong>
          {issues && issues.length > 0 && (
            <ul>
              {issues.map((it, i) => (
                <li key={i}>{it.layer ? `[${LAYER_LABEL[it.layer] ?? it.layer}] ` : ''}{it.path ? `${it.path}: ` : ''}{it.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {success && (
        <div className={`${s.notice} ${s.noticeSuccess}`} role="status" aria-live="polite">
          <strong>{success.replaced ? '재업로드 완료' : '업로드 완료'} — {success.name} v{success.version}</strong>{' '}
          (컴포넌트 {success.componentCount} · 리소스 {success.resourceCount})
          {success.compatNotes.length > 0 && (
            <ul>{success.compatNotes.map((n, i) => <li key={i}>{n}</li>)}</ul>
          )}
        </div>
      )}

      {success && success.lintReport.length > 0 && (
        <div className={`${s.notice} ${s.noticeWarn}`}>
          <strong>품질 진단 {success.lintReport.length}건 — 발행에는 영향 없어요 (참고용)</strong>
          <ul>
            {success.lintReport.map((f, i) => (
              <li key={i}>[{f.severity === 'warning' ? '주의' : '참고'}] <code>{f.path}</code> — {f.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
