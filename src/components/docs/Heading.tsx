import type { ReactNode } from 'react';
import { slugify } from '@/lib/docs/slug';
import AnchorLink from './AnchorLink';
import s from './Heading.module.css';

interface HeadingProps {
  children: ReactNode;
  /**
   * 앵커 id. 생략하면 children 이 문자열일 때 slugify 로 계산한다.
   *
   * ⚠️ 같은 페이지에 같은 텍스트의 헤딩이 두 번 나오면 **반드시 명시**해야 한다
   * (VitePress 는 `-1` 을 붙인다). 실측 충돌 3건:
   *   /components/button   `### Size` ×2        → id="size-1"
   *   /foundation/grid     `Grid` ×2            → id="grid-1"
   * 렌더 타임 카운터로 처리하면 안 된다 — StrictMode 이중 렌더·스트리밍에서 서버/클라이언트
   * 값이 갈려 hydration 불일치가 난다.
   */
  id?: string;
  /** 목차에 넣을 텍스트. children 에 태그가 섞였을 때 지정 */
  tocText?: string;
}

function resolveId(children: ReactNode, id?: string): string | undefined {
  if (id) return id;
  if (typeof children === 'string') return slugify(children);
  if (Array.isArray(children) && children.every((c) => typeof c === 'string')) {
    return slugify(children.join(''));
  }
  return undefined; // 계산 불가 — 호출부가 id 를 줘야 한다
}

export function H2({ children, id, tocText }: HeadingProps) {
  const resolved = resolveId(children, id);
  return (
    <h2 id={resolved} className={s.h2} data-toc-text={tocText}>
      {/* 목차는 이 span 의 텍스트만 읽는다 — 앵커 '#' 가 섞이지 않게 (Toc.tsx 참고) */}
      <span data-heading-text>{children}</span>
      {resolved && <AnchorLink id={resolved} />}
    </h2>
  );
}

export function H3({ children, id, tocText }: HeadingProps) {
  const resolved = resolveId(children, id);
  return (
    <h3 id={resolved} className={s.h3} data-toc-text={tocText}>
      <span data-heading-text>{children}</span>
      {resolved && <AnchorLink id={resolved} />}
    </h3>
  );
}

export function H4({ children, id }: HeadingProps) {
  return (
    <h4 id={resolveId(children, id)} className={s.h4}>
      {children}
    </h4>
  );
}
