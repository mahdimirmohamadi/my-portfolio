import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Lang } from '../../../i18n/ui';
import { genres, layers, tracks, type SceneId } from '../../../lib/radio/catalog';
import * as radio from '../../../lib/radio/engine';
import { mmss } from '../../../lib/pomodoro/engine';
import FocusClock from './FocusClock';
import RadioOptions from './RadioOptions';
import Glyph from './Glyph';

export interface Scene { id: string; src: string; small: string; thumb: string; group: string; }
interface Props { lang: Lang; strings: Record<string, string>; scenes: Scene[]; nix: string; }

export default function Radio({ lang, strings, scenes, nix }: Props) {
  const s = useSyncExternalStore(radio.subscribe, radio.snapshot, radio.snapshot);
  const [quiet, setQuiet] = useState(false), [full, setFull] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null), [usingPhoto, setUsingPhoto] = useState(false);
  const [message, setMessage] = useState(''), [sceneGroup, setSceneGroup] = useState('all');
  const desk = useRef<HTMLDivElement>(null);
  const t = (key: string) => strings[key] ?? key;
  const num = (n: number) => new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en').format(n);
  const titleOf = (track: (typeof tracks)[number]) => track.genre === 'custom' ? track.title : t(`radio.track.${track.id}`);
  const track = radio.currentTrack();
  const scene = scenes.find(v => v.id === s.mix.scene) ?? scenes[0];
  const activeSounds = layers.filter(id => s.mix.layers[id] > 0);
  const soundsTitle = activeSounds.map(id => t(`radio.layer.${id}`)).join(' + ') || t('radio.pickSound');
  const list = [...tracks, ...s.custom].filter(v => v.genre === s.mix.genre);
  const musicPlaying = s.playing && s.mix.musicEnabled && s.mix.music > 0;
  useEffect(() => {
    radio.initRadio();
    const onFull = () => setFull(document.fullscreenElement === desk.current);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setQuiet(false); };
    document.addEventListener('fullscreenchange', onFull);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('fullscreenchange', onFull); document.removeEventListener('keydown', onKey); };
  }, []);
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await desk.current?.requestFullscreen(); }
    catch { setMessage(t('radio.fullscreenError')); }
  }
  function addPhoto(file?: File) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) || file.size > 12 * 1024 * 1024 || !file.size) { setMessage(t('radio.error.photo')); return; }
    const url = URL.createObjectURL(file), image = new Image();
    image.onload = () => { setPhoto(url); setUsingPhoto(true); setMessage(''); };
    image.onerror = () => { URL.revokeObjectURL(url); setMessage(t('radio.error.photo')); };
    image.src = url;
  }
  const range = (label: string, value: number, action: (n: number) => void) => <label className="radio-range"><span>{label}<span aria-hidden="true">{num(value)}%</span></span><input aria-label={label} type="range" min="0" max="100" step="1" value={value} onChange={e => action(Number(e.target.value))} /></label>;
  const iconKey = (name: Parameters<typeof Glyph>[0]['name'], label: string, action: () => void, pressed?: boolean) => <button className="radio-icon key-sm" type="button" aria-label={label} title={label} aria-pressed={pressed} onClick={action}><Glyph name={name} /></button>;
  return <div className={`radio-desk${quiet ? ' is-quiet' : ''}`} ref={desk} data-playing={s.playing} data-music-playing={musicPlaying}>
    <div className="radio-mode">
      <div role="group" aria-label={t('radio.listenMode')}>
        <button className="key-sm" aria-pressed={s.mix.musicEnabled} onClick={() => radio.setMusicEnabled(true)}>{t('radio.musicMode')}</button>
        <button className="key-sm" aria-pressed={!s.mix.musicEnabled} onClick={() => radio.setMusicEnabled(false)}>{t('radio.soundsOnly')}</button>
      </div>
      <div className="radio-quick" role="group" aria-label={t('radio.quickSounds')}>
        {(['rain', 'fire', 'waves'] as const).map(id => <button key={id} className="key-sm" aria-pressed={!s.mix.musicEnabled && activeSounds.length === 1 && activeSounds[0] === id} onClick={() => radio.playSoundOnly(id)}><Glyph name={id} />{t(`radio.only.${id}`)}</button>)}
      </div>
    </div>
    <div className="radio-deck">
      <div className="radio-scene">
        <img className="radio-scene__image" src={usingPhoto && photo ? photo : scene.src} srcSet={usingPhoto && photo ? undefined : `${scene.small} 720w, ${scene.src} 1440w`} sizes="(min-width: 1000px) 1100px, 100vw" width="1440" height="960" alt={usingPhoto ? t('radio.scene.custom') : t(`radio.scene.${scene.id}.alt`)} fetchPriority="high" />
        <div className="radio-scene__tools">
          <span className="radio-scene__name">{usingPhoto ? t('radio.scene.custom') : t(`radio.scene.${scene.id}`)}</span>
          {iconKey('eye', quiet ? t('radio.focusExit') : t('radio.focus'), () => setQuiet(!quiet), quiet)}
          {iconKey('expand', full ? t('radio.fullscreenExit') : t('radio.fullscreen'), () => void fullscreen())}
        </div>
        <div className="radio-nix on-glass"><img src={nix} width="140" height="175" alt={t('radio.nix')} /></div>
      </div>
      <div className="radio-transport">
        <div className="radio-now">
          <p className="radio-now__status"><i className={`radio-led${s.playing ? ' is-lit' : ''}`} aria-hidden="true" />{s.loading ? t('radio.loading') : s.playing ? t('radio.live') : t('radio.ready')}</p>
          <h2>{s.mix.musicEnabled ? titleOf(track) : soundsTitle}</h2>
          <p className="radio-track-meta">{s.mix.musicEnabled ? <>{t(`radio.genre.${s.mix.genre}`)}{track.credit && <> · <bdi>{track.credit.artist}</bdi></>}</> : t('radio.noMusic')}</p>
        </div>
        <div className="radio-transport__keys">
          {s.mix.musicEnabled && iconKey('previous', t('radio.previous'), radio.previous)}
          <button className="btn radio-play" onClick={radio.toggleRadio} aria-label={s.playing ? t('radio.pause') : t('radio.play')}><Glyph name={s.playing ? 'pause' : 'play'} /><span>{t(s.playing ? 'radio.pauseShort' : 'radio.playShort')}</span></button>
          {s.mix.musicEnabled && iconKey('next', t('radio.next'), radio.next)}
        </div>
        <div className="radio-master">{range(t('radio.master'), s.mix.master, master => radio.setMix({ master }))}</div>
        {s.mix.musicEnabled && <label className="radio-seek"><span className="sr-only">{t('radio.seek')}</span><span dir="ltr">{mmss(s.position * 1000, lang)}</span><input aria-label={t('radio.seek')} type="range" min="0" max={s.duration || 1} step="0.1" value={Math.min(s.position, s.duration || 1)} disabled={!s.duration} onChange={e => radio.seek(Number(e.target.value))} /><span dir="ltr">{mmss(s.duration * 1000, lang)}</span></label>}
      </div>
    </div>
    {(s.error || message) && <div className="radio-message" role={s.error ? 'alert' : 'status'}><p>{s.error ? t(`radio.error.${s.error}`) : message}</p>{iconKey('close', t('radio.dismiss'), () => { radio.dismissError(); setMessage(''); })}</div>}
    <div className="radio-controls">
      {s.mix.musicEnabled && <div className="radio-music-picker">
        <label className="radio-field"><span>{t('radio.station')}</span><select aria-label={t('radio.station')} value={s.mix.genre} onChange={e => radio.chooseGenre(e.target.value as typeof s.mix.genre)}>{genres.filter(g => g !== 'custom' || s.custom.length).map(g => <option key={g} value={g}>{t(`radio.genre.${g}`)}</option>)}</select></label>
        <label className="radio-field"><span>{t('radio.track')} <span className="radio-muted">({num(list.length)})</span></span><select aria-label={t('radio.track')} value={s.trackId} onChange={e => radio.chooseTrack(e.target.value)}>{list.map(v => <option key={v.id} value={v.id}>{titleOf(v)}</option>)}</select></label>
      </div>}
      <section className="radio-sounds" aria-labelledby="radio-sounds-title">
        <div className="radio-section-head"><h2 id="radio-sounds-title">{t('radio.sounds')}</h2><button className="radio-text-button" disabled={!activeSounds.length} onClick={() => radio.setMix({ layers: { rain: 0, fire: 0, waves: 0, wind: 0, birds: 0, vinyl: 0 } })}>{t('radio.clearSounds')}</button></div>
        <p className="radio-muted">{t(s.mix.musicEnabled ? 'radio.layerHint' : 'radio.soundHint')}</p>
        <div className="radio-sound-list">{layers.map(id => <div key={id} className="radio-sound">
          <button className="radio-sound-key" aria-pressed={s.mix.layers[id] > 0} onClick={() => radio.toggleSound(id)}><Glyph name={id} /><span>{t(`radio.layer.${id}`)}</span><i className={`radio-led${s.mix.layers[id] ? ' is-lit' : ''}`} aria-hidden="true" /></button>
          {s.mix.layers[id] > 0 && range(t('radio.soundVolume').replace('{name}', t(`radio.layer.${id}`)), s.mix.layers[id], value => radio.setLayer(id, value))}
        </div>)}</div>
      </section>
      <section className="radio-scenes" aria-labelledby="radio-scenes-title">
        <div className="radio-section-head"><h2 id="radio-scenes-title">{t('radio.sceneHeading')}</h2>
          <label className="radio-scene-filter"><span className="sr-only">{t('radio.sceneFilter')}</span><select aria-label={t('radio.sceneFilter')} value={sceneGroup} onChange={e => setSceneGroup(e.target.value)}>{['all', 'anime', 'aura', 'cozy'].map(g => <option key={g} value={g}>{t(`radio.sceneGroup.${g}`)}</option>)}</select></label>
        </div>
        <div className="radio-scene-choices" role="group" aria-label={t('radio.scenes')}>
          {scenes.filter(v => sceneGroup === 'all' || v.group === sceneGroup).map(v => <button key={v.id} aria-pressed={!usingPhoto && s.mix.scene === v.id} onClick={() => { setUsingPhoto(false); radio.setMix({ scene: v.id as SceneId }); }}><img src={v.thumb} width="240" height="160" alt="" loading="lazy" /><span>{t(`radio.scene.${v.id}`)}</span></button>)}
          {photo && <button aria-pressed={usingPhoto} onClick={() => setUsingPhoto(true)}><img src={photo} width="240" height="160" alt="" /><span>{t('radio.scene.custom')}</span></button>}
        </div>
      </section>
      <div className="radio-secondary"><button className="key-sm" aria-expanded={s.mix.showTimer} aria-controls="radio-focus-panel" onClick={() => radio.setMix({ showTimer: !s.mix.showTimer })}>{t(s.mix.showTimer ? 'radio.timerHide' : 'radio.timerShow')}</button></div>
      <div id="radio-focus-panel" hidden={!s.mix.showTimer}>{s.mix.showTimer && <FocusClock lang={lang} t={t} />}</div>
      <RadioOptions s={s} lang={lang} t={t} titleOf={titleOf} setMessage={setMessage} addPhoto={addPhoto} resetPhoto={() => setUsingPhoto(false)} />
    </div>
    <p className="radio-foot">{t('radio.private')}</p>
  </div>;
}
