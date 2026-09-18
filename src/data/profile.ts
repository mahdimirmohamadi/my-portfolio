// Profile data from the EN + FA resumes (1405), in plain terms.
import type { Lang } from '../i18n/ui';

type L10n = Record<Lang, string>;
type L10nList = Record<Lang, string[]>;

export const person = {
  email: 'MahdiMirMohamadi13@gmail.com',
  links: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/mahdimirmohamadi', handle: 'github.com/mahdimirmohamadi' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/mahdimirmohamadi', handle: 'linkedin.com/in/mahdimirmohamadi' },
    { id: 'telegram', label: 'Telegram', href: 'https://t.me/mahdimirmo', handle: 't.me/mahdimirmo' },
  ],
  resume: { en: '/resume/mahdi-mirmohamadi-en.pdf', fa: '/resume/mahdi-mirmohamadi-fa.pdf' },
} as const;

/** neofetch-style facts (keys stay English: it's terminal output) */
export const fetch: { k: string; v: L10n }[] = [
  { k: 'Role', v: { en: 'Front-End Engineer', fa: 'مهندس فرانت‌اند' } },
  { k: 'Uptime', v: { en: '4 years in production', fa: '۴ سال در محیط production' } },
  { k: 'Location', v: { en: 'Tehran, Iran (UTC+3:30)', fa: 'تهران، ایران' } },
  { k: 'OS', v: { en: 'Linux', fa: 'Linux' } },
  { k: 'Shell', v: { en: 'zsh', fa: 'zsh' } },
  { k: 'Languages', v: { en: 'TypeScript, JavaScript', fa: 'TypeScript، JavaScript' } },
  { k: 'Frameworks', v: { en: 'React 19, Next.js, Astro, Remix', fa: 'React 19، Next.js، Astro، Remix' } },
  { k: 'AI', v: { en: 'Claude Code, Cursor, Antigravity, Hermes', fa: 'Claude Code، Cursor، Antigravity، Hermes' } },
  { k: 'Education', v: { en: 'B.Sc. Mechatronics, IUST', fa: 'کارشناسی مکاترونیک، علم و صنعت' } },
  { k: 'Focus', v: { en: 'Performance, SEO, DX', fa: 'پرفورمنس، سئو، تجربهٔ توسعه' } },
];

export const jobs: {
  id: string;
  branch: string;
  company: string;
  url?: string;
  place: L10n;
  mode: L10n;
  since: L10n;
  lead?: L10n;
  commits: L10nList;
}[] = [
  {
    id: 'innolearn',
    branch: 'remote/melbourne',
    company: 'InnoLearn',
    url: 'https://innolearn.ir',
    place: { en: 'Melbourne, Australia', fa: 'ملبورن، استرالیا' },
    mode: { en: 'Remote', fa: 'دورکاری' },
    since: { en: 'Oct 2025', fa: 'مهر ۱۴۰۴' },
    lead: {
      en: 'An LMS plus InnoMeet, a live meeting app. One of two front-end engineers.',
      fa: 'سامانهٔ LMS و اینومیت، اپ جلسات زنده. یکی از دو مهندس فرانت‌اند محصول.',
    },
    commits: {
      en: [
        'feat(innomeet): chat, live video, audio and image streaming',
        'feat(innomeet): live quizzes and polls',
        'feat: native image creation tool (no AI)',
        'feat: assignments & exams module, landing pages',
        'chore: improve UX and the team’s CI/CD',
      ],
      fa: [
        'feat(innomeet): چت، استریم زندهٔ ویدیو، صدا و تصویر',
        'feat(innomeet): کوییز و نظرسنجی زنده',
        'feat: ابزار تصویرساز native (بدون هوش مصنوعی)',
        'feat: بخش تکالیف و آزمون‌ها، لندینگ پیج‌ها',
        'chore: بهبود تجربهٔ کاربری و CI/CD تیم',
      ],
    },
  },
  {
    id: 'armani',
    branch: 'main',
    company: 'Armani English',
    url: 'https://armanienglish.com',
    place: { en: 'Tehran, Iran', fa: 'تهران، ایران' },
    mode: { en: 'Hybrid', fa: 'هیبریدی' },
    since: { en: 'Sep 2022', fa: 'شهریور ۱۴۰۱' },
    commits: {
      en: [
        'feat: main website + admin panels, reusable UI with the design team',
        'feat(ai): automated exam and AI scoring system',
        'perf: fix Core Web Vitals, page loads 30% faster',
        'ci: better SEO and CI/CD pipeline',
        'chore: AI-assisted workflow with Claude Code and Cursor',
      ],
      fa: [
        'feat: وب‌سایت اصلی و پنل‌های مدیریت، کامپوننت‌های قابل‌استفادهٔ مجدد با تیم طراحی',
        'feat(ai): سامانهٔ آزمون و تصحیح خودکار با هوش مصنوعی',
        'perf: اصلاح Core Web Vitals، بارگذاری ۳۰٪ سریع‌تر',
        'ci: بهبود سئو و CI/CD',
        'chore: جریان کاری مبتنی بر AI با Claude Code و Cursor',
      ],
    },
  },
];

export const education: { years: L10n; title: L10n; place: L10n }[] = [
  { years: { en: '2019 – 2023', fa: '۱۳۹۸ – ۱۴۰۲' }, title: { en: 'B.Sc. Mechatronics Engineering', fa: 'کارشناسی مهندسی مکاترونیک' }, place: { en: 'Iran University of Science & Technology', fa: 'دانشگاه علم و صنعت ایران' } },
  { years: { en: '2013 – 2019', fa: '۱۳۹۲ – ۱۳۹۸' }, title: { en: 'Diploma, Math & Physics', fa: 'دیپلم ریاضی و فیزیک' }, place: { en: 'Allameh Helli High School (NODET)', fa: 'دبیرستان علامه حلی (سمپاد)' } },
];

export const aiBuilt: { title: L10n; body: L10n; where: string }[] = [
  {
    title: { en: 'Automated exam & AI scoring', fa: 'آزمون و تصحیح خودکار با AI' },
    body: { en: 'Exams graded by an AI pipeline instead of a human queue.', fa: 'آزمون‌هایی که به‌جای صف انسانی، با پایپ‌لاین هوش مصنوعی تصحیح می‌شوند.' },
    where: 'Armani English',
  },
  {
    title: { en: 'Real-time exams with AI scoring', fa: 'آزمون realtime با تصحیح هوشمند' },
    body: { en: 'Part of the student portal, alongside a smart study planner.', fa: 'بخشی از پورتال دانش‌آموزان، کنار برنامه‌ریز مطالعاتی هوشمند.' },
    where: 'my.armanienglish.com',
  },
];

export const aiTools = ['Claude Code', 'Cursor', 'Antigravity', 'Hermes'];

/** htop rows: skill groups as processes */
export const procs: { pid: number; cmd: string; label: L10n; tools: string[]; load: number }[] = [
  { pid: 1, cmd: 'typescript', label: { en: 'Languages', fa: 'زبان‌ها' }, tools: ['TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3'], load: 92 },
  { pid: 42, cmd: 'react-runtime', label: { en: 'Frameworks', fa: 'فریم‌ورک‌ها' }, tools: ['React 18/19', 'Next.js (App Router)', 'Astro', 'Remix', 'Refine', 'TanStack Start'], load: 88 },
  { pid: 128, cmd: 'ai-copilots', label: { en: 'AI-assisted dev', fa: 'توسعه با AI' }, tools: ['Claude Code', 'Cursor', 'Antigravity', 'Hermes'], load: 81 },
  { pid: 256, cmd: 'stylesd', label: { en: 'Styling & UI', fa: 'استایل و UI' }, tools: ['Tailwind CSS', 'Shadcn UI', 'Chakra UI', 'Material UI', 'PandaCSS'], load: 74 },
  { pid: 512, cmd: 'state-sync', label: { en: 'State & data', fa: 'State و داده' }, tools: ['Zustand', 'Jotai', 'Redux', 'TanStack Query', 'SWR'], load: 69 },
  { pid: 1024, cmd: 'build-farm', label: { en: 'Tools & DevOps', fa: 'ابزار و DevOps' }, tools: ['Git', 'GitHub', 'GitLab', 'Turborepo', 'pnpm', 'Docker', 'CI/CD'], load: 63 },
  { pid: 2048, cmd: 'vitals-watch', label: { en: 'Performance & SEO', fa: 'پرفورمنس و سئو' }, tools: ['Core Web Vitals', 'Technical SEO', 'Performance'], load: 57 },
];

/** marquee: tech names */
export const tech = ['Linux', 'zsh', 'TypeScript', 'React', 'Next.js', 'Astro', 'Remix', 'Node.js', 'Tailwind', 'Zustand', 'TanStack', 'Turborepo', 'pnpm', 'Docker', 'Git', 'Claude Code', 'Cursor', 'Core Web Vitals'];
