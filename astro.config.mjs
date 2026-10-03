// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import { termDark, termLight } from './src/lib/shiki-themes.mjs';

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

  integrations: [
    mdx(),
    // the ~/lab pomodoro timer is a React island (only /lab/pomodoro loads it)
    react(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', fa: 'fa-IR' } },
      filter: (page) => !page.includes('/og-card'),
    }),
  ],

  markdown: {
    shikiConfig: {
      themes: { light: termLight, dark: termDark },
      defaultColor: false,
      wrap: true,
    },
  },

  // static, per-weight files from fontsource (small); Vazirmatn from Google (Persian)
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Geist',
      cssVariable: '--font-body',
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Geist Mono',
      cssVariable: '--font-mono',
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Young Serif',
      cssVariable: '--font-display',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Vazirmatn',
      cssVariable: '--font-fa',
      weights: [400, 800],
      styles: ['normal'],
      subsets: ['arabic'],
      fallbacks: ['Tahoma', 'sans-serif'],
    },
  ],
});
