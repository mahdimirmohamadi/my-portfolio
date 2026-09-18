// Builds the social card (1200×630): newsprint, the inked photo in a slanted panel,
// a saffron title block with a hard ink shadow. Run: pnpm og  (after pnpm mangaize)
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const outDir = root + 'src/assets/og/';
mkdirSync(outDir, { recursive: true });

const W = 1200;
const H = 630;
const photo = await sharp(root + 'src/assets/photo/mahdi-manga-800.png').resize(560, 560).toBuffer();

const slant = `M620 40 H1160 V590 H660 Z`;
const bg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="1.2" fill="#16130f" fill-opacity="0.22"/>
    </pattern>
    <clipPath id="panel"><path d="${slant}"/></clipPath>
  </defs>
  <rect width="100%" height="100%" fill="#f4ecda"/>
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#dots)" opacity="0.5"/>
  <!-- hard ink shadows -->
  <path d="${slant}" transform="translate(12 12)" fill="#16130f"/>
  <rect x="52" y="132" width="540" height="300" transform="translate(10 10)" fill="#16130f"/>
  <!-- title block with misregistered saffron plate -->
  <rect x="58" y="138" width="540" height="300" fill="#f2b705"/>
  <rect x="52" y="132" width="540" height="300" fill="none" stroke="#16130f" stroke-width="6"/>
  <text x="84" y="206" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="23" fill="#16130f" letter-spacing="2">VOL. 1 · THE SAFFRON CHRONICLE</text>
  <text x="84" y="298" font-family="DejaVu Sans, Arial Black, sans-serif" font-weight="900" font-size="66" fill="#16130f">Mahdi</text>
  <text x="84" y="370" font-family="DejaVu Sans, Arial Black, sans-serif" font-weight="900" font-size="66" fill="#16130f">MirMohamadi</text>
  <text x="84" y="414" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="26" fill="#16130f">Front-End Developer · Tehran</text>
  <text x="56" y="560" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="28" fill="#b3261e">mahdimirmo.ir</text>
</svg>`;

const frame = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <path d="${slant}" fill="none" stroke="#16130f" stroke-width="8" stroke-linejoin="round"/>
</svg>`;

// photo clipped to the slanted panel
const mask = Buffer.from(`<svg width="560" height="560"><path d="M0 0 H540 V550 H40 Z" fill="#000"/></svg>`);
const clipped = await sharp(photo).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();

await sharp(Buffer.from(bg))
  .composite([
    { input: clipped, left: 620, top: 40 },
    { input: Buffer.from(frame), left: 0, top: 0 },
  ])
  .png({ palette: true, colours: 32, compressionLevel: 9 })
  .toFile(outDir + 'og-default.png');

console.log('og: wrote src/assets/og/og-default.png');
