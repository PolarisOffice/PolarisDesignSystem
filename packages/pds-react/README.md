# @polarisoffice/pds-react

Polaris Design System 의 React 컴포넌트입니다. 치수·색은 Figma
`📚Polaris Design System` 실측값이며, 렌더 결과를 디자인과 대조하는 검증기가 함께 있습니다.

```bash
npm install @polarisoffice/pds-react
```

## 쓰기

```tsx
import { Button, InputField } from '@polarisoffice/pds-react';
import '@polarisoffice/pds-react/tokens.css';   // 토큰 + 웹폰트

export default function Example() {
  return (
    <>
      <Button variant="primary" size={48}>버튼</Button>
      <InputField label="이메일" placeholder="name@example.com" />
    </>
  );
}
```

`tokens.css` 는 한 번만 불러오면 됩니다. CSS 변수(`--color-*`, `--radius-*`,
`--typography-*`)를 정의합니다. 서체 **Pretendard 는 포함되지 않습니다** — 외부 CDN 을 자동으로
부르지 않으므로 프로젝트가 직접 로드하세요(없으면 시스템 한글 서체로 폴백됩니다):

```bash
npm i pretendard
```

```ts
// app/layout.tsx — tokens.css 와 같은 자리
import 'pretendard/dist/web/static/pretendard-dynamic-subset.css';
```

React 18 이상이 필요합니다. 상태를 가진 컴포넌트에는 `'use client'` 가 붙어 있어
Next.js App Router 의 서버 컴포넌트에서 그대로 가져다 쓸 수 있습니다.

## 컴포넌트

| | 변형 축 |
|---|---|
| `Button` | `variant` 10종 (primary·default·ai·sub·gray·black·delete + ghost 3종) × `size` 6종 (24·32·40·48·54·64, **숫자**) |
| `InputField` | 상태는 값·상호작용으로 결정 · `leftIcon` · `revealToggle` · `error` |
| `Toggle` | `size` (`md` · `sm`) · `label` |
| `Checkbox` · `Radio` · `RadioGroup` | `tone` (`brand` · `ai`) · `indeterminate` |
| `Tabs` | `variant` (`primary` · `secondary`) · `layout` (`fill` · `hug`) · `size` (`medium` · `small`) |
| `SegmentControl` | `variant` (`pill` · `filled` · `outlined`) · `layout` · `size` (`md` · `sm`) |
| `Select` | `size` (`lg` · `md` · `sm`) |
| `Menu` · `MenuItem` · `MenuDivider` | `selected` · `hasSubmenu` · `hideCheck` |
| `Table` · `Badge` · `Credit` | |
| `Tooltip` | `placement` (`top` · `bottom` · `left` · `right` · `none`) |
| `Toast` · `Toaster` · `toast()` | `type` (`default` · `success` · `error`) · `placement` (`top` · `bottom`) |
| `Popup` | 버튼 1~2개 · `closable` · `dontShowAgain` |
| `Dim` | `loading` |
| `IconButton` · `DownloadIcon` · `UserIcon` | |

각 컴포넌트는 지원 축을 코드로 알립니다.

```ts
Button.supportedProps    // { variant: [...10], size: [24, 32, 40, 48, 54, 64] }
Tooltip.supportedProps   // { placement: ['top','bottom','left','right','none'] }
```

## 스타일 방식

CSS 변수 + 인라인 style 만 씁니다. 런타임 스타일 엔진(emotion 등)이 없어 어떤
번들러에서도 그대로 돌아가고, 토큰 값을 바꾸면 **재빌드 없이** 반영됩니다.

```js
document.documentElement.style.setProperty('--color-accent-normal', '#00c853');
// 버튼·탭·체크박스가 함께 따라옵니다
```

## 다크 모드

`tokens.css` 가 `html[data-theme="dark"]` 로 다크 팔레트를 정의합니다.

```js
document.documentElement.setAttribute('data-theme', 'dark');
```

색 토큰은 두 갈래입니다 — 테마에 따라 **뒤집히는 것**(`--color-label-inverse`,
`--color-background-base`, `--color-action-normal`)과 **고정인 것**(`--color-static-white`,
`--color-accent-normal`, `--color-layer-overlay`). 직접 색을 조합할 때는 전경과 배경을
같은 갈래에서 골라야 합니다. 섞으면 라이트에서는 멀쩡하다가 다크에서만 글자가 묻힙니다.

## 값의 출처

치수·색은 **디자인이 정본**입니다. 문서 산문과 어긋나면 디자인을 따랐고, 그런
자리는 코드 주석에 남겼습니다(Toast 배경·너비, Tooltip radius·padding,
Toggle 크기, Radio 점 지름 등).

## 라이선스

Apache-2.0
