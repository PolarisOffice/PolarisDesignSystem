import type { SVGProps } from 'react';

/**
 * 문서 예제가 아이콘 자리를 보여줄 때 쓰는 최소 세트.
 * 표(Table)의 검색·필터·정렬·페이지 이동이 쓰는 아이콘도 여기 함께 둔다.
 *
 * PDS 아이콘 시스템 전체가 아니다 — 디자인의 아이콘 라이브러리를 받으면 그쪽으로
 * 대체한다. 크기·색은 부모를 따른다(`currentColor`, `1em`).
 *
 * Search·Close·Filter·Chevron 3종·Sort 3종의 경로는 Figma Icon 세트(1252:1667) 24px 경로.
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

// 아래 아이콘들은 선 하나짜리라 획 속성을 묶어 쓴다. 굵기는 Figma 24px 기준 1.5.
const stroke = {
  stroke: 'currentColor',
  strokeWidth: '1.5',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function SearchIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M20 20L16.5847 16.5847M18.7404 11.3702C18.7404 15.4407 15.4407 18.7404 11.3702 18.7404C7.29976 18.7404 4 15.4407 4 11.3702C4 7.29976 7.29976 4 11.3702 4C15.4407 4 18.7404 7.29976 18.7404 11.3702Z" {...stroke} />
    </svg>
  );
}

/** 날짜 선택기 입력칸 앞 아이콘 — Figma Icon 세트 calendar-days 모양(달력 + 날짜 점) */
export function CalendarIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" {...stroke} />
      <path d="M4 10H20M8.5 3.5V7M15.5 3.5V7" {...stroke} />
      <path d="M8 13.5H8.01M12 13.5H12.01M16 13.5H16.01M8 17H8.01M12 17H12.01" {...stroke} strokeWidth="2" />
    </svg>
  );
}

export function CloseIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M18 6L6 18M6 6L18 18" {...stroke} />
    </svg>
  );
}

export function ChevronLeftIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M15 18L9 12L15 6" {...stroke} />
    </svg>
  );
}

export function ChevronRightIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M9 18L15 12L9 6" {...stroke} />
    </svg>
  );
}

export function ChevronDownIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 9L12 15L18 9" {...stroke} />
    </svg>
  );
}

/** 깔때기. */
export function FilterIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M10.4006 18.4145C10.4005 18.5618 10.4419 18.7062 10.52 18.8315C10.5982 18.9568 10.71 19.058 10.843 19.1239L12.4433 19.9164C12.5653 19.9768 12.7008 20.0053 12.8371 19.9992C12.9734 19.9931 13.1058 19.9526 13.2218 19.8815C13.3378 19.8104 13.4335 19.7111 13.4999 19.5931C13.5663 19.4751 13.6011 19.3422 13.601 19.2071V12.7181C13.6012 12.3252 13.7486 11.9465 14.0147 11.6552L19.7939 5.32356C19.8974 5.20987 19.9656 5.0689 19.99 4.91768C20.0144 4.76646 19.994 4.61148 19.9314 4.47147C19.8688 4.33146 19.7665 4.21242 19.637 4.12875C19.5076 4.04508 19.3564 4.00036 19.2018 4H4.79982C4.64508 4.00006 4.49369 4.04455 4.36396 4.1281C4.23424 4.21166 4.13175 4.33068 4.06892 4.47075C4.0061 4.61082 3.98562 4.76593 4.00997 4.91729C4.03433 5.06865 4.10247 5.20977 4.20614 5.32356L9.98693 11.6552C10.253 11.9465 10.4004 12.3252 10.4006 12.7181V18.4145Z" {...stroke} />
    </svg>
  );
}

/** 정렬 없음 — 위·아래 셰브론을 쌓은 ↕ 모양. */
export function SortIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M7 15L12 20L17 15M7 9L12 4L17 9" {...stroke} />
    </svg>
  );
}

/** 오름차순 — 위 화살표. */
export function SortAscIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M19 12L12 5L5 12M12 5V19" {...stroke} />
    </svg>
  );
}

/** 내림차순 — 아래 화살표. */
export function SortDescIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 5V19M5 12L12 19L19 12" {...stroke} />
    </svg>
  );
}
