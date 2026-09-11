import type { Metadata } from 'next';
import { H2 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import SpecTable from '@/components/docs/SpecTable';
import { pageMeta } from '@/lib/docs/pages';
import { ELEVATION_LEVELS, SHADOW_TOKENS, Z_INDEX_TOKENS } from './elevation.data';
import s from './elevation.module.css';

const meta = pageMeta('/foundation/elevation')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/foundation/elevation.md` */
export default function ElevationPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        Polaris Office의 깊이감은 그림자보다 배경색 레이어링과 보더로 먼저 표현해요. 그림자는 떠 있는
        요소(드롭다운·모달·토스트)에만 사용해 인터페이스를 가볍고 스캔하기 쉽게 유지해요.
      </PageLead>

      <H2>원칙</H2>
      <p>
        Polaris Office의 깊이감은 background-color 레이어링·보더·그림자의 조합으로 표현해요. 정적
        콘텐츠는 배경색과 보더로 영역을 잡고, 카드부터는 그림자를 더해 위계를 명확히 해요. 떠 있는
        요소(드롭다운·모달·토스트)일수록 그림자가 강해지며, Dark mode에서는 alpha를 강화해 동일한 위계를
        유지해요.
      </p>

      <H2>Elevation Levels</H2>
      <SpecTable
        columns={[
          { key: 'level', header: 'Level', width: '20%' },
          { key: 'signal', header: '신호', width: '30%' },
          { key: 'usage', header: '사용처', width: '50%' },
        ]}
        rows={ELEVATION_LEVELS.map((l) => ({
          level: <span className={s.level}>{l.level}</span>,
          signal: l.mono ? <span className={s.signal}>{l.signal}</span> : l.signal,
          usage: l.usage,
        }))}
      />

      <H2>Shadow tokens</H2>
      <SpecTable
        columns={[
          { key: 'token', header: 'Token', width: '18%' },
          { key: 'light', header: 'Light', width: '30%' },
          { key: 'dark', header: 'Dark', width: '30%' },
          { key: 'usage', header: '사용 예시', width: '22%' },
        ]}
        rows={SHADOW_TOKENS.map((t) => ({
          token: <span className={s.token}>{t.token}</span>,
          light: <span className={s.signal}>{t.light}</span>,
          dark: <span className={s.signal}>{t.dark}</span>,
          usage: t.usage,
        }))}
      />

      <H2>Shadow Preview</H2>
      <div className={s.previewGrid}>
        <div className={s.previewItem}>
          <div className={`${s.previewBox} ${s.boxSm}`} />
          <div className={s.previewLabel}>shadow-sm</div>
        </div>
        <div className={s.previewItem}>
          <div className={`${s.previewBox} ${s.boxMd}`} />
          <div className={s.previewLabel}>shadow-md</div>
        </div>
        <div className={s.previewItem}>
          <div className={`${s.previewBox} ${s.boxLg}`} />
          <div className={s.previewLabel}>shadow-lg</div>
        </div>
        <div className={s.previewItem}>
          <div className={`${s.previewBox} ${s.boxXl}`} />
          <div className={s.previewLabel}>shadow-xl</div>
        </div>
      </div>

      <H2>Z-Index Scale</H2>
      <SpecTable
        columns={[
          { key: 'token', header: 'Token', width: '25%' },
          { key: 'value', header: '값', width: '25%' },
          { key: 'usage', header: '사용 예시', width: '50%' },
        ]}
        rows={Z_INDEX_TOKENS.map((z) => ({
          token: <span className={s.token}>{z.token}</span>,
          value: z.value,
          usage: z.usage,
        }))}
      />
    </>
  );
}
