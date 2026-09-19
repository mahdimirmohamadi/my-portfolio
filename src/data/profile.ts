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
    { id: 'x', label: 'X', href: 'https://x.com/mahdimirmo', handle: 'x.com/mahdimirmo' },
  ],
  /** where the technical posts live (the "More nerdy stuff" section at the end of the home page) */
  social: {
    x: { handle: '@mahdimirmo', href: 'https://x.com/mahdimirmo' },
    // TODO(owner): the Telegram channel's handle, e.g. 'mychannel' (without the @).
    // While it's empty the channel card shows but isn't a link.
    telegramChannel: '',
  },
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
  /** what the company or product is, in one line */
  about: L10n;
  shipped: L10nList;
  /** the products I worked on there */
  products: { label: string; href: string }[];
  stack: string[];
}[] = [
  {
    id: 'innolearn',
    company: 'InnoLearn',
    url: 'https://innolearn.ir',
    place: { en: 'Melbourne, Australia', fa: 'ملبورن، استرالیا' },
    mode: { en: 'remote', fa: 'دورکاری' },
    since: { month: { en: 'Oct', fa: 'مهر' }, year: { en: '2025', fa: '۱۴۰۴' }, iso: '2025-10' },
    role: { en: 'Software engineer', fa: 'مهندس نرم‌افزار' },
    about: {
      en: 'An all-in-one learning platform: an LMS plus InnoMeet, a live online meeting app built for classes. Both live in one Turborepo monorepo.',
      fa: 'یه اکوسیستم کامل آموزش آنلاین: یه LMS به‌علاوه‌ی اینومیت، اپ جلسه‌ی آنلاینی که برای کلاس ساخته شده. هر دو توی یه مونوریپوی Turborepo زندگی می‌کنن.',
    },
    shipped: {
      en: [
        'We’re a two-person front-end team, and I built a big part of InnoMeet and its blocks: chat, live video, image and audio streaming.',
        'Live quizzes and polls a teacher can drop into the middle of a class.',
        'A native image creation tool, built from scratch with zero AI.',
        'The assignments and exams module of the LMS, plus several landing pages for the main site.',
        'Went beyond my tasks: pitched and shipped UX improvements for the product and cleaned up the team’s CI/CD.',
      ],
      fa: [
        'تیم فرانت‌اند ما دو نفره‌ست و بخش بزرگی از اینومیت و بلوک‌هاش رو من ساختم: چت، استریم زنده‌ی ویدیو، تصویر و صدا.',
        'کوییز و نظرسنجی زنده که معلم وسط کلاس برای شاگردها می‌فرسته.',
        'یه ابزار تصویرساز native که از صفر ساختمش، بدون هیچ AI.',
        'بخش تکالیف و آزمون‌های LMS، به‌علاوه‌ی چندتا لندینگ برای سایت اصلی.',
        'فراتر از شرح وظایفم: ایده‌هایی برای بهتر شدن UX محصول دادم و اجراشون کردم، و CI/CD تیم رو هم مرتب کردم.',
      ],
    },
    products: [
      { label: 'innolearn.ir', href: 'https://innolearn.ir' },
      { label: 'innomeet.ir', href: 'https://innomeet.ir' },
    ],
    stack: ['Next.js', 'TypeScript', 'Turborepo', 'pnpm', 'Tailwind CSS', 'Zustand'],
  },
  {
    id: 'armani',
    company: 'Armani English',
    url: 'https://armanienglish.com',
    place: { en: 'Tehran, Iran', fa: 'تهران، ایران' },
    mode: { en: 'hybrid', fa: 'هیبریدی' },
    since: { month: { en: 'Sep', fa: 'شهریور' }, year: { en: '2022', fa: '۱۴۰۱' }, iso: '2022-09' },
    role: { en: 'Software engineer', fa: 'مهندس نرم‌افزار' },
    about: {
      en: 'An English-learning company: a big store for courses and educational products, plus a student portal with exams, study clubs and live webinars.',
      fa: 'یه مجموعه‌ی آموزش زبان انگلیسی: یه فروشگاه بزرگ برای دوره‌ها و محصولات آموزشی، به‌علاوه‌ی یه پورتال دانش‌آموزی با آزمون، کلاب درسی و وبینار زنده.',
    },
    shipped: {
      en: [
        'I build and maintain the main website and the admin panels, with responsive, reusable components made side by side with the UX/UI and product design team.',
        'AI-powered features, including an automated exam and scoring system: students take the exam, AI grades it.',
        'The student portal (my.armanienglish.com): real-time exams, AI scoring, a smart study planner, study clubs and live webinars.',
        'Fixed Core Web Vitals issues and cut page load times by 30%, with a noticeably better SEO and a proper CI/CD pipeline.',
        'Brought an AI-assisted workflow into the team with Claude Code and Cursor: faster features and refactors, same quality bar.',
      ],
      fa: [
        'سایت اصلی و پنل‌های ادمین رو می‌سازم و نگه می‌دارم، با کامپوننت‌های ریسپانسیو و قابل‌استفاده‌ی مجدد که کنار تیم UX/UI و طراحی محصول ساختیم.',
        'قابلیت‌های مبتنی بر AI، از جمله سامانه‌ی آزمون و تصحیح خودکار: شاگرد آزمون می‌ده، AI تصحیحش می‌کنه.',
        'پورتال دانش‌آموزی (my.armanienglish.com): آزمون realtime، تصحیح با AI، برنامه‌ریز مطالعاتی هوشمند، کلاب‌های درسی و وبینار زنده.',
        'مشکلات Core Web Vitals رو حل کردم و سرعت لود صفحه‌ها ۳۰٪ بهتر شد؛ سئو هم حسابی بهتر شد و CI/CD درست‌وحسابی راه افتاد.',
        'یه workflow مبتنی بر AI با Claude Code و Cursor آوردم توی کار: فیچر و ریفکتور سریع‌تر، بدون اینکه کیفیت فدا بشه.',
      ],
    },
    products: [
      { label: 'armanienglish.com', href: 'https://armanienglish.com' },
      { label: 'my.armanienglish.com', href: 'https://my.armanienglish.com' },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Chakra UI', 'Zustand', 'Jotai', 'TanStack Query', 'SWR'],
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

/** the AI toolbox keys: what each tool is for, in my words */
export const aiToolbox: { name: string; href: string; key: string; use: L10n }[] = [
  {
    name: 'Claude Code',
    href: 'https://www.claude.com/product/claude-code',
    key: '1',
    use: {
      en: 'My main agent. It lives in the terminal: plans the change, writes it, refactors it.',
      fa: 'ایجنت اصلیم. توی ترمینال زندگی می‌کنه: نقشه می‌کشه، کد رو می‌نویسه، ریفکتورش می‌کنه.',
    },
  },
  {
    name: 'Cursor',
    href: 'https://cursor.com',
    key: '2',
    use: {
      en: 'The editor I read diffs in, with quick inline edits and tab completions.',
      fa: 'ادیتوری که diffها رو توش می‌خونم، با ویرایش‌های سریع درجا و tab completion.',
    },
  },
  {
    name: 'Antigravity',
    href: 'https://antigravity.google',
    key: '3',
    use: {
      en: 'Google’s agent-first IDE, for when a few agents work side by side.',
      fa: 'IDE ایجنت‌محور گوگل، برای وقتی که چندتا ایجنت با هم موازی کار می‌کنن.',
    },
  },
  {
    name: 'Hermes Agent',
    href: 'https://hermes-agent.nousresearch.com',
    key: '4',
    use: {
      en: 'Nous Research’s open-source agent: my sidekick for research and side chores.',
      fa: 'ایجنت اوپن‌سورس Nous Research: دستیارم برای تحقیق و کارهای جانبی.',
    },
  },
];

/** skill groups, shown as logo lists (names map to icons in data/logos.ts) */
export const stack: { id: string; label: L10n; items: string[] }[] = [
  { id: 'lang', label: { en: 'Languages', fa: 'زبان‌ها' }, items: ['TypeScript', 'JavaScript', 'HTML', 'CSS'] },
  { id: 'fw', label: { en: 'Frameworks', fa: 'فریم‌ورک‌ها' }, items: ['React', 'Next.js', 'Astro', 'Remix', 'Refine', 'TanStack Start'] },
  { id: 'ui', label: { en: 'Styling', fa: 'استایل' }, items: ['Tailwind CSS', 'shadcn/ui', 'Chakra UI', 'MUI', 'Panda CSS'] },
  { id: 'state', label: { en: 'State & data', fa: 'State و داده' }, items: ['Zustand', 'Jotai', 'Redux', 'TanStack Query', 'SWR'] },
  { id: 'ops', label: { en: 'Tooling', fa: 'ابزارها' }, items: ['Linux', 'Git', 'GitHub', 'GitLab', 'Turborepo', 'pnpm', 'Docker', 'CI/CD'] },
  { id: 'web', label: { en: 'Web quality', fa: 'کیفیت وب' }, items: ['Core Web Vitals', 'Technical SEO'] },
];
