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
      <PageLead>4px 단위 간격 스케일이에요. 정해진 값만 쓰면 레이아웃이 일관되고 밀도 조절도 쉬워져요.</PageLead>

      <H2>기본 단위</H2>
      <p>
        <strong>4px가 기본 단위</strong>예요. 간격 값은 전부 4의 정수 배수로 0~64px 12단계만 써요. 예외로 미세
        조정용 2px(spacing-4xs)가 있어요.
      </p>

      <H2>Space token</H2>
      <p>
        이름은 t-shirt 사이즈(spacing-&#123;size&#125;)예요. spacing-sm이 16px, 한 단계 아래 xs가 12px, 위 md가
        20px.
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
      <p>쓰임에 따라 세 범위로 나눠요.</p>
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
