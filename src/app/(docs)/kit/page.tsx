import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { H2 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import InfoNote from '@/components/docs/InfoNote';
import { DocCard } from '@/components/docs/CardGrid';
import { listStoredDesigns } from '@/lib/store';
import { IS_HOSTED, KIT_REPO_URL, HOSTED_KIT_TITLE, HOSTED_KIT_DESCRIPTION, publicOrigin } from '@/lib/hosting';
import UploadForm from './UploadForm';
import CopyCode from './CopyCode';
import { PDS_SYSTEM_NAME } from '@/live-components';
import s from './kit.module.css';

export const dynamic = 'force-dynamic';

// 문서 레이아웃 title template(`%s | Polaris Design System`)이 뒤를 붙인다
export const metadata: Metadata = IS_HOSTED
  ? { title: HOSTED_KIT_TITLE, description: HOSTED_KIT_DESCRIPTION }
  : { title: '내 디자인 시스템', description: 'DESIGN.md 를 올리면 비주얼 가이드 페이지가 생기고 로컬 AI 가 MCP 로 가져다 씁니다.' };

/**
 * `/kit` — 내 디자인 시스템 (DESIGN.md 업로드 + 목록 + 로컬 AI 연결).
 *
 * PDS 문서 사이트가 루트를 가져가면서 여기로 옮겼고, 2026-08-27 GNB 에 복원하며 홈과 같은
 * 문법(표제·리드·3열 정의 행·면 링크 카드 그리드)으로 다시 그렸다. DESIGN.md 파이프라인
 * (업로드 → designs/*.md → /guide/design/*  + MCP)은 그대로다.
 *
 * 2026-09-18: GNB 탭(잠시 `적용하기`)을 거쳐 AI Integration 사이드바 항목이 되면서 구 `(kit)` 그룹
 * (가운데 960 단독 레이아웃)에서 문서 셸로
 * 옮겼다 — 사이드바·본문·목차 그리드가 다른 탭과 같아야 한 사이트로 읽힌다. 그래서 여기엔
 * 자체 `<main>`·폭·H1 스타일이 없다(셸의 것을 쓴다). PAX 동봉 빌드는 이 폴더를 걷어낸다
 * (scripts/build-pds-docs.mjs STRIP_DIRS).
 *
 * 2026-10-07 공개 서버 모드(IS_HOSTED, lib/hosting.ts): pds.polarisoffice.com 처럼 모두가 보는 도메인에선
 * 같은 경로가 업로드 없는 **MCP 연결 안내**가 된다 — 올린 파일이 모두에게 보이는 데다 서버리스는 파일 쓰기도
 * 안 되므로, 업로드가 있었다는 흔적(제목·목록·드롭존)을 남기지 않는다. 이 사이트의 MCP 는 공개 read-only.
 */
export default async function KitUploadPage() {
  // 접속한 주소 그대로 — 다른 PC(192.168.x:3100)에서 열었으면 그 주소가 복사돼야 한다. 프록시 뒤 https 는 x-forwarded-proto 로.
  const origin = publicOrigin(await headers());
  const mcpUrl = `${origin}/api/mcp`;

  if (IS_HOSTED) return <HostedMcpGuide mcpUrl={mcpUrl} />;

  const designs = listStoredDesigns();
  return (
    <>
      <h1>내 디자인 시스템</h1>
      <PageLead>
        PDS 는 이 사이트에 기본으로 들어 있는 예시입니다. 같은 형식(DESIGN.md)으로 여러분의 디자인 시스템을 올리면
        비주얼 가이드 페이지가 생기고, AI 가 MCP 로 토큰·컴포넌트·조합 규칙을 그대로 가져다 씁니다.
      </PageLead>

      {/* 쓰는 순서 — 다른 문서 페이지와 같은 본문 목록(16px). 구 3열 정의 행(13px)은 이 탭만 글자가
          작아 보여 걷어냈다(2026-09-18) */}
      <ol>
        <li>
          <strong>DESIGN.md 작성</strong> — 토큰·컴포넌트·조합 규칙을 한 파일에 적습니다.{' '}
          <a href="/api/example-design" download="DESIGN.md">샘플 DESIGN.md 내려받기</a> 후
          이름과 값만 바꾸면 됩니다. 형식 전체는 저장소의 <code>docs/design-md-spec.md</code>.
        </li>
        <li>
          <strong>올리기</strong> — 검증을 통과하면 즉시 발행돼 아래 목록과 가이드 페이지에 바로 나타납니다.
        </li>
        <li>
          <strong>AI 연결</strong> — AI 에게 MCP 로 연결해 두면 &ldquo;디자인 시스템으로 만들어줘&rdquo; 한 마디가 그
          규칙대로 동작합니다.
        </li>
      </ol>

      <H2>올라온 디자인 시스템</H2>
      {designs.length === 0 ? (
        <InfoNote>아직 올라온 디자인 시스템이 없어요. 아래에 DESIGN.md 를 놓으면 여기에 카드로 나타납니다.</InfoNote>
      ) : (
        // 공통 DocCard 를 2열로 — auto-fill(200px) 이면 카드 2장이 213px 로 좁아져 태그·메타가 줄줄이 꺾였다(2026-09-21)
        <div className={s.systemGrid}>
          {designs.map((d) => {
            const components = d.items.filter((i) => i.kind === 'component').length;
            const resources = d.items.filter((i) => i.kind === 'resource').length;
            return (
              <DocCard
                key={d.meta.name}
                href={d.meta.name === PDS_SYSTEM_NAME ? '/' : `/guide/design/${encodeURIComponent(d.meta.name)}`}
                name={
                  <span className={s.nameRow}>
                    {d.meta.title}
                    {d.meta.name === PDS_SYSTEM_NAME && <span className={s.badge}>기본 동봉</span>}
                  </span>
                }
                desc={d.meta.description}
                meta={`${d.meta.name} · v${d.meta.version} · 컴포넌트 ${components} · 리소스 ${resources}`}
              />
            );
          })}
        </div>
      )}

      <H2>내 DESIGN.md 올리기</H2>
      <UploadForm />

      <H2>AI 연결</H2>
      <p>
        이 서버의 MCP 주소는 <code>{mcpUrl}</code> 하나입니다. 쓰는 도구의 명령을 복사해 터미널에
        붙여 넣으면 연결됩니다. 플러그인으로 설치하면 조합 규칙(스킬)까지 같이 들어가 &ldquo;디자인 시스템으로 만들어줘&rdquo;가 규칙대로 동작합니다.
      </p>
      <div className={s.howGrid}>
        <div className={s.how}>
          <div className={s.howHead}>Claude Code 플러그인 <small>도구 + 규칙</small></div>
          <p className={s.howDesc}>
            Claude Code 안에서 두 줄을 차례로 입력합니다. <code>&lt;이 폴더 경로&gt;</code> 는 이 킷을 받은 위치예요.
            설치 후 재시작하면 바로 동작합니다.
          </p>
          <CopyCode label="claude-plugin" code={'/plugin marketplace add <이 폴더 경로>/plugin\n/plugin install design-md@PDS'} />
        </div>
        <div className={s.how}>
          <div className={s.howHead}>Claude Code, MCP 만 <small>도구만</small></div>
          <p className={s.howDesc}>플러그인 없이 조회 도구 3개만 붙입니다. 터미널에서 한 번 실행하면 끝.</p>
          <CopyCode label="claude-mcp" code={`claude mcp add --transport http design-md ${mcpUrl}`} />
        </div>
        <div className={s.how}>
          <div className={s.howHead}>Codex 플러그인 <small>도구 + 규칙</small></div>
          <p className={s.howDesc}>
            Codex 앱에서 <strong>플러그인 → 우측 상단 + → 마켓플레이스 추가</strong>, 출처(Source) 칸에 아래 경로를 넣고 추가한 뒤
            <strong> personal 탭 → design-md</strong> 를 추가합니다. 설치 후 Codex 를 완전히 종료했다가 다시 실행하세요.
          </p>
          <CopyCode label="codex-plugin" code={'<이 폴더 경로>/plugin'} />
        </div>
      </div>
      <p>
        연결되면 AI 가 <code>list_design_components</code> 로 목록을 보고 <code>get_design_component</code> 로 필요한 것만 가져갑니다.
        서버 포트를 바꾸거나 다른 PC 에서 접속하면 위 주소와 <code>plugin/plugins/design-md/.mcp.json</code>, 환경변수{' '}
        <code>DESIGN_KIT_ALLOWED_HOSTS</code>(예: <code>192.168.0.10:3100</code>)도 같이 바꿔 주세요.
      </p>
    </>
  );
}

/**
 * 공개 서버 모드의 `/kit` — 업로드·목록 없이 "PDS 를 AI 에 MCP 로 연결하는 법" 하나만.
 * 사이드바 이름(nav.ts)·메타(pages.ts)와 같은 HOSTED_KIT_TITLE 을 H1 으로 쓴다.
 */
function HostedMcpGuide({ mcpUrl }: { mcpUrl: string }) {
  return (
    <>
      <h1>{HOSTED_KIT_TITLE}</h1>
      <PageLead>
        PDS 를 AI(Claude Code·Codex 등)에 MCP 로 연결해 두면 &ldquo;디자인 시스템으로 만들어줘&rdquo; 한 마디로 토큰·컴포넌트·조합
        규칙을 그대로 가져다 씁니다. 이 사이트의 MCP 주소는 <code>{mcpUrl}</code> 하나이고, 조회만 하는 읽기 전용입니다.
      </PageLead>

      <H2>연결 방법</H2>
      <p>
        쓰는 도구의 명령을 복사해 붙여 넣으면 연결됩니다. 도구만 붙이는 방법이 가장 빠르고, 플러그인으로 설치하면 조합 규칙(스킬)까지
        같이 들어가 저장 위치·토큰 사용법이 정해진 대로 동작합니다.
      </p>
      <div className={s.howGrid}>
        <div className={s.how}>
          <div className={s.howHead}>Claude Code, MCP 만 <small>도구만</small></div>
          <p className={s.howDesc}>플러그인 없이 조회 도구 3개만 붙입니다. 터미널에서 한 번 실행하면 끝.</p>
          <CopyCode label="claude-mcp" code={`claude mcp add --transport http design-md ${mcpUrl}`} />
        </div>
        <div className={s.how}>
          <div className={s.howHead}>Claude Code 플러그인 <small>도구 + 규칙</small></div>
          <p className={s.howDesc}>
            <a href={KIT_REPO_URL} target="_blank" rel="noreferrer">저장소</a>를 받은 뒤 <code>plugin/plugins/design-md/.mcp.json</code> 의
            주소를 <code>{mcpUrl}</code> 로 바꾸고, Claude Code 안에서 두 줄을 차례로 입력합니다. <code>&lt;받은 폴더 경로&gt;</code> 는
            저장소를 받은 위치예요. 설치 후 재시작하면 바로 동작합니다.
          </p>
          <CopyCode label="claude-plugin" code={'/plugin marketplace add <받은 폴더 경로>/plugin\n/plugin install design-md@PDS'} />
        </div>
        <div className={s.how}>
          <div className={s.howHead}>Codex 플러그인 <small>도구 + 규칙</small></div>
          <p className={s.howDesc}>
            <a href={KIT_REPO_URL} target="_blank" rel="noreferrer">저장소</a>를 받아 <code>plugin/plugins/design-md/.mcp.codex.json</code> 의
            주소를 <code>{mcpUrl}</code> 로 바꾼 뒤, Codex 앱에서 <strong>플러그인 → 우측 상단 + → 마켓플레이스 추가</strong>, 출처(Source)
            칸에 아래 경로를 넣고 추가하고 <strong>personal 탭 → design-md</strong> 를 추가합니다. 설치 후 Codex 를 완전히 종료했다가 다시
            실행하세요.
          </p>
          <CopyCode label="codex-plugin" code={'<받은 폴더 경로>/plugin'} />
        </div>
      </div>

      <H2>연결되면</H2>
      <p>
        AI 가 <code>list_design_components</code> 로 컴포넌트 목록을 보고, <code>get_design_component</code> 로 필요한 컴포넌트의 코드와
        사용법만, <code>get_design_foundation</code> 으로 색·글꼴·간격 토큰(CSS 변수)을 가져갑니다. 셋 다 읽기 전용이라 이 사이트의 내용을
        바꾸지 않습니다.
      </p>
      <p>
        MCP 없이 규칙 파일만 프로젝트에 넣으려면 <Link href="/ai">Skill 파일</Link>을 받으세요.
      </p>
    </>
  );
}
