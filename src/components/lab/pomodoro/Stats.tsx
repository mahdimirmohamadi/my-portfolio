import { useEffect, useMemo, useRef, useState } from 'react';
import type { Data, Session } from '../../../lib/pomodoro/store';
import { startOfDay, startOfWeek, dayKey, heatGrid, fmtDate } from '../../../lib/pomodoro/calendar';
import { useI18n } from './ctx';

const done = (s: Session) => s.status === 'done';

/** This week in one line, then minutes per category. (Today lives on the timer's screen.) */
export function Week({ d, now }: { d: Data; now: number }) {
  const { t, catName, lang, count } = useI18n();
  const thisWeek = d.sessions.filter((s) => done(s) && s.end >= startOfWeek(now, lang));
  const minutes = thisWeek.reduce((a, s) => a + s.minutes, 0);
  const byCat = (() => {
    const m = new Map<string | null, number>();
    for (const s of thisWeek) {
      const known = d.categories.some((c) => c.id === s.category) ? s.category : null;
      m.set(known, (m.get(known) ?? 0) + s.minutes);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  })();
  const top = byCat[0]?.[1] ?? 1;

  return (
    <section className="pomo-sec" aria-labelledby="pomo-week">
      <h2 id="pomo-week" className="pomo-h">
        {t('pomo.week')}
        <span className="pomo-h__meta">{thisWeek.length ? `${count(thisWeek.length)} · ${t('pomo.min', { n: minutes })}` : t('pomo.statsNone')}</span>
      </h2>
      {byCat.length > 0 && (
        <ul className="pomo-bycat" role="list">
          {byCat.map(([id, min]) => (
            <li key={id ?? 'none'}>
              <span className="pomo-bycat__name">{catName(d.categories.find((c) => c.id === id))}</span>
              <span className="pomo-bycat__bar" aria-hidden="true">
                <span style={{ transform: `scaleX(${min / top})` }} />
              </span>
              <span className="caption">{t('pomo.min', { n: min })}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 26;
const TOP = 18;

const level = (n: number) => (n <= 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n <= 4 ? 3 : 4);

export function Heatmap({ d, now }: { d: Data; now: number }) {
  const { t, lang, num, catName, count } = useI18n();
  const [filter, setFilter] = useState<string>('all');
  const scroller = useRef<HTMLDivElement>(null);
  const today = startOfDay(now);
  const grid = useMemo(() => heatGrid(today, lang), [today, lang]);
  const rtl = lang === 'fa';

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of d.sessions) {
      if (!done(s)) continue;
      const known = d.categories.some((c) => c.id === s.category) ? s.category : null;
      if (filter !== 'all' && (filter === 'none' ? known !== null : known !== filter)) continue;
      const k = dayKey(s.end);
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
  }, [d.sessions, d.categories, filter]);

  const total = useMemo(() => {
    let n = 0;
    for (const col of grid.weeks) for (const c of col) n += counts.get(c.key) ?? 0;
    return n;
  }, [counts, grid]);

  // phones: open at today
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = rtl ? -el.scrollWidth : el.scrollWidth;
  }, [rtl]);

  const W = LEFT + grid.weeks.length * STEP;
  const H = TOP + 7 * STEP;
  const x = (col: number) => (rtl ? W - LEFT - (col + 1) * STEP + GAP : LEFT + col * STEP);
  const hasUncat = d.sessions.some((s) => s.category === null || !d.categories.some((c) => c.id === s.category));

  return (
    <section className="pomo-sec pomo-heat" aria-labelledby="pomo-heat">
      <div className="pomo-heat__head">
        <h2 id="pomo-heat" className="pomo-h">
          {t('pomo.heat')}
        </h2>
        <span className="caption">{t('pomo.heat.total', { n: total })}</span>
        <label className="pomo-field pomo-heat__filter">
          <span className="sr-only">{t('pomo.category')}</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">{t('pomo.heat.all')}</option>
            {d.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {catName(c)}
              </option>
            ))}
            {hasUncat && <option value="none">{t('pomo.cat.none')}</option>}
          </select>
        </label>
      </div>
      <div className="pomo-heat__scroll" ref={scroller}>
        <svg className="pomo-heat__svg" viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ minWidth: Math.min(W, 600) }} role="img" aria-label={`${t('pomo.heat')}: ${t('pomo.heat.total', { n: total })}`}>
          {grid.months.map((m) => (
            <text key={`${m.col}-${m.label}`} x={rtl ? x(m.col) + CELL : x(m.col)} y={11} className="pomo-heat__month" textAnchor={rtl ? 'end' : 'start'}>
              {m.label}
            </text>
          ))}
          {grid.weekdays.map((w, i) =>
            i % 2 === 0 ? (
              <text key={i} x={rtl ? W - 4 : 4} y={TOP + i * STEP + CELL - 2} className="pomo-heat__day" textAnchor={rtl ? 'end' : 'start'}>
                {w}
              </text>
            ) : null,
          )}
          {grid.weeks.map((col, ci) =>
            col.map((c, ri) => {
              if (c.future) return null;
              const n = counts.get(c.key) ?? 0;
              return (
                <rect key={c.key} x={x(ci)} y={TOP + ri * STEP} width={CELL} height={CELL} rx={3} className={`pomo-cell l${level(n)}${c.ts === today ? ' is-today' : ''}`}>
                  <title>{`${fmtDate(lang, c.ts, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}: ${n ? count(n) : num(0)}`}</title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>
      <p className="pomo-heat__legend caption" aria-hidden="true">
        <span>{t('pomo.heat.less')}</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <svg key={l} width={CELL} height={CELL} viewBox={`0 0 ${CELL} ${CELL}`}>
            <rect width={CELL} height={CELL} rx={3} className={`pomo-cell l${l}`} />
          </svg>
        ))}
        <span>{t('pomo.heat.more')}</span>
      </p>
    </section>
  );
}
