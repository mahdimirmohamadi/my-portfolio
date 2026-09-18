// Page chrome that must survive ClientRouter page turns: edition toggle, contents
// sheet (swipe to dismiss), off-screen pausing of idle loops, language "edition flip",
// copy-to-clipboard. Everything is (re)bound on astro:page-load.

const root = document.documentElement;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function initEdition() {
  document.querySelectorAll<HTMLButtonElement>('[data-edition-toggle]').forEach((btn) => {
    const sync = () => btn.setAttribute('aria-pressed', String(root.dataset.edition === 'night'));
    sync();
    btn.addEventListener('click', () => {
      const night = root.dataset.edition !== 'night';
      if (night) root.dataset.edition = 'night';
      else delete root.dataset.edition;
      try {
        localStorage.setItem('edition', night ? 'night' : 'day');
      } catch {}
      sync();
    });
  });
}

function initSheet() {
  const sheet = document.querySelector<HTMLDialogElement>('#contents-sheet');
  if (!sheet) return;
  const close = () => {
    sheet.style.removeProperty('--sheet-y');
    sheet.close();
  };
  document.querySelectorAll('[data-sheet-open]').forEach((b) => b.addEventListener('click', () => sheet.showModal()));
  sheet.querySelectorAll('[data-sheet-close], [data-sheet-link]').forEach((b) => b.addEventListener('click', close));
  // click on the backdrop (outside the sheet box) closes
  sheet.addEventListener('click', (e) => {
    if (e.target !== sheet) return;
    const r = sheet.getBoundingClientRect();
    const { clientX: x, clientY: y } = e as MouseEvent;
    if (y < r.top || y > r.bottom || x < r.left || x > r.right) close();
  });

  // swipe to dismiss: drag the grip/header down; dismiss on distance or flick velocity
  const handles = sheet.querySelectorAll<HTMLElement>('[data-sheet-grip], .sheet__head');
  let startY = 0;
  let startT = 0;
  let dy = 0;
  let dragging = false;
  handles.forEach((h) => {
    h.addEventListener('pointerdown', (e) => {
      if ((e.target as HTMLElement).closest('button')) return;
      dragging = true;
      startY = e.clientY;
      startT = performance.now();
      dy = 0;
      sheet.classList.add('is-dragging');
      h.setPointerCapture(e.pointerId);
    });
    h.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const raw = e.clientY - startY;
      // rubber-band when dragging up past the top
      dy = raw < 0 ? -Math.sqrt(-raw) * 2 : raw;
      sheet.style.setProperty('--sheet-y', `${dy}px`);
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      sheet.classList.remove('is-dragging');
      const velocity = dy / Math.max(1, performance.now() - startT);
      if (dy > 110 || velocity > 0.11) close();
      else sheet.style.setProperty('--sheet-y', '0px');
    };
    h.addEventListener('pointerup', end);
    h.addEventListener('pointercancel', end);
  });
}

// idle loops (Simo floating, wings) pause when off-screen: no wasted frames
let idleObserver: IntersectionObserver | undefined;
function initOffscreen() {
  idleObserver?.disconnect();
  idleObserver = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) en.target.removeAttribute('data-offscreen');
        else en.target.setAttribute('data-offscreen', '');
      }
    },
    { rootMargin: '80px' },
  );
  document.querySelectorAll('[data-idle]').forEach((el) => idleObserver!.observe(el));
}

// language switch plays a page-flip view transition (rare moment #9)
let flipping = false;
function initLangFlip() {
  document.querySelectorAll('[data-lang-flip]').forEach((a) =>
    a.addEventListener('click', () => {
      flipping = !reduced() && !('lite' in root.dataset);
    }),
  );
}
document.addEventListener('astro:after-swap', () => {
  if (flipping) {
    root.dataset.flip = '';
    flipping = false;
    setTimeout(() => delete root.dataset.flip, 600);
  }
});

function initCopy() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy ?? '';
      const label = btn.querySelector('[data-copy-label]');
      try {
        await navigator.clipboard.writeText(text);
        if (label) {
          const was = label.textContent;
          label.textContent = btn.dataset.copied ?? 'Copied!';
          btn.classList.add('is-copied');
          setTimeout(() => {
            label.textContent = was;
            btn.classList.remove('is-copied');
          }, 1600);
        }
      } catch {
        location.href = `mailto:${text}`;
      }
    });
  });
}

document.addEventListener('astro:page-load', () => {
  initEdition();
  initSheet();
  initOffscreen();
  initLangFlip();
  initCopy();
});
