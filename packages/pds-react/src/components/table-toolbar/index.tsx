'use client';

import { useEffect, useRef, useState } from 'react';

import { color, font, motion, radius } from '../../tokens.js';
import { withSupported } from '../../supported.js';

import type { CSSProperties } from 'react';
import type { TableToolbarProps } from './types.js';

/**
 * 표 위 한 줄 — 검색·필터(왼쪽)와 건수·액션(오른쪽)을 놓는 자리 컴포넌트. 로직은 없다.
 *
 * 줄 높이는 40 이다(2026-10-12 디자인 결정 — 일괄 작업 바가 32 로는 좁다). 형제 컴포넌트(InputField sm·Select sm·
 * Button 32)는 줄 가운데에 놓인다. 일괄 작업 바도 1행과 같은 높이라 바뀌어도 표가 밀리지 않는다. 칩 줄(below)은
 * 일괄 작업 중엔 보이지 않게 하되 자리는 남긴다 — 행을 고르는 순간 표가 올라가지 않게(2026-10-08 디자인 결정).
 *
 * 바깥 여백은 갖지 않는다 — 표와의 간격 12px 은 쓰는 쪽이 준다.
 */
const ROW_MIN_H = 40;
const GAP = 8;
const END_GAP = 12;
const BELOW_GAP = 8;
const CLEAR_H = 24;

const row: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: GAP,
  flexWrap: 'wrap',
  minHeight: ROW_MIN_H,
};

const text: CSSProperties = {
  fontFamily: font.family,
  fontSize: font.body2Size,
  lineHeight: 1.5,
  whiteSpace: 'nowrap',
};

/** 화면엔 숨기고 스크린 리더엔 읽힌다 */
const srOnly: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/** '선택 해제' 텍스트 버튼 — 호버 면, 키보드 포커스(:focus-visible)일 때만 링 */
function ClearButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={(e) => setFocusVisible(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => setFocusVisible(false)}
      style={{
        ...text,
        boxSizing: 'border-box',
        flexShrink: 0,
        marginLeft: 'auto',
        height: CLEAR_H,
        padding: '0 8px',
        border: 'none',
        borderRadius: radius.xs,
        background: hover ? color.interactionHover : 'transparent',
        color: color.labelNeutral,
        fontWeight: 500,
        cursor: 'pointer',
        transition: `background-color ${motion.durationFast} ${motion.easeOut}`,
        outline: focusVisible ? `2px solid ${color.accentNormal}` : 'none',
      }}
    >
      {label}
    </button>
  );
}

function TableToolbarBase({ start, end, below, selection, className }: TableToolbarProps) {
  const selecting = !!selection && selection.count > 0;
  // 숨긴 칩 줄에 포커스·클릭이 가지 않게 inert 를 건다 — JSX 속성은 React 18 이 경고하므로(peer react>=18) 요소에 직접 쓴다
  const belowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (belowRef.current) belowRef.current.inert = selecting;
  }, [selecting]);

  return (
    <div className={className}>
      {/* 안내 영역은 늘 붙어 있어야 한다 — 내용과 함께 생긴 live region 은 첫 변화('1개 선택')를 읽지 않는 리더가 많다 */}
      <span aria-live="polite" style={srOnly}>
        {selecting ? `${selection.count}개 선택` : ''}
      </span>
      {selecting ? (
        <div
          style={{
            ...row,
            boxSizing: 'border-box',
            padding: '0 8px 0 12px',
            background: color.fillNeutral,
            borderRadius: radius.md,
          }}
        >
          <span style={{ ...text, fontWeight: 700, color: color.labelNormal }}>
            {`${selection.count}개 선택`}
          </span>
          {selection.actions && <div style={{ display: 'flex', alignItems: 'center', gap: GAP }}>{selection.actions}</div>}
          <ClearButton label={selection.clearLabel ?? '선택 해제'} onClick={selection.onClear} />
        </div>
      ) : (
        <div style={row}>
          {start && <div style={{ ...row, flex: '1 1 auto', minHeight: undefined }}>{start}</div>}
          {end && <div style={{ display: 'flex', alignItems: 'center', gap: END_GAP, marginLeft: 'auto' }}>{end}</div>}
        </div>
      )}
      {below && (
        <div
          // 일괄 작업 중엔 숨기되 높이는 지킨다(visibility). inert 는 위 effect 가 건다
          ref={belowRef}
          aria-hidden={selecting || undefined}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: GAP,
            marginTop: BELOW_GAP,
            ...(selecting && { visibility: 'hidden' }),
          }}
        >
          {below}
        </div>
      )}
    </div>
  );
}

export const TableToolbar = withSupported(TableToolbarBase, { acceptsChildren: false });
