import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecVal } from '@/components/docs/SpecTable';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import { Button, Popup } from '@polarisoffice/pds-react';
import UsageGrid from '@/components/docs/UsageGrid';
import { CaseList, CaseBlock } from '@/components/docs/CaseList';
import { TabSwitchLink } from '@/components/docs/DocTabs';
import {
  POPUP_ANATOMY,
  POPUP_ANTI_CASES,
  POPUP_BUTTON,
  POPUP_CONTAINER,
  POPUP_CONTEXT,
  POPUP_TYPOGRAPHY,
  POPUP_USAGE,
  POPUP_X_RULES,
} from './popup.data';
import s from './popup.module.css';

/**
 * Popup — Design 탭.
 * 목차 표준화(2026-08-13 목차 감사 방침 시행): 원본이 `## Properties` 아래 섞어 두었던
 * 가이드 3절을 분리했다 — `의도와 맥락`은 새 `## Case`(toast 와 동일 패턴) 아래로,
 * `다시 보지 않기`·`배치`는 `## Guidelines` 로. **헤딩 텍스트 전부 보존 = 기존 앵커 id 전부
 * 유지**, 새로 생기는 id 는 `case` 하나뿐이다.
 *
 * 디자인 검토 반영(2026-08-28): Case > 의도와 맥락의 각 케이스에 실물 Popup 프리뷰 —
 * 포지셔닝만 중화한 진짜 컴포넌트(toast 확정 패턴), 구 "예) …" 텍스트 줄은 프리뷰가 대신한다.
 */
export default function PopupDesign() {
  return (
    <>
      <p className="kit-muted">
        이 문서의 치수·스펙은 <strong>Web 기준</strong>이에요 (2026-08-21 개편, Figma Popup 의 web
        변형이 정본). Mobile 변형 스펙은 추후 반영 예정이에요.
      </p>

      <H2>Anatomy</H2>
      {/* 실물 기반 도해 — 패키지 Popup 을 렌더해 파트를 실측·콜아웃한다(번호는 아래 legend 와 같은 축).
          Popup 은 화면 전체를 덮는 fixed 오버레이라 그대로는 문서를 덮는다 — transform 래퍼가
          containing block 이 되어 `fixed; inset: 0` 을 375px 미니 뷰포트 안에 가둔다(정적 style 뿐).
          견본은 Figma 의 'TWO BTN 다시보지않기' 케이스 — 현행 코드 패키지(모바일 사양) 렌더라
          세부 치수는 아래 Web 스펙 표가 정본이고, 패키지가 web 사양으로 갱신되면 자동 반영된다. 02 Close(X) 는 onClose(함수 prop — RSC
          경계 불가) 전제인 데다 TWO BTN 과 상호배타라 이 견본에선 콜아웃을 배선하지 않는다. */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: '[role="dialog"] h2', anchor: 'left' },
          { n: '03', selector: '[role="dialog"] p', anchor: 'right' },
          { n: '04', selector: '[role="dialog"] button:first-of-type' },
          { n: '05', selector: '[role="dialog"] button:last-of-type' },
          { n: '06', selector: '[role="dialog"] label' },
        ]}
      >
        <div style={{ width: 375, height: 260, transform: 'translateZ(0)', borderRadius: 12, overflow: 'hidden' }}>
          <Popup
            open
            title="새 버전으로 업데이트할까요?"
            dontShowAgain={false}
            footer={
              <>
                {/* Web 변형의 팝업 버튼은 32 — 팝업이 높이를 강제하므로 크기 축도 맞춘다
                    (48 을 남기면 패딩·폰트만 48짜리가 되어 어긋난다) */}
                <Button variant="default" size={32}>
                  나중에
                </Button>
                <Button variant="primary" size={32}>
                  업데이트
                </Button>
              </>
            }
          >
            새 기능과 개선 사항이 담겨 있어요.
          </Popup>
        </div>
      </AnatomyFigure>
      <Anatomy items={[...POPUP_ANATOMY]} />

      <H2>Properties</H2>

      <H3>Button Type</H3>
      <p>
        ONE BTN 과 TWO BTN 두 가지 구성이에요. 되돌릴 수 없는 액션에는 취소 수단이 있는 TWO BTN 을 써요.{' '}
        <TabSwitchLink to="code">코드로 보기</TabSwitchLink>
      </p>

      <H3>Close (X) Button</H3>
      <p>
        X 버튼은 버튼 레이블이 <strong>&apos;닫기&apos;가 아닌 경우</strong>에 추가해요.
        &apos;닫기&apos; 레이블 버튼이 있는 경우와 Alert처럼 정보성 모달에는 X를 표시하지 않아요.
      </p>

      <H2>Case</H2>

      <H3>의도와 맥락</H3>
      <p>
        Popup은 사용자의 명시적인 응답 없이는 다음 단계로 진행할 수 없는 상황에 사용해요. 화면을 차단하는
        만큼, 꼭 필요한 경우에만 제한적으로 사용해야 해요.
      </p>
      <CaseList>
        {/* 케이스마다 예문을 실물 Popup 으로 렌더 (2026-08-28 검토 반영 — toast 와 같은 패턴).
            className 이 딤(fixed)에 붙으므로 포지셔닝만 css 로 중화 — 딤·패널·버튼 강제
            스타일이 전부 실물이라 스펙과 드리프트하지 않는다. 견본 문구·버튼 variant 는
            popup.data.ts 주석대로 구 예문·Demo 탭 호출과 동일(창작 없음). onClose 미배선
            (RSC 경계)이라 X·딤 클릭·Esc 는 없다 — 프리뷰는 그림이므로(inert/aria-hidden,
            toggle 패턴) 무방하고, 살아있는 데모는 Demo 탭에 있다. 구 "예) …" 줄은 프리뷰가
            대신한다. */}
        {POPUP_CONTEXT.map((c) => (
          <CaseBlock key={c.n} badge={c.n} title={c.title} sub={c.desc}>
            {/* data-anatomy-sample — 실물 견본 헤딩(Popup 내부 h2)이 문서 정답지·slug-check 에
                안 잡히게 하는 마커 (refresh-headings.ts stripNonDocSubtrees 참고) */}
            <div className={s.casePreview} data-anatomy-sample="" inert aria-hidden="true">
              <Popup
                className={s.casePopup}
                open
                title={c.sample.title}
                footer={c.sample.actions.map((a) => (
                  /* Web 변형의 팝업 버튼은 32 — Anatomy 견본과 같은 이유로 크기 축을 맞춘다 */
                  <Button key={a.label} variant={a.variant} size={32}>
                    {a.label}
                  </Button>
                ))}
              >
                {c.sample.body}
              </Popup>
            </div>
          </CaseBlock>
        ))}
        <CaseBlock badge="!" tone="caution" title="이런 경우엔 Popup을 쓰지 마세요">
          <ul>
            {POPUP_ANTI_CASES.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </CaseBlock>
      </CaseList>

      <H2>Guidelines</H2>
      <UsageGrid do={[...POPUP_USAGE.do]} dont={[...POPUP_USAGE.dont]} />

      <H3>다시 보지 않기</H3>
      <p>반복 노출을 막아야 하는 정보성 팝업에만 제공해요. ONE BTN·TWO BTN 둘 다에 붙일 수 있어요.</p>

      <H3>배치</H3>
      <p>
        Desktop 은 <strong>오른쪽</strong>이 주요 액션, Mobile 은 <strong>위</strong>가 주요 액션이에요.
      </p>


      <H3>X Button 사용 기준</H3>
      <SpecTable
        caption="X 버튼을 넣는 기준"
        columns={[
          { key: 'case', header: '케이스', width: '52%' },
          { key: 'x', header: 'X 버튼', width: '48%' },
        ]}
        rows={POPUP_X_RULES.map((r) => ({ case: r.case, x: r.x }))}
      />

      <H2>Specification</H2>

      <H3>Container</H3>
      <SpecTable
        caption="Popup 컨테이너 스펙"
        columns={[
          { key: 'prop', header: '속성', width: '32%' },
          { key: 'value', header: '값', width: '38%' },
          { key: 'desc', header: '설명', width: '30%' },
        ]}
        rows={POPUP_CONTAINER.map((r) => ({
          prop: r.prop,
          value: <SpecVal>{r.value}</SpecVal>,
          desc: r.desc,
        }))}
      />

      <H3>Button</H3>
      <SpecTable
        caption="Popup 버튼 스펙"
        columns={[
          { key: 'prop', header: '속성', width: '30%' },
          { key: 'primary', header: 'Primary', width: '35%' },
          { key: 'secondary', header: 'Secondary', width: '35%' },
        ]}
        rows={POPUP_BUTTON.map((r) => ({
          prop: r.prop,
          primary: <SpecVal>{r.primary}</SpecVal>,
          secondary: <SpecVal>{r.secondary}</SpecVal>,
        }))}
      />

      <H3>Typography</H3>
      <SpecTable
        caption="Popup 타이포그래피"
        columns={[
          { key: 'el', header: '요소', width: '28%' },
          { key: 'size', header: 'Size', width: '16%' },
          { key: 'weight', header: 'Weight', width: '14%' },
          { key: 'color', header: 'Color Token', width: '42%' },
        ]}
        rows={POPUP_TYPOGRAPHY.map((r) => ({
          el: r.el,
          size: <SpecVal>{r.size}</SpecVal>,
          weight: r.weight,
          color: <SpecVal>{r.color}</SpecVal>,
        }))}
      />
    </>
  );
}
