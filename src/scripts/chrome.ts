// Desktop-session chrome that survives page turns: theme toggle (circle reveal),
// Tehran clock + CPU sparkline, workspace scroll-spy, Nix's eyes, idle pausing, copy.
import { prefersLessMotion, finePointer } from './util';

const root = document.documentElement;

function initTheme() {
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    const sync = () => btn.setAttribute('aria-pressed', String(root.dataset.theme === 'light'));
    sync();
    btn.addEventListener('click', () => {
      const light = root.dataset.theme !== 'light';
      const apply = () => {
        if (light) root.dataset.theme = 'light';
        else delete root.dataset.theme;
        try {
          localStorage.setItem('theme', light ? 'light' : 'dark');
        } catch {}
        sync();
      };
      if (!document.startViewTransition || prefersLessMotion()) return apply();
      // origin-aware: the new theme grows out of the button
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.dataset.themeSwitching = '';
      const vt = document.startViewTransition(apply);
      vt.ready.then(() =>
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
          { duration: 560, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', pseudoElement: '::view-transition-new(root)' },
        ),
      );
      vt.finished.finally(() => delete root.dataset.themeSwitching);
    });
  });
}

// ── tray: Tehran clock + a decorative CPU sparkline ──
let trayTimer: number | undefined;
function initTray() {
  clearInterval(trayTimer);
  const clock = document.querySelector<HTMLElement>('[data-clock]');
  const cpu = document.querySelector<SVGPolylineElement>('[data-cpu] polyline');
  const tf = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran' });
  const pts = Array.from({ length: 16 }, () => 8 + Math.random() * 8);
  const draw = () => cpu?.setAttribute('points', pts.map((v, i) => `${(i * 60) / 15},${20 - v}`).join(' '));
  const tick = () => {
    if (clock) clock.textContent = `TEH ${tf.format(new Date())}`;
    if (!document.hidden && !prefersLessMotion()) {
      pts.shift();
      const prev = pts[pts.length - 1];
      pts.push(Math.max(2, Math.min(18, prev + (Math.random() - 0.5) * 7)));
    }
    draw();
  };
  tick();
  trayTimer = window.setInterval(tick, 1200);
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

// ── Nix's eyes follow the pointer ──
let eyesBound = false;
function initEyes() {
  if (eyesBound || !finePointer() || prefersLessMotion()) return;
  eyesBound = true;
  let raf = 0;
  let px = 0;
  let py = 0;
  window.addEventListener(
    'pointermove',
    (e) => {
      px = e.clientX;
      py = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        document.querySelectorAll<SVGGElement>('[data-nix-eyes] .eyes').forEach((g) => {
          const svg = g.ownerSVGElement;
          if (!svg) return;
          const r = svg.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) return;
          const dx = px - (r.left + r.width / 2);
          const dy = py - (r.top + r.height / 2);
          const d = Math.hypot(dx, dy) || 1;
          const k = Math.min(1, d / 300) * 4;
          g.style.translate = `${((dx / d) * k).toFixed(2)}px ${((dy / d) * k).toFixed(2)}px`;
        });
      });
    },
    { passive: true },
  );
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
  initTray();
  initSpy();
  initEyes();
  initIdle();
  initCopy();
});
