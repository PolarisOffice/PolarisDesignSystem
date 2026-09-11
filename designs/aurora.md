---
name: aurora
title: Aurora Design System
version: 1.0.0
description: PDS 동봉 샘플 디자인 시스템 — 업로드·가이드·MCP 도구 흐름을 바로 체험할 수 있습니다.
tokens:
  color:
    primary: "#6366F1"
    primary-hover: "#4F46E5"
    surface: "#FFFFFF"
    surface-muted: "#F4F4F5"
    text: "#18181B"
    text-muted: "#71717A"
    border: "#E4E4E7"
    success: "#10B981"
    danger: "#EF4444"
  typography:
    font-family-base: "'Pretendard', 'Apple SD Gothic Neo', sans-serif"
    font-size-base: "15px"
    font-size-sm: "13px"
  spacing:
    xs: "4px"
    sm: "8px"
    md: "16px"
    lg: "24px"
    xl: "40px"
  radius:
    sm: "6px"
    md: "10px"
    lg: "16px"
  shadow:
    card: "0 1px 3px rgba(24, 24, 27, 0.08)"
    pop: "0 8px 24px rgba(24, 24, 27, 0.16)"
themes:
  dark:
    color:
      primary: "#818CF8"
      primary-hover: "#6366F1"
      surface: "#18181B"
      surface-muted: "#27272A"
      text: "#FAFAFA"
      text-muted: "#A1A1AA"
      border: "#3F3F46"
---

# Aurora Design System

라이트·다크를 모두 지원하는 샘플 디자인 시스템입니다. 색·간격·라운드·그림자는 하드코딩하지 않고
반드시 CSS 변수(`var(--카테고리-키)`)로만 사용합니다.


## Components
### Button

기본 액션 버튼 — variant 로 primary/ghost 를 지원합니다.

#### Usage

페이지의 주요 액션 1개에만 primary 를 사용하고, 보조 액션은 ghost 를 사용합니다.

```tsx
<Button>저장</Button>
<Button variant="ghost">취소</Button>
```

#### Code

```tsx
'use client';

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export function Button({ variant = 'primary', style, children, ...rest }: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-xs)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--typography-font-family-base)',
    fontSize: 'var(--typography-font-size-base)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'filter 0.15s ease',
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--color-primary)', color: '#FFFFFF', border: '1px solid transparent' },
    ghost: { background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)' },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {children}
    </button>
  );
}
```

### Card

콘텐츠 묶음 컨테이너 — 제목·본문 슬롯을 제공합니다.

#### Code

```tsx
'use client';

import React from 'react';

type CardProps = {
  title?: string;
  children: React.ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: 'var(--spacing-lg)',
      }}
    >
      {title && (
        <h3
          style={{
            margin: 0,
            marginBottom: 'var(--spacing-sm)',
            color: 'var(--color-text)',
            fontFamily: 'var(--typography-font-family-base)',
            fontSize: 'var(--typography-font-size-base)',
          }}
        >
          {title}
        </h3>
      )}
      <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--typography-font-size-sm)' }}>{children}</div>
    </div>
  );
}
```

### Badge

상태 표시용 소형 라벨 — tone 으로 success/danger/neutral 을 지원합니다.

#### Code

```tsx
'use client';

import React from 'react';

type BadgeProps = {
  tone?: 'success' | 'danger' | 'neutral';
  children: React.ReactNode;
};

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  const tones: Record<string, React.CSSProperties> = {
    success: { background: 'var(--color-success)', color: '#FFFFFF' },
    danger: { background: 'var(--color-danger)', color: '#FFFFFF' },
    neutral: { background: 'var(--color-surface-muted)', color: 'var(--color-text-muted)' },
  };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px var(--spacing-sm)',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--typography-font-size-sm)',
        fontFamily: 'var(--typography-font-family-base)',
        ...tones[tone],
      }}
    >
      {children}
    </span>
  );
}
```

## Resources

### Getting Started

디자인 시스템을 프로젝트에 적용하는 순서입니다.

1. 파운데이션 토큰을 `styles/design-tokens.css` 로 저장하고, 토큰을 쓰는 페이지 파일 최상단에서 import 합니다.
2. 필요한 컴포넌트를 `components/design/` 아래에 가져온 코드 그대로 저장합니다 (수정 금지).
3. 페이지·조합 코드는 자유롭게 작성하되, 색·간격 값은 항상 `var(--카테고리-키)` 변수만 사용합니다.
