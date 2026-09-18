// Chrome that survives page turns: day/night switch (circle reveal), section scroll-spy,
// idle pausing, copy-to-clipboard.
import { prefersLessMotion } from './util';

const root = document.documentElement;

function syncTheme() {
  const night = root.dataset.theme === 'dark';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(night));
    const label = btn.querySelector('[data-theme-label]');
    // the button names the state it switches to
    if (label) label.textContent = (night ? btn.dataset.day : btn.dataset.night) ?? '';
  });
}

function initTheme() {
  syncTheme();
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const night = root.dataset.theme !== 'dark';
      const apply = () => {
        if (night) root.dataset.theme = 'dark';
        else delete root.dataset.theme;
        try {
          localStorage.setItem('theme', night ? 'dark' : 'light');
        } catch {}
        syncTheme();
      };
      if (!document.startViewTransition || prefersLessMotion()) return apply();
      // origin-aware: the new light spreads out from the switch you pressed
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.dataset.themeSwitching = '';
      const vt = document.startViewTransition(apply);
      vt.ready.then(() =>
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
          { duration: 620, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
        ),
      );
      vt.finished.finally(() => delete root.dataset.themeSwitching);
    });
  });
}

// ── workspace scroll-spy (home only) ──
let spy: IntersectionObserver | undefined;
function initSpy() {
  spy?.disconnect();
  const links = [...document.querySelectorAll<HTMLAnchorElement>('a[data-ws]')].filter((a) => a.dataset.ws);
  const ids = [...new Set(links.map((a) => a.dataset.ws!))];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
  if (!sections.length) return;
  // the band is the middle of the viewport; the active workspace is the section in it
  const inBand = new Set<string>();
  spy = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) inBand.add(en.target.id);
        else inBand.delete(en.target.id);
      }
      const current = sections.map((s) => s.id).filter((id) => inBand.has(id)).pop();
      links.forEach((a) => a.classList.toggle('is-active', a.dataset.ws === current));
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => spy!.observe(s));
}

// ── idle loops pause off-screen ──
let idle: IntersectionObserver | undefined;
function initIdle() {
  idle?.disconnect();
  idle = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) en.target.removeAttribute('data-offscreen');
        else en.target.setAttribute('data-offscreen', '');
      }
    },
    { rootMargin: '80px' },
  );
  document.querySelectorAll('[data-idle]').forEach((el) => idle!.observe(el));
}

function initCopy() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const label = btn.querySelector('[data-copy-label]');
      try {
        await navigator.clipboard.writeText(btn.dataset.copy ?? '');
        if (!label) return;
        const was = label.textContent;
        label.textContent = btn.dataset.copied ?? 'Copied!';
        setTimeout(() => (label.textContent = was), 1500);
      } catch {
        location.href = `mailto:${btn.dataset.copy}`;
      }
    });
  });
}

document.addEventListener('astro:page-load', () => {
  initTheme();
  initSpy();
  initIdle();
  initCopy();
});
