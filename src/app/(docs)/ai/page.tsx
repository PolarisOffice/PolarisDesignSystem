import type { Metadata } from 'next';
import { H2, H3 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import { pageMeta } from '@/lib/docs/pages';
import s from './ai.module.css';
import { withBase } from '@/lib/basePath';

const meta = pageMeta('/ai')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** zip 안 구조 — scripts/build-pds-skill-zip.mjs 가 조립하는 그대로 */
const FILE_TREE = `pds-design/
  SKILL.md                     ← AI가 먼저 읽는 진입점 (설치·배선·조합 규칙 + 컴포넌트 카탈로그)
  references/
    button/README.md           ← 컴포넌트별 용도·사용 규칙·예제 (문서 사이트에서 생성)
    checkbox/README.md
    …                          ← src/components 폴더와 1:1
  src/
    components/button/         ← 패키지 소스 그대로 (index.tsx · style.ts · types.ts)
    components/checkbox/
    …
    tokens.ts · tokens.generated.ts · supported.ts · index.ts   ← 공용 파일 (항상 함께)
  styles/
    design-tokens.css          ← 디자인 토큰 CSS (app/layout.tsx 에서 한 번 import)
  LICENSE`;

/**
 * `/ai` — AI 연동. 2026-08-25 스킬 다운로드만 남긴다(사용자 결정): 구 `/ai/skill` 은 308 로 여기 온다.
 * 2026-09-01 스킬 zip 을 빌드 산출물로 교체 — scripts/generate-pds-skill.mjs(문서 → SKILL/) +
 * build-pds-skill-zip.mjs(SKILL/ + 소스 폴더명 매칭) 가 public/pds-design-skill.zip 을 만든다.
 */
export default function AiPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        PDS 스킬 파일을 AI 툴에 연결하면 Polaris Design System 기준으로 바로 답하고, &quot;PDS&quot;라는
        말이 없어도 화면/UI를 만들어달라는 요청에 자동으로 반응해 PDS 기준의 코드를 생성해요.
      </PageLead>

      <H2>스킬 파일이란?</H2>
      <p>
        PDS 컴포넌트 소스, 디자인 토큰 CSS, 컴포넌트별 사용 규칙과 예제를 AI가 읽기 좋은 형태로 한데 묶은
        파일이에요. <strong>npm 을 쓸 수 없는 환경</strong>(사내망·온프레미스)을 위한 것으로, AI 가 동봉된
        소스를 프로젝트에 복사해 PDS 컴포넌트를 그대로 씁니다. 내용은 문서 사이트와 토큰 파일에서 빌드 때
        자동 생성되므로 사이트가 갱신되면 스킬도 함께 갱신돼요.
      </p>
      <p>
        PAX 웹채팅이나 design-md MCP 가 연결된 프로젝트라면 이 파일이 필요 없어요 — 그쪽이 항상 최신
        발행본을 직접 줍니다. npm 을 쓸 수 있으면 <code>npm i @polarisoffice/pds-react</code> 가 더 간단해요.
      </p>

      <H2>설치 방법</H2>

      <H3>ZIP 다운로드</H3>
      <div className={s.installBlock}>
        <a
          href={withBase('/pds-design-skill.zip')}
          download
          className={`${s.installCode} ${s.downloadLink}`}
        >
          ⬇ pds-design-skill.zip 다운로드
        </a>
      </div>
      <p>
        압축을 풀어 <code>pds-design</code> 폴더를 프로젝트의 <code>.claude/skills/</code>(또는 쓰는 AI 도구의
        스킬 디렉터리)에 넣으세요. AI 가 화면을 만들 때 SKILL.md 규칙대로 <code>src/</code> 를{' '}
        <code>components/pds/</code> 로, 토큰 CSS 를 <code>styles/design-tokens.css</code> 로 복사해 씁니다.
      </p>
      <blockquote className={s.note}>
        <p>
          <strong>참고</strong> 프로젝트는 TypeScript 여야 해요(소스가 .tsx). 서체 Pretendard 는 프로젝트가
          직접 로드합니다 — 없으면 시스템 한글 서체로 보여요.
        </p>
      </blockquote>

      <H2>파일 구조</H2>
      <p>스킬 파일은 아래 구조로 구성되어 있어요.</p>
      <pre className={s.tree}>
        <code>{FILE_TREE}</code>
      </pre>

      <H2>활용 예시</H2>
      <p>
        <strong>새 화면/UI를 만들어달라고 할 때</strong> (&quot;PDS&quot; 언급 없이도 자동 발동해요)
      </p>
      <ul>
        <li>&quot;설정 페이지 하나 만들어줘&quot;</li>
        <li>&quot;이 데이터 목록 화면 디자인해줘&quot;</li>
        <li>&quot;저장·취소 버튼이 있는 확인 팝업 만들어줘&quot;</li>
      </ul>
      <p>
        <strong>스펙을 물어볼 때</strong>
      </p>
      <ul>
        <li>&quot;Button 은 어떤 variant 가 있어?&quot;</li>
        <li>&quot;Tabs 를 fill 로 쓰려면?&quot;</li>
        <li>&quot;라운드 토큰 값 알려줘&quot;</li>
      </ul>
    </>
  );
}
