import type { Metadata } from 'next';
import { H2 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import PageTabs from '@/components/docs/PageTabs';
import { CardGrid, DocCard } from '@/components/docs/CardGrid';
import SpecTable, { SpecToken, SpecVal } from '@/components/docs/SpecTable';
import { pageMeta } from '@/lib/docs/pages';
import { AI_TOKENS, FORMAT_APPS, PLAN_COLORS, RELATED_DOCS, ROLE_CARDS } from './colors.data';
import { PaletteSection, RolesSection } from './roles-section';
import s from './colors.module.css';

const meta = pageMeta('/foundation/colors')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 토큰 var 로 칠한 칩 — hex 가 아니라 변수를 쓰므로 다크 모드에서 실제 값이 보인다 */
function Chip({ token, size }: { token: string; size?: 'lg' }) {
  return (
    <span
      className={size === 'lg' ? s.chipLg : s.chip}
      style={{ background: `var(${token})` }}
      aria-hidden="true"
    />
  );
}

/* ── Overview ── */
function Overview() {
  return (
    <>
      <H2>색상의 세 가지 책임</H2>
      <p>
        폴라리스는 Word·Sheet·Slide 를 아우르는 멀티 포맷 오피스 제품군이에요. 그래서 하나의 색상 체계가
        세 가지 맥락을 동시에 담당해요.
      </p>
      <div className={s.dutyList}>
        {ROLE_CARDS.map((card) => (
          <section key={card.num} className={s.duty}>
            <div className={s.dutyFig} aria-hidden="true">
              {card.chips.map((chip) => (
                <div key={chip.label} className={s.dutyChip}>
                  <Chip token={chip.token} size="lg" />
                  <span className={s.dutyChipLabel}>{chip.label}</span>
                </div>
              ))}
            </div>
            <div>
              <span className={s.dutyNum}>책임 {card.num}</span>
              {/* 카드 제목 — 목차·앵커 대상이 아니고 16px 라 h3(20px 급) 위계와 어긋나
                  헤딩에서 강등(2026-08-28 위계 통일). 시각은 .dutyTitle 그대로 */}
              <p className={s.dutyTitle}>{card.title}</p>
              <p className={s.dutyDesc}>{card.desc}</p>
            </div>
          </section>
        ))}
      </div>

      <H2>토큰 명명 규칙</H2>
      <p>
        토큰 이름은 <code>category / role / variant</code> 세 칸이에요. 예:{' '}
        <SpecToken>accent/brand/normal</SpecToken> → CSS 변수 <SpecToken>--color-accent-normal</SpecToken>
      </p>
      <SpecTable
        caption="토큰 명명 규칙"
        columns={[
          { key: 'part', header: '자리', width: '16%' },
          { key: 'mean', header: '의미', width: '36%' },
          { key: 'ex', header: '예', width: '48%' },
        ]}
        rows={[
          {
            part: <strong>Category</strong>,
            mean: '색상의 쓰임새',
            ex: 'label · accent · fill · line · background · layer · static · interaction',
          },
          { part: <strong>Role</strong>, mean: '세부 역할', ex: 'brand · action · ai · link · format/word · plan/pro' },
          { part: <strong>Variant</strong>, mean: '강도 단계', ex: 'neutral · normal · strong · inverse' },
          {
            part: <strong>State</strong>,
            mean: 'variant 뒤에 언더스코어로 붙는 상태',
            ex: (
              <>
                <SpecToken>accent/ai/ai_hover</SpecToken> · <SpecToken>accent/ai/ai_pressed</SpecToken>
              </>
            ),
          },
        ]}
      />

      <H2>Semantic → Primitive 계층</H2>
      <p>
        컴포넌트는 항상 Semantic 토큰만 참조하고, Semantic 은 내부에서 Primitive 를 var() 로 참조해요.
        리브랜딩과 다크 모드는 이 한 겹 아래에서만 바뀌어요.
      </p>
      <SpecTable
        caption="Semantic 과 Primitive 계층"
        columns={[
          { key: 'layer', header: '계층', width: '16%' },
          { key: 'desc', header: '설명', width: '52%' },
          { key: 'ex', header: '예', width: '32%' },
        ]}
        rows={[
          {
            layer: <strong>Semantic</strong>,
            desc: '역할 기반 색상. 컴포넌트와 UI 에 직접 적용하는 토큰이며, "이 색이 무엇을 의미하는가"로 참조해요.',
            ex: <SpecToken>--color-accent-normal</SpecToken>,
          },
          {
            layer: <strong>Primitive</strong>,
            desc: '팔레트 원시값. 색조·채도·명도로만 구성된 원시 색상이며 체계의 기반이지만 컴포넌트에는 직접 쓰지 않아요.',
            ex: <SpecToken>--primitive-po-blue-60</SpecToken>,
          },
        ]}
      />

      <H2>관련 문서</H2>
      <CardGrid>
        {RELATED_DOCS.map((doc) => (
          <DocCard key={doc.href} href={doc.href} name={doc.name} desc={doc.desc} />
        ))}
      </CardGrid>
    </>
  );
}

/**
 * ── Roles ──
 * width 는 헤딩 글자폭 기준 — 균등 분할(16%)이면 `hover‑adaptive`/`pressed‑adaptive`(줄바꿈
 * 없는 합성어, U+2011 논브레이킹 하이픈)가 표 우측 모서리에서 잘렸다(2026-08-25 피드백 실측:
 * 854px 표 기준 필요 113px vs 가용 89px). 앞 3열(칩+hex 한 줄, white-space: nowrap)은 16%로
 * 충분해 그대로 두고, 포맷 열(page.tsx 호출부)에서 14%로 양보한 폭을 뒤 2열에 얹었다.
 */
const FORMAT_STATES: { suffix: string; header: string; width: string; state?: 'Normal' | 'Hover' | 'Pressed' }[] = [
  { suffix: '', header: 'normal', width: '16%', state: 'Normal' },
  { suffix: '-hover', header: 'hover', width: '16%', state: 'Hover' },
  { suffix: '-pressed', header: 'pressed', width: '16%', state: 'Pressed' },
  { suffix: '-hover-adaptive', header: 'hover‑adaptive', width: '18%' },
  { suffix: '-pressed-adaptive', header: 'pressed‑adaptive', width: '20%' },
];

function Roles() {
  return (
    <>
      <p className={s.tabLead}>
        컴포넌트와 화면에 직접 쓰는 <strong>Semantic 토큰</strong> 전체예요. 이름이 곧 쓰임이라 &quot;이 색이
        무엇을 의미하는가&quot;로 참조하고, 값(hex)은 토큰 뒤에서 테마에 따라 바뀌어요.
      </p>
      <RolesSection />

      <H2>포맷 앱 색상</H2>
      <p>
        파일 포맷을 구분하거나 포맷별 화면을 표현할 때 사용해요. 포맷마다 주색과 인터랙션 상태(hover·pressed),
        다크 모드에서 회색톤으로 보정되는 <SpecToken>-adaptive</SpecToken> 2종을 합쳐 총 5토큰이에요.
      </p>
      <SpecTable
        caption="포맷 앱 색상 토큰"
        columns={[
          { key: 'app', header: '포맷', width: '14%' },
          ...FORMAT_STATES.map((st) => ({ key: st.suffix || 'normal', header: st.header, width: st.width })),
        ]}
        rows={FORMAT_APPS.map((app) => {
          const row: Record<string, React.ReactNode> = {
            app: (
              <>
                <strong>{app.name}</strong>
                <span className={s.cellSub} title={app.token}>
                  <SpecToken>{app.token}</SpecToken>
                </span>
              </>
            ),
          };
          for (const st of FORMAT_STATES) {
            const hex = st.state ? app.swatches.find((sw) => sw.state === st.state)?.hex : undefined;
            row[st.suffix || 'normal'] = (
              <span className={s.val} title={`${app.token}${st.suffix}`}>
                <Chip token={`${app.token}${st.suffix}`} />
                {hex && <SpecVal>{hex}</SpecVal>}
              </span>
            );
          }
          return row;
        })}
      />
      <p className={s.note}>
        *-adaptive 는 다크 모드에서만 회색톤으로 변환돼요. 우측 상단 테마 토글로 확인할 수 있어요.
      </p>

      <H2>구독 플랜 색상</H2>
      <p>
        요금제를 구분하는 색상이에요. 요금제 뱃지·업셀 UI·기능 잠금 상태에서 글자색{' '}
        <SpecToken>{'--color-plan-{name}'}</SpecToken> 과 10% 알파 배경{' '}
        <SpecToken>{'--color-plan-{name}-bg'}</SpecToken> 쌍으로 써요.
      </p>
      <SpecTable
        caption="구독 요금제 색상 토큰"
        columns={[
          { key: 'plan', header: '요금제', width: '16%' },
          { key: 'fg', header: '글자색', width: '46%' },
          { key: 'bg', header: '배경 (10%)', width: '38%' },
        ]}
        rows={PLAN_COLORS.map((plan) => ({
          plan: <strong>{plan.name}</strong>,
          fg: (
            <span className={s.val}>
              <Chip token={plan.token} /> <SpecToken>{plan.token}</SpecToken> <SpecVal>{plan.hex}</SpecVal>
            </span>
          ),
          bg: (
            <span className={s.val}>
              <Chip token={`${plan.token}-bg`} /> <SpecToken>{`${plan.token}-bg`}</SpecToken>{' '}
              <SpecVal>{plan.bg}</SpecVal>
            </span>
          ),
        }))}
      />

      <H2>AI 전용 색상</H2>
      <p>
        AI 기능과 상호작용을 표현하는 주요 컬러예요. 폴라리스에서 보라색 계열은 <strong>AI 기능에만</strong>{' '}
        사용해요. AI 어시스턴트, AI 생성 콘텐츠, AI 툴바에 <SpecToken>accent/ai</SpecToken> 토큰을 일관되게
        적용하면 사용자는 &quot;이 기능은 AI다&quot;를 색상만으로 즉시 인식해요. 다른 UI 요소에 보라색을
        임의로 사용하지 마세요.
      </p>
      <SpecTable
        caption="AI 전용 색상 토큰"
        columns={[
          { key: 'name', header: '토큰', width: '40%' },
          { key: 'value', header: '값', width: '18%' },
          { key: 'desc', header: '용도', width: '42%' },
        ]}
        rows={AI_TOKENS.map((t) => ({
          name: (
            <>
              <strong>{t.name}</strong>
              <span className={s.cellSub} title={t.token}>
                <SpecToken>{t.token}</SpecToken>
              </span>
            </>
          ),
          value: (
            <span className={s.val}>
              <Chip token={t.token} /> <SpecVal>{t.hex}</SpecVal>
            </span>
          ),
          desc: t.desc,
        }))}
      />
    </>
  );
}

/* ── Palette ── */
function Palette() {
  return (
    <>
      <p className={s.tabLead}>
        Semantic 토큰이 내부적으로 참조하는 <strong>Primitive 스케일</strong>이에요. 컴포넌트에는 Roles 탭의
        Semantic 토큰만 쓰고, 아래 hex 를 직접 하드코딩하지 마세요.
      </p>
      <PaletteSection />
    </>
  );
}

/**
 * 원본: PDS `docs/foundation/colors.md` + color-roles.md + color-palette.md 병합본.
 * 레이아웃은 seed-design.io/foundations/color 문법(2026-08-19) — Overview / Roles / Palette
 * 탭(탭별 목차) → 표와 스케일 그리드. 히어로 일러스트는 뺐고(피드백) 장식 배지·번호 카드 없음.
 */
export default function ColorsPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      {/* 2026-08-28 책임 03 교체(플랜→AI)에 맞춰 리드도 세 책임 나열로 정렬 — 플랜 토큰은
          Roles 탭에 남아 있으므로 리드에서만 뺀다 */}
      <PageLead>
        폴라리스 색상 시스템은 접근성을 바탕으로 UI 계층, 포맷 앱 아이덴티티, AI 기능을 하나의 체계로
        표현해요.
      </PageLead>

      <PageTabs
        tocScope="active"
        ariaLabel="컬러 문서 보기 전환"
        tabs={[
          { id: 'overview', label: 'Overview', content: <Overview /> },
          { id: 'roles', label: 'Roles', content: <Roles /> },
          { id: 'palette', label: 'Palette', content: <Palette /> },
        ]}
      />
    </>
  );
}
