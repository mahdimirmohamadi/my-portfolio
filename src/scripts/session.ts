// ~/ai: the agent session streams in line by line when it first scrolls into view
// (prompt characters type out like tokens). Replay button re-runs it.
import { prefersLessMotion, onceInView } from './util';

function play(lines: HTMLElement[]) {
  lines.forEach((l) => (l.style.opacity = '0'));
  let t = 0;
  lines.forEach((l, i) => {
    const kind = [...l.classList].find((c) => c.startsWith('sl--'))!;
    const text = l.querySelector<HTMLElement>('.sl__text')!;
    const full = text.dataset.full ?? (text.dataset.full = text.textContent ?? '');
    t += kind === 'sl--step' ? 420 : kind === 'sl--prompt' ? 150 : 170;
    setTimeout(() => {
      l.style.opacity = '';
      l.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 180, easing: 'ease-out' });
      if (kind === 'sl--prompt') {
        // stream the prompt like tokens
        text.textContent = '';
        let n = 0;
        const words = full.split(/(\s+)/);
        const step = () => {
          text.textContent = words.slice(0, ++n).join('');
          if (n < words.length) setTimeout(step, 55);
        };
        step();
      }
    }, t);
    if (kind === 'sl--prompt') t += full.split(/\s+/).length * 55 * 2;
    if (i === 0) t += 200;
  });
}

document.addEventListener('astro:page-load', () => {
  const win = document.querySelector<HTMLElement>('[data-session]');
  if (!win || win.dataset.ready) return;
  win.dataset.ready = '';
  const lines = [...win.querySelectorAll<HTMLElement>('[data-line]')];
  const replay = win.querySelector<HTMLButtonElement>('[data-session-replay]');
  if (prefersLessMotion()) {
    replay?.remove();
    return;
  }
  lines.forEach((l) => (l.style.opacity = '0'));
  onceInView(win, () => play(lines), 0.4);
  replay?.addEventListener('click', () => play(lines));
});
