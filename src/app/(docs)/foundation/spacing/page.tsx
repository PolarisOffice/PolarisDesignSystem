import type { Metadata } from 'next';
import { H2 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import SpecTable from '@/components/docs/SpecTable';
import { pageMeta } from '@/lib/docs/pages';
import { SPACE_TOKENS, USAGE_GROUPS } from './spacing.data';
import s from './spacing.module.css';

const meta = pageMeta('/foundation/spacing')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/foundation/spacing.md` */
export default function SpacingPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        간격 시스템을 사용하면 페이지 레이아웃과 UI를 더 쉽게 만들 수 있어요. 일관되고 의도적인 간격
        시스템 사용은 최종 사용자에게 더욱 조화로운 경험을 제공해요.
        또한, 간격 시스템은 향후 반응형 디자인과 사용자 정의 가능한 UI 밀도를 위한 기반을 마련해 제품의
        전반적인 품질과 접근성을 높여 줘요.
      </PageLead>

      <H2>기본 단위</H2>
      <p>
        우리 간격 시스템은 <strong>4px를 기본 단위</strong>로 해요. 이 기본 단위는 간격의 크기를 결정하고
        제품 전체의 시각적 일관성을 보장해요. 4px 기본 단위를 기반으로 하는 간격 시스템의 주요 기반은
        간격 스케일이에요. 이 스케일은 UI 요소를 일관된 방식으로 배치하는 데 사용할 수 있는 제한된 공간 값
        집합이에요. 각 간격 값은 기본 단위의 정수 배수이며, 0px에서 64px까지의 범위로 다양한 레이아웃에서
        일관성을 유지하면서도 유연성을 제공해요. 다만 border-gap 등 미세 조정용으로 0.5단위(2px) 보조
        토큰 spacing-4xs를 예외적으로 제공해요.
      </p>

      <H2>Space token</H2>
      <p>
        4px 기본 단위는 Space token 시스템의 기반이 돼요. 모든 Space token은 시맨틱한 t-shirt 사이즈 명명
        규칙(spacing-&#123;size&#125;)을 따르며, 단계가 한 칸 커질수록 px 값이 커져요. 예를 들어,
        spacing-sm은 16px이며 한 단계 작은 spacing-xs는 12px, 한 단계 큰 spacing-md는 20px이에요.
      </p>
      <SpecTable
        columns={[
          { key: 'token', header: 'Token', width: '26%' },
          { key: 'base', header: '기본 단위 배수', width: '18%' },
          { key: 'rem', header: 'REM', width: '13%' },
          { key: 'px', header: 'px', width: '13%' },
          { key: 'example', header: 'Example', width: '30%' },
        ]}
        rows={SPACE_TOKENS.map((t) => ({
          token: <span className={s.tokenName}>{t.token}</span>,
          base: <span className={s.pxVal}>{t.base}</span>,
          rem: t.rem,
          px: t.px,
          example: t.swatch ? (
            <span className={s.swatch} style={{ width: t.swatch.w, height: t.swatch.h }} />
          ) : null,
        }))}
      />

      <H2>Usage</H2>
      <p>
        최상의 결과를 얻으려면 사용 사례마다 서로 다른 간격 단위 범위가 필요해요. 간격 단위는 세 가지
        크기 범위로 나눌 수 있어요.
      </p>
      {USAGE_GROUPS.map((g) => (
        <div key={g.title} className={s.usageGroup}>
          <div className={s.usageTitle}>{g.title}</div>
          <div className={s.usageRange}>{g.range}</div>
          <ul className={s.usageList}>
            {g.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
