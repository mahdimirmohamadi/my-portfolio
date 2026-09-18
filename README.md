# mahdi@workstation

Mahdi MirMohamadi's portfolio as a modern Linux desktop session: a tiled hero (nvim buffer + live terminal), `git log` for experience, grouped skill logos, a photo with an optional 1-bit mode, and Nix, a tiny CRT daemon. English lives at `/` and Persian (RTL) at `/fa/`. Built with Astro and vanilla CSS, and fully static.

> The manga edition (*The Saffron Chronicle*) lives on the `main` branch. This is the `theme/workstation` branch.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server at `localhost:4321` (drafts are visible here) |
| `pnpm build` | Static site in `dist/` |
| `pnpm preview` | Serve `dist/` locally |
| `pnpm check` | Type-check (needs TypeScript 6.x) |
| `pnpm dither` | Re-dither the portrait from `src/assets/photo/mahdi-original.png` |
| `pnpm og` | Rebuild the social card |

## Writing a blog post

1. Add `src/content/blog/en/my-post.md` (or `fa/`). The file name becomes the URL: `/blog/my-post`.
2. Frontmatter: `title`, `description`, `pubDate`, `tags`, and optionally `translationKey` (same key on the EN and FA versions links them) and `draft: true`.
3. For terminal blocks and asides, use `.mdx`:

   ```mdx
   import { Term, Nix, Callout } from '../../../components/mdx';

   <Term lines={[{ cmd: 'whoami' }, { out: 'mahdi' }]} />
   <Nix>Nix says hi.</Nix>
   ```

4. Build. The post appears on `/blog`, its tag pages and the RSS feed. Copy `src/content/blog/en/_template-new-post.md` to start.

## Where things live

```
src/
  data/profile.ts          resume data: neofetch facts, jobs (git log), AI, skill groups
  content/blog/{en,fa}/    posts          content/projects/{en,fa}/  project READMEs
  i18n/                    UI strings (EN + FA), locale paths, Persian digits & Jalali dates
  layouts/BaseLayout.astro head, fonts, theme pre-paint, router, top panel, dock, status line
  components/
    chrome/                TopPanel (workspaces, CPU, Tehran clock), Dock (phones), StatusLine
    home/                  Hero, Terminal, Whoami, GitLog, AiLoop, Projects, Skills, BlogTeaser, Contact
    art/Nix.astro          the mascot (moods: happy, panic, sleep)
    ui/ mdx/ blog/
  scripts/
    terminal.ts            the shell: commands, history, tab completion
    chrome.ts              theme circle-reveal, clock, scroll-spy, Nix's eyes, idle pausing, copy
    fx/                    click sparks
    portrait.ts session.ts portrait wipe, streaming AI session
scripts/                   build-time: dither.mjs, og.mjs
```

## Design rules

- **Palette:** warm black, phosphor lime `#C6F432`, amber and coral, plus a daylight theme. No blue or purple. No gradients: the background is film grain plus faint CRT scanlines. Tool logos come from simple-icons, inlined at build time in currentColor.
- **The cartoon edge:** 2px outlines, hard offset shadows (never blurred), tilted stickers, and Nix.
- **Motion:** `transform`/`opacity` only. Frequent interactions stay under 250ms. `prefers-reduced-motion` and `html[data-lite]` (low-end or save-data devices) turn the effects off, and nothing ever stays hidden.
- **Performance:** static HTML, about 12KB gzipped of JS on the home page, and no framework runtime. Hover states are border/colour changes (focus follows the mouse, like a tiling WM), not glows.
- **RTL:** logical properties everywhere, and `--dir` mirrors shadows and transforms. Terminal and code blocks stay LTR.

## Reserved: ~/lab (lofi radio + pomodoro)

`/lab` is a placeholder. The dock will mount in `BaseLayout`'s `dock` slot as a React island (`client:idle transition:persist="lab-dock"`), so it keeps playing between pages.
