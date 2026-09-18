import type { UIKey } from '../../i18n/ui';

export type NavItem = { key: UIKey; plain: UIKey; path: string; no?: string; soon?: boolean };

/** The table of contents. `path` is locale-less; prefix with lp(). */
export const chapters: NavItem[] = [
  { key: 'nav.cover', plain: 'nav.cover.plain', path: '/', no: '0' },
  { key: 'nav.quests', plain: 'nav.quests.plain', path: '/#quests', no: '2' },
  { key: 'nav.artifacts', plain: 'nav.artifacts.plain', path: '/artifacts', no: '3' },
  { key: 'nav.grimoire', plain: 'nav.grimoire.plain', path: '/#grimoire', no: '4' },
  { key: 'nav.omake', plain: 'nav.omake.plain', path: '/omake', no: '5' },
  { key: 'nav.letters', plain: 'nav.letters.plain', path: '/#letters', no: '6' },
  { key: 'nav.rest', plain: 'nav.rest.plain', path: '/chaikhaneh', no: '7', soon: true },
];
