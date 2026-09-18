// Number ticker: counts up to data-count when first in view (tabular numbers, no layout shift).
import { prefersLessMotion, onceInView, fmt } from '../util';

export function initCountUp() {
  document.querySelectorAll<HTMLElement>('[data-count]:not([data-counted])').forEach((el) => {
    el.dataset.counted = '';
    const target = Number(el.dataset.count);
    if (prefersLessMotion()) return;
    el.textContent = fmt(0);
    onceInView(el, () => {
      const start = performance.now();
      const D = 1100;
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / D);
        el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  });
}
