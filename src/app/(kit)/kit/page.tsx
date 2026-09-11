import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { H2 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import { listStoredDesigns } from '@/lib/store';
import UploadForm from './UploadForm';
import CopyCode from './CopyCode';
import { PDS_SYSTEM_NAME } from '@/live-components';
import s from './kit.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '내 디자인 시스템 | PDS',
  description: 'DESIGN.md 를 올리면 비주얼 가이드 페이지가 생기고 로컬 AI 가 MCP 로 가져다 씁니다.',
};

/**
 * `/kit` — 내 디자인 시스템 (DESIGN.md 업로드 + 목록 + 로컬 AI 연결).
 *
 * PDS 문서 사이트가 루트를 가져가면서 여기로 옮겼고, 2026-08-27 GNB 에 복원하며 홈과 같은
 * 문법(표제·리드·3열 정의 행·면 링크 카드 그리드)으로 다시 그렸다. DESIGN.md 파이프라인
 * (업로드 → designs/*.md → /guide/design/*  + MCP)은 그대로다.
 */
export default async function KitUploadPage() {
  const designs = listStoredDesigns();
  // 접속한 주소 그대로 — 다른 PC(192.168.x:3100)에서 열었으면 그 주소가 복사돼야 한다
  const host = (await headers()).get('host') ?? 'localhost:3000';
  const mcpUrl = `http://${host}/api/mcp`;

  return (
    <main className={s.page}>
      <h1 className={s.title}>내 디자인 시스템</h1>
      <PageLead>
        PDS 는 이 사이트에 기본으로 들어 있는 예시입니다. 같은 형식(DESIGN.md)으로 여러분의 디자인 시스템을 올리면
        비주얼 가이드 페이지가 생기고, AI 가 MCP 로 토큰·컴포넌트·조합 규칙을 그대로 가져다 씁니다.
      </PageLead>

      <div className={s.steps}>
        <div className={s.step}>
          <h3><span>1</span>DESIGN.md 작성</h3>
          <p>
            토큰·컴포넌트·조합 규칙을 한 파일에 적습니다.{' '}
            <a href="/api/guide/design-content?name=aurora&raw=1" download="DESIGN.md">샘플 DESIGN.md 내려받기</a> —
            이름과 값만 바꾸면 됩니다. 형식 전체는 저장소의 <code>docs/design-md-spec.md</code>.
          </p>
        </div>
        <div className={s.step}>
          <h3><span>2</span>올리기</h3>
          <p>검증을 통과하면 즉시 발행 — 아래 목록과 가이드 페이지에 바로 나타납니다.</p>
        </div>
        <div className={s.step}>
          <h3><span>3</span>AI 연결</h3>
          <p>AI 에게 MCP 로 연결해 두면 &ldquo;디자인 시스템으로 만들어줘&rdquo; 한 마디가 그 규칙대로 동작합니다.</p>
        </div>
      </div>

      <H2>올라온 디자인 시스템</H2>
      {designs.length === 0 ? (
        <p className={s.empty}>아직 올라온 디자인 시스템이 없어요. 아래에 DESIGN.md 를 놓으면 여기에 카드로 나타납니다.</p>
      ) : (
        <div className={s.grid}>
          {designs.map((d) => {
            const components = d.items.filter((i) => i.kind === 'component').length;
            const resources = d.items.filter((i) => i.kind === 'resource').length;
            return (
              <Link key={d.meta.name} href={d.meta.name === PDS_SYSTEM_NAME ? '/' : `/guide/design/${encodeURIComponent(d.meta.name)}`} className={s.card}>
                <span className={s.cardHead}>
                  {d.meta.title}
                  {d.meta.name === PDS_SYSTEM_NAME && <span className={s.badge}>기본 동봉 · 문서 사이트</span>}
                  <span className={s.arrow} aria-hidden="true">→</span>
                </span>
                {d.meta.description && <span className={s.cardDesc}>{d.meta.description}</span>}
                <span className={s.cardMeta}>
                  {d.meta.name} · v{d.meta.version} · 컴포넌트 {components} · 리소스 {resources}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <H2>내 DESIGN.md 올리기</H2>
      <UploadForm />

      <H2>AI 연결</H2>
      <p className={s.note} style={{ margin: '0 0 12px' }}>
        이 서버의 MCP 주소는 <code>{mcpUrl}</code> 하나입니다. 쓰는 도구의 명령을 복사해 터미널에
        붙여 넣으면 연결됩니다. 플러그인으로 설치하면 조합 규칙(스킬)까지 같이 들어가 &ldquo;디자인 시스템으로 만들어줘&rdquo;가 규칙대로 동작합니다.
      </p>
      <div className={`${s.grid} ${s.gridThree}`}>
        <div className={s.how}>
          <div className={s.howHead}>Claude Code 플러그인 <small>도구 + 규칙</small></div>
          <p className={s.howDesc}>
            Claude Code 안에서 두 줄을 차례로 입력합니다. <code>&lt;이 폴더 경로&gt;</code> 는 이 킷을 받은 위치예요.
            설치 후 재시작하면 바로 동작합니다.
          </p>
          <CopyCode code={'/plugin marketplace add <이 폴더 경로>/plugin\n/plugin install design-md@PDS'} />
        </div>
        <div className={s.how}>
          <div className={s.howHead}>Claude Code, MCP 만 <small>도구만</small></div>
          <p className={s.howDesc}>플러그인 없이 조회 도구 3개만 붙입니다. 터미널에서 한 번 실행하면 끝.</p>
          <CopyCode code={`claude mcp add --transport http design-md ${mcpUrl}`} />
        </div>
        <div className={s.how}>
          <div className={s.howHead}>Codex 플러그인 <small>도구 + 규칙</small></div>
          <p className={s.howDesc}>
            Codex 앱에서 <strong>플러그인 → 우측 상단 + → 마켓플레이스 추가</strong>, 출처(Source) 칸에 아래 경로를 넣고 추가한 뒤
            <strong> personal 탭 → design-md</strong> 를 추가합니다. 설치 후 Codex 를 완전히 종료했다가 다시 실행하세요.
          </p>
          <CopyCode code={'<이 폴더 경로>/plugin'} />
        </div>
      </div>
      <p className={s.note}>
        연결되면 AI 가 <code>list_design_components</code> 로 목록을 보고 <code>get_design_component</code> 로 필요한 것만 가져갑니다.
        서버 포트를 바꾸거나 다른 PC 에서 접속하면 위 주소와 <code>plugin/plugins/design-md/.mcp.json</code>, 환경변수{' '}
        <code>DESIGN_KIT_ALLOWED_HOSTS</code>(예: <code>192.168.0.10:3100</code>)도 같이 바꿔 주세요.
      </p>
    </main>
  );
}
