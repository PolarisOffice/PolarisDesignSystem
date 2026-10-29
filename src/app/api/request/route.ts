/**
 * POST /api/request — 요청 팝업(components/docs/RequestButton — 개선 요청·요청·제안)을 팀즈 채널로 넘긴다. **저장하지 않는다.**
 * 순서: Host 허용목록(403) → same-origin(403) → 크기(413) → zod(400) → honeypot(조용히 200) → 카드 크기(413)
 *   → IP별 제한(429) → 웹훅 미설정(503 — 화면이 메일 대안을 띄운다) → Teams Workflows 웹훅 POST(8초, 실패 502)
 * 첨부 이미지는 팝업이 JPEG 로 다시 그려 줄인 data URI 를 카드에 그대로 넣는다(여기도 저장하지 않는다).
 *
 * env `PDS_REQUEST_WEBHOOK_URL` — 팀즈 채널 Workflows "Send webhook alerts to a channel" 주소(서버 전용 비밀값).
 * 주소에 서명이 들어 있어 로그에 남기지 않는다.
 */

import { z } from 'zod';
import { checkAllowedHost, hostForbidden, checkSameOrigin, crossOriginForbidden } from '@/lib/auth';
import {
  publicOrigin,
  REQUEST_TYPES,
  REQUEST_CONTENT_MAX,
  REQUEST_FROM_RE,
  REQUEST_CARD_MAX_BYTES,
  type RequestType,
} from '@/lib/hosting';
import { PDS_VERSION } from '@/lib/docs/changelog';
import { pageMeta } from '@/lib/docs/pages';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 내용 2,000자(UTF-8 최대 약 6KB) + 이미지 data URI(카드 한도 28KB 이하) + 나머지 칸
const BODY_MAX_BYTES = 48 * 1024;
const WEBHOOK_TIMEOUT_MS = 8000;
const WINDOW_MS = 10 * 60 * 1000;
const WINDOW_LIMIT = 5;

const text = (max: number) => z.string().trim().max(max).default('');

const JPEG_DATA_URI = /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/;
/** 팝업이 canvas 로 다시 그린 JPEG 만 받는다 — 접두사·base64 모양에 더해 디코드한 첫 바이트가 JPEG 시그니처(FF D8 FF)인지 본다 */
function isJpegDataUri(v: string): boolean {
  if (!JPEG_DATA_URI.test(v)) return false;
  const head = Buffer.from(v.slice(v.indexOf(',') + 1, v.indexOf(',') + 9), 'base64');
  return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
}
const Schema = z.object({
  type: z.enum(REQUEST_TYPES.map((t) => t.value) as [RequestType, ...RequestType[]]),
  content: z.string().trim().min(1).max(REQUEST_CONTENT_MAX),
  email: text(100).refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
  page: z.string().default('').refine((v) => !v || REQUEST_FROM_RE.test(v)),
  image: z.string().max(REQUEST_CARD_MAX_BYTES).default('').refine((v) => !v || isJpegDataUri(v)),
  /** honeypot — 사람은 못 보는 칸 */
  website: z.string().default(''),
});
type RequestBody = z.infer<typeof Schema>;

// ponytail: 인스턴스 메모리라 서버가 여럿이면 느슨하고 재시작하면 비워진다.
// 실제 방어선은 Vercel Firewall 의 /api/request 경로 rate limit 규칙(대시보드 설정, 코드 없음)이다.
const hits = new Map<string, number[]>();
function rateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  const limited = recent.length >= WINDOW_LIMIT;
  if (!limited) recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return limited;
}

/**
 * Adaptive Card — 사용자 입력은 전부 RichTextBlock 의 TextRun 에 넣는다. TextBlock·FactSet 은 마크다운을
 * 해석해서 `[공지](https://피싱)` 같은 위장 링크가 사내 채널에 그대로 살아난다. TextRun 은 글자 그대로 그린다.
 */
function buildMessage(d: RequestBody, origin: string) {
  const run = (value: string, style: Record<string, string> = {}) => ({ type: 'TextRun', text: value, ...style });
  const fact = (label: string, value: string) => ({
    type: 'RichTextBlock',
    spacing: 'Small',
    inlines: [run(`${label}  `, { weight: 'Bolder' }), run(value)],
  });
  const typeLabel = REQUEST_TYPES.find((t) => t.value === d.type)!.label;
  const pageUrl = d.page ? `${origin}${d.page}` : '';
  const pageTitle = d.page ? (pageMeta(d.page)?.title ?? d.page) : '';

  return {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        contentUrl: null,
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: '1.4',
          msteams: { width: 'Full' },
          body: [
            {
              type: 'RichTextBlock',
              inlines: [run(`[PDS] ${typeLabel}${d.type === 'improve' && pageTitle ? ` · ${pageTitle}` : ''}`, { size: 'Medium', weight: 'Bolder' })],
            },
            { type: 'RichTextBlock', spacing: 'Medium', inlines: [run(d.content)] },
            ...(d.image
              ? [{ type: 'Image', url: d.image, altText: '첨부한 이미지', spacing: 'Medium', msTeams: { allowExpand: true } }]
              : []),
            { ...fact('보낸 페이지', pageUrl || '알 수 없음'), separator: true },
            fact('답 받을 이메일', d.email || '남기지 않음'),
            fact('PDS 버전', PDS_VERSION),
          ],
          actions: pageUrl ? [{ type: 'Action.OpenUrl', title: '페이지 열기', url: pageUrl }] : [],
        },
      },
    ],
  };
}

export async function POST(req: Request) {
  if (!checkAllowedHost(req)) return hostForbidden();
  if (!checkSameOrigin(req)) return crossOriginForbidden();

  if (Number(req.headers.get('content-length') || 0) > BODY_MAX_BYTES) {
    return Response.json({ error: 'too_large' }, { status: 413 });
  }
  const raw = await req.text();
  if (Buffer.byteLength(raw, 'utf8') > BODY_MAX_BYTES) return Response.json({ error: 'too_large' }, { status: 413 });

  let parsed;
  try {
    parsed = Schema.safeParse(JSON.parse(raw));
  } catch {
    return Response.json({ error: 'invalid_request' }, { status: 400 });
  }
  if (!parsed.success) return Response.json({ error: 'invalid_request' }, { status: 400 });
  const data = parsed.data;

  // 봇 — 보낸 것처럼 답해서 다시 시도할 이유를 주지 않는다
  if (data.website) return Response.json({ ok: true });

  const payload = JSON.stringify(buildMessage(data, publicOrigin(req.headers)));
  if (Buffer.byteLength(payload, 'utf8') > REQUEST_CARD_MAX_BYTES) {
    return Response.json({ error: 'card_too_large' }, { status: 413 });
  }

  // Vercel 은 x-forwarded-for 를 실제 접속 IP 로 덮어쓴다(위조 불가). 로컬은 헤더가 없어 한 묶음으로 센다
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (rateLimited(ip)) {
    return Response.json({ error: 'rate_limited — 10분 동안 5번까지 보낼 수 있어요.' }, { status: 429 });
  }

  const webhook = process.env.PDS_REQUEST_WEBHOOK_URL?.trim();
  if (!webhook) return Response.json({ error: 'webhook_unset' }, { status: 503 });

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      redirect: 'error',
    });
    if (!res.ok) {
      console.warn(`[PDS] 요청 전달 실패 — 웹훅 HTTP ${res.status}`);
      return Response.json({ error: 'send_failed' }, { status: 502 });
    }
  } catch (e) {
    // 오류 객체에 웹훅 주소가 섞일 수 있어 이름만 남긴다
    console.warn(`[PDS] 요청 전달 실패 — ${e instanceof Error ? e.name : 'unknown'}`);
    return Response.json({ error: 'send_failed' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
