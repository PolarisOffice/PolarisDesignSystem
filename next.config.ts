import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 킷이 다른 repo(예: VibeAgent 상위 폴더) 안에 놓여도 Next 16 이 상위 lockfile 을
  // workspace root 로 오추론하지 않도록 고정. next dev/build 는 항상 킷 디렉터리에서
  // 실행되므로 cwd == 킷 루트.
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    root: process.cwd(),
  },

  /**
   * 기존 PDS(VitePress) 사이트 URL 호환.
   *
   * 원본은 `cleanUrls` 를 켜지 않아 **운영 URL 이 전부 `.html` 로 끝난다**
   * (`/components/button.html`). 이식 후에도 기존 링크·북마크가 살아야 하므로 308 로 넘긴다.
   * 마지막 두 건은 원본 `vercel.json` 에 있던 것으로, 삭제된 dropdown 페이지를 select 로 보낸다.
   */
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      // `.html` 로 끝나는 모든 경로 → 확장자 제거
      { source: '/:path(.*)\\.html', destination: '/:path', permanent: true },
      // 원본은 <script>window.location.replace('/')</script> 스텁 페이지였다 — 진짜 308 로 대체
      { source: '/overview', destination: '/', permanent: true },
      // 리소스 페이지 폐지(2026-08-19) — Figma 링크는 헤더 아이콘, 에셋은 브랜드 로고 페이지
      { source: '/resources', destination: '/', permanent: true },
      // 컴포넌트 목록 페이지 숨김(2026-08-19) — 사이드바 라벨은 비링크, 첫 컴포넌트로 보낸다
      { source: '/components', destination: '/components/button', permanent: true },
      { source: '/components/dropdown', destination: '/components/select', permanent: true },
      // 2026-08-13 Color Palette 단독 페이지를 Roles 하단 축약 섹션으로 병합 — 구 앵커
      // (#po-blue 등)는 브라우저가 fragment 를 보존해 넘어오고 anchor-aliases 가 착지시킨다
      // 2026-08-19 Color 개요+Roles 를 /foundation/colors 한 페이지로 병합 — 구 URL 둘 다 직행
      // (팔레트→롤→컬러 체인 리다이렉트 회피). 구 앵커는 anchor-aliases 가 착지시킨다
      { source: '/foundation/color-roles', destination: '/foundation/colors', permanent: true },
      { source: '/foundation/color-palette', destination: '/foundation/colors', permanent: true },
      // 2026-08-25 브랜드 컬러·서체 페이지 폐지 — 내용이 파운데이션과 중복이라 각 정본으로 보낸다.
      // 구 앵커는 목적지에 대응 헤딩이 없어 상단 착지(별칭 미등록 — 값이 없는 별칭은 조용히 죽는다)
      { source: '/brand/colors', destination: '/foundation/colors', permanent: true },
      { source: '/brand/typeface', destination: '/foundation/typography', permanent: true },
      // 2026-08-25 AI 섹션을 스킬 다운로드 한 페이지로 축소 — 구 하위 라우트는 /ai 로
      { source: '/ai/skill', destination: '/ai', permanent: true },
    ];
  },
};

export default nextConfig;
