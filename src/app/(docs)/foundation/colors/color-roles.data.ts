/** 원본 `docs/foundation/color-roles.md` — Property 표 · 역할 토큰 32행 · Variant 표 · 관련 문서 */

export type PropKind = 'fg' | 'bg' | 'str';

/** 태그·배지 기본 표기 (str 은 화면에 'stroke' 로 노출) */
export const PROP_LABEL: Record<PropKind, string> = {
  fg: 'fg',
  bg: 'bg',
  str: 'stroke',
};

export interface PropBadge {
  kind: PropKind;
  label: string;
}

export const PROP_BADGES: PropBadge[] = [
  { kind: 'fg', label: 'fg: 전경 (텍스트·아이콘)' },
  { kind: 'bg', label: 'bg: 배경 (채움·서피스)' },
  { kind: 'str', label: 'stroke: 선·테두리' },
];

export interface PropertyRow {
  /** `background`, `layer` 처럼 코드 칩이 2개인 행이 있어 배열 */
  categories: string[];
  prop: string;
  desc: string;
}

export const PROPERTY_ROWS: PropertyRow[] = [
  { categories: ['label'], prop: 'fg', desc: '텍스트, 아이콘 등 전경 요소' },
  { categories: ['accent'], prop: 'fg / bg', desc: '브랜드·강조 색상. 텍스트와 배경 양쪽에 사용' },
  { categories: ['fill'], prop: 'bg', desc: 'UI 요소 배경 채움' },
  { categories: ['background', 'layer'], prop: 'bg', desc: '화면 전체 배경 및 레이어 서피스' },
  { categories: ['line'], prop: 'stroke', desc: '구분선, 테두리' },
  { categories: ['interaction'], prop: 'bg overlay', desc: '호버·클릭 상태의 오버레이' },
  { categories: ['static'], prop: 'fg / bg', desc: '라이트·다크 무관하게 고정' },
];

export interface RoleToken {
  /** 토큰명 (예: label/normal) */
  name: string;
  /** CSS 변수명 */
  css: string;
  /** 표기 텍스트 — hex 자체가 콘텐츠라 리터럴 유지 (overlay 는 `#000000 · 50%`) */
  hex: string;
  /** 스와치 배경값 (overlay 만 8자리 hex 로 hex 표기와 다름) */
  swatch: string;
  desc: string;
  prop: PropKind;
  /** 태그 표기 오버라이드 — static 의 'fg / bg' */
  label?: string;
}

export interface RoleGroup {
  name: string;
  desc?: string;
  tokens: RoleToken[];
}

export interface RoleSection {
  /** H3 텍스트 — 앵커 id 가 여기서 파생되므로 원본 바이트 그대로 (— 와 · 포함) */
  heading: string;
  intro: string;
  groups: RoleGroup[];
}

export const ROLE_SECTIONS: RoleSection[] = [
  {
    heading: 'Label',
    intro: '텍스트와 아이콘의 전경색이에요. 강조도 5단계.',
    groups: [
      {
        name: 'label',
        desc: '강조도 높음 → 낮음 순',
        tokens: [
          {
            name: 'label/normal',
            css: '--color-label-normal',
            hex: '#26282b',
            swatch: '#26282b',
            desc: '기본 텍스트 및 아이콘. 가장 높은 강조도',
            prop: 'fg',
          },
          {
            name: 'label/neutral',
            css: '--color-label-neutral',
            hex: '#454c53',
            swatch: '#454c53',
            desc: '중간 강도. 삼단 이상의 정보 위계에서 사용',
            prop: 'fg',
          },
          {
            name: 'label/alternative',
            css: '--color-label-alternative',
            hex: '#72787f',
            swatch: '#72787f',
            desc: '부가적·약한 강도의 텍스트',
            prop: 'fg',
          },
          {
            name: 'label/assistive',
            css: '--color-label-assistive',
            hex: '#9ea4aa',
            swatch: '#9ea4aa',
            desc: '가장 약한 보조 텍스트. 플레이스홀더 등',
            prop: 'fg',
          },
          {
            name: 'label/inverse',
            css: '--color-label-inverse',
            hex: '#ffffff',
            swatch: '#ffffff',
            desc: '어두운 배경 위 반전 텍스트 (툴팁, 토스트 등)',
            prop: 'fg',
          },
        ],
      },
    ],
  },
  {
    heading: 'Accent',
    intro: '브랜드와 핵심 액션을 강조하는 색이에요. Brand·Action·Format·Plan·AI·Link 6역할.',
    groups: [
      {
        name: 'accent/brand',
        desc: '브랜드 블루. 주요 액션과 정보 강조',
        tokens: [
          {
            name: 'accent/brand/neutral',
            css: '--color-accent-neutral',
            hex: '#60a5fa',
            swatch: '#60a5fa',
            desc: '인터랙션 없이 표시만 할 때',
            prop: 'fg',
          },
          {
            name: 'accent/brand/normal',
            css: '--color-accent-normal',
            hex: '#1d7ff9',
            swatch: '#1d7ff9',
            desc: '기본 브랜드 색. 아이콘·버튼에 써요. 링크는 accent/link',
            prop: 'fg',
          },
          {
            name: 'accent/brand/strong',
            css: '--color-accent-strong',
            hex: '#1458ad',
            swatch: '#1458ad',
            desc: '더 강한 강조. hover·pressed 상태 등',
            prop: 'fg',
          },
        ],
      },
      {
        name: 'accent/action',
        desc: 'CTA 버튼 배경색. 검정 계열 고정',
        tokens: [
          {
            name: 'accent/action/normal',
            css: '--color-action-normal',
            hex: '#000000',
            swatch: '#000000',
            desc: 'Primary 버튼 배경 (Black 버튼)',
            prop: 'bg',
          },
          {
            name: 'accent/action/strong',
            css: '--color-action-strong',
            hex: '#454c53',
            swatch: '#454c53',
            desc: '버튼 hover·pressed 상태',
            prop: 'bg',
          },
        ],
      },
      {
        name: 'accent/ai',
        desc: 'AI 기능 전용 보라색 계열',
        tokens: [
          {
            name: 'accent/ai/normal',
            css: '--color-ai-normal',
            hex: '#6f3ad0',
            swatch: '#6f3ad0',
            desc: 'AI 기능 기본 강조색',
            prop: 'fg',
          },
          {
            name: 'accent/ai/strong',
            css: '--color-ai-strong',
            hex: '#511bb2',
            swatch: '#511bb2',
            desc: '더 강한 강조',
            prop: 'fg',
          },
          {
            name: 'accent/ai/ai_hover',
            css: '--color-ai-hover',
            hex: '#f5f1fd',
            swatch: '#f5f1fd',
            desc: 'AI 요소 hover 배경 오버레이',
            prop: 'bg',
          },
          {
            name: 'accent/ai/ai_pressed',
            css: '--color-ai-pressed',
            hex: '#e0d1ff',
            swatch: '#e0d1ff',
            desc: 'AI 요소 pressed 배경 오버레이',
            prop: 'bg',
          },
        ],
      },
      {
        name: 'accent/link',
        desc: '하이퍼링크 전용',
        tokens: [
          {
            name: 'accent/link/normal',
            css: '--color-link-normal',
            hex: '#1d7ff9',
            swatch: '#1d7ff9',
            desc: '기본 링크 색상',
            prop: 'fg',
          },
          {
            name: 'accent/link/strong',
            css: '--color-link-strong',
            hex: '#1458ad',
            swatch: '#1458ad',
            desc: '강조 링크',
            prop: 'fg',
          },
          {
            name: 'accent/link/visited',
            css: '--color-link-visited',
            hex: '#404dc2',
            swatch: '#404dc2',
            desc: '방문한 링크',
            prop: 'fg',
          },
        ],
      },
    ],
  },
  {
    heading: 'State',
    intro: '신규 알림이나 오류 등 시스템 상태를 전달하는 색상이에요.',
    groups: [
      {
        name: 'state',
        tokens: [
          {
            name: 'state/new',
            css: '--color-state-new',
            hex: '#fb4949',
            swatch: '#fb4949',
            desc: '신규 콘텐츠·알림 뱃지',
            prop: 'bg',
          },
          {
            name: 'state/error',
            css: '--color-state-error',
            hex: '#f95c5c',
            swatch: '#f95c5c',
            desc: '오류 메시지, 에러 상태 표시',
            prop: 'fg',
          },
        ],
      },
    ],
  },
  {
    heading: 'Fill',
    intro: '요소 배경을 채우는 색이에요. neutral → normal → strong 순으로 진해져요.',
    groups: [
      {
        name: 'fill',
        desc: '강도 약함 → 강함',
        tokens: [
          {
            name: 'fill/neutral',
            css: '--color-fill-neutral',
            hex: '#f7f8f9',
            swatch: '#f7f8f9',
            desc: '가장 연한 배경. 비활성 영역, 코드 블록 등',
            prop: 'bg',
          },
          {
            name: 'fill/normal',
            css: '--color-fill-normal',
            hex: '#f2f4f6',
            swatch: '#f2f4f6',
            desc: '일반 배경 채움. 입력 필드, 칩, 태그 등',
            prop: 'bg',
          },
          {
            name: 'fill/strong',
            css: '--color-fill-strong',
            hex: '#e8ebed',
            swatch: '#e8ebed',
            desc: '강조된 채움. 눌린 상태, 선택된 배경 등',
            prop: 'bg',
          },
        ],
      },
    ],
  },
  {
    heading: 'Line',
    intro: '구분선과 컴포넌트 테두리에 사용하는 색상이에요.',
    groups: [
      {
        name: 'line',
        desc: '강도 약함 → 강함',
        tokens: [
          {
            name: 'line/neutral',
            css: '--color-line-neutral',
            hex: '#e8ebed',
            swatch: '#e8ebed',
            desc: '가장 연한 구분선. 카드 테두리, 구분자',
            prop: 'str',
          },
          {
            name: 'line/normal',
            css: '--color-line-normal',
            hex: '#c9cdd2',
            swatch: '#c9cdd2',
            desc: '일반 테두리. 입력 필드, 버튼 외곽선',
            prop: 'str',
          },
          {
            name: 'line/strong',
            css: '--color-line-strong',
            hex: '#b3b8bd',
            swatch: '#b3b8bd',
            desc: '강조 테두리. 포커스, 선택 상태',
            prop: 'str',
          },
        ],
      },
    ],
  },
  {
    heading: 'Interaction',
    intro: 'hover·pressed 때 요소 위에 덧씌우는 반투명 오버레이예요.',
    groups: [
      {
        name: 'interaction',
        tokens: [
          {
            name: 'interaction/hover',
            css: '--color-interaction-hover',
            hex: '#f2f4f6',
            swatch: '#f2f4f6',
            desc: '마우스 오버 상태',
            prop: 'bg',
          },
          {
            name: 'interaction/pressed',
            css: '--color-interaction-pressed',
            hex: '#e8ebed',
            swatch: '#e8ebed',
            desc: '클릭·탭 상태',
            prop: 'bg',
          },
        ],
      },
    ],
  },
  {
    heading: 'Background & Layer',
    intro: '앱 전체의 배경 레이어를 구성하는 색상이에요.',
    groups: [
      {
        name: 'background / layer',
        tokens: [
          {
            name: 'background/base',
            css: '--color-background-base',
            hex: '#ffffff',
            swatch: '#ffffff',
            desc: '앱 전체 기본 배경',
            prop: 'bg',
          },
          {
            name: 'layer/surface',
            css: '--color-layer-surface',
            hex: '#ffffff',
            swatch: '#ffffff',
            desc: '카드, 시트, 모달 등 떠 있는 레이어 배경',
            prop: 'bg',
          },
          {
            name: 'layer/overlay',
            css: '--color-layer-overlay',
            hex: '#000000 · 50%',
            swatch: '#00000080',
            desc: '모달·다이얼로그 뒤 딤 처리',
            prop: 'bg',
          },
        ],
      },
    ],
  },
  {
    heading: 'Static',
    intro: '라이트·다크 모드에 관계없이 항상 고정된 색상이에요.',
    groups: [
      {
        name: 'static',
        tokens: [
          {
            name: 'static/white',
            css: '--color-static-white',
            hex: '#ffffff',
            swatch: '#ffffff',
            desc: '항상 흰색으로 고정. 어두운 배경 위 요소 등',
            prop: 'fg',
            label: 'fg / bg',
          },
          {
            name: 'static/black',
            css: '--color-static-black',
            hex: '#000000',
            swatch: '#000000',
            desc: '항상 검정으로 고정. 아이콘, 특수 버튼 등',
            prop: 'fg',
            label: 'fg / bg',
          },
        ],
      },
    ],
  },
];

export interface VariantRow {
  category: string;
  steps: string;
  note: string;
}

export const VARIANT_ROWS: VariantRow[] = [
  {
    category: 'label',
    steps: 'assistive → alternative → neutral → normal → inverse',
    note: 'inverse는 반전(dark bg 위)',
  },
  { category: 'accent/brand', steps: 'neutral → normal → strong', note: 'neutral = 비강조 표시용' },
  { category: 'fill', steps: 'neutral → normal → strong', note: '채움 강도' },
  { category: 'line', steps: 'neutral → normal → strong', note: '테두리 강도' },
  { category: 'accent/action', steps: 'normal → strong', note: 'strong = hover/pressed 용' },
];
