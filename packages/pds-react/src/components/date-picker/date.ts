/**
 * 날짜 계산 — 시각은 버리고 "그 날" 만 다룬다(로컬 자정).
 * 표기는 PDS 규칙 YYYY.MM.DD. 입력은 . - / 구분자를 모두 받는다.
 */

/** 그 날 자정 */
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const pad = (n: number) => String(n).padStart(2, '0');

export const formatDate = (d: Date) => `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;

/** `2026.10.14` · `2026-10-14` · `2026/10/14` · `20261014`. 없는 날(2026.02.30)이면 null */
export function parseDate(text: string): Date | null {
  const m = text.trim().match(/^(\d{4})[.\-/]?\s*(\d{1,2})[.\-/]?\s*(\d{1,2})\.?$/);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : null;
}

/**
 * `시작 ~ 종료` 를 읽는다. 구분자는 `~` 하나만 — `-` 는 날짜 안 구분자와 겹친다.
 * 종료가 시작보다 앞이면 뒤집는다. 날짜 하나만 쳤으면 그날 하루로 본다.
 */
export function parseRange(text: string): { start: Date; end: Date } | null {
  const parts = text.split('~');
  if (parts.length > 2) return null;
  const a = parseDate(parts[0]);
  const b = parts.length === 2 ? parseDate(parts[1]) : a;
  if (!a || !b) return null;
  return a <= b ? { start: a, end: b } : { start: b, end: a };
}

/** 그 달을 일요일부터 채운 주 목록 — 앞뒤 달 날짜로 빈칸을 메운다(4~6주) */
export function monthWeeks(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  let cur = addDays(first, -first.getDay());
  const end = addDays(last, 6 - last.getDay());
  const weeks: Date[][] = [];
  while (cur <= end) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(cur, i)));
    cur = addDays(cur, 7);
  }
  return weeks;
}
