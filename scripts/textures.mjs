// Bakes the newsprint grain into tiny tiling PNGs (no live SVG filters at runtime).
// Run: pnpm textures  (outputs into public/textures/)
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../public/textures/', import.meta.url));
mkdirSync(out, { recursive: true });

const SIZE = 180;

// deterministic PRNG so the tile never changes between builds
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function grain(file, [r, g, b], density, maxAlpha) {
  const rand = mulberry32(1405);
  const px = Buffer.alloc(SIZE * SIZE * 4);
  for (let i = 0; i < SIZE * SIZE; i++) {
    const n = rand();
    px[i * 4] = r;
    px[i * 4 + 1] = g;
    px[i * 4 + 2] = b;
    // sparse fibres + faint speckle
    px[i * 4 + 3] = n < density ? Math.round(maxAlpha * (0.4 + rand() * 0.6)) : n < density * 4 ? Math.round(maxAlpha * 0.25) : 0;
  }
  await sharp(px, { raw: { width: SIZE, height: SIZE, channels: 4 } })
    .png({ palette: true, colours: 8, compressionLevel: 9, effort: 10 })
    .toFile(out + file);
}

await grain('grain.png', [74, 58, 36], 0.012, 46);
await grain('grain-night.png', [239, 230, 210], 0.01, 26);
console.log('textures: wrote grain.png, grain-night.png');
