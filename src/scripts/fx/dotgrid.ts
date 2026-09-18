// Hero dot grid (ReactBits-style "Dot Grid"): the page's static dot texture lights up in
// lime and gets pushed away around the cursor. Canvas, desktop only; renders only while
// the pointer moves or dots are settling, and never when the hero is off-screen.
import { prefersLessMotion, finePointer } from '../util';

const GAP = 24; // must match the body background-size
const R = 150; // influence radius

function init(canvas: HTMLCanvasElement) {
  const hero = canvas.parentElement!;
  const ctx = canvas.getContext('2d')!;
  const dpr = Math.min(2, devicePixelRatio || 1);
  let w = 0;
  let h = 0;
  let ox = 0; // canvas origin in document coords (to align with the page grid)
  let oy = 0;
  let mx = -9999;
  let my = -9999;
  let energy = 0; // 0..1, fades when the pointer leaves
  let target = 0;
  let raf = 0;
  let visible = true;
  const lime = () => getComputedStyle(document.documentElement).getPropertyValue('--lime').trim() || '#c6f432';
  let color = lime();

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    ox = r.left + scrollX;
    oy = r.top + scrollY;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    color = lime();
  };

  const frame = () => {
    raf = 0;
    energy += (target - energy) * 0.18;
    ctx.clearRect(0, 0, w, h);
    if (energy > 0.01) {
      ctx.fillStyle = color;
      // grid points near the cursor, in document space → canvas space
      const x0 = Math.floor((mx + ox - R) / GAP) * GAP;
      const y0 = Math.floor((my + oy - R) / GAP) * GAP;
      for (let gx = x0; gx <= mx + ox + R; gx += GAP) {
        for (let gy = y0; gy <= my + oy + R; gy += GAP) {
          const cx = gx - ox;
          const cy = gy - oy;
          const dx = cx - mx;
          const dy = cy - my;
          const d = Math.hypot(dx, dy);
          if (d > R) continue;
          const f = (1 - d / R) * energy;
          const push = f * 14;
          ctx.globalAlpha = Math.min(1, f * 1.4);
          ctx.beginPath();
          ctx.arc(cx + (dx / (d || 1)) * push, cy + (dy / (d || 1)) * push, 1.2 + f * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    if (visible && Math.abs(target - energy) > 0.01) raf = requestAnimationFrame(frame);
  };
  const kick = () => {
    if (!raf && visible) raf = requestAnimationFrame(frame);
  };

  hero.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
    target = 1;
    energy = Math.max(energy, 0.02);
    kick();
  });
  hero.addEventListener('pointerleave', () => {
    target = 0;
    kick();
  });
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(hero);
  new ResizeObserver(resize).observe(canvas);
  new MutationObserver(() => (color = lime())).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  resize();
}

document.addEventListener('astro:page-load', () => {
  if (!finePointer() || prefersLessMotion()) return;
  const c = document.querySelector<HTMLCanvasElement>('[data-dotgrid]');
  if (c && !c.dataset.ready) {
    c.dataset.ready = '';
    init(c);
  }
});
