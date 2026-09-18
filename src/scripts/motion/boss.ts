// Boss battles (moment #4, rare): when a boss panel scrolls into view, it takes a hit.
// Stat boss: 180ms shake, −30% number ticker, HP bar drains, SFX pops, "Defeated" stamp slams.
// Without JS / with reduced motion everything is simply shown in its final state.
import { spring, prefersLessMotion, onceInView } from './util';

function fmt(n: number) {
  return new Intl.NumberFormat(document.documentElement.lang.startsWith('fa') ? 'fa-IR' : 'en-GB').format(n);
}

function battle(boss: HTMLElement) {
  const sfx = boss.querySelector<HTMLElement>('[data-boss-sfx]');
  const stamp = boss.querySelector<HTMLElement>('[data-boss-stamp]');
  const ticker = boss.querySelector<HTMLElement>('[data-ticker]');
  const hp = boss.querySelector<HTMLElement>('[data-hp]');

  // resting "before" state, set while the panel is still off-screen
  if (sfx) sfx.style.opacity = '0';
  if (stamp) stamp.style.opacity = '0';
  if (hp) hp.style.scale = '1 1';
  if (ticker) ticker.textContent = fmt(0);

  onceInView(boss, () => {
    boss.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-3px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(-2px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 180, easing: 'linear' },
    );

    if (ticker) {
      const target = Number(ticker.dataset.ticker ?? 0);
      const start = performance.now();
      const D = 900;
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / D);
        const eased = 1 - Math.pow(1 - p, 3);
        ticker.textContent = fmt(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    if (hp) {
      hp.style.scale = '';
      hp.animate([{ scale: '1 1' }, { scale: '0 1' }], { duration: 700, delay: 120, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', fill: 'backwards' });
    }

    const land = ticker ? 700 : 120;
    if (sfx) sfx.style.opacity = '';
    sfx?.animate(
      [
        { opacity: 0, transform: 'scale(0.4)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 520, delay: land, easing: spring(), fill: 'backwards' },
    );
    if (stamp) stamp.style.opacity = '';
    stamp?.animate(
      [
        { opacity: 0, transform: 'scale(1.6)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 380, delay: land + 260, easing: spring(), fill: 'backwards' },
    );
  });
}

document.addEventListener('astro:page-load', () => {
  if (prefersLessMotion()) return;
  document.querySelectorAll<HTMLElement>('[data-boss]').forEach(battle);
});
