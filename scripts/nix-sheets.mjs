// Cut Nix's extra poses out of the 3×2 sheets on white (nix-sheet-2.jpg, nix-sheet-3.jpg).
// Flood-fills the white background from the edges, peels the light JPEG halo off the black
// outline, then groups the pieces by grid cell (so confetti and steam stay with their pose)
// and writes one PNG with real alpha per pose. Run: pnpm nix
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { setPngText } from './lib/png-text.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const sheets = [
  { file: 'nix-sheet-2.jpg', poses: ['head', 'call', 'mail', 'cv', 'grad', 'thumbs'] },
  // holes: seed points of white gaps enclosed by the drawing that are background, not paper
  // (the space between the headphone band and his head); the CV and envelope stay white
  { file: 'nix-sheet-3.jpg', poses: ['tea', 'music', 'search', 'point', 'think', 'bonsai'], holes: [[970, 195], [900, 170], [1050, 170]] },
  { file: 'nix-sheet-4.jpg', poses: ['desk', 'plane', 'phone', 'notebook', 'hardhat', 'bigkey'] },
  // the empty browser window he peeks into is background, not paper
  { file: 'nix-sheet-5.jpg', poses: ['moon', 'sun', 'rocket', 'window', 'bow', 'bye'], holes: [[600, 1800], [700, 1500], [640, 1350]] },
];

for (const sheet of sheets) {
  const { data, info } = await sharp(root + 'src/assets/nix/' + sheet.file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const N = W * H;
  const at = (i) => [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
  const neutral = (i, minLum) => {
    const [r, g, b] = at(i);
    return Math.max(r, g, b) - Math.min(r, g, b) <= 16 && (r + g + b) / 3 >= minLum;
  };

  // 1. the white background, reached from the edges
  const bg = new Uint8Array(N);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  for (const [hx, hy] of sheet.holes ?? []) stack.push(hy * W + hx);
  while (stack.length) {
    const i = stack.pop();
    if (bg[i] || !neutral(i, 225)) continue;
    bg[i] = 1;
    const x = i % W;
    if (x > 0) stack.push(i - 1);
    if (x < W - 1) stack.push(i + 1);
    if (i >= W) stack.push(i - W);
    if (i < N - W) stack.push(i + W);
  }

  // 2. peel the light halo hugging the outline
  const touchesBg = (i) => {
    const x = i % W;
    return (x > 0 && bg[i - 1]) || (x < W - 1 && bg[i + 1]) || (i >= W && bg[i - W]) || (i < N - W && bg[i + W]);
  };
  for (let pass = 0; pass < 2; pass++) {
    const peel = [];
    for (let i = 0; i < N; i++) if (!bg[i] && touchesBg(i) && neutral(i, 150)) peel.push(i);
    for (const i of peel) bg[i] = 1;
  }

  // 3. connected pieces, grouped by the grid cell their centre falls in
  const label = new Int32Array(N).fill(-1);
  const boxes = {};
  let id = 0;
  for (let s = 0; s < N; s++) {
    if (bg[s] || label[s] >= 0) continue;
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
      if (x < c.x0) c.x0 = x;
      if (x > c.x1) c.x1 = x;
      if (y < c.y0) c.y0 = y;
      if (y > c.y1) c.y1 = y;
      for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) {
        if (j >= 0 && j < N && !bg[j] && label[j] < 0) {
          label[j] = id;
          q.push(j);
        }
      }
    }
    if (c.n >= 40) {
      const col = Math.min(2, Math.floor(c.sx / c.n / (W / 3)));
      const row = c.sy / c.n < H / 2 ? 0 : 1;
      const pose = sheet.poses[row * 3 + col];
      const b = (boxes[pose] ??= { ids: new Set(), x0: W, y0: H, x1: 0, y1: 0 });
      b.ids.add(id);
      b.x0 = Math.min(b.x0, c.x0);
      b.y0 = Math.min(b.y0, c.y0);
      b.x1 = Math.max(b.x1, c.x1);
      b.y1 = Math.max(b.y1, c.y1);
    }
    id++;
  }

  // 4. one RGBA PNG per pose, edge pixels softened
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
        if (bg[i] || !b.ids.has(label[i])) continue;
        const o = (y * w + x) * 4;
        const [r, g, bl] = at(i);
        out[o] = r;
        out[o + 1] = g;
        out[o + 2] = bl;
        out[o + 3] = touchesBg(i) ? 190 : 255;
      }
    }
    // the sheets are 2048px; halve them so the sources stay small (still 2× the largest use)
    const file = root + `src/assets/nix/nix-${pose}.png`;
    await sharp(out, { raw: { width: w, height: h, channels: 4 } })
      .resize(Math.round(w / 2))
      .png({ compressionLevel: 9 })
      .toFile(file);
    setPngText(
      file,
      'impeccable:prompt',
      `ORIGIN: cut from src/assets/nix/${sheet.file} by scripts/nix-sheets.mjs (white flood-fill, halo peel, per-cell crop). Sheet generated by the owner with nano-banana.`,
    );
    console.log(`nix: ${pose} ${w}×${h}`);
  }
}
