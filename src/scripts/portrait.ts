// whoami portrait: 1-bit dither ⇄ colour photo, with a scanline riding the wipe.
import { prefersLessMotion } from './util';

document.addEventListener('astro:page-load', () => {
  const fig = document.querySelector<HTMLElement>('[data-portrait]');
  const btn = fig?.querySelector<HTMLButtonElement>('[data-portrait-toggle]');
  const img = fig?.querySelector<HTMLImageElement>('.portrait__real');
  const scan = fig?.querySelector<HTMLElement>('.portrait__scan');
  if (!fig || !btn || !img || !scan || btn.dataset.ready) return;
  btn.dataset.ready = '';

  btn.addEventListener('click', async () => {
    const on = !fig.classList.contains('is-color');
    if (on && !img.getAttribute('src')) {
      img.src = img.dataset.src ?? '';
      img.hidden = false;
      await img.decode().catch(() => {});
    }
    img.hidden = false;
    // next frame so the clip-path transition runs from its start state
    requestAnimationFrame(() => fig.classList.toggle('is-color', on));
    btn.setAttribute('aria-pressed', String(on));
    btn.textContent = on ? (btn.dataset.labelDither ?? '') : (btn.dataset.labelColor ?? '');
    if (prefersLessMotion()) return;
    const h = fig.clientHeight;
    scan.animate(
      [
        { translate: `0 ${on ? 0 : h}px`, opacity: 1 },
        { translate: `0 ${on ? h : 0}px`, opacity: 1 },
      ],
      { duration: 700, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' },
    );
  });
});
