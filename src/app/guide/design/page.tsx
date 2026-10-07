import Link from 'next/link';
import { listStoredDesigns } from '@/lib/store';
import { IS_HOSTED } from '@/lib/hosting';
import { PDS_SYSTEM_NAME } from '@/live-components';

export const dynamic = 'force-dynamic';

/**
 * /guide/design — 발행된 디자인 시스템 목록.
 * 경로는 VibeAgent 웹과 미러 (DesignGuideView 사본의 뒤로가기 링크가 이 경로를 가리킴).
 *
 * 조성은 PDS 문서 사이트를 따른다 — H1 + 17px 설명문, 카드는 본문/메타 2단(.asset-card 패턴),
 * 색·간격·라운드는 전부 PDS 토큰. 인라인 style 을 쓰지 않아야 테마 전환이 자동으로 따라온다.
 */
export default function DesignGuideListPage() {
  const designs = listStoredDesigns();

  return (
    <div className="design-guide-scroll">
      <main className="kit-main">
        <h1 className="kit-page-title">디자인 가이드</h1>
        <p className="kit-page-desc">
          발행된 디자인 시스템입니다. AI 는 여기 있는 컴포넌트 코드와 색·글꼴 값을 그대로 가져다 씁니다.
        </p>

        {designs.length === 0 ? (
          <p className="kit-empty">
            아직 발행된 디자인 시스템이 없습니다.
            {!IS_HOSTED && (
              <>
                <br />
                <Link href="/kit">내 디자인 시스템</Link>에서 DESIGN.md 를 업로드하면 여기에 표시돼요.
              </>
            )}
          </p>
        ) : (
          <div className="kit-card-grid">
            {designs.map((d) => {
              const componentCount = d.items.filter((i) => i.kind === 'component').length;
              const resourceCount = d.items.filter((i) => i.kind === 'resource').length;
              return (
                <Link
                  key={d.meta.id}
                  href={d.meta.name === PDS_SYSTEM_NAME ? '/' : `/guide/design/${encodeURIComponent(d.meta.name)}`}
                  className="kit-card-link"
                >
                  <span className="kit-badge">v{d.meta.version}</span>
                  <h2 className="kit-card-title">{d.meta.title}</h2>
                  {d.meta.description && <p className="kit-muted">{d.meta.description}</p>}
                  <div className="kit-card-meta">
                    <span>{d.meta.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>컴포넌트 {componentCount}</span>
                    <span aria-hidden="true">·</span>
                    <span>리소스 {resourceCount}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
