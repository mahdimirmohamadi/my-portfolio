import { ui, defaultLang, type Lang, type UIKey } from './ui';

export const LANGS: Lang[] = ['en', 'fa'];

/** Static paths for `src/pages/[...lang]/…` routes: en → no prefix, fa → /fa */
export const langPaths = () => LANGS.map((lang) => ({ params: { lang: lang === defaultLang ? undefined : lang } }));

export function langFromParam(param: string | undefined): Lang {
  return param === 'fa' ? 'fa' : 'en';
}

export function useT(lang: Lang) {
  return (key: UIKey) => ui[lang][key] ?? ui[defaultLang][key];
}

export const dirOf = (lang: Lang) => (lang === 'fa' ? 'rtl' : 'ltr');

/** Prefixes a site path with the locale ("/omake" → "/fa/omake"). */
export function lp(lang: Lang, path = '/') {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
}

/** Same page in the other language (strips/adds the /fa prefix). */
export function switchLangPath(pathname: string, to: Lang) {
  const bare = pathname.replace(/^\/fa(?=\/|$)/, '') || '/';
  return lp(to, bare);
}

const localeTag = (lang: Lang) => (lang === 'fa' ? 'fa-IR-u-ca-persian-nu-arabext' : 'en-GB');

export function formatDate(lang: Lang, date: Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat(localeTag(lang), opts).format(date);
}

export function formatNum(lang: Lang, n: number) {
  return new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-GB').format(n);
}

/** Minutes to read, from raw markdown. */
export function readingMinutes(body = '') {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
