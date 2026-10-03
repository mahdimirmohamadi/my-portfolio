// Days, weeks and the year-long heatmap. English weeks start on Monday with Gregorian months;
// Persian weeks start on Saturday with Jalali months, in Persian digits.

export type Lang = 'en' | 'fa';

const DAY = 86_400_000;

export const startOfDay = (ts: number) => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

/** A local calendar day as a key (the device's own midnight). */
export const dayKey = (ts: number) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

/** Days since the week began: Monday = 0 (en), Saturday = 0 (fa). */
export const weekIndex = (ts: number, lang: Lang) => {
  const wd = new Date(ts).getDay(); // Sunday = 0
  return lang === 'fa' ? (wd + 1) % 7 : (wd + 6) % 7;
};

export const startOfWeek = (ts: number, lang: Lang) => {
  const d = new Date(startOfDay(ts));
  d.setDate(d.getDate() - weekIndex(ts, lang));
  return d.getTime();
};

/** Adds whole calendar days (safe across daylight-saving changes). */
export const addDays = (ts: number, n: number) => {
  const d = new Date(ts);
  d.setDate(d.getDate() + n);
  return d.getTime();
};

const locale = (lang: Lang) => (lang === 'fa' ? 'fa-IR-u-ca-persian-nu-arabext' : 'en-GB');

export const fmtNum = (lang: Lang, n: number) => new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en').format(n);

export const fmtDate = (lang: Lang, ts: number, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale(lang), opts).format(ts);

/** The day of the month in the page's calendar (1-based, Latin digits for maths). */
const dayOfMonth = (lang: Lang, ts: number) => {
  const tag = lang === 'fa' ? 'fa-IR-u-ca-persian-nu-latn' : 'en-GB';
  const part = new Intl.DateTimeFormat(tag, { day: 'numeric' }).formatToParts(ts).find((p) => p.type === 'day');
  return Number(part?.value ?? 1);
};

export interface HeatCell {
  ts: number;
  key: string;
  future: boolean;
}

export interface HeatGrid {
  weeks: HeatCell[][]; // columns, oldest first; each column is 7 days from the week's first day
  months: { col: number; label: string }[];
  weekdays: string[]; // 7 short names, from the week's first day
}

/** 53 weeks ending with the week of `now`. */
export function heatGrid(now: number, lang: Lang, weeks = 53): HeatGrid {
  const today = startOfDay(now);
  const first = addDays(startOfWeek(today, lang), -(weeks - 1) * 7);
  const cols: HeatCell[][] = [];
  const months: HeatGrid['months'] = [];
  for (let w = 0; w < weeks; w++) {
    const col: HeatCell[] = [];
    for (let d = 0; d < 7; d++) {
      const ts = addDays(first, w * 7 + d);
      col.push({ ts, key: dayKey(ts), future: ts > today });
      // a month is labelled on the column that holds its first day
      if (dayOfMonth(lang, ts) === 1 && w > 0) months.push({ col: w, label: fmtDate(lang, ts, { month: 'short' }) });
    }
    cols.push(col);
  }
  const weekdays = cols[0].map((c) => fmtDate(lang, c.ts, { weekday: 'narrow' }));
  return { weeks: cols, months, weekdays };
}

export const DAY_MS = DAY;
