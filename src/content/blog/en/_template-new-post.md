---
title: How to write a new post
description: Copy this file to publish a post. It's a draft, so it never ships.
pubDate: 2026-09-18
tags: [meta]
draft: true
---

1. Copy this file into `src/content/blog/en/` (or `fa/` for Persian) with a new name, e.g. `my-first-post.md`. The file name becomes the URL: `/blog/my-first-post`.
2. Edit the frontmatter (`title`, `description`, `pubDate`, `tags`) and delete `draft: true` when it's ready.
3. To link the English and Persian versions, give both the same `translationKey`.
4. For terminal blocks and asides, rename to `.mdx` and `import { Term, Nix, Callout } from '../../../components/mdx';`
5. Run `pnpm build` (or keep `pnpm dev` open). The post shows up on /blog and its tag pages.
