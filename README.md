# Ma: mahdimirmo.ir

Mahdi MirMohamadi's portfolio as one quiet alcove: his photo hangs like a scroll that unrolls when you arrive, and Nix (the mascot, also the logo and favicon) powers on beside it, greets you in a speech bubble and reacts to whatever you hover: he picks up the phone, holds the CV, points at the photo, dozes off if you idle, and panics if you shake the mouse. Below it: experience as a timeline, projects as real screenshots, an animated loop of how AI changed his workflow, skills with logos, a live terminal, the blog and "Get in touch" with the phone number and email set large. A resume picker (EN or FA) opens from any "Download my resume". English lives at `/` and Persian (RTL) at `/fa/`. Built with Astro and vanilla CSS, and fully static.

The design system is written down in [DESIGN.md](DESIGN.md); product intent in [PRODUCT.md](PRODUCT.md).

> The earlier Linux-desktop edition is kept on the `theme/workstation` branch. The first (manga) edition was removed; it survives only in git history.

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
    home/                  Hero, Work (timeline), Projects, AiNote (workflow loop), Skills, Shell/Terminal, BlogTeaser, Contact
    art/Nix.astro          the mascot (28 poses; see DESIGN.md)
    ui/                    Icon, Logo, Arrow, SectionHead, Window
  scripts/
    terminal.ts            the shell: commands, history, tab completion
    chrome.ts              theme circle-reveal, scroll-spy, idle pausing, resume picker
scripts/                   build-time: nix.mjs + nix-sheets.mjs (cut the poses), icons.mjs (favicons), og.mjs (social card)
```

## Design rules

See [DESIGN.md](DESIGN.md). In short: sage plaster, pine-grey ink, a bronze shelf, one lime accent for what is alive (buds, the primary action of a block, the current nav item). No shadows, gradients, eyebrows or card grids. Tool marks show their brand colour on hover. Motion is transform/opacity, and `prefers-reduced-motion` or `html[data-lite]` shows the final state. Logical properties everywhere, with `--dir` mirroring transforms in RTL.

## Reserved: ~/lab (lofi radio + pomodoro)

`/lab` is a placeholder. The dock will mount in `BaseLayout`'s `dock` slot as a React island (`client:idle transition:persist="lab-dock"`), so it keeps playing between pages.
