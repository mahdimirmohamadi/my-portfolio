import { useEffect, useState } from 'react';
import { useData, useNow } from '../pomodoro/ctx';
import { start, pause, resume, stop, skip, initEngine, leftOf, mmss, setTopic, setCategory } from '../../../lib/pomodoro/engine';
import { setSettings } from '../../../lib/pomodoro/data';
import type { Lang } from '../../../i18n/ui';

export default function FocusClock({ lang, t }: { lang: Lang; t: (key: string) => string }) {
  const d = useData(), timer = d.timer;
  const now = useNow(timer.status === 'running', 1000);
  const [confirm, setConfirm] = useState(false);
  useEffect(() => initEngine(), []);
  useEffect(() => setConfirm(false), [timer.id, timer.status]);
  const left = leftOf(timer, now);
  const label = timer.status === 'running' ? 'pause' : timer.status === 'paused' ? 'resume' : timer.phase === 'focus' ? 'start' : 'startBreak';
  const num = (n: number) => new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en').format(n);
  return <aside className="radio-timer" aria-labelledby="radio-timer-title">
    <h2 id="radio-timer-title">{t('radio.timer')}</h2>
    <p className="radio-muted">{t('radio.timerHint')}</p>
    <div className="radio-timer__screen">
      <div className="radio-timer__phase"><i className={timer.status === 'running' ? 'radio-led is-lit' : 'radio-led'} aria-hidden="true" />{t(`pomo.phase.${timer.phase}`)}{timer.status === 'paused' && <span>{t('pomo.paused')}</span>}</div>
      <div className="radio-timer__digits" dir="ltr" aria-label={`${t(`pomo.phase.${timer.phase}`)} ${mmss(left, lang)}`}>{mmss(left, lang)}</div>
      <progress max={timer.duration} value={Math.max(0, timer.duration - left)} aria-label={t(`pomo.phase.${timer.phase}`)} />
      {d.reward && <p role="status">{t('radio.timerDone')}</p>}
    </div>
    {confirm ? <div className="radio-stop-confirm">
      <p>{t('radio.timerStopAsk')}</p>
      <button className="key-sm" onClick={() => { stop(); setConfirm(false); }}>{t('radio.confirmStop')}</button>
      <button className="key-sm" onClick={() => setConfirm(false)}>{t('radio.cancel')}</button>
    </div> : <div className="radio-timer__actions">
      <button className="btn" onClick={() => timer.status === 'running' ? pause() : timer.status === 'paused' ? resume() : start()}>{t(`pomo.${label}`)}</button>
      {timer.status !== 'idle' && timer.phase === 'focus' && <button className="btn btn--ghost" onClick={() => setConfirm(true)}>{t('pomo.stop')}</button>}
      {timer.phase !== 'focus' && <button className="btn btn--ghost" onClick={skip}>{t('pomo.skip')}</button>}
    </div>}
    <div className="radio-timer__presets" role="group" aria-label={t('radio.timerPreset')}>
      {[{ focus: 25, short: 5, long: 15 }, { focus: 50, short: 10, long: 30 }].map(p => <button key={p.focus} className="key-sm" disabled={timer.status !== 'idle'} aria-pressed={d.settings.focus === p.focus && d.settings.short === p.short} onClick={() => setSettings(p)}><span dir="ltr">{num(p.focus)} / {num(p.short)}</span></button>)}
    </div>
    <label className="radio-field"><span>{t('pomo.category')}</span><select value={timer.category ?? ''} onChange={e => setCategory(e.target.value || null)}><option value="">{t('pomo.cat.none')}</option>{d.categories.map(c => <option key={c.id} value={c.id}>{c.name || t(`pomo.cat.${c.id}`)}</option>)}</select></label>
    <label className="radio-field"><span>{t('pomo.topic')}</span><input value={timer.topic} maxLength={120} placeholder={t('pomo.topicPh')} onChange={e => setTopic(e.target.value)} /></label>
    <a className="radio-text-link" href={lang === 'fa' ? '/fa/lab/pomodoro' : '/lab/pomodoro'}>{t('radio.timerSettings')} <span aria-hidden="true">↗</span></a>
  </aside>;
}
