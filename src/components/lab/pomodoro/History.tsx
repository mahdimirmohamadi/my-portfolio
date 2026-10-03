import { useMemo, useRef, useState } from 'react';
import type { Data, Session } from '../../../lib/pomodoro/store';
import { editSession, deleteSession, exportBackup, importBackup, clearAll } from '../../../lib/pomodoro/data';
import { dayKey, fmtDate } from '../../../lib/pomodoro/calendar';
import { useI18n } from './ctx';

const PAGE = 10;

function Row({ s, d }: { s: Session; d: Data }) {
  const { t, lang, catName } = useI18n();
  const [mode, setMode] = useState<'view' | 'edit' | 'delete'>('view');
  const [cat, setCat] = useState<string>(s.category ?? '');
  const [topic, setTopic] = useState(s.topic);
  const known = d.categories.find((c) => c.id === s.category);
  const hm = (ts: number) => fmtDate(lang, ts, { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <li className={`pomo-row${s.status === 'abandoned' ? ' is-abandoned' : ''}`}>
      <span className="pomo-row__dot" aria-hidden="true" />
      <div className="pomo-row__main">
        <p className="pomo-row__line">
          <span className="pomo-row__time" dir="ltr">
            {hm(s.start)}–{hm(s.end)}
          </span>
          <span className="caption">{t('pomo.min', { n: s.minutes })}</span>
          {s.status === 'abandoned' && <span className="sticker">{t('pomo.hist.abandoned')}</span>}
        </p>
        {mode === 'edit' ? (
          <form
            className="pomo-inline pomo-row__edit"
            onSubmit={(e) => {
              e.preventDefault();
              editSession(s.id, { category: cat || null, topic });
              setMode('view');
            }}
          >
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label={t('pomo.category')}>
              {!known && <option value="">{t('pomo.cat.none')}</option>}
              {d.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {catName(c)}
                </option>
              ))}
            </select>
            <input type="text" value={topic} maxLength={120} placeholder={t('pomo.topicPh')} aria-label={t('pomo.topic')} onChange={(e) => setTopic(e.target.value)} />
            <button type="submit" className="key-sm">
              {t('pomo.save')}
            </button>
            <button type="button" className="key-sm" onClick={() => setMode('view')}>
              {t('pomo.cancel')}
            </button>
            <button type="button" className="key-sm pomo-danger" onClick={() => setMode('delete')}>
              {t('pomo.delete')}
            </button>
          </form>
        ) : (
          <p className="pomo-row__what">
            <b>{catName(known)}</b>
            <span className={s.topic ? undefined : 'pomo-quiet'}>{s.topic || t('pomo.hist.noTopic')}</span>
          </p>
        )}
        {mode === 'delete' && (
          <p className="pomo-inline pomo-row__ask">
            <span>{t('pomo.hist.deleteAsk')}</span>
            <button type="button" className="key-sm pomo-danger" onClick={() => deleteSession(s.id)}>
              {t('pomo.yes')}
            </button>
            <button type="button" className="key-sm" onClick={() => setMode('view')}>
              {t('pomo.cancel')}
            </button>
          </p>
        )}
      </div>
      {mode === 'view' && (
        <button
          type="button"
          className="key-sm pomo-row__tools"
          onClick={() => {
            setCat(s.category && known ? s.category : '');
            setTopic(s.topic);
            setMode('edit');
          }}
        >
          {t('pomo.edit')}
        </button>
      )}
    </li>
  );
}

export function History({ d }: { d: Data }) {
  const { t, lang } = useI18n();
  const [shown, setShown] = useState(PAGE);
  const sorted = useMemo(() => [...d.sessions].sort((a, b) => b.start - a.start), [d.sessions]);
  const page = sorted.slice(0, shown);
  const days: { key: string; ts: number; list: Session[] }[] = [];
  for (const s of page) {
    const key = dayKey(s.start);
    const last = days[days.length - 1];
    if (last?.key === key) last.list.push(s);
    else days.push({ key, ts: s.start, list: [s] });
  }

  return (
    <section className="pomo-sec pomo-hist" aria-labelledby="pomo-hist">
      <h2 id="pomo-hist" className="pomo-h">
        {t('pomo.sessions')}
      </h2>
      {!sorted.length && <p className="pomo-quiet">{t('pomo.hist.none')}</p>}
      {days.map((day) => (
        <div key={day.key} className="pomo-day">
          <h3 className="pomo-day__head">{fmtDate(lang, day.ts, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
          <ol className="pomo-rows" role="list">
            {day.list.map((s) => (
              <Row key={s.id} s={s} d={d} />
            ))}
          </ol>
        </div>
      ))}
      {sorted.length > shown && (
        <button type="button" className="btn btn--ghost pomo-more" onClick={() => setShown((n) => n + PAGE)}>
          {t('pomo.hist.more')}
        </button>
      )}
    </section>
  );
}

export function DataPanel() {
  const { t } = useI18n();
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const [asking, setAsking] = useState(false);

  return (
    <section className="pomo-sec pomo-data" aria-labelledby="pomo-data">
      <h2 id="pomo-data" className="pomo-h">
        {t('pomo.data')}
      </h2>
      <p className="pomo-data__hint">{t('pomo.data.hint')}</p>
      <div className="pomo-inline">
        <button type="button" className="key-sm" onClick={exportBackup}>
          {t('pomo.data.export')}
        </button>
        <button type="button" className="key-sm" onClick={() => file.current?.click()}>
          {t('pomo.data.import')}
        </button>
        <input
          ref={file}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (!f) return;
            const n = importBackup(await f.text());
            setMsg(n === null ? t('pomo.data.bad') : t('pomo.data.imported', { n }));
          }}
        />
      </div>
      <p className="pomo-data__msg" role="status">
        {msg}
      </p>
      {asking ? (
        <div className="pomo-ask">
          <p>{t('pomo.data.clearAsk')}</p>
          <span className="pomo-inline">
            <button
              type="button"
              className="key-sm pomo-danger"
              onClick={() => {
                clearAll();
                setAsking(false);
                setMsg('');
              }}
            >
              {t('pomo.data.clearYes')}
            </button>
            <button type="button" className="key-sm" onClick={() => setAsking(false)}>
              {t('pomo.cancel')}
            </button>
          </span>
        </div>
      ) : (
        <button type="button" className="key-sm pomo-clear" onClick={() => setAsking(true)}>
          {t('pomo.data.clear')}
        </button>
      )}
    </section>
  );
}
