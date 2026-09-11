/**
 * 실물 컴포넌트 등록표 — 킷 전용 셸. 생성 사본(COPIES) 아님.
 *
 * 여기 등록된 시스템·컴포넌트만 가이드에서 **실제로 실행**된다.
 * DESIGN.md 가 패키지를 지정하는 것이 아니라 이 파일이 정한다 —
 * md 에 어떤 패키지 이름을 적어도 여기 없으면 무시된다(allowlist, fail-closed).
 *
 * 업로드된 코드 문자열은 여전히 실행하지 않는다. 위협은 코드가 아니라 출처다.
 *
 * ── 외부 사용자에게 ──
 * 이 파일을 비우면 킷은 순수 범용 도구가 된다(모든 견본이 골격 렌더).
 * 자기 디자인 시스템을 실물로 보여주려면, 컴포넌트를 npm 패키지로 만들고
 * 아래와 같은 형태로 등록하면 된다. 키는 DESIGN.md 의 컴포넌트 이름(슬러그)이다.
 */
import { Button, InputField } from '@polarisoffice/pds-react';

import PopupDemo from './live-demos/PopupDemo';
import ToastDemo from './live-demos/ToastDemo';
import TooltipDemo from './live-demos/TooltipDemo';
import MenuDemo from './live-demos/MenuDemo';
import SelectDemo from './live-demos/SelectDemo';
import DimDemo from './live-demos/DimDemo';
import TableDemo from './live-demos/TableDemo';
import CreditDemo from './live-demos/CreditDemo';
import BadgeDemo from './live-demos/BadgeDemo';
import { CheckboxDemo, RadioDemo, SegmentDemo, TabDemo, ToggleDemo } from './live-demos/ActionDemos';

import type { ComponentType } from 'react';

type LiveMap = Record<string, Record<string, ComponentType<Record<string, unknown>>>>;

/** md 의 `name:` — 생성기 SYSTEM_NAME · PAX PDS_SYSTEM_NAME 과 반드시 같아야 한다 */
export const PDS_SYSTEM_NAME = 'pds';

export const LIVE_COMPONENTS: LiveMap = {
  // DESIGN.md 의 name → { 컴포넌트 슬러그: 실제 컴포넌트 }
  [PDS_SYSTEM_NAME]: {
    button: Button as ComponentType<Record<string, unknown>>,
    input: InputField as ComponentType<Record<string, unknown>>,
    // 오버레이 계열은 타일에 눕힐 수 없어 데모(여는 버튼)를 등록한다 —
    // 데모가 패키지 컴포넌트를 그대로 import 하므로 반영 경로는 같다.
    popup: PopupDemo as ComponentType<Record<string, unknown>>,
    toast: ToastDemo as ComponentType<Record<string, unknown>>,
    tooltip: TooltipDemo as ComponentType<Record<string, unknown>>,
    menu: MenuDemo as ComponentType<Record<string, unknown>>,
    select: SelectDemo as ComponentType<Record<string, unknown>>,
    dim: DimDemo as ComponentType<Record<string, unknown>>,
    table: TableDemo as ComponentType<Record<string, unknown>>,
    credit: CreditDemo as ComponentType<Record<string, unknown>>,
    toggle: ToggleDemo as ComponentType<Record<string, unknown>>,
    checkbox: CheckboxDemo as ComponentType<Record<string, unknown>>,
    radio: RadioDemo as ComponentType<Record<string, unknown>>,
    tab: TabDemo as ComponentType<Record<string, unknown>>,
    segment: SegmentDemo as ComponentType<Record<string, unknown>>,
    badge: BadgeDemo as ComponentType<Record<string, unknown>>,
  },
};

export const liveComponentsFor = (systemName: string) => LIVE_COMPONENTS[systemName];
