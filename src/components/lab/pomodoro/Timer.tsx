import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { start, pause, resume, stop, skip, dismissReward, setCategory, setTopic, leftOf, mmss } from '../../../lib/pomodoro/engine';
import { drawReward } from '../../../lib/pomodoro/data';
import { startOfDay } from '../../../lib/pomodoro/calendar';
import type { Data } from '../../../lib/pomodoro/store';
import { useI18n, useNow } from './ctx';

export interface Img {
  id: string;
  src: string;
  w: number;
  h: number;
}
export type Poses = Record<'desk' | 'type' | 'think' | 'tea' | 'sleep' | 'thumbs', { src: string; w: number; h: number }>;

const AUTO_REWARD_MS = 20_000;

export default function Timer({ d, images, poses }: { d: Data; images: Img[]; poses: Poses }) {
  const { t, lang, catName } = useI18n();
  const timer = d.timer;
  const running = timer.status === 'running';
  const now = useNow(running || !!d.reward);
  const left = leftOf(timer, now);

  // the reward: shown after a finished focus, until the break starts (or, with auto-start,
  // for 20 seconds or until tapped)
  const autoReward = !!d.reward && timer.status === 'running';
  const rewardOn = !!d.reward && timer.phase !== 'focus' && images.length > 0 && !(autoReward && now - d.reward.at > AUTO_REWARD_MS);
  useEffect(() => {
    if (d.reward && !d.reward.image) drawReward(images.map((i) => i.id));
  }, [d.reward, images]);
  useEffect(() => {
    if (d.reward && autoReward && now - d.reward.at > AUTO_REWARD_MS) dismissReward();
  }, [d.reward, autoReward, now]);
  const img = rewardOn ? images.find((i) => i.id === d.reward!.image) : undefined;

  const pose: keyof Poses = rewardOn
    ? 'thumbs'
    : timer.status === 'paused'
      ? 'think'
      : timer.phase === 'focus'
        ? running
          ? 'type'
          : 'desk'
        : timer.phase === 'short'
          ? 'tea'
          : 'sleep';

  // Nix lives in the page header (rendered by Astro); the island takes the spot over
  const [spot, setSpot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.getElementById('pomo-nix-spot');
    if (el) {
      el.replaceChildren();
      setSpot(el);
    }
  }, []);

  const phaseName = t(`pomo.phase.${timer.phase}`);
  const active = timer.status !== 'idle';
  const progress = timer.duration ? 1 - left / timer.duration : 0;

  const todays = useMemo(() => {
    const from = startOfDay(now);
    return d.sessions.filter((s) => s.status === 'done' && s.end >= from).sort((a, b) => a.end - b.end);
  }, [d.sessions, Math.floor(now / 60_000)]);

  const topics = useMemo(() => {
    const seen = new Set<string>();
    for (let i = d.sessions.length - 1; i >= 0 && seen.size < 40; i--) {
      const topic = d.sessions[i].topic.trim();
      if (topic) seen.add(topic);
    }
    return [...seen];
  }, [d.sessions]);


  let primary: { label: string; run: () => void };
  if (running) primary = { label: t('pomo.pause'), run: pause };
  else if (timer.status === 'paused') primary = { label: t('pomo.resume'), run: resume };
  else primary = { label: timer.phase === 'focus' ? t('pomo.start') : t('pomo.startBreak'), run: start };

  return (
    <section className="pomo-device" aria-labelledby="pomo-clock-label">
      {spot &&
        createPortal(
          <span className="pomo-nix" aria-hidden="true">
            {(Object.keys(poses) as (keyof Poses)[]).map((k) => (
              <img key={k} src={poses[k].src} width={poses[k].w} height={poses[k].h} alt="" className={k === pose ? 'is-on' : undefined} decoding="async" />
            ))}
          </span>,
          spot,
        )}

      <div className={`pomo-screen screen${rewardOn ? ' is-reward' : ''}`} data-phase={timer.phase} data-status={timer.status}>
        <div className="pomo-screen__bar">
          <span id="pomo-clock-label" className="pomo-screen__phase">
            <span className={`pomo-led${running ? ' is-lit' : ''}`} aria-hidden="true" />
            {phaseName}
            {timer.status === 'paused' && <span className="pomo-screen__dim"> · {t('pomo.paused')}</span>}
          </span>
        </div>

        {img ? (
          <button
            type="button"
            className="pomo-reward"
            onClick={autoReward ? dismissReward : undefined}
            tabIndex={autoReward ? 0 : -1}
            aria-label={autoReward ? t('pomo.rewardBack') : t('pomo.reward')}
          >
            <img src={img.src} width={img.w} height={img.h} alt={t('pomo.reward')} />
            {autoReward && <span className="pomo-reward__time">{mmss(left, lang)}</span>}
          </button>
        ) : (
          <div className="pomo-clock" role="timer" aria-live="off">
            {mmss(left, lang)}
          </div>
        )}

        <span className="pomo-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }} />
        </span>

        {/* today, as lit dots on the glass: one per finished pomodoro, the goal's slots unlit */}
        <div className="pomo-day-dots">
          <ol role="list" aria-label={t('pomo.todayGoal', { n: todays.length, m: d.settings.goal })}>
            {Array.from({ length: Math.max(d.settings.goal, todays.length) }, (_, i) => {
              const s = todays[i];
              if (!s) return <li key={`slot-${i}`} className={i === todays.length && timer.phase === 'focus' && active ? 'is-now' : undefined} aria-hidden="true" />;
              const c = d.categories.find((c) => c.id === s.category);
              const when = new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-GB', { hour: '2-digit', minute: '2-digit' }).format(s.end);
              const label = [when, catName(c), s.topic].filter(Boolean).join(' · ');
              return <li key={s.id} className="is-done" title={label} aria-label={label} />;
            })}
          </ol>
          <span className="pomo-screen__dim" aria-hidden="true">
            {t('pomo.todayGoal', { n: todays.length, m: d.settings.goal })}
          </span>
        </div>
        {img && !autoReward && <p className="sr-only" aria-live="polite">{t('pomo.reward')}</p>}
      </div>

      {/* what this pomodoro is for: one line */}
      <div className="pomo-what">
        <select value={timer.category ?? ''} onChange={(e) => setCategory(e.target.value || null)} aria-label={t('pomo.category')}>
          {d.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {catName(c)}
            </option>
          ))}
        </select>
        <input type="text" list="pomo-topics" value={timer.topic} maxLength={120} placeholder={t('pomo.topicPh')} aria-label={t('pomo.topic')} onChange={(e) => setTopic(e.target.value)} />
        <datalist id="pomo-topics">
          {topics.map((tp) => (
            <option key={tp} value={tp} />
          ))}
        </datalist>
      </div>

      <div className="pomo-keys">
        <button type="button" className="btn pomo-key-main" onClick={primary.run}>
          {primary.label}
        </button>
        {timer.phase === 'focus' && active && (
          <button type="button" className="btn btn--ghost" onClick={stop}>
            {t('pomo.stop')}
          </button>
        )}
        {timer.phase !== 'focus' && (
          <button type="button" className="btn btn--ghost" onClick={skip}>
            {t('pomo.skip')}
          </button>
        )}
      </div>

      {timer.phase === 'focus' && active && <p className="pomo-warn">{t('pomo.closeWarn')}</p>}
    </section>
  );
}
