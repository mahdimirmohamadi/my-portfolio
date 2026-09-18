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

## Project notes (The Saffron Chronicle)

- Read `README.md` first: design rules, structure, how posts work.
- Every page is `src/pages/[...lang]/…` → builds `/` (en) and `/fa/` (fa, RTL). Use `lp(lang, path)` for links and `useT(lang)` for strings; add every UI string to both `en` and `fa` in `src/i18n/ui.ts`.
- Styling is vanilla CSS with tokens (`src/styles/tokens.css`); no Tailwind. Use logical properties; mirror transforms with `var(--dir)`.
- No blue/purple, no colour gradients. Motion: transform/opacity only, respect `prefers-reduced-motion` and `html[data-lite]`.
- Keep everything local: do not publish, upload, push or deploy without the owner asking.
- `astro check` needs TypeScript 6.x (TS 7 native compiler lacks the API).
