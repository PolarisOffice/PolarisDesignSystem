import type { ReactNode } from 'react';
import { CodePanel, PreviewFrame } from './CodeTools';
import { highlight } from '@/lib/docs/highlight';
import { PDS_FIGMA_URL, PDS_INSTALL, PDS_ON_NPM, PDS_PACKAGE, PDS_PREVIEW_ENABLED } from '@/lib/docs/package';
import s from './CodeExample.module.css';

/** 코드 패널이 접힘 대상이 되는 줄 수 — 서버에서 판정한다 */
const CLAMP_LINES = 12;

export interface CodeExampleSpec {
  id: string;
  title: string;
  desc?: string;
  /** 화면에 보여줄 코드 — **이게 정본이다.** 패키지가 없어도 문자열이라 정직하다 */
  code: string;
  /**
   * 라이브 미리보기. 패키지 배포 후에 추가한다(지금은 전부 생략).
   *
   * ⚠️ `() => ReactNode` 가 아니라 `ReactNode` 다 — 함수는 RSC 경계를 넘지 못해서
   * "Functions cannot be passed directly to Client Components" 로 터진다. 지연 *마운트* 는
   * PreviewFrame 이 담당한다.
   */
  preview?: ReactNode;
  /** 미리보기에 쓸 대표 컴포넌트명 — 자리표시에 `<Button />` 처럼 표시된다 */
  previewName?: string;
}

/**
 * Code 탭의 예제 한 건 — 미리보기 면 + 코드 패널.
 *
 * 제목에 `code-` 접두 id 를 단다. 접두가 필요한 이유는 Design 탭이 같은 페이지에서
 * `size`·`variant` 같은 흔한 앵커를 이미 쓰고 있어서다 — 접두 없이는 두 패널이 같은 id 를
 * 갖게 되고 `getElementById` 가 먼저 나온 쪽(Design)만 집는다.
 * 목차에서 비활성 탭 헤딩이 새지 않는 것은 DocTabs 의 `data-toc-scope="active"` 가 보장한다.
 */
export function CodeExample({ id, title, desc, code, preview, previewName }: CodeExampleSpec) {
  const clampable = code.split('\n').length > CLAMP_LINES;
  return (
    <figure className={s.example}>
      <figcaption>
        <h3 id={`code-${id}`} className={s.exampleTitle}>
          {title}
        </h3>
        {desc && <p className={s.exampleDesc}>{desc}</p>}
      </figcaption>
      <div className={s.card}>
        <PreviewFrame name={previewName ?? title.replace(/\s+/g, '')}>{preview}</PreviewFrame>
        <CodePanel code={code} clampable={clampable}>
          {highlight(code)}
        </CodePanel>
      </div>
    </figure>
  );
}

/**
 * Code 탭 껍데기 — 패키지 상태 안내를 **한 번만** 그린다.
 *
 * 같은 사과문을 예제마다 반복하면 미완성으로 보이므로, 상단에 사실 위주 안내 하나 + 예제마다는
 * 조용한 자리표시(PreviewFrame)로 나눈다. 설치 스니펫은 패키지가 실제로 있을 때만 노출한다 —
 * 404 나는 패키지의 `npm i` 를 띄우는 게 진짜 민망한 부분이다.
 */
export function CodeTabShell({ live = false, children }: { live?: boolean; children: ReactNode }) {
  return (
    <>
      {PDS_PREVIEW_ENABLED && live ? (
        PDS_ON_NPM ? (
          /* 설치 안내 — 강조 박스가 아니라 일반 코드블럭 + 복사 버튼 (2026-08-28 검토:
             "의미 없는 강조 표시 삭제 하고 코드블럭 + 복사 버튼으로 수정") */
          <div className={s.install}>
            <span className={s.installLabel}>설치</span>
            {/* .card 로 감싼다 — CodePanel 의 툴바 구분선은 카드 안 divider 전제라,
                맨몸으로 두면 선 하나가 허공에 떠 보인다(2026-08-28 피드백) */}
            <div className={s.card}>
              <CodePanel code={PDS_INSTALL} clampable={false}>
                {highlight(PDS_INSTALL)}
              </CodePanel>
            </div>
          </div>
        ) : (
          <div className={s.shellNotice}>
            <span className={s.shellNoticeTitle}>라이브 미리보기 (베타)</span>
            <span className={s.shellNoticeBody}>
              아래 미리보기는 실제 <strong>{PDS_PACKAGE}</strong> 패키지(베타 빌드)를 렌더한 거예요. npm
              발행을 준비 중이에요. 발행 후 설치 안내가 여기 표시돼요.
            </span>
          </div>
        )
      ) : (
        <div className={s.shellNotice}>
          <span className={s.shellNoticeTitle}>컴포넌트 패키지 준비 중</span>
          <span className={s.shellNoticeBody}>
            React 컴포넌트 패키지를 Figma 원본에서 추출하고 있어요. 아래 코드는 확정 전 API 초안이며,{' '}
            <strong>패키지 이름({PDS_PACKAGE})은 잠정</strong>이에요. npm 발행 시 확정돼요. 지금 확정된
            스펙과 사용 규칙은 Design 탭에서 확인하세요.
          </span>
          <span className={s.shellLinks}>
            <a href={PDS_FIGMA_URL} target="_blank" rel="noreferrer">
              Figma 원본 보기 →
            </a>
          </span>
        </div>
      )}
      {children}
    </>
  );
}
