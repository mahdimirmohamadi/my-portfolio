// Screenshots of the live project sites (headless Chromium), keyed by project slug.
// `<slug>-full.jpg` is the whole page (scripts/shots.mjs), shown in a browser frame that scrolls
// on hover; `<slug>.png` is the first viewport only, used for the social-size fallbacks.
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/projects/*.{png,jpg}', { eager: true });

/** the full-page screenshot, or the first-viewport one if no full capture exists */
export function shotOf(slug: string): ImageMetadata | undefined {
  return files[`../assets/projects/${slug}-full.jpg`]?.default ?? files[`../assets/projects/${slug}.png`]?.default;
}
