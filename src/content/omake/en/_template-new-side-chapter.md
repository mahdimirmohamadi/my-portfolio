---
title: How to write a new side chapter
description: Copy this file to publish a post. It's a draft, so it never ships.
pubDate: 2026-09-18
tags: [meta]
draft: true
---

1. Copy this file into `src/content/omake/en/` (or `fa/` for Persian) with a new name, e.g. `my-first-post.md`. The file name becomes the URL: `/omake/my-first-post`.
2. Edit the frontmatter: `title`, `description`, `pubDate`, `tags`. Delete `draft: true` when it's ready.
3. To link the English and Persian versions, give both the same `translationKey`.
4. Want manga bits? Rename to `.mdx` and `import { Bubble, SFX, Panel, Callout } from '../../../components/mdx';`
5. Run `pnpm build` (or keep `pnpm dev` open). It shows up on the Omake page, its tag pages and the RSS feed.
