import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * The blog. Write a post: add `src/content/blog/en/my-post.md` (or `fa/`), then build.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** same key on the EN + FA versions links them for the language switch */
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/** Projects. One file per project per language. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    url: z.url().optional(),
    stack: z.array(z.string()),
    order: z.number(),
    /** a short code glyph drawn big on the card, e.g. "</>" */
    glyph: z.string(),
    kind: z.string(),
  }),
});

export const collections = { blog, projects };
