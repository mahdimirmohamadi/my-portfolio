import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Post = CollectionEntry<'omake'>;
export type Artifact = CollectionEntry<'artifacts'>;

/** "en/hello-world" → { lang: "en", slug: "hello-world" } */
export function splitId(id: string) {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
}

export async function getPosts(lang: Lang) {
  const posts = await getCollection('omake', (p) => splitId(p.id).lang === lang && (import.meta.env.DEV || !p.data.draft));
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getArtifacts(lang: Lang) {
  const items = await getCollection('artifacts', (a) => splitId(a.id).lang === lang);
  return items.sort((a, b) => a.data.order - b.data.order);
}

export const slugOf = (entry: { id: string }) => splitId(entry.id).slug;

export function tagSlug(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '');
}
