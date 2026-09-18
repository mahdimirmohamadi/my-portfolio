// About portrait: the real photo by default; "1-bit mode" wipes a dithered layer over it,
// with a scanline riding the wipe edge. The dither image loads on first use only.
import { prefersLessMotion } from './util';

document.addEventListener('astro:page-load', () => {
  const fig = document.querySelector<HTMLElement>('[data-portrait]');
  const btn = fig?.querySelector<HTMLButtonElement>('[data-portrait-toggle]');
  const bits = fig?.querySelector<HTMLElement>('.portrait__dither');
  const scan = fig?.querySelector<HTMLElement>('.portrait__scan');
  if (!fig || !btn || !bits || !scan || btn.dataset.ready) return;
  btn.dataset.ready = '';

  btn.addEventListener('click', () => {
    const on = !fig.classList.contains('is-bits');
    if (on && !bits.style.getPropertyValue('--src')) bits.style.setProperty('--src', bits.dataset.src ?? '');
    // next frame so the clip-path transition runs from its start state
    requestAnimationFrame(() => fig.classList.toggle('is-bits', on));
    btn.setAttribute('aria-pressed', String(on));
    btn.textContent = on ? (btn.dataset.labelOn ?? '') : (btn.dataset.labelOff ?? '');
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
