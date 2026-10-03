// Editing the visitor's own data: categories, past sessions, settings, the image deck, and the
// JSON backup that moves a history between browsers.

import { update, load, save, fresh, uid, cleanSettings, cleanSession, cleanCategory, DEFAULT_SETTINGS, type Settings, type Category } from './store';
import { syncIdle } from './engine';

export function setSettings(patch: Partial<Settings>) {
  update((d) => {
    d.settings = cleanSettings({ ...d.settings, ...patch });
    syncIdle(d);
  });
}

// ── categories ──

export function addCategory(name: string) {
  const clean = name.trim().slice(0, 40);
  if (!clean) return null;
  const id = uid();
  update((d) => {
    d.categories.push({ id, name: clean });
  });
  return id;
}

export function renameCategory(id: string, name: string) {
  const clean = name.trim().slice(0, 40);
  if (!clean) return;
  update((d) => {
    const c = d.categories.find((c) => c.id === id);
    if (c) c.name = clean;
  });
}

/** Its sessions move to Uncategorized; the last category stays. */
export function deleteCategory(id: string) {
  update((d) => {
    if (d.categories.length <= 1) return;
    d.categories = d.categories.filter((c) => c.id !== id);
    for (const s of d.sessions) if (s.category === id) s.category = null;
    const fallback = d.categories[0].id;
    if (d.timer.category === id) d.timer.category = fallback;
    if (d.lastCategory === id) d.lastCategory = fallback;
  });
}

// ── past sessions ──

export function editSession(id: string, patch: { category: string | null; topic: string }) {
  update((d) => {
    const s = d.sessions.find((s) => s.id === id);
    if (!s) return;
    s.category = patch.category;
    s.topic = patch.topic.trim().slice(0, 120);
  });
}

export function deleteSession(id: string) {
  update((d) => {
    d.sessions = d.sessions.filter((s) => s.id !== id);
  });
}

// ── the reward deck: a shuffle, no repeats until every image has been seen ──

function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Gives the waiting reward its image (the page knows which images exist; the clock doesn't). */
export function drawReward(images: string[]) {
  if (!images.length) return;
  update((d) => {
    if (!d.reward || d.reward.image) return;
    let deck = d.deck.filter((id) => images.includes(id));
    if (!deck.length) {
      deck = shuffle([...images]);
      // a fresh deck never opens with the image just shown
      if (deck.length > 1 && deck[0] === d.lastImage) deck.push(deck.shift()!);
    }
    d.reward.image = deck.shift()!;
    d.lastImage = d.reward.image;
    d.deck = deck;
  });
}

// ── backup ──

const APP = 'mahdimirmo.ir/pomodoro';

export function exportBackup() {
  const d = load();
  const body = JSON.stringify(
    { app: APP, v: 1, exportedAt: new Date().toISOString(), settings: d.settings, categories: d.categories, sessions: d.sessions },
    null,
    2,
  );
  const url = URL.createObjectURL(new Blob([body], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `pomodoro-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const sameSettings = (a: Settings, b: Settings) => (Object.keys(a) as (keyof Settings)[]).every((k) => a[k] === b[k]);

/** Merges a backup: new sessions are added (by id, so the same file twice changes nothing),
 *  categories are joined (by id, then by name), and its settings apply only if this browser
 *  still has the defaults. Returns how many sessions were new, or null if the file isn't a backup. */
export function importBackup(text: string): number | null {
  let x: any;
  try {
    x = JSON.parse(text);
  } catch {
    return null;
  }
  if (!x || x.app !== APP || !Array.isArray(x.sessions)) return null;
  let added = 0;
  update((d) => {
    const nameOf = (c: Category) => c.name.trim().toLowerCase() || c.id;
    const idMap = new Map<string, string>();
    for (const raw of Array.isArray(x.categories) ? x.categories : []) {
      const c = cleanCategory(raw);
      if (!c) continue;
      const byId = d.categories.find((m) => m.id === c.id);
      const byName = d.categories.find((m) => nameOf(m) === nameOf(c));
      const match = byId ?? byName;
      if (match) idMap.set(c.id, match.id);
      else {
        d.categories.push(c);
        idMap.set(c.id, c.id);
      }
    }
    const have = new Set(d.sessions.map((s) => s.id));
    for (const raw of x.sessions) {
      const s = cleanSession(raw);
      if (!s || have.has(s.id)) continue;
      if (s.category) s.category = idMap.get(s.category) ?? (d.categories.some((c) => c.id === s.category) ? s.category : null);
      d.sessions.push(s);
      have.add(s.id);
      added++;
    }
    d.sessions.sort((a, b) => a.start - b.start);
    if (x.settings && sameSettings(d.settings, DEFAULT_SETTINGS)) {
      d.settings = cleanSettings(x.settings);
      syncIdle(d);
    }
  });
  return added;
}

export function clearAll() {
  const keepAsked = load().notifyAsked;
  const next = fresh();
  next.notifyAsked = keepAsked;
  save(next);
}
