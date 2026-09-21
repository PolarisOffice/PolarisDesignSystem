import pdsPkg from '../../../packages/pds-react/package.json';

/**
 * 변경 이력 — 버전별로 무엇이 바뀌었는지 남기는 단일 소스(2026-09-18 신설).
 *
 * 세 곳이 읽는다:
 *  · `/changelog` 페이지 — 목록 그대로
 *  · 푸터 "업데이트 YYYY.MM.DD" — **날짜가 있는 첫 항목**의 날짜(구 PDS_UPDATED 손관리 상수 대체.
 *    빌드 시점 날짜를 쓰면 내용 없이 재빌드만 해도 바뀌어 거짓 신호가 되므로 릴리스에 묶는다)
 *  · 컴포넌트 목록의 "New" 배지 — `isNew()` (components-catalog `since` 와 대조)
 *
 * 쓰는 법: 컴포넌트·토큰을 바꾸면 **맨 위에** 새 버전 항목을 적되 `date: null` 로 둔다.
 * `npm run release:pds` 가 맨 위 항목의 version 이 새 버전과 같은지 확인하고 날짜를 그날로 채운다
 * (다르면 중단 — 이력 없이 발행되지 않게). 형식은 스크립트가 정규식으로 읽으므로
 * **첫 줄 `{ version: '…', date: … ,` 모양을 유지**할 것.
 */
export interface ChangelogEntry {
  version: string;
  /** 발행일 YYYY.MM.DD — null 이면 아직 발행 전(release:pds 가 채운다) */
  date: string | null;
  /** 새로 생긴 것 — 컴포넌트·export·prop */
  added?: string[];
  /** 바뀐 것 — 값·동작·문구 */
  changed?: string[];
  /** 고친 것 — 버그 */
  fixed?: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.1.0',
    date: '2026.09.18',
    added: [
      'Loading: ProgressCircle(18·24·32·48)·ProgressBar(indeterminate·determinate)',
      'Skeleton: rect·circle·text',
    ],
    changed: [
      'Button: loading 이면 아이콘 자리에 스피너. 회색 비활성 얼굴로 가라앉던 것을 걷어내 버튼 색을 유지한다',
      'Dim: 자체 스피너를 ProgressCircle 48(static/white)로 교체',
      'Button: Figma 재대조. 아이콘 간격 전 사이즈 4px, 24 radius 6px, 64 행간 1.4·자간 −1.5%, Default·Gray hover 글자색, Disabled 글자·테두리 토큰',
    ],
  },
  {
    version: '1.0.7',
    date: '2026.09.15',
    changed: [
      'Button variant 에 JSDoc 추가(기본값 primary, 목록 밖 값 폴백 동작)',
      'npm 발행 자동화(미러 Trusted Publishing). 정본에는 태그를 찍지 않는다',
    ],
  },
  {
    version: '1.0.6',
    date: '2026.09.09',
    fixed: ['Sub 버튼 다크 모드 2건. 라이트 값이 그대로 밝은 판으로 남던 문제'],
  },
  {
    version: '1.0.5',
    date: '2026.09.04',
    changed: ['NOTICE 를 법무팀 확정 문안으로 교체', '라이선스 Apache-2.0 으로 첫 발행'],
  },
  {
    version: '1.0.4',
    date: '2026.09.01',
    fixed: ['Checkbox 레이블 간격 10 → 0 (문서 스펙과 동기화)'],
  },
  {
    version: '1.0.3',
    date: '2026.09.01',
    changed: ['배포물(dist·zip)에서 내부 주석 제거. 소스는 그대로'],
    fixed: ['Radio 점 8px 정중앙'],
  },
  {
    version: '1.0.2',
    date: '2026.09.01',
    changed: ['repository 메타데이터 추가', 'Pretendard CDN @import 제거. 서체는 프로젝트가 로드'],
  },
  {
    version: '1.0.1',
    date: '2026.08.28',
    changed: ['radius 스케일 재편(xxs 4·xs 6)', 'Tabs 인디케이터 규칙 확정', 'Tooltip 을 한 도형으로 렌더'],
  },
  {
    version: '1.0.0',
    date: '2026.08.26',
    added: [
      '첫 발행: Button·InputField·Toggle·Checkbox·Radio·Tabs·SegmentControl·Select·Menu·Badge·Credit·Table·Tooltip·Toast·Popup·Dim·IconButton + 토큰 CSS',
    ],
  },
];

/** 현재 패키지 버전 — 빌드 시점 package.json */
export const PDS_VERSION: string = pdsPkg.version;

/** 푸터 "업데이트" 날짜 — 발행된(날짜 있는) 가장 최근 항목 */
export const PDS_UPDATED: string = CHANGELOG.find((e) => e.date)?.date ?? '';

const minor = (v: string) => v.split('.').slice(0, 2).join('.');

/**
 * 이 컴포넌트가 "새것"인가 — 추가된 버전(`since`)이 현재 버전과 같은 major.minor 면 참.
 * patch 릴리스(1.1.1)에서도 유지되고 다음 minor(1.2.0)에서 저절로 꺼진다 — 손으로 떼지 않는다.
 * 아직 발행 전(package.json 이 이전 버전)이면 거짓이라, 배지는 release:pds 와 함께 켜진다.
 */
export const isNew = (since?: string): boolean => Boolean(since) && minor(since!) === minor(PDS_VERSION);
