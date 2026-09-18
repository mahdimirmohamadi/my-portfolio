// A tiny, real shell for the hero terminal. Commands are data-driven from the page
// (projects, posts, links), output is plain DOM (links are real <a>s), and it keeps
// history (↑/↓), Tab completion and Ctrl+L. ~4KB, no dependencies.
import { prefersLessMotion } from './util';

type Data = {
  lang: string;
  home: string;
  blog: string;
  other: string;
  email: string;
  links: { id: string; label: string; href: string; handle: string }[];
  resume: { en: string; fa: string };
  facts: [string, string][];
  projects: { slug: string; title: string; href: string; url?: string }[];
  posts: { title: string; href: string }[];
  skills: [string, string][];
  ai: { tools: string[]; built: string[] };
};

const NIX = [' ▄▄▄▄▄▄▄ ', '█ ▪   ▪ █', '█  ◡◡   █', ' ▀▀▀▀▀▀▀ ', '  ▘   ▝  '];

function init(root: HTMLElement) {
  const log = root.querySelector<HTMLElement>('[data-term-log]')!;
  const form = root.querySelector<HTMLFormElement>('[data-term-form]')!;
  const input = root.querySelector<HTMLInputElement>('[data-term-input]')!;
  const screen = root.querySelector<HTMLElement>('[data-term-screen]')!;
  const data: Data = JSON.parse(root.closest('.term-wrap')!.querySelector('[data-term-data]')!.textContent!);
  const history: string[] = [];
  let hIndex = 0;
  let busy = false;

  const line = (html: string, cls = 't-out') => {
    const p = document.createElement('p');
    p.className = cls;
    p.innerHTML = html;
    log.append(p);
    log.scrollTop = log.scrollHeight;
    return p;
  };
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const a = (href: string, text: string, ext = false) =>
    `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(text)}</a>`;
  const b = (s: string, c = 'lime') => `<b class="t-${c}">${esc(s)}</b>`;
  const pad = (s: string, n: number) => s + ' '.repeat(Math.max(1, n - s.length));

  const commands: Record<string, { help?: string; run: (args: string[]) => unknown }> = {
    help: {
      help: 'list commands',
      run: () => {
        line(b('available commands'));
        for (const [name, c] of Object.entries(commands)) if (c.help) line(`  ${b(pad(name, 12), 'amber')}${esc(c.help)}`);
        line('tip: ↑/↓ history · tab completes · ctrl+l clears', 't-dim');
      },
    },
    whoami: { help: 'who is this', run: () => line('mahdi — front-end engineer @ Armani English & InnoLearn, Tehran') },
    neofetch: {
      help: 'system info',
      run: () => {
        const rows = [`${b('mahdi')}@${b('workstation')}`, '-----------------', ...data.facts.map(([k, v]) => `${b(k, 'amber')}: ${esc(v)}`)];
        const n = Math.max(rows.length, NIX.length);
        for (let i = 0; i < n; i++) line(`<span class="t-lime">${esc(NIX[i] ?? '         ')}</span>   ${rows[i] ?? ''}`);
      },
    },
    ls: {
      help: 'list ~/projects',
      run: () => {
        line(data.projects.map((p) => a(p.href, `${p.slug}/`)).join('  '));
        line(`try ${b('open ' + (data.projects[0]?.slug ?? ''), 'amber')}`, 't-dim');
      },
    },
    projects: { run: (args) => commands.ls.run(args) },
    open: {
      help: 'open <project>',
      run: ([slug]) => {
        const p = data.projects.find((x) => x.slug === slug);
        if (!p) return void line(`open: ${esc(slug ?? '')}: no such project. try ${b('ls', 'amber')}`, 't-coral');
        line(`opening ${a(p.href, p.title)} …`);
        setTimeout(() => (location.href = p.href), 450);
      },
    },
    cd: {
      help: 'cd <work|ai|projects|skills|blog|contact>',
      run: ([dir = '~']) => {
        const id = dir.replace(/^~\/?/, '').replace(/\/$/, '') || 'top';
        if (id === 'blog') return void (location.href = data.blog);
        const el = document.getElementById(id);
        if (!el) return void line(`cd: no such directory: ${esc(dir)}`, 't-coral');
        el.scrollIntoView({ behavior: prefersLessMotion() ? 'auto' : 'smooth' });
      },
    },
    skills: {
      help: 'what’s running (htop-lite)',
      run: () => data.skills.forEach(([cmd, tools]) => line(`${b(pad(cmd, 15), 'amber')}${esc(tools)}`)),
    },
    ai: {
      help: 'how I use AI',
      run: () => {
        line(`${b('copilots')}   ${esc(data.ai.tools.join(' · '))}`);
        data.ai.built.forEach((x) => line(`${b('shipped', 'amber')}    ${esc(x)}`));
        line('I plan with the model, write with it, and review every diff myself.', 't-dim');
      },
    },
    blog: {
      help: 'latest posts',
      run: () => {
        if (!data.posts.length) return void line('~/blog is empty (for now)', 't-dim');
        data.posts.forEach((p) => line(`› ${a(p.href, p.title)}`));
      },
    },
    contact: {
      help: 'how to reach me',
      run: () => {
        line(`${b(pad('mail', 10), 'amber')}${a('mailto:' + data.email, data.email)}`);
        data.links.forEach((l) => line(`${b(pad(l.id, 10), 'amber')}${a(l.href, l.handle, true)}`));
        line(`${b(pad('resume', 10), 'amber')}${a(data.resume.en, 'en.pdf')}  ${a(data.resume.fa, 'fa.pdf')}`);
      },
    },
    sudo: {
      help: 'sudo hire-me',
      run: async ([what]) => {
        if (what === 'hire-me' || what === 'hire') {
          line('[sudo] password for recruiter: ********', 't-dim');
          await wait(500);
          line(`${b('✓ access granted.')} opening a new mail…`);
          setTimeout(() => (location.href = `mailto:${data.email}?subject=${encodeURIComponent('Let’s work together')}`), 600);
        } else if (what === 'rm') line('nice try. Nix is watching.', 't-coral');
        else line(`sudo: ${esc(what ?? '')}: command not found. try ${b('sudo hire-me', 'amber')}`, 't-coral');
      },
    },
    theme: { help: 'toggle dark / daylight', run: () => document.querySelector<HTMLButtonElement>('[data-theme-toggle]')?.click() },
    lang: { help: 'switch language (en / fa)', run: () => (location.href = data.other) },
    date: { run: () => line(new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Tehran' }).format(new Date()) + ' (Tehran)') },
    uname: { run: () => line('Linux workstation 6.x #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux') },
    pwd: { run: () => line('/home/mahdi') },
    echo: { run: (args) => line(esc(args.join(' '))) },
    history: { run: () => history.forEach((h, i) => line(`${String(i + 1).padStart(4)}  ${esc(h)}`)) },
    vim: { run: () => line('you are now stuck in vim. just kidding — :q', 't-dim') },
    exit: { run: () => line(`there is no escape. try ${b('contact', 'amber')} instead.`, 't-dim') },
    clear: { help: 'clear the screen', run: () => void (log.innerHTML = '') },
  };

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function exec(raw: string) {
    const cmdline = raw.trim();
    line(`<span class="ps1">$</span> ${esc(cmdline)}`, '');
    if (!cmdline) return;
    history.push(cmdline);
    hIndex = history.length;
    const [name, ...args] = cmdline.split(/\s+/);
    if (name === 'rm' && args.join(' ').includes('-rf')) return void line('rm: refusing to remove "/": this is someone’s portfolio', 't-coral');
    const c = commands[name.toLowerCase()];
    if (!c) return void line(`zsh: command not found: ${esc(name)} — try ${b('help', 'amber')}`, 't-coral');
    await c.run(args);
  }

  /** types a command visibly (used by the chips and the boot) */
  async function typeAndRun(cmd: string) {
    if (busy) return;
    busy = true;
    if (prefersLessMotion()) input.value = cmd;
    else {
      input.value = '';
      for (const ch of cmd) {
        input.value += ch;
        await wait(38);
      }
      await wait(120);
    }
    input.value = '';
    await exec(cmd);
    busy = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = '';
    exec(v);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && history.length) {
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex];
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] ?? '';
      e.preventDefault();
    } else if (e.key === 'Tab') {
      const [head, ...rest] = input.value.split(' ');
      const pool = rest.length ? data.projects.map((p) => p.slug) : Object.keys(commands);
      const word = rest.length ? rest[rest.length - 1] : head;
      const hit = pool.find((c) => c.startsWith(word) && c !== word);
      if (hit) input.value = rest.length ? `${head} ${hit}` : hit;
      e.preventDefault();
    } else if (e.key === 'l' && e.ctrlKey) {
      log.innerHTML = '';
      e.preventDefault();
    }
  });
  // click anywhere on the screen focuses the prompt (but not when selecting text or following a link)
  screen.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a') || getSelection()?.toString()) return;
    input.focus({ preventScroll: true });
  });
  root.closest('.term-wrap')!.querySelectorAll<HTMLButtonElement>('[data-term-run]').forEach((btn) =>
    btn.addEventListener('click', () => typeAndRun(btn.dataset.termRun!)),
  );
  document.querySelectorAll('[data-focus-term]').forEach((el) =>
    el.addEventListener('click', () => setTimeout(() => input.focus({ preventScroll: true }), 350)),
  );
}

document.addEventListener('astro:page-load', () => {
  const root = document.querySelector<HTMLElement>('[data-term]');
  if (root && !root.dataset.ready) {
    root.dataset.ready = '';
    init(root);
  }
});
