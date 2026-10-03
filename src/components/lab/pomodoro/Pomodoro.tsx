// ~/lab/pomodoro: the timer, its stats and the visitor's own history. Everything is stored in this
// browser (src/lib/pomodoro/store.ts); the clock itself runs in src/lib/pomodoro/engine.ts, which
// the dock's mini-timer also loads on every other page. Spec: docs/pomodoro.md.
//
// Minimal by design: the timer is the page. History (the week, the year, past sessions) and
// Settings (lengths, categories, the backup) open under two keys, one at a time.
import { useEffect, useMemo, useState } from 'react';
import { initEngine } from '../../../lib/pomodoro/engine';
import type { Lang } from '../../../lib/pomodoro/calendar';
import { I18n, makeCtx, useData, useNow, type Strings } from './ctx';
import Timer, { type Img, type Poses } from './Timer';
import { SettingsPanel, CategoriesPanel } from './Settings';
import { Week, Heatmap } from './Stats';
import { History, DataPanel } from './History';

interface Props {
  lang: Lang;
  strings: Strings;
  images: Img[];
  poses: Poses;
}

type Drawer = 'history' | 'settings' | null;

export default function Pomodoro({ lang, strings, images, poses }: Props) {
  const ctx = useMemo(() => makeCtx(lang, strings), [lang, strings]);
  const d = useData();
  // stats only need the minute (and the day turning over)
  const now = useNow(true, 30_000);
  const [open, setOpen] = useState<Drawer>(null);
  useEffect(() => initEngine(), []);

  const key = (id: Exclude<Drawer, null>, label: string) => (
    <button type="button" className="btn btn--ghost pomo-drawer-key" aria-expanded={open === id} aria-controls="pomo-drawer" onClick={() => setOpen(open === id ? null : id)}>
      {label}
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  return (
    <I18n.Provider value={ctx}>
      <div className="pomo">
        <Timer d={d} images={images} poses={poses} />
        <div className="pomo-drawer-keys">
          {key('history', ctx.t('pomo.hist'))}
          {key('settings', ctx.t('pomo.settings'))}
        </div>
        {open && (
          <div id="pomo-drawer" className="pomo-drawer">
            {open === 'history' ? (
              <>
                <Week d={d} now={now} />
                <Heatmap d={d} now={now} />
                <History d={d} />
              </>
            ) : (
              <>
                <SettingsPanel d={d} />
                <CategoriesPanel d={d} />
                <DataPanel />
              </>
            )}
          </div>
        )}
      </div>
    </I18n.Provider>
  );
}
