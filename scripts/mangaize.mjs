// Turns the real photo into a manga cover panel:
// ink line-art + halftone screentone on newsprint, the yellow shirt as a flat
// saffron spot colour (slightly misregistered), plants as pistachio tone.
// Run: pnpm mangaize  (outputs into src/assets/photo/)
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../src/assets/photo/', import.meta.url));
const SRC = dir + 'mahdi-original.png';
// Rendered natively at each display width (no resampling) so the dots stay crisp
// and 8-colour PNGs stay small; halftone cell scales with the width.
const WIDTHS = [480, 800, 1040];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const PAPER = hex('#F4ECDA');
const INK = hex('#16130F');
const SAFFRON = hex('#F2B705');
const SAFFRON_DEEP = hex('#B87A00');
const PISTACHIO = hex('#8DB255');
const PISTACHIO_INK = hex('#4E6B26');

async function render(SIZE) {
const CELL = SIZE / 150;
const MISREG = { x: Math.round(SIZE / 256), y: Math.round(SIZE / 420) };
const base = sharp(SRC).resize(SIZE, SIZE, { kernel: 'lanczos3' });
const { data: rgb } = await base.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { data: lum } = await base.clone().greyscale().blur(1.4).raw().toBuffer({ resolveWithObject: true });

const N = SIZE * SIZE;

function hsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, max ? d / max : 0, max];
}

// 1. classify: 0 none, 1 shirt (saffron), 2 foliage (pistachio), 3 skin (kept light, like manga faces)
const cls = new Uint8Array(N);
for (let i = 0; i < N; i++) {
  const [h, s, v] = hsv(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]);
  if (h >= 40 && h <= 64 && s > 0.42 && v > 0.32) cls[i] = 1;
  else if (h > 66 && h < 175 && s > 0.18 && v > 0.12) cls[i] = 2;
  else if (h >= 2 && h < 40 && s > 0.1 && s < 0.66 && v > 0.22) cls[i] = 3;
}
// clean the shirt mask: majority filter removes speckles (skin highlights, plant bits)
const clean = new Uint8Array(cls);
const R = Math.max(2, Math.round(SIZE / 420));
for (let y = R; y < SIZE - R; y++) {
  for (let x = R; x < SIZE - R; x++) {
    let shirt = 0;
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) if (cls[(y + dy) * SIZE + x + dx] === 1) shirt++;
    const i = y * SIZE + x;
    const total = (2 * R + 1) ** 2;
    if (shirt > total * 0.55) clean[i] = 1;
    else if (cls[i] === 1) clean[i] = 0;
  }
}

// 2. edges (Sobel on blurred luminance) -> ink lines
const edge = new Float32Array(N);
for (let y = 1; y < SIZE - 1; y++) {
  for (let x = 1; x < SIZE - 1; x++) {
    const p = (dx, dy) => lum[(y + dy) * SIZE + x + dx];
    const gx = -p(-1, -1) - 2 * p(-1, 0) - p(-1, 1) + p(1, -1) + 2 * p(1, 0) + p(1, 1);
    const gy = -p(-1, -1) - 2 * p(0, -1) - p(1, -1) + p(-1, 1) + 2 * p(0, 1) + p(1, 1);
    edge[y * SIZE + x] = Math.hypot(gx, gy);
  }
}

// halftone dot test on a 45deg grid: is (x,y) inside a dot for darkness t (0..1)?
const S2 = Math.SQRT1_2;
function dot(x, y, t) {
  if (t <= 0.02) return false;
  if (t >= 0.98) return true;
  const u = (x + y) * S2 / CELL, v = (x - y) * S2 / CELL;
  const fu = u - Math.floor(u) - 0.5, fv = v - Math.floor(v) - 0.5;
  return Math.hypot(fu, fv) < Math.sqrt(t / Math.PI);
}

const contrast = (l) => Math.min(1, Math.max(0, (l / 255 - 0.12) / 0.74)); // crush the curve

const out = Buffer.alloc(N * 3);
const put = (i, c) => { out[i * 3] = c[0]; out[i * 3 + 1] = c[1]; out[i * 3 + 2] = c[2]; };

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const i = y * SIZE + x;
    const L = contrast(lum[i]);
    // skin reads as clean paper with light tone; everything else gets a lifted gamma
    const dark = (1 - L) ** (clean[i] === 3 ? 2.4 : 1.35);

    // saffron plate is sampled with an offset (misregistration)
    const sx = x - MISREG.x, sy = y - MISREG.y;
    const shirt = sx >= 0 && sy >= 0 && sx < SIZE && sy < SIZE && clean[sy * SIZE + sx] === 1;

    if (edge[i] > (clean[i] === 3 ? 120 : 170) && clean[i] !== 2) { put(i, INK); continue; }

    if (shirt) {
      // flat saffron; folds become saffron-deep tone, deepest shadows ink
      if (dark > 0.78) put(i, INK);
      else if (dot(x, y, Math.max(0, (dark - 0.42) * 1.5))) put(i, SAFFRON_DEEP);
      else put(i, SAFFRON);
      continue;
    }

    if (clean[i] === 2) {
      // foliage: pistachio screentone on paper, soft edges only
      if (edge[i] > 260) put(i, PISTACHIO_INK);
      else if (dot(x, y, 0.15 + dark * 0.55)) put(i, dark > 0.55 ? PISTACHIO_INK : PISTACHIO);
      else put(i, PAPER);
      continue;
    }

    // everything else: posterized ink + screentone
    if (dark > 0.7) put(i, INK);
    else if (dark < 0.2) put(i, PAPER);
    else put(i, dot(x, y, (dark - 0.2) / 0.5) ? INK : PAPER);
  }
}

return sharp(out, { raw: { width: SIZE, height: SIZE, channels: 3 } });
}

for (const w of WIDTHS) {
  const img = await render(w);
  await img.png({ palette: true, colours: 8, compressionLevel: 9, effort: 10 }).toFile(dir + `mahdi-manga-${w}.png`);
}
const manga = await render(1040);

// round sticker (face) for byline/footer/OG: crop around the face, circular alpha
const FACE = { left: 244, top: 122, size: 455 };
const STICKER = 144; // 2x the largest display size (72px)
const circle = Buffer.from(
  `<svg width="${STICKER}" height="${STICKER}"><circle cx="${STICKER / 2}" cy="${STICKER / 2}" r="${STICKER / 2}" fill="#000"/></svg>`,
);
const face = await manga
  .clone()
  .extract({ left: FACE.left, top: FACE.top, width: FACE.size, height: FACE.size })
  .png()
  .toBuffer();
await sharp(face)
  .resize(STICKER)
  .ensureAlpha()
  .composite([{ input: circle, blend: 'dest-in' }])
  .png({ palette: true, colours: 16, compressionLevel: 9, effort: 10 })
  .toFile(dir + 'mahdi-sticker.png');

console.log(`mangaize: wrote ${WIDTHS.map((w) => `mahdi-manga-${w}.png`).join(', ')}, mahdi-sticker.png`);
