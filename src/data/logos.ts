// Tool name → brand mark. simple-icons marks are inlined at build time and drawn in currentColor
// (their brand colour shows on hover). Antigravity and Hermes Agent have no simple-icons entry,
// so their official site icons are used as images (sources in each PNG's metadata).
// Tools without a published mark are shown by name alone; no imitation marks.
import type { ImageMetadata } from 'astro';
import antigravity from '../assets/logos/antigravity.png';
import hermesAgent from '../assets/logos/hermes-agent.png';
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

type Icon = { path: string; title: string; hex: string };

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

const images: Record<string, { src: ImageMetadata; hex: string }> = {
  Antigravity: { src: antigravity, hex: '#3b82f6' },
  'Hermes Agent': { src: hermesAgent, hex: '#8a8a8a' },
};

export type Logo =
  | { kind: 'svg'; path: string; hex: string; dark: boolean }
  | { kind: 'img'; src: ImageMetadata; hex: string; dark: boolean }
  | null;

/** relative luminance of a #rrggbb colour (0 black … 1 white) */
function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** A tool's published mark, or null: tools without one are shown by name alone.
 *  `dark` marks near-black brand colours, which fall back to ink at night. */
export function logoOf(name: string): Logo {
  const img = images[name];
  if (img) return { kind: 'img', src: img.src, hex: img.hex, dark: false };
  const m = marks[name];
  if (!m) return null;
  return { kind: 'svg', path: m.path, hex: `#${m.hex}`, dark: luminance(m.hex) < 0.05 };
}
