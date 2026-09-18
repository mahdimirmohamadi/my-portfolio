// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import { inkPaper, inkNight } from './src/lib/shiki-themes.mjs';

export default defineConfig({
  site: 'https://mahdimirmo.ir',
  output: 'static',
  trailingSlash: 'ignore',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fa'],
    routing: { prefixDefaultLocale: false },
  },

  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },

  // ~10KB gz of CSS inlined: no render-blocking stylesheet requests on first visit
  build: { inlineStylesheets: 'auto' },

  integrations: [
    mdx(),
    // React is wired now but only used by the future comfort dock (radio + pomodoro).
    react(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', fa: 'fa-IR' } },
      filter: (page) => !page.includes('/chaikhaneh'),
    }),
  ],

  markdown: {
    shikiConfig: {
      themes: { light: inkPaper, dark: inkNight },
      defaultColor: false,
      wrap: true,
    },
  },

  fonts: [
    {
      // body + UI for both scripts
      provider: fontProviders.google(),
      name: 'Vazirmatn',
      cssVariable: '--font-body',
      // static 400 + 700: the variable range file is ~2x heavier per subset
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin', 'arabic'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      // fontsource serves per-subset files; google would declare ~120 CJK slices
      provider: fontProviders.fontsource(),
      name: 'Dela Gothic One',
      cssVariable: '--font-display',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Impact', 'sans-serif'],
    },
    {
      // comic hand lettering; ~18KB per static weight (Shantell Sans was ~80KB)
      provider: fontProviders.fontsource(),
      name: 'Mali',
      cssVariable: '--font-hand',
      weights: [500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Comic Sans MS', 'cursive'],
    },
    {
      provider: fontProviders.google(),
      name: 'Lalezar',
      cssVariable: '--font-fa-display',
      weights: [400],
      styles: ['normal'],
      subsets: ['arabic', 'latin'],
      fallbacks: ['Tahoma', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Jomhuria',
      cssVariable: '--font-fa-sfx',
      weights: [400],
      styles: ['normal'],
      subsets: ['arabic'],
      fallbacks: ['Tahoma', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
