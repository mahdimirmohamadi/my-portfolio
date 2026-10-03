import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { load, subscribe, SERVER_SNAPSHOT, type Category } from '../../../lib/pomodoro/store';
import type { Lang } from '../../../lib/pomodoro/calendar';

export type Strings = Record<string, string>;

export interface Ctx {
  lang: Lang;
  /** a UI string, with {n}, {m} and {name} filled in (numbers in the page's digits) */
  t: (key: string, vars?: Record<string, string | number>) => string;
  num: (n: number) => string;
  /** "1 pomodoro" / "3 pomodoros" */
  count: (n: number) => string;
  catName: (c: Category | undefined | null) => string;
}

export function makeCtx(lang: Lang, strings: Strings): Ctx {
  const nf = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en');
  const pr = new Intl.PluralRules(lang);
  const num = (n: number) => nf.format(n);
  const t: Ctx['t'] = (key, vars) => {
    let s = strings[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, typeof v === 'number' ? num(v) : v);
    return s;
  };
  return {
    lang,
    t,
    num,
    count: (n) => t(pr.select(n) === 'one' ? 'pomo.n.one' : 'pomo.n.other', { n }),
    catName: (c) => (c ? c.name || strings[`pomo.cat.${c.id}`] || c.id : t('pomo.cat.none')),
  };
}

export const I18n = createContext<Ctx>(makeCtx('en', {}));
export const useI18n = () => useContext(I18n);

/** The stored data, live: every change in this tab or another re-renders. */
export const useData = () => useSyncExternalStore(subscribe, load, () => SERVER_SNAPSHOT);

/** The current time, refreshed while `live` (a running clock). */
export function useNow(live: boolean, every = 250) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    setNow(Date.now());
    if (!live) return;
    const id = setInterval(() => setNow(Date.now()), every);
    return () => clearInterval(id);
  }, [live, every]);
  return now;
}
