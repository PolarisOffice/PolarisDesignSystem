# PDS — Polaris Design System

**Polaris Design System(PDS) 문서 사이트**이자, 마크다운 한 파일(DESIGN.md)로 어떤 디자인
시스템이든 비주얼 가이드와 AI 연동을 만들 수 있는 **자가호스팅 킷**입니다.

- **문서 사이트** — 브랜드·파운데이션·컴포넌트·AI 문서 전체. 컴포넌트 페이지는 Design / Code
  2탭으로, Design 탭은 정적 가이드(Anatomy·Properties·Guidelines·Specification), Code 탭은
  발행된 npm 패키지 **[`@polarisoffice/pds-react`](https://www.npmjs.com/package/@polarisoffice/pds-react)**
  (이 저장소 `packages/pds-react`)를 실제로 실행하는 라이브 미리보기입니다 — 가이드가 그림이
  아니라 실물입니다.
- **디자인 시스템 킷** — DESIGN.md 를 업로드하면 가이드 페이지와 AI 조회 도구(MCP)가 자동으로
  생깁니다. PDS 전용이 아니라 범용이며, PDS 는 동봉된 대표 예시입니다.

## 빠른 시작

요구 사항: Node 20 이상.

```bash
npm install
npm run dev        # http://localhost:3000
```

## 컴포넌트 패키지 쓰기

```bash
npm i @polarisoffice/pds-react
```

React 컴포넌트 17종 + 디자인 토큰. API 명세는 패키지에 동봉된 타입 정의(.d.ts)가 정본입니다.
사용 예제는 문서 사이트 각 컴포넌트의 Code 탭에 있습니다.

## 내 디자인 시스템 올리기

마크다운 한 파일(DESIGN.md)로 정의한 디자인 시스템을 ① 비주얼 가이드 페이지와 ② AI 가
조회하는 MCP 도구로 서빙합니다. AI 는 컴포넌트의 **완성 코드를 그대로 복사**하고 디자인 토큰을
CSS 변수로만 사용합니다 — 디자인을 "보고 재해석"하며 생기는 어긋남을 원천 제거하는 방식입니다.

상단 메뉴 **내 디자인 시스템**(`/kit`)에서 DESIGN.md 를 업로드하면(검증 통과 = 즉시 발행)
`designs/<name>.md` 로 저장되고 `/guide/design/<name>` 가이드 페이지와 MCP 도구(`/api/mcp`)에
즉시 반영됩니다. [getdesign.md](https://getdesign.md/) 계열 외부 DESIGN.md 도 **무수정 업로드**를
지원합니다(자동 호환 정규화).

- 업로드 UI: http://localhost:3000/kit
- 자동 생성 가이드: http://localhost:3000/guide/design
- 동봉 예시: `designs/pds.md`(PDS). 저작 시작점 템플릿은 `examples/DESIGN.md`(aurora 샘플 — 서빙 목록엔 넣지 않는다, 2026-10-07)

## AI 연결 (MCP)

제공 도구 3종(모두 read-only): `list_design_components` · `get_design_component` · `get_design_foundation`

**방법 1 — MCP 서버 직접 추가** (Claude Code 예시):

```bash
claude mcp add --transport http design-md http://localhost:3000/api/mcp
```

**방법 2 — 동봉 플러그인 설치** (적용 규칙 스킬 포함):

```
/plugin marketplace add <이 폴더 경로>/plugin
/plugin install design-md@PDS
```

방법 1을 쓸 경우 `plugin/plugins/design-md/skills/design-system/SKILL.md` 를 프로젝트의
`.claude/skills/design-system/SKILL.md` 로 복사해 두면 "코드 무수정 복사" 규약이 함께 적용됩니다.

**Codex** — 같은 `plugin/` 폴더가 Codex 마켓플레이스 형식도 갖고 있습니다: 플러그인 → 우측 상단
+ → 마켓플레이스 추가 → 출처(Source)에 `<이 폴더 경로>/plugin` → personal 탭 → design-md 추가 →
Codex 재시작.

## 오프라인 스킬 zip (npm 을 쓸 수 없는 환경)

문서 사이트 **AI Integration → Skill 파일**에서 `pds-design-skill.zip` 을 받습니다. 컴포넌트
소스(`src/`)·토큰 CSS·컴포넌트별 규칙(`references/`)이 한 묶음이며 AI 가 SKILL.md 규칙대로
프로젝트에 복사해 씁니다. 사내망·온프레미스처럼 npm 설치가 불가능할 때 쓰고, MCP 연결이 있으면
그쪽이 우선입니다.

zip 은 빌드 때 자동 조립됩니다(`npm run skill:gen` → `skill:zip`, 드리프트 검사 `skill:check`) —
소스는 저장소 안에서 복사되지 않고 zip 안에서만 합쳐집니다.

## 인증 (선택)

기본은 **무인증**(localhost 개인용). 팀 서버로 띄울 땐 환경변수로 토큰을 켜세요:

```bash
DESIGN_KIT_TOKEN=<임의의 긴 문자열> npm run dev
```

설정 시 `/api/mcp` 와 `/api/upload` 에 `Authorization: Bearer <토큰>` 이 필요합니다
(가이드 페이지·DESIGN.md 다운로드는 계속 공개 — 읽기 전용 쇼케이스).

토큰 모드에서의 MCP 연결은 방법 1에 헤더를 붙여 사용하세요:

```bash
claude mcp add --transport http design-md http://localhost:3000/api/mcp \
  --header "Authorization: Bearer <토큰>"
```

⚠️ 동봉 플러그인(방법 2)의 `.mcp.json` 에는 헤더가 없어 토큰 모드에서 그대로는 401이 납니다 —
토큰을 쓸 경우 `plugin/plugins/design-md/.mcp.json` 의 서버 항목에
`"headers": { "Authorization": "Bearer <토큰>" }` 을 직접 추가하거나 방법 1을 쓰세요.

보안 참고: 업로드·MCP 는 브라우저 교차 출처 요청(CSRF)을 차단하고 DNS rebinding 방어(Host
허용목록 검증)를 켭니다. 기본 허용 호스트는 `localhost:3000`·`127.0.0.1:3000` 뿐이라 포트를
바꾸거나 도메인·다른 PC 에서 접속하는 팀 서버라면 허용 호스트를 지정해야 합니다(아니면 403):

```bash
DESIGN_KIT_ALLOWED_HOSTS=localhost:4000,design.example.com npm run dev
```

## 공개 서버로 띄우기 (업로드 없음)

PDS 문서 사이트처럼 **모두가 보는 도메인**(예: `pds.polarisoffice.com`)에 올릴 때는 공개 서버 모드로 빌드합니다.
킷의 저장소는 `designs/*.md` 파일이라 공개 서버가 업로드를 받으면 누가 올린 파일이든 모든 방문자에게
보이고, Vercel 같은 서버리스에서는 파일 쓰기 자체가 실패합니다.

```bash
NEXT_PUBLIC_DESIGN_KIT_HOSTED=1               # /api/upload 403, /kit 은 업로드 없는 "MCP 연결" 안내로(사이드바·약관의 업로드 언급도 빠짐)
DESIGN_KIT_ALLOWED_HOSTS=pds.polarisoffice.com   # 그 도메인으로 들어오는 /api/mcp 를 허용 (없으면 Invalid Host header 403)
```

`NEXT_PUBLIC_` 이라 **빌드 때** 박힙니다(사이드바 이름·페이지 제목이 정적 표라서 — PAX 동봉 빌드의 `NEXT_PUBLIC_PDS_EMBED` 와
같은 방식). 값을 바꾸면 다시 빌드하세요. 가이드 페이지·DESIGN.md 다운로드·MCP(read-only)는 그대로 공개되고 동봉 디자인(`designs/`)만
서빙됩니다. 방문자가 자기 디자인 시스템을 쓰려면 이 저장소를 받아 자기 PC 나 팀 서버에서 띄웁니다(기본값 = 업로드 켜짐).

## DESIGN.md 프로토콜

[docs/design-md-spec.md](docs/design-md-spec.md) 참조. 요약:

- frontmatter: `name`(kebab) · `version`(semver) · `tokens:`(색·타이포·간격·라운드·그림자 중첩 맵) · `themes: dark:`(선택 오버라이드)
- 본문: `## Components` 아래 H3 = 컴포넌트 1개 (`#### Usage`/`#### Variants` 선택, `#### Code` 필수 — ` ```tsx `(또는 ` ```jsx `) 펜스가 정본), `## Resources` 아래 H3 = 참조 문서
- 업로드 시 프롬프트 인젝션·시크릿·펜스 위조 패턴을 거절하는 3계층 검증 게이트가 적용됩니다
- 디자인 시스템은 최대 20개까지 저장됩니다 — 정리는 `designs/` 폴더에서 `.md` 파일 삭제로 합니다 (삭제 UI 없음)

## 구조

```
── 문서 사이트 ──
src/app/(docs)/          문서 페이지 전체 (홈·브랜드·파운데이션·컴포넌트·AI·리소스)
src/components/docs/     문서 프리미티브 (SpecTable·Anatomy·UsageGrid·DocTabs·CodeExample …)
src/lib/docs/            슬러그·네비 트리·페이지 메타·패키지 연결점
src/app/pds-tokens.css   PDS 디자인 토큰 — 빌드 생성, 편집 금지
src/styles/docs-tokens.css  문서 전용 삽화 토큰 (팔레트 밖 색 + 다크 값)
public/brand-assets/     브랜드 에셋 — 로고 패키지·심볼·워드마크 (Apache-2.0 제외, 별도 라이선스: LICENSE.md)
public/                  그 외 정적 파일 (홈 히어로·아이코노그래피 삽화·빌드가 만드는 스킬 zip)

── 컴포넌트 패키지 ──
packages/pds-react/      @polarisoffice/pds-react 소스 (컴포넌트 17종 + tokens.css)

── DESIGN.md 파이프라인 ──
designs/            업로드된 DESIGN.md = 데이터 (파일이 곧 저장소, 파일 존재 = 발행)
examples/DESIGN.md  저작 시작점 템플릿
src/lib/design/     ⚠️ AUTO-GENERATED — 코어 엔진 (파서·검증·생성기), 직접 수정 금지
src/components/design/DesignGuideView.tsx  ⚠️ AUTO-GENERATED — 비주얼 가이드 렌더러
src/app/api/mcp     MCP 서빙 (요청마다 새 transport — stateless)
plugin/             AI 플러그인 (스킬 + MCP 커넥터)
```

주의:

- **`AUTO-GENERATED` 표시가 있는 파일은 직접 수정하지 마세요** — 포크해서 쓰는 경우엔 자유지만, upstream 갱신을 다시 받으면 덮어써집니다.
- 저장소가 **로컬 파일**이므로 serverless(Vercel 등) 배포는 지원하지 않습니다 — 로컬 실행 또는 자가호스팅(VM/컨테이너) 전용입니다.
- 포트를 3000 이외로 바꾸면 MCP 연결 URL 과 `plugin/plugins/design-md/.mcp.json` 의 URL 도 함께 바꿔야 합니다.

## 검증

```bash
npm run build              # 프로덕션 빌드 (전 라우트 정적 생성 + 파생물 재조립)
npm run smoke              # DESIGN.md 파이프라인 자가 점검 (파싱→검증→resolve→생성)
npm run docs:link-check    # 내부 링크·앵커·에셋 전수 검사 (dev 서버 필요)
```

## 라이선스

코드·문서는 Apache-2.0 — [LICENSE](LICENSE) · [NOTICE](NOTICE)

브랜드 자산(로고 등 `public/brand-assets/`)은 Apache-2.0 적용 대상이 아니며 별도 라이선스를 따릅니다 — [Brand Assets License](public/brand-assets/LICENSE.md)
