// One in-memory radio across Astro page turns. Preferences persist; playback never autostarts.
// Audio is served locally. Personal files are session-only blob URLs, never uploaded.
import { cleanMix, defaultMix, layers, level, tracks, type Genre, type Layer, type Mix, type Track } from './catalog';

export interface SavedMix { id: string; name: string; mix: Mix; trackId?: string; }
export interface RadioState {
  mix: Mix; playing: boolean; started: boolean; loading: boolean; error: 'audio' | 'storage' | 'file' | 'missing' | 'empty' | null;
  trackId: string; position: number; duration: number; sleepAt: number; sleepMinutes: number;
  custom: Track[]; saved: SavedMix[];
}
const KEY = 'lofi-radio:v1';
const listeners = new Set<() => void>();
let state: RadioState = {
  mix: cleanMix(defaultMix), playing: false, started: false, loading: false, error: null,
  trackId: tracks[0].id, position: 0, duration: 0, sleepAt: 0, sleepMinutes: 0, custom: [], saved: [],
};
let music: HTMLAudioElement | undefined;
const ambience = new Map<Layer, HTMLAudioElement>();
// Gain nodes make faders work on mobile browsers that ignore HTMLMediaElement.volume.
// One compressor keeps a fully layered mix from clipping. Nodes live with the radio.
let context: AudioContext | undefined;
let bus: DynamicsCompressorNode | undefined;
const gains = new Map<HTMLAudioElement, GainNode>();
let initialized = false;
let generation = 0;
let heartbeat: ReturnType<typeof setInterval> | undefined;

export const snapshot = () => state;
export function subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }
function emit(patch: Partial<RadioState>) {
  state = { ...state, ...patch };
  for (const fn of listeners) fn();
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = state.playing ? 'playing' : 'paused';
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({ uiVersion: 2, mix: state.mix, saved: state.saved })); }
  catch { emit({ error: 'storage' }); }
}
export const currentTrack = () => [...tracks, ...state.custom].find(t => t.id === state.trackId) ?? tracks[0];
export const playlist = () => [...tracks, ...state.custom].filter(t => t.genre === state.mix.genre);

export function initRadio() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    const mix = cleanMix(raw?.mix);
    // The simpler interface opens the optional timer on request; history stays in pomodoro:v1.
    if (raw?.uiVersion !== 2) mix.showTimer = false;
    const saved: SavedMix[] = Array.isArray(raw?.saved) ? raw.saved.slice(0, 12).filter((s: SavedMix) => s && typeof s.id === 'string' && typeof s.name === 'string').map((s: SavedMix) => ({ id: s.id.slice(0, 80), name: s.name.slice(0, 40), mix: cleanMix(s.mix, true), trackId: typeof s.trackId === 'string' ? s.trackId.slice(0, 80) : undefined })) : [];
    emit({ mix, saved, trackId: tracks.find(t => t.genre === mix.genre)!.id });
  } catch { /* Corrupt or unavailable storage starts with a usable default. */ }
  window.addEventListener('pagehide', pauseRadio);
  if ('mediaSession' in navigator) {
    for (const [action, handler] of Object.entries({ play: playRadio, pause: pauseRadio, previoustrack: previous, nexttrack: next })) {
      try { navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler); } catch {}
    }
  }
}

function getMusic() {
  if (music) return music;
  music = new Audio();
  music.preload = 'none';
  music.addEventListener('loadedmetadata', () => emit({ duration: Number.isFinite(music!.duration) ? music!.duration : 0 }));
  music.addEventListener('waiting', () => state.playing && state.mix.musicEnabled && emit({ loading: true }));
  music.addEventListener('playing', () => emit({ loading: false }));
  music.addEventListener('timeupdate', () => emit({ position: music!.currentTime }));
  music.addEventListener('ended', () => state.playing && state.mix.musicEnabled && (state.mix.repeat ? (seek(0), void playRadio()) : next()));
  music.addEventListener('error', () => {
    if (!music?.src || !state.mix.musicEnabled || !state.mix.music) return;
    pauseRadio(); emit({ error: 'audio', loading: false });
  });
  return music;
}
function openMixer() {
  if (!context && typeof AudioContext !== 'undefined') {
    context = new AudioContext();
    bus = context.createDynamicsCompressor();
    bus.threshold.value = -10;
    bus.knee.value = 16;
    bus.ratio.value = 4;
    bus.connect(context.destination);
  }
  if (context?.state === 'suspended') return context.resume();
}
function gainFor(a: HTMLAudioElement, value: number) {
  if (!context || !bus) { a.volume = value; return; }
  let gain = gains.get(a);
  if (!gain) {
    gain = context.createGain();
    gain.gain.value = 0;
    context.createMediaElementSource(a).connect(gain).connect(bus);
    gains.set(a, gain);
    a.volume = 1;
  }
  gain.gain.setTargetAtTime(value, context.currentTime, 0.015);
}
function volumes() {
  const m = state.mix;
  if (music) gainFor(music, m.musicEnabled ? m.master / 100 * m.music / 100 * 0.75 : 0);
  for (const [id, a] of ambience) gainFor(a, m.master / 100 * m.layers[id] / 100 * 0.38);
}
function synchronizeLayers() {
  for (const id of layers) {
    let a = ambience.get(id);
    if (state.playing && state.mix.layers[id] > 0) {
      if (!a) {
        a = new Audio(`/audio/radio/${id}.mp3`); a.loop = true; a.preload = 'none';
        a.addEventListener('error', () => { setLayer(id, 0); emit({ error: 'audio' }); });
        ambience.set(id, a);
      }
      gainFor(a, state.mix.master / 100 * state.mix.layers[id] / 100 * 0.38);
      if (a.error) a.load();
      if (a.paused) void a.play().catch(() => { if (state.playing && state.mix.layers[id]) emit({ error: 'audio' }); });
    } else a?.pause();
  }
  volumes();
}
function setMetadata() {
  if ('mediaSession' in navigator && typeof MediaMetadata !== 'undefined') {
    const t = currentTrack();
    navigator.mediaSession.metadata = new MediaMetadata(state.mix.musicEnabled ? { title: t.title, artist: t.credit?.artist ?? 'Nix radio', album: t.genre } : { title: layers.filter(id => state.mix.layers[id] > 0).join(' + '), artist: 'Nix radio', album: 'Ambience' });
  }
}
function runClock() {
  if (heartbeat) return;
  heartbeat = setInterval(() => {
    if (state.sleepAt && Date.now() >= state.sleepAt) { pauseRadio(); emit({ sleepAt: 0, sleepMinutes: 0 }); }
  }, 1000);
}
export async function playRadio() {
  initRadio();
  if (state.sleepAt && Date.now() >= state.sleepAt) emit({ sleepAt: 0, sleepMinutes: 0 });
  const token = ++generation;
  const withMusic = state.mix.musicEnabled && state.mix.music > 0;
  if (!withMusic && !layers.some(id => state.mix.layers[id] > 0)) {
    pauseRadio(); emit({ error: 'empty' }); return;
  }
  // Pure ambience never creates a music element or requests a song.
  const a = withMusic ? getMusic() : undefined;
  if (a && a.getAttribute('src') !== currentTrack().src) { a.src = currentTrack().src; emit({ position: 0, duration: 0 }); }
  if (!withMusic) music?.pause();
  if (a?.error) a.load();
  emit({ playing: true, started: true, loading: true, error: null });
  try {
    // Start both promises within the activation gesture; don't await resume before play.
    const unlocked = openMixer();
    volumes(); synchronizeLayers(); setMetadata(); runClock();
    await Promise.all([unlocked, a?.play()]);
    if (token === generation) emit({ loading: false });
  }
  catch {
    if (token !== generation) return;
    pauseRadio(); emit({ error: 'audio', loading: false });
  }
}
export function pauseRadio() {
  generation++;
  music?.pause(); for (const a of ambience.values()) a.pause();
  clearInterval(heartbeat); heartbeat = undefined;
  emit({ playing: false, loading: false });
}
export function toggleRadio() { if (state.playing) pauseRadio(); else void playRadio(); }
export function chooseTrack(id: string, enableMusic = true) {
  const track = [...tracks, ...state.custom].find(t => t.id === id);
  if (!track) return;
  const playing = state.playing;
  generation++; music?.pause();
  emit({ trackId: id, position: 0, duration: 0, mix: { ...state.mix, genre: track.genre, musicEnabled: enableMusic ? true : state.mix.musicEnabled }, error: null });
  if (music && state.mix.musicEnabled) music.src = track.src;
  persist(); setMetadata(); if (playing) void playRadio();
}
export function chooseGenre(genre: Genre) {
  const list = [...tracks, ...state.custom].filter(t => t.genre === genre);
  if (!list.length) return;
  chooseTrack(list[0].id);
}
export function next() {
  const list = playlist(); if (!list.length) return;
  const index = list.findIndex(t => t.id === state.trackId);
  const step = state.mix.shuffle && list.length > 1 ? 1 + Math.floor(Math.random() * (list.length - 1)) : 1;
  chooseTrack(list[(index + step) % list.length].id);
}
export function previous() {
  if (state.position > 3) { seek(0); return; }
  const list = playlist(); if (!list.length) return;
  chooseTrack(list[(list.findIndex(t => t.id === state.trackId) + list.length - 1) % list.length].id);
}
export function seek(seconds: number) {
  if (!music || !Number.isFinite(music.duration) || !Number.isFinite(seconds)) return;
  music.currentTime = Math.max(0, Math.min(music.duration, seconds));
  emit({ position: music.currentTime });
}
export function setMix(patch: Partial<Mix>) {
  const hadMusic = state.mix.musicEnabled && state.mix.music > 0;
  const genre = patch.genre ?? state.mix.genre;
  const mix = cleanMix({ ...state.mix, ...patch });
  if (genre === 'custom' && state.custom.length) mix.genre = 'custom';
  emit({ mix }); synchronizeLayers(); persist();
  if (!mix.musicEnabled || !mix.music) music?.pause();
  else if (state.playing && !hadMusic) void playRadio();
  if (state.playing && (!mix.musicEnabled || !mix.music) && !layers.some(id => mix.layers[id] > 0)) pauseRadio();
  setMetadata();
}
export function setLayer(id: Layer, value: number) { setMix({ layers: { ...state.mix.layers, [id]: level(value) } }); }
/** One explicit action, one sound, with the music fully stopped. */
export function playSoundOnly(id: Layer) {
  pauseRadio();
  setMix({ musicEnabled: false, layers: Object.fromEntries(layers.map(k => [k, k === id ? 60 : 0])) as Record<Layer, number> });
  void playRadio();
}
export function toggleSound(id: Layer) {
  const value = state.mix.layers[id] > 0 ? 0 : 45;
  setLayer(id, value);
  if (value && !state.playing) void playRadio();
}
export function setMusicEnabled(enabled: boolean) {
  const patch: Partial<Mix> = { musicEnabled: enabled };
  if (!enabled && !layers.some(id => state.mix.layers[id] > 0)) patch.layers = { ...state.mix.layers, rain: 60 };
  setMix(patch);
}
export function sleepIn(minutes: number) {
  const value = Number.isFinite(minutes) && minutes > 0 ? Math.min(180, minutes) : 0;
  emit({ sleepAt: value ? Date.now() + value * 60000 : 0, sleepMinutes: value });
}
export function saveMix(name: string) {
  const trimmed = name.trim().slice(0, 40); if (!trimmed || state.saved.length >= 12) return false;
  emit({ saved: [...state.saved, { id: crypto.randomUUID(), name: trimmed, mix: cleanMix(state.mix, true), trackId: state.trackId }] }); persist(); return true;
}
export function recallMix(id: string) {
  const preset = state.saved.find(s => s.id === id); if (!preset) return;
  if (preset.mix.musicEnabled && preset.mix.genre === 'custom' && !state.custom.length) { emit({ error: 'missing' }); return; }
  const wasPlaying = state.playing;
  const track = [...tracks, ...state.custom].find(t => t.id === preset.trackId && t.genre === preset.mix.genre);
  pauseRadio(); setMix(preset.mix);
  const selected = track ?? [...tracks, ...state.custom].find(t => t.genre === preset.mix.genre);
  if (selected) chooseTrack(selected.id, false);
  if (wasPlaying) void playRadio();
}
export function removeMix(id: string) { emit({ saved: state.saved.filter(s => s.id !== id) }); persist(); }
export function dismissError() { emit({ error: null }); }
export function importTracks(files: File[]) {
  const accepted = files.filter(f => (f.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|flac|aac|opus)$/i.test(f.name)) && f.size <= 80 * 1024 * 1024 && f.size > 0);
  const remaining = 30 - state.custom.length;
  const added = accepted.slice(0, remaining).map(f => ({ id: crypto.randomUUID(), genre: 'custom' as const, title: f.name.replace(/\.[^.]+$/, '').slice(0, 100), src: URL.createObjectURL(f), bpm: 0 }));
  emit({ custom: [...state.custom, ...added], error: accepted.length !== files.length || accepted.length > remaining ? 'file' : null });
  if (added.length) chooseTrack(added[0].id);
}
export function removeTrack(id: string) {
  const item = state.custom.find(t => t.id === id); if (!item) return;
  const remaining = state.custom.filter(t => t.id !== id);
  if (state.trackId === id) chooseTrack(remaining[0]?.id ?? tracks[0].id);
  emit({ custom: remaining }); URL.revokeObjectURL(item.src);
}
