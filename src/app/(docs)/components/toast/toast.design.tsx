import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import { Toast } from '@polarisoffice/pds-react';
import UsageGrid from '@/components/docs/UsageGrid';
import { CaseList, CaseBlock } from '@/components/docs/CaseList';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import Swatch from '@/components/docs/Swatch';
import {
  TOAST_ANATOMY,
  TOAST_ANTI_CASES,
  TOAST_CONTAINER,
  TOAST_CONTEXT,
  TOAST_STATUS_ICON,
  TOAST_TYPOGRAPHY,
  TOAST_USAGE,
  TOAST_VARIANTS,
  TOAST_VS_POPUP,
} from './toast.data';
import s from './toast.module.css';

/**
 * Toast — Design 탭.
 *
 * 목차 표준화(2026-08-13 목차 감사 방침 시행): 원본은 `## Case` 가 Specification **뒤**에
 * 있고 그 안에 스펙 표(`Typography & Color`)가 섞여 있었다. 표준 골격(Anatomy → Properties →
 * Case → Guidelines → Specification)으로 재배치하고 스펙 표는 Specification 으로 옮겼다.
 * **헤딩 텍스트는 전부 보존 — 앵커 id 는 하나도 안 바뀌고 순서만 달라진다.**
 *
 * 명명 통일(2026-08-13): Typography & Color → Typography (typography-color→typography).
 * 구 앵커는 anchor-aliases.ts 가 구제한다.
 *
 * 디자인 검토 반영(2026-08-28): ① Variant 표 Icon 열의 글자(!, ✓) → 실물 아이콘
 * (StatusIconSample — 아래 주석) ② Case > 의도와 맥락의 각 케이스에 실물 Toast 프리뷰
 * (포지셔닝만 중화한 진짜 컴포넌트, 예문 텍스트 줄은 프리뷰가 대신한다).
 */

/**
 * 패키지 Toast 의 상태 아이콘 — 표시용 재현.
 *
 * 원본은 `packages/pds-react/src/components/toast/index.tsx` 의 `StatusIcon`(20px 자리
 * 안의 16px 글리프, 원+기호 일체형 self-contained SVG)인데 export 되지 않고, Toast
 * 전체를 표 셀에 앉힐 수도 없어 소스의 지오메트리와 토큰 참조(원 = state-error /
 * state-success 폴백 포함 그대로, 기호 = static-white)를 축자로 옮겼다 — 임의 창작
 * 아님. **원본 StatusIcon 이 바뀌면 여기도 같이 고칠 것.**
 */
function StatusIconSample({ type, decorative = false }: { type: 'success' | 'error'; decorative?: boolean }) {
  const tint =
    type === 'success' ? 'var(--color-state-success, #51b41b)' : 'var(--color-state-error, #f95c5c)';
  const glyph = 'var(--color-static-white, #ffffff)';
  return (
    <span
      className={s.statusIcon}
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': type === 'success' ? 'Checkmark circle 아이콘' : 'Exclamation circle 아이콘' })}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
        <circle cx="8" cy="8" r="8" fill={tint} />
        {type === 'success' ? (
          <path
            d="M4.5 8.2L6.9 10.6L11.5 6"
            stroke={glyph}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <>
            <path d="M8 4.2V8.9" stroke={glyph} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="8" cy="11.4" r="0.95" fill={glyph} />
          </>
        )}
      </svg>
    </span>
  );
}
export default function ToastDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      {/* 실물 기반 도해 — 패키지 Toast 를 렌더해 파트를 실측·콜아웃한다(번호는 아래 legend 와 같은 축).
          Toast 는 position:fixed 로 뷰포트에 뜨는 컴포넌트 — Popup 과 같이 transform 래퍼가
          containing block 이 되어 미니 뷰포트 안에 가둔다(정적 style 뿐). 래퍼 높이 98 = 토스트 48 +
          스펙의 화면 하단 여백(bottom: 50px)인데, 그 50px 은 도해에서 보면 빈 공간일 뿐이라
          marginBottom -50 으로 레이아웃에서 걷어낸다(2026-09-04 "아래 여백 과다" 피드백) — 토스트
          위치·콜아웃 실측은 그대로, 하단 여백 수치는 Specification 표가 담당. 견본은 success 타입 —
          02 Status Icon 은 default 타입에선 렌더되지 않는다. 04 Close 는 onClose(함수 prop — RSC
          경계 불가)가 있어야만 렌더되므로 이 견본에선 콜아웃을 배선하지 않는다. */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: '[role="status"]', anchor: 'left' },
          { n: '02', selector: '[role="status"] span[aria-hidden="true"]' },
          { n: '03', selector: '[role="status"] > div > span:last-of-type' },
        ]}
      >
        <div style={{ width: 300, height: 98, marginBottom: -50, transform: 'translateZ(0)' }}>
          <Toast message="변경 사항이 저장되었습니다." type="success" />
        </div>
      </AnatomyFigure>
      <Anatomy items={[...TOAST_ANATOMY]} />

      <H2>Properties</H2>

      <H3>Variant</H3>
      <p>
        Default · Error · Success 세 가지. <TabSwitchLink to="code">코드로 보기</TabSwitchLink>
      </p>
      <SpecTable
        caption="Toast variant 별 아이콘과 색상"
        columns={[
          { key: 'variant', header: 'Variant', width: '18%' },
          { key: 'icon', header: 'Icon', width: '12%' },
          { key: 'color', header: '색상', width: '30%' },
          { key: 'usage', header: '용도', width: '40%' },
        ]}
        rows={TOAST_VARIANTS.map((v) => ({
          variant: <strong>{v.label}</strong>,
          // 실물 아이콘 (2026-08-28 검토 반영) — default 는 상태 아이콘이 없어 데이터의 '—' 그대로
          icon: v.name === 'default' ? v.icon : <StatusIconSample type={v.name} />,
          color: v.color ? <Swatch hex={v.color} token={v.colorToken} /> : '—',
          usage: v.usage,
        }))}
      />

      <H3>Position</H3>
      <p>
        화면 상단 또는 하단에 50px 여백을 두고 띄워요.
      </p>

      <H2>Case</H2>

      <H3>의도와 맥락</H3>
      <p>
        흐름을 끊지 않고 액션 결과를 바로 알릴 때 써요. 알아서 사라지니 응답이 필요 없는 상황에만이에요.
      </p>
      <CaseList>
        {/* 케이스마다 예문을 실물 Toast 로 렌더 (2026-08-28 검토 반영 — "여기도 프리뷰 필요").
            포지셔닝(fixed·centering transform)만 css 로 중화한 진짜 패키지 컴포넌트라
            치수·색·아이콘이 스펙과 드리프트하지 않는다. variant 짝은 Demo 탭의 호출
            (success·error·success)과 동일. onClose 미배선(RSC 경계)이라 Close 버튼은
            안 나온다 — Anatomy 견본과 같은 제약. 구 "예) …" 텍스트 줄은 프리뷰가 대신한다. */}
        {TOAST_CONTEXT.map((c) => (
          <CaseBlock key={c.n} badge={c.n} title={c.title} sub={c.desc}>
            <div className={s.casePreview}>
              <Toast className={s.caseToast} message={c.sample} type={c.type} />
            </div>
          </CaseBlock>
        ))}
        <CaseBlock badge="!" tone="caution" title="이런 경우엔 Toast를 쓰지 마세요">
          <ul>
            {TOAST_ANTI_CASES.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </CaseBlock>
      </CaseList>

      <H2>Guidelines</H2>
      <UsageGrid do={[...TOAST_USAGE.do]} dont={[...TOAST_USAGE.dont]} />

      <H3>Toast vs Popup</H3>
      <SpecTable
        caption="Toast 와 Popup 선택 기준"
        columns={[
          { key: 'item', header: '', width: '34%' },
          { key: 'toast', header: 'Toast', width: '33%' },
          { key: 'popup', header: 'Popup', width: '33%' },
        ]}
        rows={TOAST_VS_POPUP.map((r) => ({ item: <strong>{r.item}</strong>, toast: r.toast, popup: r.popup }))}
      />

      <H2>Specification</H2>

      <H3>Container</H3>
      <SpecTable
        caption="Toast 컨테이너 스펙"
        columns={[
          { key: 'prop', header: '속성', width: '30%' },
          { key: 'value', header: '값', width: '38%' },
          { key: 'desc', header: '설명', width: '32%' },
        ]}
        rows={TOAST_CONTAINER.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />

      <H3>Status Icon</H3>
      <SpecTable
        caption="상태 아이콘"
        columns={[
          { key: 'variant', header: 'Variant', width: '22%' },
          { key: 'bg', header: 'Background', width: '32%' },
          { key: 'icon', header: 'Icon', width: '46%' },
        ]}
        rows={TOAST_STATUS_ICON.map((r) => ({
          variant: <strong>{r.variant}</strong>,
          bg: <Swatch hex={r.bg} token={r.bgToken} />,
          // Variant 표와 같은 실물 아이콘을 이름 옆에 — 설명 텍스트가 있어 decorative
          icon: (
            <span className={s.iconCell}>
              <StatusIconSample type={r.variant === 'Error' ? 'error' : 'success'} decorative />
              {r.icon}
            </span>
          ),
        }))}
      />
      <p className="kit-muted">size: 20×20px · self-contained SVG (원+기호 일체형)</p>

      <H3>Typography</H3>
      <SpecTable
        caption="Toast 타이포그래피와 색상"
        columns={[
          { key: 'el', header: '요소', width: '30%' },
          { key: 'size', header: 'Size', width: '20%' },
          { key: 'weight', header: 'Weight', width: '16%' },
          { key: 'color', header: 'Color', width: '34%' },
        ]}
        rows={TOAST_TYPOGRAPHY.map((r) => ({
          el: r.el,
          size: <SpecVal>{r.size}</SpecVal>,
          weight: r.weight,
          color: <SpecVal>{r.color}</SpecVal>,
        }))}
      />
    </>
  );
}
