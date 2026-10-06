import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { IS_EMBED } from '@/lib/basePath';
import KitHeader from './KitHeader';
import './globals.css';

// PDS 문서 사이트가 메인이라 사이트 기본 메타도 PDS 를 따른다.
// (docs) 세그먼트는 자체 layout 에서 `%s | Polaris Design System` 템플릿을 덮어쓴다.
export const metadata: Metadata = {
  title: 'Polaris Design System',
  description: '폴라리스 서비스 전반의 컴포넌트 스펙을 정의한 디자인 명세 문서',
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/brand-assets/logo.svg` }, // metadata 는 basePath 자동 접두 대상이 아님 — embed 빌드 대응
};

/**
 * 페인트 전에 `html[data-theme]` 을 확정하는 무플래시 스크립트.
 *
 * PDS tokens.css 는 `[data-theme="dark"]` 로만 다크를 켜고 prefers-color-scheme 분기가 없다.
 * 그래서 (1) 저장값 → (2) 시스템 설정 순으로 여기서 직접 결정한다. 이 스크립트가 없으면
 * 다크 사용자가 흰 화면을 한 프레임 보게 된다. 키 문자열은 KitHeader 의 THEME_KEY 와 쌍.
 */
const THEME_INIT = `(function(){try{var s=localStorage.getItem('PDS-theme');var d=s==='dark'||s==='light'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=d;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning — 아래 스크립트가 하이드레이션 전에 data-theme 을 심는다
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* PDS 제품 서체 — 토큰이 Pretendard 를 쓴다고 선언하므로 글꼴도 함께 조달한다.
            한글 유니코드 분할본이라 화면에 나온 글자만 내려받는다(전체본보다 가볍다).
            가변 버전은 폰트 이름이 `Pretendard Variable` 이라 토큰과 매칭되지 않는다.
            외부 요청을 원치 않으면 이 link 만 지우면 된다 — 시스템 폰트로 자연 폴백된다. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
        {/* 인라인 유지가 요건 — 페인트 전에 동기 실행돼야 한다. next/script 의 beforeInteractive 는
            App Router 에서 같은 스크립트를 SSR HTML 에 2번 심어 부적합했다. React 19 가 개발 모드에서
            "클라이언트 렌더 시 실행 안 됨" 경고를 남기지만, 초기 HTML 에서는 실행되며 이 스크립트는
            최초 1회만 필요하다(이후 전환은 KitHeader 가 담당). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <KitHeader />
        {children}
        {/* 방문 집계는 pds.polarisoffice.com 만 — PAX 동봉 빌드(/guide/design/pds)는 제외해 PAX 통계를 바꾸지 않는다.
            Vercel 밖에 직접 올린 킷에선 집계가 안 되고 스크립트 404 + 콘솔 안내 한 줄만 남는다(화면 영향 없음). */}
        {!IS_EMBED && <Analytics />}
      </body>
    </html>
  );
}
