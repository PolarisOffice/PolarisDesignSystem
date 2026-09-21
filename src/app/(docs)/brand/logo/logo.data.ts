/** 로고 에셋 데이터 — 폴라리스오피스 2026 패키지 + 사용 가이드.
 * 폴라리스그룹·계열사·제품 BI 데이터는 2026-08-25 삭제(문서 범위에서 제외). */

/* ────────────────────────────────────────────────────────────
 * 사용 가이드 — 정본: 「Polaris Office Logo Usage Basics」 (디자인팀, 7섹션 PDF)
 * 2026-08-13 반영. 아래 데이터는 PDF 의 문구·항목을 그대로 옮긴 것(창작 없음).
 * ──────────────────────────────────────────────────────────── */

/** 01 로고 사용 용도 — 화면용(RGB) / 인쇄용(CMYK) */
/** 2026-09-18 부터 페이지에는 안 그린다(PDF 몫) — scripts/generate-pds-design-md.mjs 의 로고 규칙 절만 읽는다 */
export const LOGO_MEDIUMS = [
  {
    name: '화면용',
    mode: 'RGB',
    purpose: '모니터, 모바일 등 디지털 콘텐츠 제작 시',
    examples: '홈페이지, 이메일 서명, PPT, 영상 제작, SNS 게시물, 유튜브 썸네일, 배너 광고, 앱 화면',
  },
  {
    name: '인쇄용',
    mode: 'CMYK',
    purpose: '종이 또는 실물 제작 시',
    examples: '명함, 현수막, 리플릿, 브로슈어, 포스터, 스티커, 패키지, 굿즈, 사인물',
  },
] as const;

/** 02~05 로고 버전 선택 기준 */
export const LOGO_VERSIONS = [
  {
    name: '컬러 로고',
    rule: '기본',
    desc: '특별한 경우를 제외하고 모든 환경에서 컬러 로고를 사용해요. 어두운 배경에서는 어두운 배경용 로고를 사용해 배경과 로고가 명확하게 구분되게 해요.',
    examples: '가로형·세로형 × 라이트·다크 배경 4종',
  },
  {
    name: '아이콘 로고',
    rule: '한 가지 버전만',
    desc: '배경과 명확히 분리되어 보이도록 충분한 대비가 있는 곳에 배치해요.',
    examples: '화면용·인쇄용',
  },
  {
    name: '흑백 로고',
    rule: '보완적 사용',
    desc: '인쇄 출력 시 제약이 있는 경우, 저해상도 매체 등 컬러 표현이 제한되는 경우에만 보완적으로 사용해요.',
    examples: '단색 인쇄용 요청 · 도장·냅킨·볼펜 등 1도 인쇄물 · 경조사용 물품',
  },
  {
    name: '회색조 로고',
    rule: '보완적 사용',
    desc: '컬러를 사용할 수 없고 회색으로 표현하는 경우 사용해요. 배경 색상에 따라 밝은 회색 또는 어두운 회색 로고를 선택해요.',
    examples: '회색조 PDF·보고서 · 흑백 인쇄물 · 흑백 프린터 출력',
  },
] as const;

/**
 * 06 금지 사항 9종 — 텍스트는 PDF 항목 그대로, 시각화만 추가(2026-08-25 피드백: "줄글로만
 * 나오니까 직관적이지 못하다" → Do/Don't 비주얼 페어로 개선, 사용자가 3안 중 직접 선택).
 *
 * `kind` 미지정(기본)이면 실제 화면용 가로형 SVG(PO26_DONT_LOGO)에 `demoClass` CSS를 씌워
 * 위반 사례를 재현한다 — 가짜 일러스트가 아니라 진짜 브랜드 에셋을 변형해서 보여준다.
 * 세 항목만 img 변형으로 재현이 안 돼 `kind` 로 분기: pattern(텍스처 남용) · font(서체 치환) ·
 * ai(SVG 터뷸런스 왜곡, page.tsx 의 숨은 필터 정의 참고).
 */
export interface LogoDontDemo {
  label: string;
  kind?: 'pattern' | 'font' | 'ai';
  /** kind 없을 때만 사용 — logo.module.css 의 .dont* 변형 클래스 키 */
  demoClass?: string;
}

export const LOGO_DONTS: LogoDontDemo[] = [
  { label: '생성형 AI를 이용한 변형·왜곡 금지', kind: 'ai' },
  { label: '비율 변경 및 회전 금지', demoClass: 'dontRotate' },
  { label: '색상 변경 및 임의 효과(선, 그림자 등) 추가 금지', demoClass: 'dontColor' },
  { label: '주변 요소 및 가장자리 밀착 배치 금지', demoClass: 'dontCrowd' },
  { label: '복잡한 배경 또는 저대비 영역 사용 금지', demoClass: 'dontBusyBg' },
  { label: '저해상도·저품질 사용 금지', demoClass: 'dontLowRes' },
  { label: '잘린 형태 사용 금지', demoClass: 'dontCrop' },
  { label: '용도에 맞지 않는 사용 금지', kind: 'pattern' },
  { label: '서체 변경 금지', kind: 'font' },
];

/** Do/Don't 프리뷰가 공유하는 실물 로고 — 화면용 가로형(SVG).
 * ⚠️ 리터럴 직접 작성 — 아래 `PO26` 상수보다 먼저 나오는 위치라 참조하면 TDZ 로 죽는다.
 * ('용도에 맞지 않는 사용' 텍스처 데모의 심볼 아이콘은 CSS background-image 리터럴로만
 * 참조돼 여기 상수가 필요 없다 — logo.module.css `.dontPatternWrap` 참고) */
export const PO26_DONT_LOGO = '/brand-assets/logos/po-2026/화면용/화면용_가로형.svg';

/* ── 폴라리스오피스 로고 2026 공식 배포 패키지 (2026-08-24) ──
 * public/brand-assets/logos/po-2026/ — 디자인팀 배포 폴더(화면용/인쇄용/흑백·회색조)를 그대로 보존한다.
 * (brand-assets/ 는 브랜드 자산 라이선스 폴더 — public/brand-assets/LICENSE.md, 2026-09-04 이동)
 * 페이지 위계는 매체가 아니라 **로고 변형** 기준(2026-08-24 피드백) — 미리보기는 화면용,
 * 매체 분기는 카드 안 포맷 버튼(SVG·PNG=화면용 / 인쇄용=CMYK PNG)으로 한다.
 * AI 원본은 변형별 파일이 아니라 **전체로고 한 파일**(모든 변형 포함) — 상단 zip 3종에 동봉
 * (개별 원본 항목은 2026-08-24 중복으로 제거).
 * 카드가 이 데이터에서 파생되므로 패키지가 갱신되면 여기만 고친다. */
export const PO26 = '/brand-assets/logos/po-2026';
export const PO26_PACKAGE_ZIP = `${PO26}/polaris-office-logo-2026.zip`;
/** 매체별 전체 zip — 해당 폴더(변형 PNG/SVG + 아이콘 + 전체로고 AI·PDF) 통째 */
export const PO26_PRINT_ZIP = `${PO26}/polaris-office-logo-print.zip`;
export const PO26_SCREEN_ZIP = `${PO26}/polaris-office-logo-screen.zip`;
/** 가이드 PDF 가 놓일 경로. ⚠️ 2026-09-04 현재 파일은 없다 — 수정 중이라 public 에서 제거했고
 * 전체 패키지 zip(polaris-office-logo-2026.zip)에서도 뺐다. 수정본이 나오면 이 경로에 올리고 zip 에
 * 다시 넣은 뒤 아래 `comingSoon` 잠금을 푼다. */
export const PO26_GUIDE_PDF = `${PO26}/Polaris Office Logo Usage Basics.pdf`;
/** 가이드 PDF 다운로드 잠금 문구 — 버튼을 비활성으로 두고 마우스를 올리면 이 문구를 툴팁으로 띄운다.
 * 문서가 정리되면 page.tsx 의 `comingSoon` prop 과 이 상수를 함께 제거한다. */
export const PO26_GUIDE_COMING_SOON = '가이드 문서는 곧 만나보실 수 있습니다.';

/** 페이지 타이틀 옆 '전체 다운로드' 메뉴 — zip 3종 중 선택 (2026-08-25) */
export const PO26_ALL_ITEMS: { label: string; href: string }[] = [
  { label: '전체 패키지 (ZIP)', href: PO26_PACKAGE_ZIP },
  { label: '인쇄용 (.ai, PDF)', href: PO26_PRINT_ZIP },
  { label: '화면용 (.ai, PDF)', href: PO26_SCREEN_ZIP },
];

export interface Po26Format {
  label: string;
  href: string;
}

export interface Po26Asset {
  name: string;
  preview: string;
  /** 가로형(h) / 세로형(v) / 심볼(icon) — 프리뷰 크기 클래스 선택 */
  kind: 'h' | 'v' | 'icon';
  /** 어두운배경용 — 딥블루 타일 위에 프리뷰 */
  dark?: boolean;
  /**
   * 프리뷰 배경 강제 지정 — 기본(회색 fill-neutral / dark 시 딥블루) 대신 쓸 값.
   * 흑백·회색조는 투명 SVG 가 아니라 흰 캔버스가 그대로 찍힌 JPG 라, 회색 배경 위에서
   * 흰 사각형이 붕 뜬 것처럼 보였다(2026-08-25 피드백) — 캔버스와 같은 순백(테마 불변
   * static-white)으로 맞춰 이음매를 없앤다.
   */
  previewBg?: string;
  /** 화면용 드롭다운 항목(SVG·PNG …) — 있으면 '화면용 ▾' 메뉴 버튼으로 렌더 (2026-08-24) */
  screen?: Po26Format[];
  /** 개별 버튼 (인쇄용 / 가로·세로) */
  formats?: Po26Format[];
}

const screen = `${PO26}/화면용`;
const print = `${PO26}/인쇄용`;
const mono = `${PO26}/흑백`;

/** 주 변형 4종 — 미리보기는 화면용 SVG, 버튼으로 화면용(SVG·PNG)/인쇄용 분기 */
export const PO26_LOGOS: Po26Asset[] = [
  {
    name: '가로형',
    preview: `${screen}/화면용_가로형.svg`,
    kind: 'h',
    screen: [
      { label: 'SVG', href: `${screen}/화면용_가로형.svg` },
      { label: 'PNG', href: `${screen}/화면용_가로형.png` },
    ],
    formats: [{ label: '인쇄용', href: `${print}/인쇄용_가로형.png` }],
  },
  {
    name: '가로형 (어두운 배경)',
    preview: `${screen}/화면용_가로형_어두운배경용.svg`,
    kind: 'h',
    dark: true,
    screen: [
      { label: 'SVG', href: `${screen}/화면용_가로형_어두운배경용.svg` },
      { label: 'PNG', href: `${screen}/화면용_가로형_어두운배경용.png` },
    ],
    formats: [{ label: '인쇄용', href: `${print}/인쇄용_가로형_어두운배경용.png` }],
  },
  {
    name: '세로형',
    preview: `${screen}/화면용_세로형.svg`,
    kind: 'v',
    screen: [
      { label: 'SVG', href: `${screen}/화면용_세로형.svg` },
      { label: 'PNG', href: `${screen}/화면용_세로형.png` },
    ],
    formats: [{ label: '인쇄용', href: `${print}/인쇄용_세로형.png` }],
  },
  {
    name: '세로형 (어두운 배경)',
    preview: `${screen}/화면용_세로형_어두운배경용.svg`,
    kind: 'v',
    dark: true,
    screen: [
      { label: 'SVG', href: `${screen}/화면용_세로형_어두운배경용.svg` },
      { label: 'PNG', href: `${screen}/화면용_세로형_어두운배경용.png` },
    ],
    formats: [{ label: '인쇄용', href: `${print}/인쇄용_세로형_어두운배경용.png` }],
  },
];

/** 보조 변형 — 소형 카드 한 줄 (아이콘 프리뷰가 크면 부담스럽다는 2026-08-24 피드백) */
export const PO26_SMALL: Po26Asset[] = [
  {
    name: '심볼',
    preview: `${screen}/아이콘/화면용_아이콘.svg`,
    kind: 'icon',
    screen: [
      { label: 'SVG', href: `${screen}/아이콘/화면용_아이콘.svg` },
      { label: 'PNG 512px', href: `${screen}/아이콘/화면용_아이콘_512px.png` },
      { label: 'PNG 144px', href: `${screen}/아이콘/화면용_아이콘_144px.png` },
    ],
    formats: [{ label: '인쇄용', href: `${print}/아이콘/인쇄용_아이콘.png` }],
  },
  {
    name: '흑백',
    preview: `${mono}/가로.jpg`,
    kind: 'h',
    previewBg: 'var(--color-static-white)',
    formats: [
      { label: '가로', href: `${mono}/가로.jpg` },
      { label: '세로', href: `${mono}/세로.jpg` },
    ],
  },
  {
    name: '회색조',
    preview: `${mono}/회색조/가로.jpg`,
    kind: 'h',
    previewBg: 'var(--color-static-white)',
    formats: [
      { label: '가로', href: `${mono}/회색조/가로.jpg` },
      { label: '세로', href: `${mono}/회색조/세로.jpg` },
    ],
  },
];
