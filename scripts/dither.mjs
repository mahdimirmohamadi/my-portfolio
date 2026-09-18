// Turns the real photo into a 1-bit ordered (Bayer 8x8) dither, saved as an alpha mask.
// The site colours it with CSS `mask-image`, so one file follows every theme.
// Run: pnpm dither   (outputs into src/assets/photo/)
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../src/assets/photo/', import.meta.url));
const SRC = dir + 'mahdi-original.png';

// classic 8x8 Bayer matrix, normalised to 0..1
const B8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((r) => r.map((v) => (v + 0.5) / 64));

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

async function dither({ size, pixel, out, crop, dimBackground = 0.42 }) {
  const grid = Math.round(size / pixel); // dither resolution (each dot = pixel×pixel)
  const base = () => (crop ? sharp(SRC).extract(crop) : sharp(SRC)).resize(grid, grid, { kernel: 'lanczos3' });
  const { data: rgb } = await base().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  // local contrast (CLAHE) so the face survives 1-bit
  const { data: grey } = await base().greyscale().clahe({ width: 24, height: 24, maxSlope: 4 }).normalise().raw().toBuffer({ resolveWithObject: true });

  // foliage dims a little so the person reads first
  const data = new Float32Array(grid * grid);
  for (let i = 0; i < grid * grid; i++) {
    const [h, s] = hsv(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]);
    const plant = h > 66 && h < 175 && s > 0.16;
    data[i] = grey[i] * (plant ? dimBackground : 1);
  }

  const px = Buffer.alloc(size * size * 4);
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const l = data[y * grid + x] / 255;
      // light areas become lit dots (like phosphor), dark areas stay empty
      const on = l > B8[y % 8][x % 8];
      if (!on) continue;
      for (let dy = 0; dy < pixel; dy++) {
        for (let dx = 0; dx < pixel; dx++) {
          const i = ((y * pixel + dy) * size + (x * pixel + dx)) * 4;
          px[i] = px[i + 1] = px[i + 2] = 255;
          px[i + 3] = 255;
        }
      }
    }
  }
  await sharp(px, { raw: { width: size, height: size, channels: 4 } })
    .png({ palette: true, colours: 2, compressionLevel: 9, effort: 10 })
    .toFile(dir + out);
}

await dither({ size: 640, pixel: 2, out: 'mahdi-dither.png', crop: { left: 100, top: 70, width: 360, height: 360 } });
// small face crop: the avatar used in the top panel, blog byline and footer
await dither({ size: 192, pixel: 2, out: 'mahdi-dither-face.png', crop: { left: 160, top: 110, width: 210, height: 210 } });
console.log('dither: wrote mahdi-dither.png, mahdi-dither-face.png');
