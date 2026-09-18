import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Omake = side chapters = the blog.
 * Write a post: add `src/content/omake/en/my-post.md` (or `fa/`), then build.
 */
const omake = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/omake' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** same key on the EN + FA versions links them for the language switch */
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
    /** big SFX lettering on the post header, e.g. "WHOOSH" / «ووش!» */
    sfx: z.string().optional(),
  }),
});

/** Artifacts = projects. One file per project per language. */
const artifacts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artifacts' }),
  schema: z.object({
    title: z.string(),
    epithet: z.string(),
    summary: z.string(),
    url: z.url().optional(),
    stack: z.array(z.string()),
    order: z.number(),
    sigil: z.enum(['scroll', 'orb', 'lantern', 'mirror', 'coin']),
  }),
});

export const collections = { omake, artifacts };
