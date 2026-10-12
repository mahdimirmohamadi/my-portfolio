import { useState } from 'react';
import * as radio from '../../../lib/radio/engine';
import { defaultMix, tracks } from '../../../lib/radio/catalog';
import { mmss } from '../../../lib/pomodoro/engine';
import { useNow } from '../pomodoro/ctx';
import Glyph from './Glyph';
import type { Lang } from '../../../i18n/ui';

interface Props {
  s: radio.RadioState; lang: Lang; t: (key: string) => string;
  titleOf: (track: (typeof tracks)[number]) => string;
  setMessage: (value: string) => void; addPhoto: (file?: File) => void; resetPhoto: () => void;
}
export default function RadioOptions({ s, lang, t, titleOf, setMessage, addPhoto, resetPhoto }: Props) {
  const [name, setName] = useState('');
  const now = useNow(Boolean(s.sleepAt), 1000);
  const num = (n: number) => new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en').format(n);
  return <details className="radio-options">
    <summary>{t('radio.options')}</summary>
    <div className="radio-options__body">
      <section aria-labelledby="radio-save-title">
        <h2 id="radio-save-title">{t('radio.save')}</h2>
        <form className="radio-save-form" onSubmit={e => {
          e.preventDefault(); const saved = radio.saveMix(name);
          setMessage(t(saved ? 'radio.saveSuccess' : 'radio.saveLimit')); if (saved) setName('');
        }}>
          <label className="radio-field"><span className="sr-only">{t('radio.saveName')}</span><input placeholder={t('radio.savePlaceholder')} value={name} required maxLength={40} onChange={e => setName(e.target.value)} /></label>
          <button className="key-sm" type="submit" disabled={!name.trim() || s.saved.length >= 12}>{t('pomo.save')}</button>
        </form>
        {s.saved.length >= 12 && <p className="radio-muted">{t('radio.saveLimit')}</p>}
        <ul className="radio-saved" aria-label={t('radio.saved')}>{s.saved.map(v => <li key={v.id}>
          <button className="radio-text-button" onClick={() => { resetPhoto(); radio.recallMix(v.id); }}>{v.name}</button>
          <button className="radio-icon key-sm" aria-label={`${t('radio.remove')} ${v.name}`} onClick={() => radio.removeMix(v.id)}><Glyph name="close" /></button>
        </li>)}</ul>
        <label className="radio-field"><span>{t('radio.sleep')}</span><select value={s.sleepMinutes} onChange={e => radio.sleepIn(Number(e.target.value))}>
          <option value="0">{t('radio.sleepOff')}</option>{[15, 30, 60].map(n => <option key={n} value={n}>{t('radio.sleepMinutes').replace('{n}', num(n))}</option>)}
        </select></label>
        {s.sleepAt > 0 && <p className="radio-muted">{t('radio.sleepLeft').replace('{time}', mmss(Math.max(0, s.sleepAt - now), lang))}</p>}
      </section>
      <section aria-labelledby="radio-import-title">
        <h2 id="radio-import-title">{t('radio.yourFiles')}</h2>
        <label className="radio-import key-sm"><Glyph name="plus" /><span>{t('radio.addMusic')}</span><input className="sr-only" type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac,.aac,.opus" multiple onChange={e => { radio.importTracks(Array.from(e.target.files ?? [])); e.target.value = ''; }} aria-describedby="radio-music-hint" /></label>
        <p className="radio-muted" id="radio-music-hint">{t('radio.customHint')}</p>
        <label className="radio-import key-sm"><Glyph name="plus" /><span>{t('radio.addScene')}</span><input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => { addPhoto(e.target.files?.[0]); e.target.value = ''; }} aria-describedby="radio-photo-hint" /></label>
        <p className="radio-muted" id="radio-photo-hint">{t('radio.photoHint')}</p>
        {s.custom.length > 0 && <ul className="radio-saved">{s.custom.map(track => <li key={track.id}><span>{track.title}</span><button className="radio-icon key-sm" aria-label={`${t('radio.remove')} ${track.title}`} onClick={() => radio.removeTrack(track.id)}><Glyph name="close" /></button></li>)}</ul>}
      </section>
      <section className="radio-play-settings" aria-labelledby="radio-play-settings-title">
        <h2 id="radio-play-settings-title">{t('radio.playbackOptions')}</h2>
        <label className="radio-check"><input type="checkbox" checked={s.mix.shuffle} onChange={e => radio.setMix({ shuffle: e.target.checked })} />{t('radio.shuffle')}</label>
        <label className="radio-check"><input type="checkbox" checked={s.mix.repeat} onChange={e => radio.setMix({ repeat: e.target.checked })} />{t('radio.repeat')}</label>
        <label className="radio-range"><span>{t('radio.music')}<span aria-hidden="true">{num(s.mix.music)}%</span></span><input aria-label={t('radio.music')} type="range" min="0" max="100" value={s.mix.music} onChange={e => radio.setMix({ music: Number(e.target.value) })} /></label>
        <button className="radio-text-button" onClick={() => { resetPhoto(); radio.setMix(defaultMix); radio.chooseGenre('lofi'); radio.sleepIn(0); }}>{t('radio.reset')}</button>
      </section>
    </div>
    <details className="radio-credits"><summary>{t('radio.credits')}</summary>
      <p className="radio-muted">{t('radio.creditsHint')}</p>
      <ul>{tracks.filter(v => v.credit).map(v => <li key={v.id}>
        <a href={v.credit!.source} target="_blank" rel="noreferrer">{titleOf(v)}</a> — <bdi>{v.credit!.artist}</bdi>
        {v.credit!.composer !== v.credit!.artist && <span> · {t('radio.composedBy')} <bdi>{v.credit!.composer}</bdi></span>}
        <p><a href={v.credit!.licenseUrl} target="_blank" rel="noreferrer">{v.credit!.license}</a> · {t(v.credit!.transcoded ? 'radio.transcoded' : 'radio.unmodified')}</p>
      </li>)}</ul>
    </details>
  </details>;
}
