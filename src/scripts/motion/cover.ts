// Cover: the first-visit "ink-in" sequence (moment #1), thought-bubble typewriter (#2),
// and the "Remove the ink" photo toggle. Native WAAPI + a linear() spring: zero library bytes.
import { spring, prefersLessMotion } from './util';

const root = document.documentElement;

function introSequence() {
  if (!root.classList.contains('intro-armed')) return false;
  try {
    sessionStorage.setItem('intro-seen', '1');
  } catch {}

  const mobile = matchMedia('(max-width: 899px)').matches;
  const step = mobile ? 40 : 60;
  const dur = mobile ? 420 : 620;
  const anims: Animation[] = [];

  // panels pop in, staggered in reading order
  document.querySelectorAll<HTMLElement>('[data-intro="panel"]').forEach((p, i) => {
    anims.push(
      p.animate(
        [
          { opacity: 0, transform: 'scale(0.94)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: dur, delay: i * step, easing: spring(), fill: 'both' },
      ),
    );
  });

  // the photo "lands" (never faded: it is the LCP)
  const photo = document.querySelector<HTMLElement>('[data-intro="photo"]');
  photo?.animate([{ transform: 'scale(1.035)' }, { transform: 'none' }], { duration: dur, easing: spring() });

  // title SFX: squash & stretch
  const sfx = document.querySelector<HTMLElement>('[data-intro="sfx"]');
  sfx?.animate(
    [
      { transform: 'scale(0.6, 0)', offset: 0 },
      { transform: 'scale(0.9, 1.35)', offset: 0.45 },
      { transform: 'scale(1.08, 0.85)', offset: 0.72 },
      { transform: 'none', offset: 1 },
    ],
    { duration: 420, delay: step * 2, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' },
  );

  // speed-line flash behind the title (desktop only)
  if (!mobile) {
    document.querySelector<SVGElement>('.cover__speed')?.animate([{ opacity: 0 }, { opacity: 0.16 }, { opacity: 0 }], {
      duration: 300,
      delay: step * 2 + 120,
      easing: 'ease-out',
    });
  }

  Promise.all(anims.map((a) => a.finished)).then(() => {
    root.classList.remove('intro-armed');
    anims.forEach((a) => a.cancel());
  });

  typewriter(mobile ? 260 : 520, mobile ? 24 : 35);
  return true;
}

/** Thought bubble: "…" pulses, then the line types itself (aria text is separate + complete). */
function typewriter(delay: number, perChar: number) {
  const el = document.querySelector<HTMLElement>('[data-typewriter]');
  if (!el) return;
  const text = el.dataset.typewriter ?? '';
  el.textContent = '…';
  const dots = el.animate([{ opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }], { duration: 500, iterations: 2 });
  setTimeout(() => {
    dots.cancel();
    const chars = Array.from(text);
    let i = 0;
    el.textContent = '';
    const tick = () => {
      el.textContent = chars.slice(0, ++i).join('');
      if (i < chars.length) setTimeout(tick, perChar);
    };
    tick();
  }, delay + 500);
}

function inkToggle() {
  const btn = document.querySelector<HTMLButtonElement>('[data-ink-toggle]');
  const real = document.querySelector<HTMLImageElement>('.cover__real');
  if (!btn || !real) return;
  btn.addEventListener('click', () => {
    const show = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(show));
    btn.textContent = show ? (btn.dataset.labelRestore ?? '') : (btn.dataset.labelRemove ?? '');
    if (show && !real.src) {
      real.hidden = false;
      real.addEventListener('load', () => real.classList.add('is-shown'), { once: true });
      real.src = real.dataset.realSrc ?? '';
    } else {
      real.hidden = false;
      requestAnimationFrame(() => real.classList.toggle('is-shown', show));
    }
  });
}

document.addEventListener('astro:page-load', () => {
  if (!document.querySelector('.cover')) return;
  if (!prefersLessMotion()) introSequence();
  inkToggle();
});
