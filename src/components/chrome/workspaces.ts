import type { UIKey } from '../../i18n/ui';

/** Workspaces (the nav). `hash` targets home sections; `path` is a page. */
export type Workspace = { key: UIKey; hash?: string; path?: string; icon: string; soon?: boolean };

export const workspaces: Workspace[] = [
  { key: 'nav.home', hash: 'top', icon: 'M4 11 12 4l8 7v9h-5v-6H9v6H4z' },
  { key: 'nav.work', hash: 'work', icon: 'M4 7h16v12H4zM9 7V5h6v2' },
  { key: 'nav.projects', path: '/projects', hash: 'projects', icon: 'M3 6h7l2 2h9v11H3z' },
  { key: 'nav.blog', path: '/blog', icon: 'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h5' },
  { key: 'nav.contact', hash: 'contact', icon: 'M4 6h16v12H4zM4 7l8 6 8-6' },
];
