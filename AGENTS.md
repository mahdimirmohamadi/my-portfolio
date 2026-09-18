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

## Project notes (workstation theme, branch `theme/workstation`)

- Read `README.md` first. The manga edition is on `main`; don't mix the two.
- Every page is `src/pages/[...lang]/…` → builds `/` (en) and `/fa/` (fa, RTL). Use `lp(lang, path)` and `useT(lang)`; add UI strings to both locales in `src/i18n/ui.ts`.
- Vanilla CSS with tokens (`src/styles/tokens.css`), no Tailwind. Logical properties; mirror transforms with `var(--dir)`. Geist Mono has no Persian glyphs: Persian text needs `--font-fa`.
- No blue/purple. Motion: transform/opacity only, respect `prefers-reduced-motion` and `html[data-lite]`.
- Keep everything local: do not publish, upload, push or deploy without the owner asking.
- `astro check` needs TypeScript 6.x.
