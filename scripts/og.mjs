// Social card (1200×630): a terminal window with the name + the lime dithered portrait.
// Run: pnpm og   (after pnpm dither)
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const W = 1200;
const H = 630;
const P = 440; // portrait size

// colour the 1-bit mask lime on the terminal background
const mask = await sharp(root + 'src/assets/photo/mahdi-dither.png').resize(P, P, { kernel: 'nearest' }).ensureAlpha().extractChannel(3).toBuffer();
const lime = await sharp({ create: { width: P, height: P, channels: 3, background: '#C6F432' } }).joinChannel(mask).png().toBuffer();

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.3" fill="#2a3021"/></pattern>
  </defs>
  <rect width="100%" height="100%" fill="#0b0c09"/>
  <rect width="100%" height="100%" fill="url(#dots)"/>
  <!-- window -->
  <rect x="68" y="72" width="1064" height="486" rx="22" fill="#c6f432"/>
  <rect x="56" y="60" width="1064" height="486" rx="22" fill="#14170f" stroke="#e9eedf" stroke-width="4"/>
  <path d="M58 118h1060" stroke="#e9eedf" stroke-width="4"/>
  <circle cx="96" cy="89" r="10" fill="#ff6a4d" stroke="#e9eedf" stroke-width="3"/>
  <circle cx="128" cy="89" r="10" fill="#ffb224" stroke="#e9eedf" stroke-width="3"/>
  <circle cx="160" cy="89" r="10" fill="#c6f432" stroke="#e9eedf" stroke-width="3"/>
  <text x="588" y="97" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="22" fill="#a4ac96">mahdi@workstation: ~ — zsh</text>
  <text x="100" y="200" font-family="DejaVu Sans Mono, monospace" font-size="30" fill="#c6f432">$ <tspan fill="#eef1e6">whoami</tspan></text>
  <text x="100" y="292" font-family="DejaVu Sans, sans-serif" font-weight="700" font-size="68" fill="#eef1e6">Mahdi</text>
  <text x="100" y="370" font-family="DejaVu Sans, sans-serif" font-weight="700" font-size="68" fill="#eef1e6">MirMohamadi</text>
  <text x="100" y="430" font-family="DejaVu Sans Mono, monospace" font-size="27" fill="#a4ac96">front-end engineer · linux · ai</text>
  <text x="100" y="505" font-family="DejaVu Sans Mono, monospace" font-size="27" fill="#c6f432">$ <tspan fill="#eef1e6">open mahdimirmo.ir</tspan><tspan fill="#c6f432"> █</tspan></text>
  <!-- portrait frame -->
  <rect x="652" y="138" width="${P - 40}" height="${P - 40}" rx="14" fill="#0f110c" stroke="#e9eedf" stroke-width="4"/>
</svg>`;

// crop the portrait to fit the frame
const portrait = await sharp(lime).resize(P - 48, P - 48).png().toBuffer();
await sharp(Buffer.from(svg))
  .composite([{ input: portrait, left: 656, top: 142 }])
  .png({ palette: true, colours: 24, compressionLevel: 9 })
  .toFile(root + 'src/assets/og/og-default.png');
console.log('og: wrote src/assets/og/og-default.png');
