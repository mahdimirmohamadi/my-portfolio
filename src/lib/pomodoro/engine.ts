// The pomodoro's clock. It runs on every page (the dock's mini-timer loads it), so a phase ends,
// chimes and moves on wherever the visitor is on the site. Time is kept as timestamps, never as
// counted ticks, so a throttled background tab stays right.
//
// Tabs: one timer per browser, mirrored by every tab. Each tab beats a heartbeat into
// localStorage; a tab that opens and finds a session in flight with no other tab alive knows the
// last one was closed, and records the session as abandoned. A reload keeps the tab's
// sessionStorage marker, so it resumes instead.

import { load, update, idleTimer, uid, type Data, type Timer } from './store';

const MIN = 60_000;
const TABS = 'pomodoro:tabs';
const SEEN = 'pomodoro:seen';
const BEAT = 3000;
const ALIVE = 8000;

// ── the transitions (pure: they change the draft they are given) ──

function begin(t: Timer, at: number) {
  t.status = 'running';
  if (!t.startedAt) t.startedAt = at;
  t.endsAt = at + t.left;
}

function record(d: Data, t: Timer, end: number, status: 'done' | 'abandoned') {
  if (d.sessions.some((s) => s.id === t.id)) return;
  d.sessions.push({
    id: t.id,
    start: t.startedAt || end - t.duration,
    end,
    minutes: Math.round(t.duration / MIN),
    category: t.category,
    topic: t.topic.trim(),
    status,
  });
}

/** Ends the running phase at `at` and prepares (or, with auto-start, starts) the next one. */
function finishPhase(d: Data, at: number, now: number) {
  const t = d.timer;
  const s = d.settings;
  const keep = { category: t.category, topic: t.topic };
  if (t.phase === 'focus') {
    record(d, t, at, 'done');
    const done = t.done + 1;
    const long = done >= s.every;
    d.timer = idleTimer(long ? 'long' : 'short', s, { ...keep, done: long ? 0 : done });
    d.reward = { image: '', at: now };
  } else {
    d.timer = idleTimer('focus', s, { ...keep, done: t.done });
  }
  if (s.autoStart) begin(d.timer, at);
}

/** Catches up on every phase that has run out (a sleeping laptop can miss several). */
function catchUp(d: Data, now: number) {
  let ended: Timer['phase'] | null = null;
  for (let i = 0; i < 12 && d.timer.status === 'running' && d.timer.endsAt <= now; i++) {
    ended = d.timer.phase;
    finishPhase(d, d.timer.endsAt, now);
  }
  return ended;
}

function abandon(d: Data, end: number) {
  const t = d.timer;
  if (t.phase === 'focus' && t.status !== 'idle') record(d, t, Math.max(t.startedAt, end), 'abandoned');
  d.timer = idleTimer('focus', d.settings, { category: t.category, topic: t.topic, done: t.done });
}

// ── commands (the page and the dock call these) ──

export function start() {
  unlockAudio();
  const now = Date.now();
  const d = update((d) => {
    const t = d.timer;
    if (t.status === 'running') return;
    if (t.phase === 'focus') {
      if (!t.category || !d.categories.some((c) => c.id === t.category)) t.category = d.lastCategory && d.categories.some((c) => c.id === d.lastCategory) ? d.lastCategory : (d.categories[0]?.id ?? null);
      d.lastCategory = t.category;
    } else {
      d.reward = null;
    }
    begin(t, now);
  });
  askToNotify(d);
}

export function pause() {
  update((d) => {
    const t = d.timer;
    if (t.status !== 'running') return;
    t.left = Math.max(0, t.endsAt - Date.now());
    t.status = 'paused';
  });
}

export function resume() {
  unlockAudio();
  update((d) => {
    const t = d.timer;
    if (t.status !== 'paused') return;
    t.status = 'running';
    t.endsAt = Date.now() + t.left;
  });
}

/** Stops a focus session early: it is kept, as abandoned. */
export function stop() {
  update((d) => abandon(d, Date.now()));
}

/** Skips a break, straight to the next focus. */
export function skip() {
  const now = Date.now();
  update((d) => {
    if (d.timer.phase === 'focus') return;
    const t = d.timer;
    d.timer = idleTimer('focus', d.settings, { category: t.category, topic: t.topic, done: t.done });
    d.reward = null;
    if (d.settings.autoStart) begin(d.timer, now);
  });
}

export function dismissReward() {
  update((d) => {
    d.reward = null;
  });
}

export function setCategory(id: string | null) {
  update((d) => {
    d.timer.category = id;
    if (id) d.lastCategory = id;
  });
}

export function setTopic(topic: string) {
  update((d) => {
    d.timer.topic = topic.slice(0, 120);
  });
}

/** An idle timer follows the settings; a running one keeps its length until it ends. */
export function syncIdle(d: Data) {
  const t = d.timer;
  if (t.status !== 'idle') return;
  const dur = (t.phase === 'focus' ? d.settings.focus : t.phase === 'short' ? d.settings.short : d.settings.long) * MIN;
  t.duration = dur;
  t.left = dur;
}

// ── tabs ──

const tabId = (() => {
  if (typeof window === 'undefined') return '';
  try {
    const had = sessionStorage.getItem('pomodoro:tab');
    if (had) return had;
    const id = uid();
    sessionStorage.setItem('pomodoro:tab', id);
    (globalThis as any).__pomoNewTab = true;
    return id;
  } catch {
    return uid();
  }
})();

function readTabs(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(TABS) || '{}') || {};
  } catch {
    return {};
  }
}

function beat() {
  const now = Date.now();
  const tabs = readTabs();
  for (const [id, at] of Object.entries(tabs)) if (now - at > ALIVE * 4) delete tabs[id];
  tabs[tabId] = now;
  try {
    localStorage.setItem(TABS, JSON.stringify(tabs));
    localStorage.setItem(SEEN, String(now));
  } catch {}
}

function leave() {
  const tabs = readTabs();
  delete tabs[tabId];
  try {
    localStorage.setItem(TABS, JSON.stringify(tabs));
  } catch {}
}

export function otherTabsAlive() {
  const now = Date.now();
  return Object.entries(readTabs()).some(([id, at]) => id !== tabId && now - at < ALIVE);
}

function lastSeen() {
  try {
    const n = Number(localStorage.getItem(SEEN));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

/** A new tab, with no other tab alive, finds a session the closed tab left behind. */
function settleOrphan() {
  const d = load();
  if (d.timer.status === 'idle') return;
  if (!(globalThis as any).__pomoNewTab || otherTabsAlive()) return;
  const seen = lastSeen() || Date.now();
  update((d) => {
    // what finished while the last tab was still open counts as finished
    catchUp(d, Math.min(seen, Date.now()));
    if (d.timer.status !== 'idle') abandon(d, seen);
  });
}

// ── sound and notifications ──

let audio: AudioContext | null = null;
function unlockAudio() {
  try {
    audio ??= new AudioContext();
    if (audio.state === 'suspended') audio.resume();
  } catch {}
}

/** A soft two-note chime, synthesized: no audio file. */
function chime() {
  if (!audio) return;
  const t0 = audio.currentTime + 0.02;
  [
    [659.25, 0],
    [987.77, 0.22],
  ].forEach(([f, dt]) => {
    const o = audio!.createOscillator();
    const g = audio!.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t0 + dt);
    g.gain.linearRampToValueAtTime(0.22, t0 + dt + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 1.4);
    o.connect(g).connect(audio!.destination);
    o.start(t0 + dt);
    o.stop(t0 + dt + 1.5);
  });
}

function askToNotify(d: Data) {
  if (d.notifyAsked || !('Notification' in window)) return;
  update((d) => {
    d.notifyAsked = true;
  });
  if (Notification.permission === 'default') Notification.requestPermission().catch(() => {});
}

/** Strings come from the page (`[data-pomo-strings]` on the dock), in its language. */
function strings() {
  const el = document.querySelector<HTMLElement>('[data-pomo-strings]');
  return { focus: el?.dataset.noteFocus ?? 'Focus done. Take a break.', rest: el?.dataset.noteBreak ?? 'Break over. Ready to focus?' };
}

function announce(ended: Timer['phase'], d: Data) {
  if (d.settings.chime) chime();
  if (!('Notification' in window) || Notification.permission !== 'granted' || document.visibilityState === 'visible') return;
  const s = strings();
  try {
    new Notification(ended === 'focus' ? s.focus : s.rest, { icon: '/favicon-96.png', tag: 'pomodoro' });
  } catch {}
}

// ── the loop ──

let timeout: ReturnType<typeof setTimeout> | undefined;
let titleTick: ReturnType<typeof setInterval> | undefined;
let baseTitle = '';

export const mmss = (ms: number, lang: 'en' | 'fa' = 'en') => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const nf = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en', { minimumIntegerDigits: 2, useGrouping: false });
  return `${nf.format(Math.floor(total / 60))}:${nf.format(total % 60)}`;
};

export const leftOf = (t: Timer, now = Date.now()) => (t.status === 'running' ? Math.max(0, t.endsAt - now) : t.left);

function tick() {
  const now = Date.now();
  const t = load().timer;
  if (t.status !== 'running' || t.endsAt > now) return schedule();
  const run = () => {
    const before = load();
    if (before.timer.status !== 'running' || before.timer.id !== t.id || before.timer.endsAt > Date.now()) return;
    let ended: Timer['phase'] | null = null;
    const after = update((d) => {
      ended = catchUp(d, Date.now());
    });
    if (ended) announce(ended, after);
  };
  // only one tab may end the phase (and chime)
  if (navigator.locks) navigator.locks.request('pomodoro', run).catch(run);
  else run();
}

let beating: ReturnType<typeof setInterval> | undefined;

function schedule() {
  clearTimeout(timeout);
  const t = load().timer;
  if (t.status === 'running') timeout = setTimeout(tick, Math.max(0, t.endsAt - Date.now()) + 40);
  // tabs only announce themselves while a session is in flight: idle visitors store nothing
  if (t.status !== 'idle' && !beating) {
    beat();
    beating = setInterval(beat, BEAT);
  } else if (t.status === 'idle' && beating) {
    clearInterval(beating);
    beating = undefined;
    leave();
  }
  paintTitle();
}

function paintTitle() {
  const t = load().timer;
  const active = t.status !== 'idle';
  clearInterval(titleTick);
  if (!active) {
    if (baseTitle) document.title = baseTitle;
    return;
  }
  const lang = document.documentElement.lang.startsWith('fa') ? 'fa' : 'en';
  const paint = () => {
    const cur = load().timer;
    const mark = cur.status === 'paused' ? '❚❚ ' : '';
    document.title = `${mark}${mmss(leftOf(cur), lang)} · ${baseTitle}`;
  };
  paint();
  if (t.status === 'running') titleTick = setInterval(paint, 1000);
}

function guardClose(ev: BeforeUnloadEvent) {
  const t = load().timer;
  if (t.phase !== 'focus' || t.status === 'idle' || otherTabsAlive()) return;
  ev.preventDefault();
  ev.returnValue = '';
}

export function initEngine() {
  const g = globalThis as any;
  if (g.__pomoEngine) return;
  g.__pomoEngine = true;
  baseTitle = document.title;
  settleOrphan();
  window.addEventListener('pagehide', () => beating && leave());
  window.addEventListener('pageshow', (ev) => ev.persisted && beating && beat());
  window.addEventListener('beforeunload', guardClose);
  document.addEventListener('astro:after-swap', () => {
    baseTitle = document.title;
    paintTitle();
  });
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && tick());
  window.addEventListener('pomodoro:change', schedule);
  window.addEventListener('storage', (ev) => ev.key === 'pomodoro:v1' && schedule());
  schedule();
  tick();
}
