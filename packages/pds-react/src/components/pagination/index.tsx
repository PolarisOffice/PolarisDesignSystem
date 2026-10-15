'use client';

import { color, font } from '../../tokens.js';
import { withSupported } from '../../supported.js';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons/index.js';
import { IconButton } from '../icon-button/index.js';
import { Select } from '../select/index.js';
import { Tooltip } from '../tooltip/index.js';

import type { PaginationProps } from './types.js';

/**
 * 표 아래 한 줄 — 건수 + 페이지 크기 + 이전/다음. 번호형 페이지는 두지 않는다.
 *
 * 디자인 견본이 아직 없다 — Select sm·IconButton 32 를 그대로 조합한다(한 줄 높이 32 로 맞춘다).
 * page 가 범위를 벗어나도(필터로 total 이 줄어든 직후 등) 화면은 범위 안으로 맞춰 그린다.
 * 실제 page 를 되돌리는 것은 쓰는 쪽 몫이다.
 */
const GAP = 12;
const NAV_GAP = 4;
const GLYPH = 18;
/**
 * 선택 상자 폭 — 메뉴가 트리거 폭으로 열리므로 내용 맞춤이면 '10개씩' 을 고른 상태에서
 * '100개씩' 항목이 좁아진다. 네 자리('1000개씩')까지 메뉴에 들어가는 고정 폭.
 */
const SIZE_SELECT_WIDTH = 112;

function PaginationBase({
  page,
  pageSize,
  total,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const size = Math.max(1, pageSize);
  const pageCount = Math.max(1, Math.ceil(total / size));
  const current = Math.min(Math.max(1, page), pageCount);
  const from = (current - 1) * size + 1;
  const to = Math.min(current * size, total);

  const prevDisabled = current <= 1;
  const nextDisabled = current >= pageCount;

  return (
    <nav aria-label="페이지 이동" className={className} style={{ display: 'flex', alignItems: 'center', gap: GAP, flexWrap: 'wrap' }}>
      <span
        aria-live="polite"
        style={{
          fontFamily: font.family,
          fontSize: font.body3Size,
          lineHeight: 1.5,
          color: color.labelAlternative,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
      >
        {total > 0 ? `${total}건 중 ${from}–${to}` : '0건'}
      </span>

      {pageSizeOptions && onPageSizeChange && (
        <Select
          size="sm"
          width={SIZE_SELECT_WIDTH}
          value={String(pageSize)}
          // 선택지에 없는 pageSize 가 와도 'TitleText' 자리표시 대신 현재 값을 보인다
          placeholder={`${pageSize}개씩`}
          options={pageSizeOptions.map((n) => ({ value: String(n), label: `${n}개씩` }))}
          onChange={(v) => onPageSizeChange(Number(v))}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: NAV_GAP, marginLeft: 'auto' }}>
        <Tooltip content="이전 페이지">
          <IconButton
            size={32}
            icon={<ChevronLeftIcon size={GLYPH} />}
            aria-label="이전 페이지"
            disabled={prevDisabled}
            onClick={() => onPageChange(current - 1)}
          />
        </Tooltip>
        <Tooltip content="다음 페이지">
          <IconButton
            size={32}
            icon={<ChevronRightIcon size={GLYPH} />}
            aria-label="다음 페이지"
            disabled={nextDisabled}
            onClick={() => onPageChange(current + 1)}
          />
        </Tooltip>
      </div>
    </nav>
  );
}

export const Pagination = withSupported(PaginationBase, { acceptsChildren: false });
