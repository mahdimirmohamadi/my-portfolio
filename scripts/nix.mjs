// Cut Nix's four poses out of the generated sprite sheet (a JPG with the "transparent"
// checkerboard baked in). Flood-fills the neutral light background from the edges, trims the
// light JPEG halo off the black outline, then crops each pose to its own PNG with real alpha.
// Run: pnpm nix
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const src = root + 'src/assets/nix/nix-sheet.jpg';
const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;
const at = (i) => [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
const neutral = (i, minLum) => {
  const [r, g, b] = at(i);
  return Math.max(r, g, b) - Math.min(r, g, b) <= 14 && (r + g + b) / 3 >= minLum;
};

// 1. flood-fill the checkerboard (neutral + bright) from every edge pixel
const bg = new Uint8Array(N);
const stack = [];
for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
while (stack.length) {
  const i = stack.pop();
  if (bg[i] || !neutral(i, 190)) continue;
  bg[i] = 1;
  const x = i % W;
  if (x > 0) stack.push(i - 1);
  if (x < W - 1) stack.push(i + 1);
  if (i >= W) stack.push(i - W);
  if (i < N - W) stack.push(i + W);
}

// 2. peel the light-grey JPEG halo that hugs the outline (two passes)
const touchesBg = (i) => {
  const x = i % W;
  return (x > 0 && bg[i - 1]) || (x < W - 1 && bg[i + 1]) || (i >= W && bg[i - W]) || (i < N - W && bg[i + W]);
};
for (let pass = 0; pass < 2; pass++) {
  const peel = [];
  for (let i = 0; i < N; i++) if (!bg[i] && touchesBg(i) && neutral(i, 110)) peel.push(i);
  for (const i of peel) bg[i] = 1;
}

// 3. connected components of the figure; drop specks, group the rest into the four poses
const label = new Int32Array(N).fill(-1);
const comps = [];
for (let s = 0; s < N; s++) {
  if (bg[s] || label[s] >= 0) continue;
  const id = comps.length;
  const c = { n: 0, x0: W, y0: H, x1: 0, y1: 0, sx: 0, sy: 0 };
  const q = [s];
  label[s] = id;
  while (q.length) {
    const i = q.pop();
    const x = i % W;
    const y = (i / W) | 0;
    c.n++;
    c.sx += x;
    c.sy += y;
    c.x0 = Math.min(c.x0, x);
    c.x1 = Math.max(c.x1, x);
    c.y0 = Math.min(c.y0, y);
    c.y1 = Math.max(c.y1, y);
    for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) {
      if (j >= 0 && j < N && !bg[j] && label[j] < 0) {
        label[j] = id;
        q.push(j);
      }
    }
  }
  comps.push(c);
}
// the sheet: one big waving pose on the left, three stacked on the right (sleep, panic, type)
const poseOf = (c) => {
  const cx = c.sx / c.n;
  const cy = c.sy / c.n;
  if (cx < 640) return 'wave';
  return cy < 370 ? 'sleep' : cy < 630 ? 'panic' : 'type';
};
const boxes = {};
comps.forEach((c, id) => {
  if (c.n < 120) return; // JPEG specks
  const p = poseOf(c);
  const b = (boxes[p] ??= { ids: new Set(), x0: W, y0: H, x1: 0, y1: 0 });
  b.ids.add(id);
  b.x0 = Math.min(b.x0, c.x0);
  b.y0 = Math.min(b.y0, c.y0);
  b.x1 = Math.max(b.x1, c.x1);
  b.y1 = Math.max(b.y1, c.y1);
});

// 4. write each pose as RGBA; outline pixels next to the background get a softened alpha
for (const [pose, b] of Object.entries(boxes)) {
  const pad = 3;
  const x0 = Math.max(0, b.x0 - pad);
  const y0 = Math.max(0, b.y0 - pad);
  const w = Math.min(W - 1, b.x1 + pad) - x0 + 1;
  const h = Math.min(H - 1, b.y1 + pad) - y0 + 1;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y0 + y) * W + (x0 + x);
      const o = (y * w + x) * 4;
      if (bg[i] || !b.ids.has(label[i])) continue;
      const [r, g, bl] = at(i);
      out[o] = r;
      out[o + 1] = g;
      out[o + 2] = bl;
      out[o + 3] = touchesBg(i) ? 190 : 255;
    }
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(root + `src/assets/nix/nix-${pose}.png`);
  console.log(`nix: ${pose} ${w}×${h}`);
}
