// Spotlight cards + magnetic buttons (pointer-only, hover-capable devices).
import { finePointer, prefersLessMotion } from '../util';

export function initSpotlight() {
  if (!finePointer()) return;
  document.querySelectorAll<HTMLElement>('[data-spotlight]:not([data-spot-ready])').forEach((el) => {
    el.dataset.spotReady = '';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
    el.addEventListener('pointerenter', () => el.style.setProperty('--spot', '1'));
    el.addEventListener('pointerleave', () => el.style.setProperty('--spot', '0'));
  });
}

export function initMagnet() {
  if (!finePointer() || prefersLessMotion()) return;
  document.querySelectorAll<HTMLElement>('[data-magnet]:not([data-mag-ready])').forEach((el) => {
    el.dataset.magReady = '';
    const strength = 0.28;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  });
}
