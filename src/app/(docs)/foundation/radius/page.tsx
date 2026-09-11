import type { Metadata } from 'next';
import { H2 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import SpecTable from '@/components/docs/SpecTable';
import { pageMeta } from '@/lib/docs/pages';
import { RADIUS_TOKENS } from './radius.data';
import s from './radius.module.css';

const meta = pageMeta('/foundation/radius')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 원본: PDS `docs/foundation/radius.md` */
export default function RadiusPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        Radius는 UI 구성 요소의 모서리를 둥글게 처리하는 기준을 정의해요. 요소의 둥근 정도는 브랜드의
        성격을 전달하고, 일관된 비주얼 아이덴티티를 유지하는 데 기여해요.
        적절한 radius 값 사용은 컴포넌트 간의 통일성을 높이고, 사용자가 인터페이스를 더욱 직관적으로
        인식하도록 도와줘요.
      </PageLead>

      <H2>기본 단위</H2>
      <p>
        이 기본 단위는 요소의 둥글기(Radius)를 일관되게 정의하고, 전체 UI의 시각적 조화와 브랜드 톤을
        유지하는 데 기여해요.
        디자인 및 개발 전반에 걸쳐 일관된 둥근 모서리 처리를 가능하게 해요.
      </p>

      <H2>Radius token</H2>
      <SpecTable
        columns={[
          { key: 'token', header: 'Token', width: '30%' },
          { key: 'preview', header: '', width: '15%' },
          { key: 'px', header: 'px', width: '15%' },
          { key: 'usage', header: '사용 예시', width: '40%' },
        ]}
        rows={RADIUS_TOKENS.map((t) => ({
          token: <span className={s.tokenName}>{t.token}</span>,
          preview: <span className={s.preview} style={{ borderRadius: t.css }} />,
          px: <span className={s.pxVal}>{t.px}</span>,
          usage: t.usage,
        }))}
      />
    </>
  );
}
