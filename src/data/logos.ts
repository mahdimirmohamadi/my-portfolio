// Tool name → brand mark (simple-icons, inlined at build time, drawn in currentColor).
// Tools without a published mark are shown by name alone; no imitation marks.
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

export type Logo = { kind: 'svg'; path: string } | null;

/** A tool's published mark, or null: tools without one are shown by name alone. */
export function logoOf(name: string): Logo {
  const m = marks[name];
  return m ? { kind: 'svg', path: m.path } : null;
}
