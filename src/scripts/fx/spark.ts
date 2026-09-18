// Click sparks on buttons (the cartoon bit): 8 short lines burst from the press point.
import { prefersLessMotion, spring } from '../util';

document.addEventListener('pointerdown', (e) => {
  const target = (e.target as HTMLElement).closest('.btn, [data-spark]');
  if (!target || prefersLessMotion()) return;
  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:0;height:0;pointer-events:none;z-index:90`;
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('span');
    const angle = (i / 8) * 360 + 22.5;
    s.style.cssText = `position:absolute;left:-1.5px;top:0;width:3px;height:10px;border-radius:2px;background:var(--lime);transform-origin:50% 0`;
    layer.append(s);
    s.animate(
      [
        { transform: `rotate(${angle}deg) translateY(6px) scaleY(1)`, opacity: 1 },
        { transform: `rotate(${angle}deg) translateY(22px) scaleY(0.2)`, opacity: 0 },
      ],
      { duration: 420, easing: spring() },
    );
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 460);
});
