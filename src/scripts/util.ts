// Shared helpers for the effects.

/** Reduced motion OR a low-end / save-data device (html[data-lite]). */
export const prefersLessMotion = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches || 'lite' in document.documentElement.dataset;

export const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

/** The --ease-spring token (linear() with overshoot), read from CSS so JS and CSS agree. */
let cached = '';
export function spring() {
  if (!cached) cached = getComputedStyle(document.documentElement).getPropertyValue('--ease-spring').trim() || 'cubic-bezier(0.23, 1, 0.32, 1)';
  return cached;
}

/** Runs `fn` once when `el` scrolls into view. */
export function onceInView(el: Element, fn: () => void, threshold = 0.35) {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        fn();
      }
    },
    { threshold },
  );
  io.observe(el);
  return () => io.disconnect();
}

export const isFa = () => document.documentElement.lang.startsWith('fa');
export const fmt = (n: number) => new Intl.NumberFormat(isFa() ? 'fa-IR' : 'en').format(n);
