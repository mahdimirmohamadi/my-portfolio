// Full-page screenshots of the live project sites, for the scroll-on-hover browser frames.
// Scrolls each page first so lazy images load; Next.js image-optimizer URLs are served from their
// static originals (innomeet.ir's optimizer answers 503). Output: src/assets/projects/<slug>-full.jpg
// Run: PWC=<path to playwright-core> CHROME_PATH=<chrome> pnpm shots
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { setJpegComment } from './lib/png-text.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PWC ?? 'playwright-core');

const sites = [
  { slug: 'innolearn', url: 'https://innolearn.ir' },
  { slug: 'innomeet', url: 'https://innomeet.ir' },
  { slug: 'armani-english', url: 'https://armanienglish.com' },
  { slug: 'armani-portal', url: 'https://my.armanienglish.com' },
];
const only = process.argv.slice(2);
const MAX_H = 7000; // very long pages are cut here; the frame only needs a good long scroll

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
for (const site of sites.filter((s) => !only.length || only.includes(s.slug))) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.route(
    (u) => u.pathname === '/_next/image',
    async (route) => {
      const u = new URL(route.request().url());
      let r;
      for (let i = 0; i < 6; i++) {
        r = await fetch(new URL(u.searchParams.get('url'), u.origin));
        if (r.ok) break;
        await new Promise((z) => setTimeout(z, 800));
      }
      route.fulfill({ status: r.status, body: Buffer.from(await r.arrayBuffer()), headers: { 'content-type': r.headers.get('content-type') ?? 'image/png' } });
    },
  );
  await page.goto(site.url, { waitUntil: 'networkidle', timeout: 90000 }).catch((e) => console.log(site.slug, e.message));
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 250));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(3000);
  const png = await page.screenshot({ fullPage: true });
  const meta = await sharp(png).metadata();
  await sharp(png)
    .extract({ left: 0, top: 0, width: meta.width, height: Math.min(meta.height, MAX_H) })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(root + `src/assets/projects/${site.slug}-full.jpg`);
  setJpegComment(
    root + `src/assets/projects/${site.slug}-full.jpg`,
    `ORIGIN: full-page screenshot of ${site.url} (1280px wide, headless Chromium) by scripts/shots.mjs. Mahdi's own work.`,
  );
  console.log(`shots: ${site.slug} 1280×${Math.min(meta.height, MAX_H)} (page ${meta.height})`);
  await page.close();
}
await browser.close();
