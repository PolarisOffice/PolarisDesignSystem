import type { Metadata } from 'next';
import { H2 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import SpecTable, { SpecToken } from '@/components/docs/SpecTable';
import { pageMeta } from '@/lib/docs/pages';
import {
  FONT_SIZE_ALIASES,
  FONT_WEIGHTS,
  LABEL_BUTTON_STYLES,
  RESPONSIVE_STYLES,
  TYPE_SCALE,
} from './typography.data';
import s from './typography.module.css';

const meta = pageMeta('/foundation/typography')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/foundation/typography.md` */
export default function TypographyPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        타이포그래피 시스템은 정보의 전달력을 높이고 UI의 일관성을 유지하는 역할을 해요.
        <br />
        글꼴, 크기, 두께, 간격, 계층 구조 등을 체계적으로 정의하면 가독성이 높아지고, 콘텐츠의 중요도에
        따른 시각적 위계를 효과적으로 표현할 수 있어요.
      </PageLead>

      {/* 섹션명은 서체 이름으로 표기한다 (2026-08-28 검토 — 구 브랜드›서체 페이지의
          "브랜드 서체→폴라리스 / 제품 서체→프리텐다드" 표기 원칙을 이관 적용).
          구 앵커 #글꼴 은 anchor-aliases 가 구제한다. */}
      <H2>프리텐다드</H2>
      <div className={s.previewBox}>
        <div className={s.previewText}>Pretendard 프리텐다드 プリテンダード</div>
      </div>
      <div className={s.weightSection}>
        <div className={s.weightLabel}>Font Weight</div>
        {FONT_WEIGHTS.map((w) => (
          <div key={w.weight} className={s.weightRow} style={{ fontWeight: w.weight }}>
            {w.label}
          </div>
        ))}
      </div>

      <H2>Font size</H2>
      <p>
        각 스타일은 <SpecToken>{'--typography-{style}-font-family'}</SpecToken> ·{' '}
        <SpecToken>{'-font-size'}</SpecToken> · <SpecToken>{'-line-height'}</SpecToken> 세 토큰으로
        제공돼요. font-size 는 뷰포트 768px 이하에서 모바일 값으로 자동 전환돼요(아래 Usage 표).
      </p>
      <SpecTable
        columns={[
          { key: 'style', header: 'Style', width: '30%' },
          { key: 'token', header: 'Token', width: '34%' },
          { key: 'size', header: 'Size', width: '12%' },
          { key: 'lh', header: 'Line-height', width: '12%' },
          { key: 'rem', header: 'rem', width: '12%' },
        ]}
        rows={TYPE_SCALE.map((t) => ({
          style: (
            <span className={s.scaleSample} style={{ fontSize: t.px, fontWeight: t.weight }}>
              {t.name}
            </span>
          ),
          token: <SpecToken>{`${t.token}-*`}</SpecToken>,
          size: `${t.px}px`,
          lh: t.lineHeight,
          rem: t.rem,
        }))}
      />

      <H2>Label Button</H2>
      <p>
        버튼 레이블 전용 스타일 2종이에요. 11단계 스케일과 달리 <strong>font-weight 토큰을
        포함</strong>해요. Button 컴포넌트가 이 스타일을 사용해요.
      </p>
      <SpecTable
        columns={[
          { key: 'style', header: 'Style', width: '24%' },
          { key: 'token', header: 'Token', width: '34%' },
          { key: 'spec', header: 'Spec', width: '18%' },
          { key: 'usage', header: '용도', width: '24%' },
        ]}
        rows={LABEL_BUTTON_STYLES.map((t) => ({
          style: (
            <span className={s.scaleSample} style={{ fontSize: t.px, fontWeight: t.weight }}>
              {t.name}
            </span>
          ),
          token: <SpecToken>{`${t.token}-*`}</SpecToken>,
          spec: `${t.px}px · ${t.weight} · ${t.lineHeight}`,
          usage: t.usage,
        }))}
      />

      <H2>Usage</H2>
      <div className={s.usageLabel}>Responsive Style</div>
      <div className={s.responsiveGrid}>
        {(['pc', 'mobile'] as const).map((device) => (
          <div key={device}>
            <div className={s.responsiveColLabel}>{device === 'pc' ? 'PC ver.' : 'Mobile ver.'}</div>
            {RESPONSIVE_STYLES.map((r) => (
              <div key={r.name} className={s.responsiveRow}>
                <span
                  className={s.responsiveStyleName}
                  style={{ fontSize: r.labelPx, fontWeight: r.labelWeight }}
                >
                  {r.name}
                </span>
                <span className={s.responsiveSize} style={{ fontSize: r.labelPx }}>
                  {device === 'pc' ? r.pc : r.mobile}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 브랜드 › 서체 페이지에 있던 '폰트 사이즈 토큰' 표 이관(2026-08-21) — 크기 토큰은 브랜드가
          아니라 타이포그래피 주제다. 옛 표는 4행(lg·md·sm·xs)뿐이었으나 정본 별칭 11개 전체로 넓혔다.
          '사용 예' 는 Button 스펙으로 확인된 행만 채운다 — 나머지는 비워 둔다(추정 금지) */}
      <div className={s.usageLabel} style={{ marginTop: 40 }}>
        호환 별칭 대응표
      </div>
      <p>
        컴포넌트 코드와 일부 문서는 아직 옛 이름 <SpecToken>{'--font-size-*'}</SpecToken> 를 써요. 전부
        정본 <SpecToken>{'--typography-{style}-font-size'}</SpecToken> 로 연결돼 있으니 같은 값이고, 새로
        쓸 땐 정본 이름을 쓰세요.
      </p>
      <SpecTable
        caption="폰트 사이즈 호환 별칭 대응표"
        columns={[
          { key: 'style', header: 'Style', width: '14%' },
          { key: 'token', header: '정본 토큰', width: '34%' },
          { key: 'size', header: 'PC / Mobile', width: '14%' },
          { key: 'legacy', header: '호환 별칭', width: '18%' },
          { key: 'usage', header: '사용 예', width: '20%' },
        ]}
        rows={FONT_SIZE_ALIASES.map((a) => {
          const scale = TYPE_SCALE.find((t) => t.name === a.style);
          const resp = RESPONSIVE_STYLES.find((r) => r.name === a.style);
          return {
            style: a.style,
            token: <SpecToken>{`${scale?.token ?? ''}-font-size`}</SpecToken>,
            size: resp ? `${resp.pc} / ${resp.mobile}` : scale ? `${scale.px}px` : '',
            legacy: <SpecToken>{a.legacy}</SpecToken>,
            usage: a.usage || '—',
          };
        })}
      />
    </>
  );
}
