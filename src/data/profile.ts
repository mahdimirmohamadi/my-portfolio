// Profile data from the EN + FA resumes (1405), in plain terms.
import type { Lang } from '../i18n/ui';

type L10n = Record<Lang, string>;
type L10nList = Record<Lang, string[]>;

export const person = {
  email: 'MahdiMirMohamadi13@gmail.com',
  /** the phone is as important as the email: shown in the navbar, hero and contact */
  phone: { tel: '+989100770673', display: { en: '+98 910 077 0673', fa: '۰۹۱۰ ۰۷۷ ۰۶۷۳' } as L10n },
  links: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/mahdimirmohamadi', handle: 'github.com/mahdimirmohamadi' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/mahdimirmohamadi', handle: 'linkedin.com/in/mahdimirmohamadi' },
    { id: 'telegram', label: 'Telegram', href: 'https://t.me/mahdimirmo', handle: 't.me/mahdimirmo' },
  ],
  resume: { en: '/resume/mahdi-mirmohamadi-en.pdf', fa: '/resume/mahdi-mirmohamadi-fa.pdf' },
} as const;

/** neofetch-style facts (keys stay English: it's terminal output) */
export const fetch: { k: string; v: L10n }[] = [
  { k: 'Role', v: { en: 'AI-native software engineer', fa: 'مهندس نرم‌افزار AI دوست' } },
  { k: 'Uptime', v: { en: '4 years in production', fa: '۴ سال در محیط production' } },
  { k: 'Location', v: { en: 'Tehran, Iran (UTC+3:30)', fa: 'تهران، ایران' } },
  { k: 'OS', v: { en: 'Linux', fa: 'Linux' } },
  { k: 'Shell', v: { en: 'zsh', fa: 'zsh' } },
  { k: 'Languages', v: { en: 'TypeScript, JavaScript', fa: 'TypeScript، JavaScript' } },
  { k: 'Frameworks', v: { en: 'React 19, Next.js, Astro, Remix', fa: 'React 19، Next.js، Astro، Remix' } },
  { k: 'Education', v: { en: 'B.Sc. Mechatronics (computers + mechanics), IUST', fa: 'کارشناسی مکاترونیک (کامپیوتر + مکانیک)، علم و صنعت' } },
  { k: 'Focus', v: { en: 'Performance, SEO, DX', fa: 'پرفورمنس، سئو، تجربهٔ توسعه' } },
];

export const jobs: {
  id: string;
  company: string;
  url?: string;
  place: L10n;
  mode: L10n;
  since: { month: L10n; year: L10n; iso: string };
  role: L10n;
  summary: L10n;
  shipped: L10nList;
}[] = [
  {
    id: 'innolearn',
    company: 'InnoLearn',
    url: 'https://innolearn.ir',
    place: { en: 'Melbourne, Australia', fa: 'ملبورن، استرالیا' },
    mode: { en: 'remote', fa: 'دورکاری' },
    since: { month: { en: 'Oct', fa: 'مهر' }, year: { en: '2025', fa: '۱۴۰۴' }, iso: '2025-10' },
    role: { en: 'Software engineer, one of two on the product', fa: 'مهندس نرم‌افزار، یکی از دو نفر تیم محصول' },
    summary: {
      en: 'An LMS, plus InnoMeet: the live-class app where students and teachers actually see each other.',
      fa: 'یه LMS، به‌علاوه‌ی اینومیت؛ اپ کلاس آنلاینی که شاگرد و معلم واقعاً توش همدیگه رو می‌بینن.',
    },
    shipped: {
      en: [
        'Chat plus live video, audio and image streaming inside InnoMeet',
        'Live quizzes and polls in the middle of a class',
        'A native image-making tool, zero AI involved',
        'The assignments and exams module, plus the landing pages',
        'A pile of UX fixes and a cleaner CI/CD for the team',
      ],
      fa: [
        'چت و استریم زنده‌ی ویدیو، صدا و تصویر توی اینومیت',
        'کوییز و نظرسنجی زنده وسط کلاس',
        'یه ابزار ساخت تصویر native، بدون هیچ AI',
        'بخش تکالیف و آزمون‌ها، به‌علاوه‌ی لندینگ‌ها',
        'کلی اصلاح UX و یه CI/CD تمیزتر برای تیم',
      ],
    },
  },
  {
    id: 'armani',
    company: 'Armani English',
    url: 'https://armanienglish.com',
    place: { en: 'Tehran, Iran', fa: 'تهران، ایران' },
    mode: { en: 'hybrid', fa: 'هیبریدی' },
    since: { month: { en: 'Sep', fa: 'شهریور' }, year: { en: '2022', fa: '۱۴۰۱' }, iso: '2022-09' },
    role: { en: 'Software engineer', fa: 'مهندس نرم‌افزار' },
    summary: {
      en: 'The main website, the admin panels and a shared component library, side by side with the design team.',
      fa: 'سایت اصلی، پنل‌های ادمین و یه کتابخونه‌ی کامپوننت مشترک، کنار تیم دیزاین.',
    },
    shipped: {
      en: [
        'An exam system where AI does the grading',
        'Core Web Vitals fixes: pages load 30% faster',
        'Better technical SEO and a proper CI/CD pipeline',
        'An AI-assisted workflow with Claude Code and Cursor',
      ],
      fa: [
        'یه سامانه‌ی آزمون که AI تصحیحش می‌کنه',
        'اصلاح Core Web Vitals؛ صفحه‌ها ۳۰٪ سریع‌تر لود می‌شن',
        'سئوی فنی بهتر و یه پایپ‌لاین CI/CD درست‌وحسابی',
        'یه workflow با کمک Claude Code و Cursor',
      ],
    },
  },
];

export const education: { years: L10n; title: L10n; place: L10n }[] = [
  { years: { en: '2019 – 2023', fa: '۱۳۹۸ – ۱۴۰۲' }, title: { en: 'B.Sc. Mechatronics Engineering (computers + mechanics)', fa: 'کارشناسی مهندسی مکاترونیک (کامپیوتر + مکانیک)' }, place: { en: 'Iran University of Science & Technology', fa: 'دانشگاه علم و صنعت ایران' } },
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

export const aiTools = ['Claude Code', 'Cursor', 'Antigravity', 'Hermes Agent'];

/** skill groups, shown as logo lists (names map to icons in data/logos.ts) */
export const stack: { id: string; label: L10n; items: string[] }[] = [
  { id: 'lang', label: { en: 'Languages', fa: 'زبان‌ها' }, items: ['TypeScript', 'JavaScript', 'HTML', 'CSS'] },
  { id: 'fw', label: { en: 'Frameworks', fa: 'فریم‌ورک‌ها' }, items: ['React', 'Next.js', 'Astro', 'Remix', 'Refine', 'TanStack Start'] },
  { id: 'ui', label: { en: 'Styling', fa: 'استایل' }, items: ['Tailwind CSS', 'shadcn/ui', 'Chakra UI', 'MUI', 'Panda CSS'] },
  { id: 'state', label: { en: 'State & data', fa: 'State و داده' }, items: ['Zustand', 'Jotai', 'Redux', 'TanStack Query', 'SWR'] },
  { id: 'ops', label: { en: 'Tooling', fa: 'ابزارها' }, items: ['Linux', 'Git', 'GitHub', 'GitLab', 'Turborepo', 'pnpm', 'Docker', 'CI/CD'] },
  { id: 'web', label: { en: 'Web quality', fa: 'کیفیت وب' }, items: ['Core Web Vitals', 'Technical SEO'] },
];
