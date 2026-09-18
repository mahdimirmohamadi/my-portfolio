// Screenshots of the live project sites (captured with headless Chromium), keyed by project slug.
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/projects/*.png', { eager: true });

export function shotOf(slug: string): ImageMetadata | undefined {
  return files[`../assets/projects/${slug}.png`]?.default;
}
