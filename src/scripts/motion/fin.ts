// Moment #10 (rare): finishing a side chapter slams a FIN / پایان stamp, then Simo pops in
// from the inline-end corner offering the next chapter. Static and fully visible without JS.
import { spring, prefersLessMotion, onceInView } from './util';

document.addEventListener('astro:page-load', () => {
  const fin = document.querySelector<HTMLElement>('[data-fin]');
  if (!fin || prefersLessMotion()) return;
  const stamp = fin.querySelector<HTMLElement>('[data-fin-stamp]');
  const next = fin.querySelector<HTMLElement>('[data-fin-next]');
  if (stamp) stamp.style.opacity = '0';
  if (next) next.style.opacity = '0';

  onceInView(
    fin,
    () => {
      if (stamp) {
        stamp.style.opacity = '';
        stamp.animate(
          [
            { opacity: 0, transform: 'scale(1.6) rotate(-4deg)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 320, easing: spring(), fill: 'backwards' },
        );
      }
      if (next) {
        const dir = document.documentElement.dir === 'rtl' ? -1 : 1;
        next.style.opacity = '';
        next.animate(
          [
            { opacity: 0, transform: `translate(${40 * dir}px, 24px) scale(0.9)` },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 520, delay: 280, easing: spring(), fill: 'backwards' },
        );
      }
    },
    0.6,
  );
});
