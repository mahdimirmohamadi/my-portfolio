## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project notes (the git-graph edition)

- Read `README.md`, `PRODUCT.md` and `DESIGN.md` first. Sage plaster by day, a navy sky by night; two materials: molded plastic caps (a 1px lighter rim on top, a 3px darker skirt below, as `box-shadow`) and dark glass screens with a hairline bezel. Lime is only ever something lit: the buds on the git graph, phosphor on glass, LEDs on plastic, the label of the one primary cap. No blur shadows, no colour gradients (the one soft radial field behind the hero graph is the exception), no eyebrows, no card grids.
- The hero is the owner's story as a git tree (`Hero.astro`): `git init: born. hello world!` at the root, a `mechatronics` branch that merges back at graduation, `armani-english` branching off mechatronics, `innolearn` branching off main, lime tips for what is alive now, growing up into a large mounted portrait of the owner. It grows once per session; each commit message links to that part of Experience and hovering it lights its branch. Geometry (two layouts: wide and phone) lives in `geometry()` in `Hero.astro`, labels in the `hero.tree.*` strings in `src/i18n/ui.ts`; keep both locales in step.
- In the hero, Nix is small and still (`happy`) in the corner beside the portrait, never on top of the tree: no bubble, no pose swaps, no reactions (the owner called those childish). The owner's photo must stay large (a mounted rectangle, not a small circle). The owner also rejected a terminal-in-the-hero and a bone/cream day palette.
- The phone number is as important as the email: keep it wherever the email appears (navbar, hero, the contact screen, footer, the terminal's `contact`).
- The live terminal has its own section (`Shell.astro` + `Terminal.astro`); its command keys sit outside the screen and `scripts/terminal.ts` binds `[data-term-run]` document-wide.
- Every page is `src/pages/[...lang]/…` → builds `/` (en) and `/fa/` (fa, RTL). Use `lp(lang, path)` and `useT(lang)`; add UI strings to both locales in `src/i18n/ui.ts`.
- Vanilla CSS with tokens (`src/styles/tokens.css`), no Tailwind. Logical properties; mirror transforms with `var(--dir)`. Geist Mono has no Persian glyphs: Persian text needs `--font-fa`.
- No blue/purple in the UI except third-party brand marks. Motion: transform/opacity/clip-path only, respect `prefers-reduced-motion` and `html[data-lite]`.
- Nix on a dark surface needs the cut line: give the container the `on-glass` class (see `Nix.astro`).
- Keep everything local: do not publish, upload, push or deploy without the owner asking.
- `astro check` needs TypeScript 6.x.
