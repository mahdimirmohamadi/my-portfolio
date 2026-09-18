# The Saffron Chronicle

Mahdi MirMohamadi's portfolio, drawn as Volume 1 of a Persian-fable manga. English lives at `/`, Persian (RTL, "the original printing") at `/fa/`. Built with Astro and vanilla CSS, and fully static.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server at `localhost:4321` (drafts are visible here) |
| `pnpm build` | Static site in `dist/` |
| `pnpm preview` | Serve `dist/` locally |
| `pnpm check` | Type-check `.astro` / `.ts` (needs TypeScript 6.x) |
| `pnpm mangaize` | Re-ink the cover photo from `src/assets/photo/mahdi-original.png` |
| `pnpm textures` | Re-bake the paper grain tiles in `public/textures/` |
| `pnpm og` | Rebuild the social card `src/assets/og/og-default.png` |
| `pnpm art` | All three of the above |

## Writing a blog post (Omake / side chapters)

1. Create `src/content/omake/en/my-post.md` (or `fa/` for Persian). The file name becomes the URL: `/omake/my-post`.
2. Add frontmatter:

   ```yaml
   ---
   title: My post
   description: One sentence for cards, RSS and search.
   pubDate: 2026-10-01
   tags: [astro, performance]
   translationKey: my-post # optional: same key on the EN + FA versions links them
   sfx: WHOOSH # optional: big sound-effect lettering on the header
   draft: true # optional: visible in `pnpm dev`, never built
   ---
   ```

3. Want manga bits? Name it `.mdx` and import them:

   ```mdx
   import { Bubble, SFX, Panel, Callout } from '../../../components/mdx';

   <Bubble speaker="simo">Simo says hi.</Bubble>
   <SFX en="KA-BOOM" fa="بوم!" />
   ```

4. Build. The post appears on the Omake page, on its tag pages, and in `/rss.xml` or `/fa/rss.xml`.

`src/content/omake/en/_template-new-side-chapter.md` is a draft you can copy.

## Where things live

```
src/
  content.config.ts        collections: omake (blog), artifacts (projects)
  content/omake/{en,fa}/   blog posts (.md / .mdx)
  content/artifacts/{en,fa}/ project write-ups
  data/chronicle.ts        resume data: origin, quests, boss battles, grimoire, contacts
  i18n/ui.ts, utils.ts     UI strings (EN + FA), locale paths, Persian digits, Jalali dates
  layouts/BaseLayout.astro head, fonts, page-turn router, masthead, chapter bar, dock slot
  components/
    art/                   Simo (the Simorgh narrator), sigils, speed lines, SVG defs
    cover/                 the cover spread + photo
    chapters/              Origin, Quests (+ boss battles), Treasury, Grimoire, Omake, Letters
    ui/                    Panel, Bubble, SFX, ChapterHead
    mdx/                   components importable from .mdx posts
    nav/                   Masthead, ChapterBar (mobile), Footer, chapter list
  scripts/chrome.ts        edition toggle, contents sheet, idle pausing, copy email
  scripts/motion/          cover intro, boss battle, FIN stamp (native WAAPI, no library)
  styles/                  tokens, base, tone (manga primitives), motion
  pages/[...lang]/         every route once; builds both / and /fa/
scripts/                   build-time art: mangaize, textures, og
```

## Design rules

- **Palette:** paper, ink, and one spot colour, saffron. Pomegranate, pistachio and tea are accents. No blue or purple, and no colour gradients. Screentone dots are texture, not gradients.
- **Ink language:** 3px ink borders, hard offset shadows (never blurred), and misregistered colour plates (`.misreg`: the fill sits a few px off the outline).
- **RTL:** logical properties everywhere. `--dir` (1 or -1) flips transforms and shadows. The Tehran→Melbourne map is never mirrored.
- **Motion:** only `transform` and `opacity`. The delight budget goes to rare moments (cover ink-in, boss battles, the FIN stamp). Frequent interactions stay under 200ms. `prefers-reduced-motion` and `html[data-lite]` (low-end or save-data devices) show final states.
- **Performance:** static HTML, no React on first load, per-locale font preload, and the photo inked into 8-colour PNGs at 480/800/1040px.

## Reserved: the Chaikhaneh (lofi radio + pomodoro)

`/chaikhaneh` is a closed tea house for now. The comfort dock will mount in `BaseLayout`'s `dock` slot as a React island (`client:idle transition:persist="comfort-dock"`), so audio keeps playing across page turns. `@astrojs/react` and `motion` are already installed for it.
