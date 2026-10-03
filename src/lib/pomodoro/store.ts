// The pomodoro's data: one JSON document in localStorage, shared by every tab of this browser.
// Nothing leaves the browser. Every read and write is guarded: private windows and blocked
// storage simply start fresh each time.

export type Phase = 'focus' | 'short' | 'long';
export type Status = 'idle' | 'running' | 'paused';

export interface Settings {
  focus: number; // minutes
  short: number;
  long: number;
  every: number; // a long break after this many focus sessions
  goal: number; // pomodoros a day
  autoStart: boolean;
  chime: boolean;
}

/** `name` is empty for a built-in category until it is renamed (it then shows in the page's language). */
export interface Category {
  id: string;
  name: string;
}

export interface Session {
  id: string;
  start: number; // ms epoch
  end: number;
  minutes: number; // planned length
  category: string | null; // null = Uncategorized
  topic: string;
  status: 'done' | 'abandoned';
}

export interface Timer {
  phase: Phase;
  status: Status;
  /** the focus session's id (also the record's id once it ends) */
  id: string;
  duration: number; // ms
  startedAt: number; // first start, 0 while idle
  endsAt: number; // while running
  left: number; // ms left while idle or paused
  done: number; // focus sessions finished in this cycle
  category: string | null;
  topic: string;
}

export interface Reward {
  image: string;
  at: number;
}

export interface Data {
  v: 1;
  settings: Settings;
  categories: Category[];
  sessions: Session[];
  lastCategory: string | null;
  deck: string[];
  lastImage: string;
  timer: Timer;
  reward: Reward | null;
  notifyAsked: boolean;
}

export const KEY = 'pomodoro:v1';
export const BUILTIN = ['study', 'work', 'code', 'reading'] as const;
export const DEFAULT_SETTINGS: Settings = { focus: 25, short: 5, long: 15, every: 4, goal: 8, autoStart: false, chime: true };
export const LIMITS: Record<'focus' | 'short' | 'long' | 'every' | 'goal', [number, number]> = {
  focus: [5, 90],
  short: [1, 30],
  long: [1, 30],
  every: [2, 8],
  goal: [1, 20],
};

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const MIN = 60_000;

export const durationOf = (phase: Phase, s: Settings) => (phase === 'focus' ? s.focus : phase === 'short' ? s.short : s.long) * MIN;

export function idleTimer(phase: Phase, s: Settings, keep?: Partial<Timer>): Timer {
  const duration = durationOf(phase, s);
  return {
    phase,
    status: 'idle',
    id: uid(),
    duration,
    startedAt: 0,
    endsAt: 0,
    left: duration,
    done: keep?.done ?? 0,
    category: keep?.category ?? null,
    topic: keep?.topic ?? '',
  };
}

export function fresh(): Data {
  const settings = { ...DEFAULT_SETTINGS };
  return {
    v: 1,
    settings,
    categories: BUILTIN.map((id) => ({ id, name: '' })),
    sessions: [],
    lastCategory: 'study',
    deck: [],
    lastImage: '',
    timer: idleTimer('focus', settings, { category: 'study' }),
    reward: null,
    notifyAsked: false,
  };
}

const clamp = (n: unknown, [lo, hi]: [number, number], dflt: number) => {
  const v = Math.round(Number(n));
  return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : dflt;
};

export function cleanSettings(s: Partial<Settings> | undefined): Settings {
  const d = DEFAULT_SETTINGS;
  return {
    focus: clamp(s?.focus, LIMITS.focus, d.focus),
    short: clamp(s?.short, LIMITS.short, d.short),
    long: clamp(s?.long, LIMITS.long, d.long),
    every: clamp(s?.every, LIMITS.every, d.every),
    goal: clamp(s?.goal, LIMITS.goal, d.goal),
    autoStart: typeof s?.autoStart === 'boolean' ? s.autoStart : d.autoStart,
    chime: typeof s?.chime === 'boolean' ? s.chime : d.chime,
  };
}

const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function cleanSession(x: any): Session | null {
  if (!x || !isStr(x.id) || !isNum(x.start) || !isNum(x.end)) return null;
  return {
    id: x.id.slice(0, 40),
    start: x.start,
    end: Math.max(x.start, x.end),
    minutes: isNum(x.minutes) ? Math.max(1, Math.round(x.minutes)) : Math.max(1, Math.round((x.end - x.start) / MIN)),
    category: isStr(x.category) ? x.category : null,
    topic: isStr(x.topic) ? x.topic.slice(0, 120) : '',
    status: x.status === 'abandoned' ? 'abandoned' : 'done',
  };
}

export function cleanCategory(x: any): Category | null {
  if (!x || !isStr(x.id) || !isStr(x.name)) return null;
  return { id: x.id.slice(0, 40), name: x.name.slice(0, 40) };
}

/** Reads whatever is stored and repairs it, so a hand-edited or older document never breaks the page. */
function parse(raw: string | null): Data {
  const base = fresh();
  if (!raw) return base;
  try {
    const x = JSON.parse(raw);
    const settings = cleanSettings(x.settings);
    const categories = Array.isArray(x.categories) ? (x.categories.map(cleanCategory).filter(Boolean) as Category[]) : base.categories;
    const sessions = Array.isArray(x.sessions) ? (x.sessions.map(cleanSession).filter(Boolean) as Session[]) : [];
    const t = x.timer;
    const timer: Timer =
      t && ['focus', 'short', 'long'].includes(t.phase) && ['idle', 'running', 'paused'].includes(t.status) && isNum(t.duration)
        ? {
            phase: t.phase,
            status: t.status,
            id: isStr(t.id) ? t.id : uid(),
            duration: t.duration,
            startedAt: isNum(t.startedAt) ? t.startedAt : 0,
            endsAt: isNum(t.endsAt) ? t.endsAt : 0,
            left: isNum(t.left) ? t.left : t.duration,
            done: isNum(t.done) ? t.done : 0,
            category: isStr(t.category) ? t.category : null,
            topic: isStr(t.topic) ? t.topic : '',
          }
        : idleTimer('focus', settings, { category: categories[0]?.id ?? null });
    return {
      v: 1,
      settings,
      categories: categories.length ? categories : base.categories,
      sessions,
      lastCategory: isStr(x.lastCategory) ? x.lastCategory : null,
      deck: Array.isArray(x.deck) ? x.deck.filter(isStr) : [],
      lastImage: isStr(x.lastImage) ? x.lastImage : '',
      timer,
      reward: x.reward && isStr(x.reward.image) && isNum(x.reward.at) ? { image: x.reward.image, at: x.reward.at } : null,
      notifyAsked: x.notifyAsked === true,
    };
  } catch {
    return base;
  }
}

// ── the live copy: read once, then kept in step with other tabs through the storage event ──
let cache: Data | null = null;
let rawCache: string | null = null;
const listeners = new Set<() => void>();

function readRaw() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function load(): Data {
  const raw = readRaw();
  if (cache && raw === rawCache) return cache;
  rawCache = raw;
  cache = parse(raw);
  return cache;
}

export function save(next: Data) {
  cache = next;
  const raw = JSON.stringify(next);
  rawCache = raw;
  try {
    localStorage.setItem(KEY, raw);
  } catch {}
  // the dock's script and the page's island may hold separate copies of this module: tell both
  window.dispatchEvent(new Event(CHANGE));
}

/** Applies a change to the latest stored state (another tab may have written since we last read). */
export function update(fn: (d: Data) => Data | void) {
  const cur = load();
  const draft: Data = structuredClone(cur);
  const out = fn(draft) ?? draft;
  save(out);
  return out;
}

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const CHANGE = 'pomodoro:change';
if (typeof window !== 'undefined') {
  window.addEventListener(CHANGE, emit);
  window.addEventListener('storage', (ev) => {
    if (ev.key !== KEY && ev.key !== null) return;
    cache = null;
    emit();
  });
}

export const SERVER_SNAPSHOT: Data = fresh();
