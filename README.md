# mahdimirmo.ir

Mahdi MirMohamadi's portfolio. The first thing you see is his story as a git tree that grows from the root: `git init: born. hello world!` at the root, a branch for studying Mechatronics that merges back when he graduated, a branch off it for Armani English, a branch for InnoLearn, all growing up into a large portrait of him, with Nix (the mascot, also the logo and favicon) standing in the corner beside it. Every commit message links to that part of his experience, and hovering one lights its branch. Beside the tree: who Mahdi is, the phone number, the email, the resume. Below: experience as a timeline with lime LEDs, the shipped sites inside small dark screens, an animated loop of how AI changed his workflow, a keycap toolbox, skills as keycaps, a live terminal, the blog, and then the whole width goes to glass for "Get in touch", with the phone number and the email lit in phosphor. A resume picker (EN or FA) opens from any "Download my resume". English lives at `/` and Persian (RTL) at `/fa/`. Built with Astro and vanilla CSS, and fully static.

The design system is written down in [DESIGN.md](DESIGN.md); product intent in [PRODUCT.md](PRODUCT.md).

> Earlier editions: the Linux-desktop one is kept on the `theme/workstation` branch; the sage alcove ("Ma"), the beige "machine" and the first (manga) edition survive only in git history.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server at `localhost:4321` (drafts are visible here) |
| `pnpm build` | Static site in `dist/` |
| `pnpm preview` | Serve `dist/` locally |
| `pnpm check` | Type-check (needs TypeScript 6.x) |
| `pnpm nix` | Re-cut Nix's 28 poses from `src/assets/nix/nix-sheet*.jpg`, then rebuild the favicons |
| `pnpm icons` | Rebuild only the favicons from `nix-head.png` |
| `pnpm shots` | Re-capture the full-page project screenshots (needs `PWC` and `CHROME_PATH`, see the script header) |
| `pnpm og` | Rebuild the social card (needs `pnpm preview` running; see the script's header) |

## Writing a blog post

1. Add `src/content/blog/en/my-post.md` (or `fa/`). The file name becomes the URL: `/blog/my-post`.
2. Frontmatter: `title`, `description`, `pubDate`, `tags`, and optionally `translationKey` (same key on the EN and FA versions links them) and `draft: true`.
3. For terminal blocks and asides, use `.mdx`:

   ```mdx
   import { Term, Nix, Callout } from '../../../components/mdx';

   <Term lines={[{ cmd: 'whoami' }, { out: 'mahdi' }]} />
   <Nix>Nix says hi.</Nix>
   ```

4. Build. The post appears on `/blog` and its tag pages. Copy `src/content/blog/en/_template-new-post.md` to start.

## Where things live

```
src/
  data/profile.ts          resume data: phone + email, neofetch facts, jobs, education, AI tools, skill groups
  data/logos.ts            tool name → mark (simple-icons + brand colour; official icons for Antigravity, Hermes Agent)
  content/blog/{en,fa}/    posts          content/projects/{en,fa}/  project write-ups
  i18n/                    UI strings (EN + FA, conversational), locale paths, Persian digits & Jalali dates
  layouts/BaseLayout.astro head, fonts, theme pre-paint, router, navbar, dock, resume picker
  components/
    chrome/                Navbar, Dock (phones), Footer, ResumeDialog
    home/                  Hero (the git graph), Work (timeline), Projects, AiNote (workflow loop), AiToolbox, Skills, Shell/Terminal, BlogTeaser, Contact (the glass close), MoreNerdy
    art/Nix.astro          the mascot (28 poses; see DESIGN.md)
    ui/                    Icon, Logo, Arrow, SectionHead, Window
  scripts/
    terminal.ts            the shell: commands, history, tab completion
    chrome.ts              theme circle-reveal, scroll-spy, idle pausing, resume picker
scripts/                   build-time: nix.mjs + nix-sheets.mjs (cut the poses), icons.mjs (favicons), og.mjs (social card)
```

## Design rules

See [DESIGN.md](DESIGN.md). In short: sage plaster by day and a navy sky by night, molded plastic caps (a rim and a skirt) and dark glass screens (a hairline bezel), lime only where something is lit (the graph's buds, phosphor on glass, LEDs, the one primary action). No blur shadows, no colour gradients, no eyebrows, no card grids. Tool marks show their brand colour on hover. Motion is transform/opacity/stroke, one authored moment (the graph drawing itself), and `prefers-reduced-motion` or `html[data-lite]` shows the final state. Logical properties everywhere, with `--dir` mirroring transforms in RTL.

## ~/lab (pomodoro now, lofi radio later)

`/lab` is the hub: a pomodoro timer at `/lab/pomodoro` and a "soon" lofi radio. The agreed spec is [docs/pomodoro.md](docs/pomodoro.md). The timer is solo and kept in the visitor's browser; a finished focus session shows a random anime image from `src/assets/anime/`. Its mini-timer mounts in `BaseLayout`'s persistent `dock` slot as a React island (`client:idle transition:persist="lab-dock"`), so it keeps running between pages.
