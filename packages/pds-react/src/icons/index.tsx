import type { SVGProps } from 'react';

/**
 * 문서 예제가 아이콘 자리를 보여줄 때 쓰는 최소 세트.
 *
 * PDS 아이콘 시스템 전체가 아니다 — 디자인의 아이콘 라이브러리를 받으면 그쪽으로
 * 대체한다. 크기·색은 부모를 따른다(`currentColor`, `1em`).
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

const base = (size: IconProps['size']) => ({
  width: size ?? '1.25em',
  height: size ?? '1.25em',
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
});

export function DownloadIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path
        d="M12 3v11m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4.5 20a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
