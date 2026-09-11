import type { Metadata } from 'next';
import { H2 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import SpecTable from '@/components/docs/SpecTable';
import { pageMeta } from '@/lib/docs/pages';
import { ANIMATION_PATTERNS, DURATION_TOKENS, EASING_TOKENS, REDUCED_MOTION_RULES } from './motion.data';
import s from './motion.module.css';

const meta = pageMeta('/foundation/motion')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/**
 * Easing 곡선 미리보기 — 원본은 cubic-bezier 텍스트뿐이라 정적 SVG 로 곡선을 재현했다.
 * (정적이므로 prefers-reduced-motion 처리 불필요 — 이 페이지가 설명하는 원칙 그대로.)
 * 좌표계: 40×40 뷰박스 안 4~36 구간이 단위 정사각형. 좌하단 (4,36)=진행 0, 우상단 (36,4)=진행 1.
 */
function EasingCurve({ bezier }: { bezier: [number, number, number, number] }) {
  const [x1, y1, x2, y2] = bezier;
  const px = (v: number) => 4 + v * 32;
  const py = (v: number) => 36 - v * 32;
  const d = `M 4 36 C ${px(x1)} ${py(y1)}, ${px(x2)} ${py(y2)}, 36 4`;
  return (
    <svg className={s.curveSvg} width={40} height={40} viewBox="0 0 40 40" aria-hidden="true">
      <line x1={4} y1={36} x2={36} y2={4} stroke="var(--color-line-neutral)" strokeWidth={1} />
      <path d={d} fill="none" stroke="var(--color-accent-normal)" strokeWidth={2} strokeLinecap="round" />
      <circle cx={4} cy={36} r={2.5} fill="var(--color-label-alternative)" />
      <circle cx={36} cy={4} r={2.5} fill="var(--color-accent-normal)" />
    </svg>
  );
}

/** 원본: PDS `docs/foundation/motion.md` */
export default function MotionPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        애니메이션은 기능적으로만 사용해요. 상태 변환 확인과 주의 안내가 목적이며 지연·장식은 피해요.
        인터랙티브 요소는 fast(150ms)로 즉시감을, 오버레이는 slow(350ms)로 안정감을 줘요.
        prefers-reduced-motion: reduce 설정 시 모든 transform 애니메이션을 disable하고 opacity 전환만
        유지해요.
      </PageLead>

      <H2>원칙</H2>
      <p>
        생산성 도구에서 과도한 애니메이션은 인지 부하를 만들어요. 모든 인터랙티브 전환은 즉시감을 위해
        fast(150ms)에 맞추고, 모달·토스트 같은 오버레이는 차분한 안정감을 위해 slow(350ms)를 써요.
        페이지 전환은 지연 없이 즉시 렌더링해요.
      </p>

      <H2>Duration tokens</H2>
      <SpecTable
        caption="Duration 토큰"
        columns={[
          { key: 'token', header: 'Token', width: '28%' },
          { key: 'value', header: '값', width: '22%' },
          { key: 'usage', header: '사용 예시', width: '50%' },
        ]}
        rows={DURATION_TOKENS.map((t) => ({
          token: <span className={s.token}>{t.token}</span>,
          value: <span className={s.val}>{t.value}</span>,
          usage: t.usage,
        }))}
      />

      <H2>Easing tokens</H2>
      <SpecTable
        caption="Easing 토큰"
        columns={[
          { key: 'token', header: 'Token', width: '24%' },
          { key: 'preview', header: '', width: '12%' },
          { key: 'curve', header: 'curve', width: '36%' },
          { key: 'usage', header: '사용 예시', width: '28%' },
        ]}
        rows={EASING_TOKENS.map((t) => ({
          token: <span className={s.token}>{t.token}</span>,
          preview: <EasingCurve bezier={t.bezier} />,
          curve: <span className={s.curve}>{t.curve}</span>,
          usage: t.usage,
        }))}
      />

      <H2>Animation Patterns</H2>
      <SpecTable
        caption="컴포넌트별 애니메이션 패턴"
        columns={[
          { key: 'component', header: 'Component', width: '18%' },
          { key: 'transition', header: 'Transition', width: '52%' },
          { key: 'notes', header: 'Notes', width: '30%' },
        ]}
        rows={ANIMATION_PATTERNS.map((p) => ({
          component: <span className={s.token}>{p.component}</span>,
          transition: (
            <>
              <div className={s.transition}>Enter · {p.enter}</div>
              {/* 원본의 `Exit &nbsp;·` — nbsp 로 Enter 줄과 '·' 위치를 맞춘다 */}
              <div className={s.transition}>Exit {' '}· {p.exit}</div>
            </>
          ),
          notes: p.notes,
        }))}
      />

      <H2>Reduced Motion</H2>
      <SpecTable
        caption="prefers-reduced-motion: reduce 시 동작"
        columns={[
          { key: 'token', header: 'Token', width: '20%' },
          { key: 'action', header: '동작', width: '40%' },
          { key: 'effect', header: '효과', width: '40%' },
        ]}
        rows={REDUCED_MOTION_RULES.map((r) => ({
          token: <span className={s.token}>{r.token}</span>,
          action: r.action,
          effect: r.effect,
        }))}
      />
    </>
  );
}
