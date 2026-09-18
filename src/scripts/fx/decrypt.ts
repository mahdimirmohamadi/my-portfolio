// "Decrypted text": characters scramble, then resolve left→right. Runs once per element,
// when it first scrolls into view. Zero layout shift: the real text keeps its place
// (transparent, still read by screen readers) and the scramble is drawn in an overlay.
import { prefersLessMotion, onceInView } from '../util';

const LATIN = '!<>-_\\/[]{}=+*^?#01ABCDEFXYZ$%&';
const PERSIAN = 'ابپتثجچحخدسشصطعغفقکگلمنوهی';

export function decrypt(el: HTMLElement, { speed = 32, max = 950 } = {}) {
  const text = el.textContent ?? '';
  if (!text.trim()) return;
  const pool = /[؀-ۿ]/.test(text) ? PERSIAN : LATIN;

  const overlay = document.createElement('span');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.style.cssText = `position:absolute;inset:0;pointer-events:none;color:${getComputedStyle(el).color}`;
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  const realColor = el.style.color;
  // the real text stays in the flow (same layout), just invisible while scrambling
  el.style.color = 'transparent';
  el.append(overlay);

  const chars = Array.from(text);
  const step = Math.min(speed, max / chars.length);
  const start = performance.now();
  let last = 0;
  const done = () => {
    overlay.remove();
    el.style.color = realColor;
  };
  const tick = (now: number) => {
    const elapsed = now - start;
    if (now - last > 40) {
      last = now;
      const settled = Math.floor(elapsed / step);
      overlay.textContent = chars
        .map((c, i) => (i < settled || c === ' ' || c === '‌' ? c : pool[(Math.random() * pool.length) | 0]))
        .join('');
    }
    if (elapsed < step * chars.length) requestAnimationFrame(tick);
    else done();
  };
  requestAnimationFrame(tick);
}

export function initDecrypt(root: ParentNode = document) {
  if (prefersLessMotion()) return;
  root.querySelectorAll<HTMLElement>('[data-decrypt]:not([data-decrypted])').forEach((el) => {
    el.dataset.decrypted = '';
    onceInView(el, () => decrypt(el), 0.6);
  });
}
