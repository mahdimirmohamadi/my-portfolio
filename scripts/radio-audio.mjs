// Original instrumental compositions and synthesized environmental loops. Entirely offline.
// Rebuild with: node scripts/radio-audio.mjs (requires ffmpeg). No samples or network access.
import { mkdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const rate = 24000;
const out = new URL('../public/audio/radio/', import.meta.url);
mkdirSync(out, { recursive: true });
let seed = 19;
function random() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }
const freq = (midi) => 440 * 2 ** ((midi - 69) / 12);

function exportAudio(id, samples) {
  // Stereo: a short, quiet reflection widens the sound without extreme headphone separation.
  const stereo = new Float32Array(samples.length * 2);
  let peak = 0;
  for (const v of samples) peak = Math.max(peak, Math.abs(v));
  const gain = Math.min(1.5, 0.78 / Math.max(peak, 0.01));
  const delay = Math.round(rate * 0.011);
  for (let i = 0; i < samples.length; i++) {
    stereo[i * 2] = samples[i] * gain;
    stereo[i * 2 + 1] = (samples[i] * 0.94 + samples[(i + samples.length - delay) % samples.length] * 0.06) * gain;
  }
  const raw = join(tmpdir(), `portfolio-radio-${id}.f32`);
  writeFileSync(raw, Buffer.from(stereo.buffer));
  const result = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'f32le', '-ar', String(rate), '-ac', '2', '-i', raw,
    '-codec:a', 'libmp3lame', '-b:a', '128k', '-metadata', `title=${id}`, '-metadata', 'comment=Original offline synthesis; scripts/radio-audio.mjs', new URL(`${id}.mp3`, out).pathname]);
  if (result.status) throw new Error(result.stderr.toString());
  unlinkSync(raw);
  console.log(id, `${(samples.length / rate).toFixed(1)}s`);
}

function composition(id, bpm, root, mode, variant) {
  seed = 91 + root + variant * 91;
  const beat = 60 / bpm;
  const bars = 32;
  const length = bars * 4 * beat;
  const a = new Float32Array(Math.ceil(length * rate));
  function add(at, duration, sample, volume = 1) {
    const start = Math.round(at * rate), n = Math.ceil(duration * rate);
    for (let i = 0; i < n && start + i < a.length; i++) {
      const t = i / rate;
      a[start + i] += sample(t, duration) * volume;
    }
  }
  function note(midi, at, duration, volume, timbre = 'keys') {
    const f = freq(midi);
    const phase = random() * 0.2;
    add(at, duration, (t, d) => {
      const fade = Math.min(1, t / 0.012) * Math.min(1, (d - t) / 0.16);
      const vibrato = Math.sin(t * 5.1) * 0.0015;
      const p = 2 * Math.PI * f * t * (1 + vibrato) + phase;
      if (timbre === 'pad') return (Math.sin(p) + Math.sin(p * 1.003) * 0.35) * fade * Math.min(1, t / 0.7) * 0.5;
      if (timbre === 'chip') return (Math.sin(p) + Math.sin(p * 3) / 3 + Math.sin(p * 5) / 8) * Math.exp(-t * 2.8) * fade * 0.45;
      // Soft electric piano: fundamental, tine harmonics, and a very quiet detuned bell.
      return (Math.sin(p) * Math.exp(-t * 1.35) + Math.sin(p * 2.002) * 0.28 * Math.exp(-t * 4.5)
        + Math.sin(p * 4.01) * 0.09 * Math.exp(-t * 9)) * fade * 0.55;
    }, volume);
    if (volume > 0.1 && mode !== 'geek') {
      add(at + beat * 0.75, duration, (t, d) => Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 2) * Math.min(1, (d - t) / 0.1), volume * 0.055);
    }
  }
  // Minor ninth / major seventh movement; separate harmonic and rhythmic identities per station.
  const movements = variant ? [0, 5, 3, 7] : [0, 3, 7, 5];
  const melody = mode === 'anime' ? [12, 14, 15, 19, 17, 15, 14, 10] : mode === 'geek' ? [12, 19, 15, 22, 19, 15, 10, 14] : [19, 15, 14, 10, 12, 7, 10, 14];
  for (let bar = 0; bar < bars; bar++) {
    const at = bar * beat * 4;
    const chordRoot = root + movements[Math.floor(bar / 2) % 4];
    const intro = bar < 2, outro = bar >= bars - 2;
    [0, 3, 7, 10, 14].forEach((interval, i) => note(chordRoot + interval, at + i * 0.018, beat * 3.9, mode === 'ambient' ? 0.11 : 0.12, mode === 'ambient' ? 'pad' : 'keys'));
    if (mode === 'ambient') {
      note(chordRoot + 24 + (bar % 2 ? 7 : 2), at + beat, beat * 5, 0.035, 'keys');
      continue;
    }
    note(chordRoot - 12, at, beat * 1.8, 0.21);
    note(chordRoot - 12 + (bar % 2 ? 7 : 0), at + beat * 2.55, beat * 1.25, 0.16);
    if (intro || outro) continue;
    for (const pos of [0, 1.75, 2.5]) {
      add(at + beat * pos, 0.32, (t) => Math.sin(2 * Math.PI * (43 * t + 70 * 0.024 * (1 - Math.exp(-t / 0.024)))) * Math.exp(-t * 15), 0.38);
    }
    for (const pos of [1, 3]) {
      add(at + beat * pos + 0.016, 0.17, (t) => ((random() - 0.5) * 0.7 + Math.sin(2 * Math.PI * 175 * t) * 0.35) * Math.exp(-t * 27), 0.24);
    }
    for (let i = 0; i < 8; i++) {
      add(at + beat * (i / 2 + (i % 2 ? 0.07 : 0)), 0.052, (t) => (random() - 0.5) * Math.exp(-t * 85), i % 2 ? 0.095 : 0.065);
    }
    for (let n = 0; n < (mode === 'geek' ? 8 : 4); n++) {
      if (mode === 'lofi' && random() < 0.36) continue;
      const index = (bar * 3 + n + variant * 2) % melody.length;
      const offset = mode === 'geek' ? n / 2 : n + 0.08;
      note(root + melody[index], at + beat * offset, beat * (mode === 'geek' ? 0.47 : 0.85), mode === 'anime' ? 0.14 : 0.09, mode === 'geek' ? 'chip' : 'keys');
    }
  }
  // Smooth musical opening and closing; playlist advances without a hard cut.
  for (let i = 0; i < a.length; i++) a[i] *= Math.min(1, i / (rate * 1.5), (a.length - i) / (rate * 2));
  exportAudio(id, a);
}

for (const [id, bpm, root, mode, variant] of [
  ['after-hours', 76, 53, 'lofi', 0], ['soft-commits', 82, 50, 'lofi', 1],
  ['save-point', 88, 48, 'geek', 0], ['pixel-dreams', 92, 53, 'geek', 1],
  ['last-train', 74, 57, 'anime', 0], ['paper-lanterns', 80, 55, 'anime', 1],
  ['moss-light', 62, 48, 'ambient', 0], ['slow-orbit', 58, 53, 'ambient', 1],
]) composition(id, bpm, root, mode, variant);

for (const type of ['rain', 'fire', 'waves', 'wind', 'birds', 'vinyl']) {
  seed = 123;
  const seconds = 24, a = new Float32Array(rate * seconds);
  let brown = 0, smooth = 0;
  for (let i = 0; i < a.length; i++) {
    const t = i / rate, noise = random() * 2 - 1;
    brown = (brown + noise * 0.025) / 1.025;
    smooth = smooth * 0.88 + noise * 0.12;
    const swell = 0.5 + 0.5 * Math.sin(2 * Math.PI * t / 8);
    if (type === 'rain') a[i] = smooth * 0.45 + noise * 0.045 + brown * 0.4;
    if (type === 'fire') a[i] = brown * 0.65 + smooth * 0.09 + (random() < 0.0004 ? noise * 0.75 : 0);
    if (type === 'waves') a[i] = (smooth * 0.45 + brown * 0.8) * (0.12 + swell * 0.7);
    if (type === 'wind') a[i] = brown * (0.7 + 0.3 * Math.sin(t * Math.PI / 6)) + smooth * 0.08;
    if (type === 'vinyl') a[i] = noise * 0.016 + brown * 0.03 + (random() < 0.00015 ? noise * 0.17 : 0);
    if (type === 'birds') {
      const p = t % 4, call = p > 0.4 && p < 1.15;
      a[i] = brown * 0.1 + (call ? Math.sin(2 * Math.PI * (1600 * t + 110 * Math.sin(t * 19))) * Math.sin(Math.PI * (p - 0.4) / 0.75) ** 2 * 0.075 : 0);
    }
  }
  // Overlap endpoints rather than introducing a repeated silent gap.
  const cross = rate;
  for (let i = 0; i < cross; i++) {
    const x = i / cross;
    a[i] = a[a.length - cross + i] * (1 - x) + a[i] * x;
  }
  exportAudio(type, a.subarray(0, a.length - cross));
}
