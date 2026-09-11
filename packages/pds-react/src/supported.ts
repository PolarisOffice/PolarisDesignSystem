import type { ComponentType } from 'react';

/**
 * 컴포넌트가 "어떤 prop 값을 실제로 지원하는지" 알리는 규약.
 *
 * 디자인 가이드는 스펙 맵에서 뽑은 축 이름(variant/size)을 그대로 넘긴다.
 * 스펙이 패키지보다 앞서 나가는 일은 정상이므로, 지원 여부를 컴포넌트가
 * 스스로 알려 주면 가이드가 미지원 값을 실물 대신 골격으로 그릴 수 있다.
 * 값을 모른 채 기본 얼굴로 그려 놓고 다른 이름표를 붙이면 거짓말이 된다.
 *
 * 축 이름은 컴포넌트마다 다르다(variant·size·tone·type·placement…). 가이드나
 * 템플릿이 "이 컴포넌트가 어떤 변형을 갖는가" 를 **코드에서** 읽어 구멍에 맞춰
 * 꽂을 수 있어야 하므로, 알려진 두 축만 고정하지 않고 임의 축을 허용한다.
 */
export interface SupportedProps {
  variant?: string[];
  size?: string[] | number[];
  /**
   * 자식을 라벨로 받는가. 기본 true.
   *
   * `<input>`·`<hr>` 같은 void element 를 감싸는 컴포넌트는 false 를 준다.
   * 가이드는 견본에 라벨을 children 으로 넘기는데, 그게 void element 까지
   * 흘러가면 React 가 던진다. 컴포넌트 안에서도 한 번 더 버리지만
   * (다층 방어), 애초에 안 넘기는 쪽이 옳다.
   */
  acceptsChildren?: boolean;
  /**
   * 견본에 쓸 라벨. 가이드는 기본적으로 컴포넌트 제목("Button")을 넣는데,
   * 디자인 견본의 문구("버튼")와 달라 나란히 비교할 때 다른 것처럼 보인다.
   * 디자인에 있는 문구를 그대로 쓰도록 컴포넌트가 알려 준다.
   */
  sampleLabel?: string;
  /** 그 밖의 변형 축 — 값 목록으로 준다 (tone·type·placement 등). 숫자 축도 있다(Button size) */
  [axis: string]: string[] | number[] | string | boolean | undefined;
}

export type WithSupported<P> = ComponentType<P> & { supportedProps?: SupportedProps };

/** 정적 속성을 타입 안전하게 부착한다 */
export const withSupported = <P,>(comp: ComponentType<P>, supported: SupportedProps): WithSupported<P> => {
  const c = comp as WithSupported<P>;
  c.supportedProps = supported;
  return c;
};
