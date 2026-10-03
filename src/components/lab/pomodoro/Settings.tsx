import { useEffect, useState } from 'react';
import { LIMITS, type Data, type Settings as S } from '../../../lib/pomodoro/store';
import { setSettings, addCategory, renameCategory, deleteCategory } from '../../../lib/pomodoro/data';
import { useI18n } from './ctx';

const PRESETS = [
  { focus: 25, short: 5, long: 15 },
  { focus: 50, short: 10, long: 30 },
];

/** A number that commits when it is valid (typing "4" on the way to "45" never clamps). */
function NumField({ k, value, unit }: { k: keyof typeof LIMITS; value: number; unit: string }) {
  const { t, num } = useI18n();
  const [draft, setDraft] = useState(num(value));
  useEffect(() => setDraft(num(value)), [value]);
  const [lo, hi] = LIMITS[k];
  const commit = (raw: string) => {
    // Persian digits typed on a Persian keyboard count too
    const n = Number(raw.trim().replace(/[۰-۹]/g, (c) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))));
    if (!raw.trim()) return;
    if (Number.isFinite(n) && n >= lo && n <= hi) setSettings({ [k]: n } as Partial<S>);
  };
  return (
    <label className="pomo-num">
      <span>{t(`pomo.set.${k}`)}</span>
      <span className="pomo-num__box">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-describedby={`pomo-range-${k}`}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            commit(e.target.value);
          }}
          onBlur={() => setDraft(num(value))}
        />
        <span className="caption">{unit}</span>
      </span>
      <span id={`pomo-range-${k}`} className="sr-only">
        {num(lo)}–{num(hi)}
      </span>
    </label>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="pomo-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="pomo-switch__key" aria-hidden="true">
        <span />
      </span>
      <span>{label}</span>
    </label>
  );
}

export function SettingsPanel({ d }: { d: Data }) {
  const { t, num } = useI18n();
  const s = d.settings;
  const min = t('pomo.unit.min');
  return (
    <section className="pomo-sec" aria-labelledby="pomo-settings">
      <h2 id="pomo-settings" className="pomo-h">
        {t('pomo.lengths')}
      </h2>
      <div className="pomo-presets" role="group" aria-label={t('pomo.presets')}>
        {PRESETS.map((p) => {
          const on = s.focus === p.focus && s.short === p.short && s.long === p.long;
          return (
            <button key={p.focus} type="button" className="key-sm pomo-preset" aria-pressed={on} onClick={() => setSettings(p)}>
              <span dir="ltr">
                {num(p.focus)} / {num(p.short)}
              </span>
            </button>
          );
        })}
      </div>
      <div className="pomo-nums">
        <NumField k="focus" value={s.focus} unit={min} />
        <NumField k="short" value={s.short} unit={min} />
        <NumField k="long" value={s.long} unit={min} />
        <NumField k="every" value={s.every} unit={t('pomo.unit.pomos')} />
        <NumField k="goal" value={s.goal} unit={t('pomo.unit.pomos')} />
      </div>
      <div className="pomo-switches">
        <Switch checked={s.autoStart} onChange={(v) => setSettings({ autoStart: v })} label={t('pomo.set.auto')} />
        <Switch checked={s.chime} onChange={(v) => setSettings({ chime: v })} label={t('pomo.set.chime')} />
      </div>
    </section>
  );
}

/** One key per row: Edit opens the name with Save, Cancel and Delete (which asks first). */
function CategoryRow({ id, name, only }: { id: string; name: string; only: boolean }) {
  const { t } = useI18n();
  const [mode, setMode] = useState<'view' | 'edit' | 'delete'>('view');
  const [draft, setDraft] = useState(name);
  if (mode === 'edit')
    return (
      <li className="pomo-cat">
        <form
          className="pomo-inline pomo-cat__form"
          onSubmit={(e) => {
            e.preventDefault();
            renameCategory(id, draft);
            setMode('view');
          }}
        >
          <input type="text" value={draft} maxLength={40} onChange={(e) => setDraft(e.target.value)} aria-label={t('pomo.cat.rename')} autoFocus />
          <button type="submit" className="key-sm">
            {t('pomo.save')}
          </button>
          <button type="button" className="key-sm" onClick={() => setMode('view')}>
            {t('pomo.cancel')}
          </button>
          <button type="button" className="key-sm pomo-danger" disabled={only} title={only ? t('pomo.cat.last') : undefined} onClick={() => setMode('delete')}>
            {t('pomo.delete')}
          </button>
        </form>
      </li>
    );
  if (mode === 'delete')
    return (
      <li className="pomo-cat pomo-cat--ask">
        <span>{t('pomo.cat.deleteAsk', { name })}</span>
        <span className="pomo-inline">
          <button type="button" className="key-sm pomo-danger" onClick={() => deleteCategory(id)}>
            {t('pomo.yes')}
          </button>
          <button type="button" className="key-sm" onClick={() => setMode('view')}>
            {t('pomo.cancel')}
          </button>
        </span>
      </li>
    );
  return (
    <li className="pomo-cat">
      <span className="pomo-cat__name">{name}</span>
      <button
        type="button"
        className="key-sm"
        onClick={() => {
          setDraft(name);
          setMode('edit');
        }}
      >
        {t('pomo.edit')}
      </button>
    </li>
  );
}

export function CategoriesPanel({ d }: { d: Data }) {
  const { t, catName } = useI18n();
  const [name, setName] = useState('');
  return (
    <section className="pomo-sec" aria-labelledby="pomo-cats">
      <h2 id="pomo-cats" className="pomo-h">
        {t('pomo.cats')}
      </h2>
      <ul className="pomo-cats" role="list">
        {d.categories.map((c) => (
          <CategoryRow key={c.id} id={c.id} name={catName(c)} only={d.categories.length <= 1} />
        ))}
      </ul>
      <form
        className="pomo-inline pomo-add"
        onSubmit={(e) => {
          e.preventDefault();
          if (addCategory(name)) setName('');
        }}
      >
        <input type="text" value={name} maxLength={40} placeholder={t('pomo.cat.new')} aria-label={t('pomo.cat.new')} onChange={(e) => setName(e.target.value)} />
        <button type="submit" className="key-sm" disabled={!name.trim()}>
          {t('pomo.cat.add')}
        </button>
      </form>
    </section>
  );
}
