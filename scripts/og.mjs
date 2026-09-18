// Social card (1200×630): screenshots the site's own /og-card page, so the card uses the
// real fonts and palette. Run with the preview server up: pnpm build && pnpm preview, then pnpm og.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { setPngText } from './lib/png-text.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const base = process.env.OG_BASE ?? 'http://127.0.0.1:4322';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PWC ?? 'playwright-core');

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`${base}/og-card/`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
await sharp(png).png({ compressionLevel: 9, palette: true, colours: 96 }).toFile(root + 'src/assets/og/og-default.png');
setPngText(
  root + 'src/assets/og/og-default.png',
  'impeccable:prompt',
  'ORIGIN: screenshot of the site\'s own /og-card page (1200x630, headless Chromium) by scripts/og.mjs: real photo, Nix, site fonts and palette.',
);
console.log('og: wrote src/assets/og/og-default.png');
