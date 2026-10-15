'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { color, font, motion, radius, shadow } from '../../tokens.js';
import { withSupported } from '../../supported.js';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '../../icons/index.js';
import { InputField } from '../input/index.js';
import { addDays, formatDate, monthWeeks, parseDate, parseRange, sameDay, startOfDay } from './date.js';

import type { CSSProperties } from 'react';
import type { CalendarProps, DatePickerProps, DatePreset, DateRange } from './types.js';
import type { InputFieldSize } from '../input/types.js';

/**
 * PDS Figma `Component/Action → Date Picker`(2026-10-14) 실측.
 *
 * 하루 칸 32×32(모서리 sm) · 패널 모서리 md · 그림자 md · 달력 안쪽 여백 16.
 * 기간은 양 끝을 파란 면, 사이를 연한 파란 띠(subFill)로 칠한다. 양 끝 칸은 안쪽 절반에 띠를 깔아
 * 사이 칸과 이어 보이게 한다. 빠른 선택 한 줄은 104×32.
 */
const CELL = 32;
const GAP = 4; // 입력칸과 패널 사이
const FIELD_HEIGHT: Record<InputFieldSize, number> = { lg: 52, md: 40, sm: 32, xs: 28 };
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
/** 팝오버 등장·퇴장 — Tooltip 과 같은 값(JS 타이머와 짝이라 숫자). 등장 150 = duration-fast, 퇴장 100 = duration-instant */
const FADE_OUT = 100;
const SLIDE = 4;
const REDUCE_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FORMAT_ERROR = '날짜를 YYYY.MM.DD 형식으로 입력해 주세요.';

/** 기본 빠른 선택 — 오늘까지를 끝으로 잡는다(조회 화면은 앞날을 고를 일이 드물다) */
export const DEFAULT_DATE_PRESETS: DatePreset[] = [
  { label: '오늘', range: (t) => ({ start: t, end: t }) },
  { label: '지난 7일', range: (t) => ({ start: addDays(t, -6), end: t }) },
  { label: '지난 30일', range: (t) => ({ start: addDays(t, -29), end: t }) },
  { label: '이번 달', range: (t) => ({ start: new Date(t.getFullYear(), t.getMonth(), 1), end: t }) },
];

const text = (size: string, weight: number, c: string): CSSProperties => ({
  fontFamily: font.family,
  fontSize: size,
  fontWeight: weight,
  lineHeight: 1.5,
  color: c,
});

const plainButton: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
};

/** 키보드로 왔을 때만 링 — Input 의 ClearButton 과 같은 방식 */
function useRing() {
  const [ring, setRing] = useState(false);
  return {
    ring,
    handlers: {
      onFocus: (e: React.FocusEvent<HTMLElement>) => setRing(e.currentTarget.matches(':focus-visible')),
      onBlur: () => setRing(false),
    },
  };
}

type DayRole = 'none' | 'single' | 'start' | 'end' | 'between';

function Day({
  date,
  role,
  outside,
  today,
  onPick,
}: {
  date: Date;
  role: DayRole;
  outside: boolean;
  today: boolean;
  onPick: (d: Date) => void;
}) {
  const [hover, setHover] = useState(false);
  const { ring, handlers } = useRing();
  const filled = role === 'single' || role === 'start' || role === 'end';
  // 양 끝 칸은 안쪽 절반에만 띠를 깐다 — 시작=오른쪽, 끝=왼쪽
  const strip =
    role === 'between' ? { left: 0, width: CELL } : role === 'start' ? { left: CELL / 2, width: CELL / 2 } : role === 'end' ? { left: 0, width: CELL / 2 } : null;
  const fg = filled ? color.staticWhite : today ? color.accentNormal : outside ? color.labelAssistive : color.labelNormal;
  const bg = filled ? color.accentNormal : role === 'between' ? 'transparent' : hover ? color.interactionHover : 'transparent';
  return (
    <span style={{ position: 'relative', display: 'block', width: CELL, height: CELL }}>
      {strip && <span aria-hidden style={{ position: 'absolute', top: 0, height: CELL, background: color.subFill, ...strip }} />}
      <button
        type="button"
        onClick={() => onPick(date)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...handlers}
        aria-label={`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`}
        aria-pressed={filled || role === 'between'}
        aria-current={today ? 'date' : undefined}
        style={{
          ...plainButton,
          ...text(font.body3Size, filled || today ? 700 : 400, fg),
          position: 'relative',
          justifyContent: 'center',
          width: CELL,
          height: CELL,
          borderRadius: radius.sm,
          background: bg,
          outline: ring ? `2px solid ${color.accentNormal}` : 'none',
          outlineOffset: -2,
        }}
      >
        {date.getDate()}
      </button>
    </span>
  );
}

function NavButton({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const { ring, handlers } = useRing();
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...handlers}
      aria-label={dir === 'prev' ? '이전 달' : '다음 달'}
      style={{
        ...plainButton,
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: radius.sm,
        color: color.labelNeutral,
        background: hover ? color.interactionHover : 'transparent',
        outline: ring ? `2px solid ${color.accentNormal}` : 'none',
      }}
    >
      {dir === 'prev' ? <ChevronLeftIcon size={18} /> : <ChevronRightIcon size={18} />}
    </button>
  );
}

function PresetButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const { ring, handlers } = useRing();
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...handlers}
      aria-pressed={selected}
      style={{
        ...plainButton,
        ...text(font.body3Size, selected ? 700 : 400, selected ? color.labelNormal : color.labelNeutral),
        width: 104,
        height: CELL,
        padding: '0 10px',
        borderRadius: radius.sm,
        background: selected ? color.fillNormal : hover ? color.interactionHover : 'transparent',
        outline: ring ? `2px solid ${color.accentNormal}` : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/**
 * PDS Calendar — 날짜 선택기의 달력 패널.
 * 기간 모드는 날짜를 두 번 누른다(시작 → 종료). 두 번째가 앞이면 뒤집는다.
 */
function CalendarBase(props: CalendarProps) {
  const today = startOfDay(props.today ?? new Date());
  const range = props.mode === 'range';
  const single = props.mode === 'range' ? null : props.value ?? null;
  const committed: DateRange = props.mode === 'range' ? props.value ?? { start: null, end: null } : { start: null, end: null };
  // 시작만 누른 상태 — 종료를 누를 때까지 바깥에 알리지 않는다
  const [pending, setPending] = useState<Date | null>(null);
  const anchor = range ? committed.start : single;
  const [view, setView] = useState(() => {
    const d = anchor ?? today;
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const start = pending ?? committed.start;
  const end = pending ? null : committed.end;
  const roleOf = (d: Date): DayRole => {
    if (!range) return sameDay(d, single) ? 'single' : 'none';
    if (!start) return 'none';
    if (!end || sameDay(start, end)) return sameDay(d, start) ? 'single' : 'none';
    if (sameDay(d, start)) return 'start';
    if (sameDay(d, end)) return 'end';
    return d > start && d < end ? 'between' : 'none';
  };

  const pick = (d: Date) => {
    if (d.getMonth() !== view.m) setView({ y: d.getFullYear(), m: d.getMonth() });
    if (props.mode !== 'range') return props.onChange?.(d);
    if (!pending) return setPending(d);
    setPending(null);
    props.onChange?.(d < pending ? { start: d, end: pending } : { start: pending, end: d });
  };

  const move = (n: number) => setView(({ y, m }) => ({ y: m + n < 0 ? y - 1 : m + n > 11 ? y + 1 : y, m: (m + n + 12) % 12 }));

  const presets = props.mode === 'range' && props.presets !== false ? props.presets ?? DEFAULT_DATE_PRESETS : null;

  return (
    <div
      className={props.className}
      style={{
        display: 'inline-flex',
        background: color.layerSurface,
        border: `1px solid ${color.lineNeutral}`,
        borderRadius: radius.md,
        boxShadow: shadow.md,
        overflow: 'hidden',
      }}
    >
      {presets && (
        <div role="group" aria-label="빠른 선택" style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 8, borderRight: `1px solid ${color.lineNeutral}` }}>
          {presets.map((p) => {
            const r = p.range(today);
            return (
              <PresetButton
                key={p.label}
                label={p.label}
                selected={!pending && sameDay(committed.start, r.start) && sameDay(committed.end, r.end)}
                onClick={() => {
                  setPending(null);
                  setView({ y: r.start.getFullYear(), m: r.start.getMonth() });
                  if (props.mode === 'range') props.onChange?.(r);
                }}
              />
            );
          })}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <NavButton dir="prev" onClick={() => move(-1)} />
          <span aria-live="polite" style={text(font.body2Size, 500, color.labelNormal)}>
            {view.y}년 {view.m + 1}월
          </span>
          <NavButton dir="next" onClick={() => move(1)} />
        </div>
        <div aria-hidden style={{ display: 'flex' }}>
          {WEEKDAYS.map((w) => (
            <span key={w} style={{ ...text(font.caption1Size, 400, color.labelAssistive), width: CELL, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {w}
            </span>
          ))}
        </div>
        {/* ponytail: 칸 사이 방향키 이동은 없다(Tab 으로 순서대로) — 요청이 오면 roving tabindex 로 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
          {monthWeeks(view.y, view.m).map((week) => (
            <div key={week[0].getTime()} style={{ display: 'flex' }}>
              {week.map((d) => (
                <Day key={d.getTime()} date={d} role={roleOf(d)} outside={d.getMonth() !== view.m} today={sameDay(d, today)} onPick={pick} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Calendar = withSupported(CalendarBase, { mode: ['single', 'range'], acceptsChildren: false });

/**
 * PDS DatePicker — 입력칸(InputField) + 달력 팝오버.
 * 입력칸에 YYYY.MM.DD(기간은 `시작 ~ 종료`)로 직접 칠 수도 있다. 칸을 벗어나거나 Enter 를 누르면 읽는다.
 */
function DatePickerBase(props: DatePickerProps) {
  const { size = 'lg', label, error, placeholder, disabled, width, today, id, className } = props;
  const range = props.mode === 'range';
  const autoId = useId();
  const panelId = `${id ?? autoId}-calendar`;
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // 팝오버는 body 로 띄운다 — 카드·모달·표처럼 overflow 를 자르는 부모 안에서도 잘리지 않게(Tooltip portal 과 같은 방식)
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; up: boolean } | null>(null);
  // 닫혀도 퇴장 페이드가 끝날 때까지 붙여 둔다. 등장은 마운트 → 페인트 → entered 2단계라야 transition 이 돈다(Tooltip 과 같음)
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setEntered(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    setEntered(false);
    const t = setTimeout(() => setMounted(false), FADE_OUT);
    return () => clearTimeout(t);
  }, [open]);
  const inside = (n: Node | null) => !!n && (!!rootRef.current?.contains(n) || !!panelRef.current?.contains(n));

  // 제어/비제어 — value 가 undefined 가 아니면 바깥이 쥔다
  const [inner, setInner] = useState<Date | DateRange | null>(props.defaultValue ?? null);
  const controlled = props.value !== undefined;
  const value = controlled ? props.value ?? null : inner;
  // 치는 중인 글자. null 이면 값에서 만든 글자를 보여 준다
  const [draft, setDraft] = useState<string | null>(null);
  const [badFormat, setBadFormat] = useState(false);

  const shown = (() => {
    if (!value) return '';
    if (value instanceof Date) return formatDate(value);
    return value.start && value.end ? `${formatDate(value.start)} ~ ${formatDate(value.end)}` : '';
  })();

  const commit = (next: Date | DateRange | null) => {
    if (!controlled) setInner(next);
    setDraft(null);
    setBadFormat(false);
    if (props.mode === 'range') props.onChange?.((next as DateRange | null) ?? { start: null, end: null });
    else props.onChange?.(next as Date | null);
  };

  const readDraft = () => {
    if (draft === null) return;
    if (!draft.trim()) return commit(null);
    const parsed = range ? parseRange(draft) : parseDate(draft);
    if (parsed) commit(parsed);
    else setBadFormat(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!inside(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // 입력칸 바로 아래(모자라면 위)에 fixed 로 놓는다. 안쪽 스크롤 컨테이너의 scroll 은 window 로 버블되지 않아 capture 로 받는다
  useLayoutEffect(() => {
    if (!mounted) return setPos(null);
    const place = () => {
      const r = rootRef.current?.getBoundingClientRect();
      const h = panelRef.current?.offsetHeight ?? 0;
      if (!r) return;
      const fieldBottom = r.top + FIELD_HEIGHT[size];
      const below = fieldBottom + GAP;
      const up = below + h > window.innerHeight && r.top - GAP - h >= 0;
      setPos({ top: up ? r.top - GAP - h : below, left: r.left, up });
    };
    place();
    const opts = { capture: true, passive: true } as const;
    window.addEventListener('scroll', place, opts);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, opts);
      window.removeEventListener('resize', place);
    };
  }, [mounted, size]);

  return (
    <div
      ref={rootRef}
      className={className}
      // Tab 으로 밖에 나가면 닫는다. 빈 곳 클릭(relatedTarget 없음)은 바깥 mousedown 이 맡는다
      onBlur={(e) => {
        if (e.relatedTarget && !inside(e.relatedTarget)) setOpen(false);
      }}
      style={{ position: 'relative', width: width ?? (range ? 280 : 200) }}
    >
      <InputField
        id={id}
        size={size}
        label={label}
        fullWidth
        disabled={disabled}
        leftIcon={<CalendarIcon />}
        // 제목은 lg 만 그린다(InputField). lg 빈 칸은 제목을 보여 주고, 눌러서 제목이 올라가면 형식 안내를 띄운다
        placeholder={placeholder ?? (label && size === 'lg' && !focused ? undefined : range ? 'YYYY.MM.DD ~ YYYY.MM.DD' : 'YYYY.MM.DD')}
        error={error ?? (badFormat ? FORMAT_ERROR : undefined)}
        value={draft ?? shown}
        onChange={(e) => {
          setDraft(e.currentTarget.value);
          setBadFormat(false);
        }}
        onClick={() => setOpen(true)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          readDraft();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            readDraft();
            setOpen(false);
          } else if (e.key === 'ArrowDown') setOpen(true);
        }}
        autoComplete="off"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
      />
      {mounted &&
        createPortal(
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label="날짜 고르기"
          // 좌표를 재기 전 한 프레임은 숨긴다(0,0 에 번쩍 뜨지 않게)
          style={{
            position: 'fixed',
            top: pos?.top ?? 0,
            left: pos?.left ?? 0,
            zIndex: 1000,
            visibility: pos ? 'visible' : 'hidden',
            // 입력칸 쪽에서 4px 미끄러지며 나타난다(위로 열리면 아래에서). 퇴장은 미끄럼 없이 빠르게 흐려지기만
            opacity: entered ? 1 : 0,
            transform: entered || REDUCE_MOTION ? 'none' : `translateY(${pos?.up ? SLIDE : -SLIDE}px)`,
            transition: entered
              ? `opacity ${motion.durationFast} ${motion.easeOut}, transform ${motion.durationFast} ${motion.easeOut}`
              : `opacity ${FADE_OUT}ms ${motion.easeIn}`,
            // 사라지는 중에는 눌리지 않게
            pointerEvents: open ? undefined : 'none',
          }}
        >
          {props.mode === 'range' ? (
            <Calendar
              mode="range"
              value={(value as DateRange | null) ?? undefined}
              presets={props.presets}
              today={today}
              onChange={(r) => {
                commit(r);
                setOpen(false);
              }}
            />
          ) : (
            <Calendar
              value={value as Date | null}
              today={today}
              onChange={(d) => {
                commit(d);
                setOpen(false);
              }}
            />
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}

export const DatePicker = withSupported(DatePickerBase, {
  mode: ['single', 'range'],
  size: Object.keys(FIELD_HEIGHT),
  acceptsChildren: false,
});

