// Tool name → brand mark (simple-icons, inlined at build time, drawn in currentColor).
// Tools without a published mark get a neutral monogram tile instead of an imitation.
import {
  siTypescript,
  siJavascript,
  siHtml5,
  siCss,
  siReact,
  siNextdotjs,
  siAstro,
  siRemix,
  siRefine,
  siTanstack,
  siReactquery,
  siTailwindcss,
  siShadcnui,
  siChakraui,
  siMui,
  siRedux,
  siSwr,
  siLinux,
  siGit,
  siGithub,
  siGitlab,
  siTurborepo,
  siPnpm,
  siDocker,
  siGithubactions,
  siClaudecode,
  siCursor,
  siLighthouse,
  siGooglesearchconsole,
  siGmail,
  siTelegram,
} from 'simple-icons';

type Icon = { path: string; title: string };

const marks: Record<string, Icon> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  HTML: siHtml5,
  CSS: siCss,
  React: siReact,
  'Next.js': siNextdotjs,
  Astro: siAstro,
  Remix: siRemix,
  Refine: siRefine,
  'TanStack Start': siTanstack,
  'TanStack Query': siReactquery,
  'Tailwind CSS': siTailwindcss,
  'shadcn/ui': siShadcnui,
  'Chakra UI': siChakraui,
  MUI: siMui,
  Redux: siRedux,
  SWR: siSwr,
  Linux: siLinux,
  Git: siGit,
  GitHub: siGithub,
  GitLab: siGitlab,
  Turborepo: siTurborepo,
  pnpm: siPnpm,
  Docker: siDocker,
  'CI/CD': siGithubactions,
  'Claude Code': siClaudecode,
  Cursor: siCursor,
  'Core Web Vitals': siLighthouse,
  'Technical SEO': siGooglesearchconsole,
  Email: siGmail,
  Telegram: siTelegram,
};

const monograms: Record<string, string> = {
  Antigravity: 'Ag',
  Hermes: 'He',
  Zustand: 'Zu',
  Jotai: 'Jo',
  'Panda CSS': 'Pa',
  LinkedIn: 'in',
};

export type Logo = { kind: 'svg'; path: string } | { kind: 'mono'; text: string };

export function logoOf(name: string): Logo {
  const m = marks[name];
  if (m) return { kind: 'svg', path: m.path };
  return { kind: 'mono', text: monograms[name] ?? name.slice(0, 2) };
}
