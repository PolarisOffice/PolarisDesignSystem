/**
 * 컴포넌트 카탈로그 — 목록 페이지·사이드바 분류·(후일) MCP 가 공유하는 단일 소스.
 * 원본 `docs/components/index.md` 의 카드 4그룹을 그대로 옮겼다.
 *
 * `slug` 는 라우트이자 컴포넌트 식별자다. Phase 5 에서 살아있는 컴포넌트를 만들 때
 * 파일명은 `toPascalCase(slug).tsx` 규약을 따른다 — 그래야 나중에 MCP 의
 * `componentSavePath()` 가 계산하는 저장 경로와 어긋나지 않는다.
 */

export interface ComponentEntry {
  slug: string;
  name: string;
  desc: string;
  /** 추가된 패키지 버전 — changelog `isNew()` 가 현재 버전과 대조해 "New" 배지를 켠다(다음 minor 에서 저절로 꺼짐) */
  since?: string;
}

export interface ComponentGroup {
  label: string;
  items: ComponentEntry[];
}

/**
 * 소분류와 순서는 **Figma 원본의 컴포넌트 그룹**을 그대로 따른다
 * (Feedback → Action → Overlay → Contents, 2026-09-18). 디자인에서 쓰는 이름과
 * 순서가 문서에서 달라지면 같은 것을 두 이름으로 부르게 된다.
 */
export const COMPONENT_GROUPS: ComponentGroup[] = [
  {
    label: 'Feedback',
    items: [
      { slug: 'loading', name: 'Loading', desc: '처리 중임을 알리는 표시예요. 원형·막대·Skeleton 세 가지가 있어요.', since: '1.1.0' },
      { slug: 'popup', name: 'Popup', desc: '사용자의 확인이 필요한 경우 표시되는 모달 컴포넌트예요.' },
      { slug: 'toast', name: 'Toast', desc: '화면에 일시적으로 나타나 상태나 결과를 안내하는 컴포넌트예요.' },
      { slug: 'tooltip', name: 'Tooltip', desc: 'UI 요소에 대한 추가 정보를 간략하게 제공하는 컴포넌트예요.' },
    ],
  },
  {
    label: 'Action',
    items: [
      // 그룹 내 이름 오름차순 정렬 (2026-08-13) — 새 항목도 알파벳 자리에 넣는다
      { slug: 'button', name: 'Button', desc: '사용자의 액션을 유도하는 기본 인터랙션 컴포넌트예요.' },
      { slug: 'checkbox', name: 'Checkbox & Radio', desc: '다중 선택 또는 단일 선택 옵션을 제공하는 컴포넌트예요.' },
      { slug: 'input', name: 'Input Field', desc: '사용자로부터 텍스트를 입력받는 컴포넌트예요.' },
      { slug: 'segment-control', name: 'Segment Control', desc: '상호 배타적인 옵션 중 하나를 선택하거나 콘텐츠를 필터링해요.' },
      { slug: 'tabs', name: 'Tabs', desc: '한 화면 내에서 콘텐츠를 탭 단위로 구분하여 전환하는 컴포넌트예요.' },
      { slug: 'toggle', name: 'Toggle', desc: '켜짐/꺼짐 두 가지 상태를 즉시 전환할 때 사용해요.' },
    ],
  },
  {
    label: 'Overlay',
    items: [
      { slug: 'context-menu', name: 'Context & Menu Item', desc: '컨텍스트에 따라 옵션 목록을 오버레이로 표시하는 컴포넌트예요.' },
      { slug: 'select', name: 'Select', desc: '미리 정의된 옵션 목록에서 하나를 선택하는 컴포넌트예요.' },
    ],
  },
  {
    label: 'Contents',
    items: [
      { slug: 'table', name: 'Table', desc: '행과 열로 구성된 데이터를 시각적으로 정렬하여 표시해요.' },
    ],
  },
];
