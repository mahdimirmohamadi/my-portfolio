import type { UIKey } from '../../i18n/ui';

/** Workspaces (the nav). `hash` targets home sections; `path` is a page. */
export type Workspace = { key: UIKey; hash?: string; path?: string; icon: string; soon?: boolean; /** false: navbar only */ dock?: boolean };

export const workspaces: Workspace[] = [
  { key: 'nav.home', hash: 'top', icon: 'M4 11 12 4l8 7v9h-5v-6H9v6H4z' },
  { key: 'nav.work', hash: 'work', icon: 'M4 7h16v12H4zM9 7V5h6v2' },
  { key: 'nav.projects', path: '/projects', hash: 'projects', icon: 'M3 6h7l2 2h9v11H3z' },
  { key: 'nav.ai', hash: 'ai', icon: 'M12 3v3M12 18v3M3 12h3M18 12h3M7 7h10v10H7z', dock: false },
  { key: 'nav.blog', path: '/blog', icon: 'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h5' },
  { key: 'nav.lab', path: '/lab', icon: 'M9 3h6M10 3v6l-5 9.5A1.7 1.7 0 0 0 6.5 21h11a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7.2 15h9.6' },
  { key: 'nav.contact', hash: 'contact', icon: 'M4 6h16v12H4zM4 7l8 6 8-6' },
];
