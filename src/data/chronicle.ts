// The story data, straight from the EN + FA resumes (1405).
import type { Lang } from '../i18n/ui';

type L10n = Record<Lang, string>;
type L10nList = Record<Lang, string[]>;

export const person = {
  email: 'MahdiMirMohamadi13@gmail.com',
  links: [
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/mahdimirmohamadi', handle: 'in/mahdimirmohamadi' },
    { id: 'github', label: 'GitHub', href: 'https://github.com/mahdimirmohamadi', handle: 'mahdimirmohamadi' },
    { id: 'telegram', label: 'Telegram', href: 'https://t.me/mahdimirmo', handle: '@mahdimirmo' },
  ],
  resume: { en: '/resume/mahdi-mirmohamadi-en.pdf', fa: '/resume/mahdi-mirmohamadi-fa.pdf' },
} as const;

export const origin: { id: string; years: L10n; title: L10n; place: L10n; line: L10n }[] = [
  {
    id: 'helli',
    years: { en: '2013 – 2019', fa: '۱۳۹۲ – ۱۳۹۸' },
    title: { en: 'The School of Prodigies', fa: 'مدرسهٔ استعدادها' },
    place: { en: 'Allameh Helli High School (NODET)', fa: 'دبیرستان علامه حلی (سمپاد)' },
    line: { en: 'Diploma in Mathematics & Physics. Learned that every problem has a proof.', fa: 'دیپلم ریاضی و فیزیک. یاد گرفت هر مسئله‌ای اثباتی دارد.' },
  },
  {
    id: 'iust',
    years: { en: '2019 – 2023', fa: '۱۳۹۸ – ۱۴۰۲' },
    title: { en: 'Half Machine, Half Code', fa: 'نیمی ماشین، نیمی کد' },
    place: { en: 'Iran University of Science & Technology', fa: 'دانشگاه علم و صنعت ایران' },
    line: {
      en: 'B.Sc. Mechatronics Engineering (Computer + Mechanical). Built robots, then fell for the browser.',
      fa: 'کارشناسی مهندسی مکاترونیک (کامپیوتر + مکانیک). ربات ساخت، بعد عاشق مرورگر شد.',
    },
  },
];

export const quests: {
  id: string;
  name: L10n;
  company: string;
  place: L10n;
  mode: L10n;
  since: L10n;
  lead?: L10n;
  deeds: L10nList;
}[] = [
  {
    id: 'armani',
    name: { en: 'The Long Quest', fa: 'مأموریت بلند' },
    company: 'Armani English',
    place: { en: 'Tehran, Iran', fa: 'تهران، ایران' },
    mode: { en: 'Hybrid', fa: 'هیبریدی' },
    since: { en: 'Sep 2022', fa: 'شهریور ۱۴۰۱' },
    deeds: {
      en: [
        'Built and maintain the main website and admin panels, pairing with the design team on responsive, reusable UI components.',
        'Developed AI-powered features, including an automated exam and scoring system.',
        'Cut page load times by 30% by fixing Core Web Vitals, and noticeably improved SEO and the CI/CD pipeline.',
        'Ships faster with Claude Code and Cursor, without cutting corners on quality.',
      ],
      fa: [
        'توسعه و نگهداری وب‌سایت اصلی و پنل‌های مدیریتی، همراه با ساخت کامپوننت‌های ریسپانسیو و قابل‌استفادهٔ مجدد در همکاری با تیم طراحی.',
        'توسعهٔ سرویس‌های مبتنی بر هوش مصنوعی، از جمله سامانهٔ آزمون و تصحیح خودکار.',
        'بهینه‌سازی Core Web Vitals و بهبود ۳۰ درصدی سرعت بارگذاری صفحات، همراه با بهبود چشمگیر سئو و CI/CD.',
        'به‌کارگیری Claude Code و Cursor برای تحویل سریع‌تر، بدون کوتاه‌آمدن از کیفیت.',
      ],
    },
  },
  {
    id: 'innolearn',
    name: { en: 'The Overseas Quest', fa: 'مأموریت آن‌سوی آب‌ها' },
    company: 'InnoLearn',
    place: { en: 'Melbourne, Australia', fa: 'ملبورن، استرالیا' },
    mode: { en: 'Remote', fa: 'دورکاری' },
    since: { en: 'Oct 2025', fa: 'مهر ۱۴۰۴' },
    lead: {
      en: 'An all-in-one learning platform: an LMS plus InnoMeet, a live meeting app. One of its two front-end developers.',
      fa: 'اکوسیستم یکپارچهٔ آموزش دیجیتال: سامانهٔ LMS و اینومیت، پلتفرم جلسات آنلاین. یکی از دو توسعه‌دهندهٔ فرانت‌اند محصول.',
    },
    deeds: {
      en: [
        'Built much of InnoMeet: chat, live video, image and audio streaming, plus live quizzes and polls.',
        'Built a native image creation tool (no AI), the assignments and exams module, and landing pages.',
        'Often went beyond the role, improving product UX and the team’s CI/CD setup.',
      ],
      fa: [
        'توسعهٔ بخش بزرگی از اینومیت: چت، استریم زندهٔ ویدیو، تصویر و صدا، و کوییز و نظرسنجی زنده.',
        'پیاده‌سازی ابزار تصویرساز native و بدون هوش مصنوعی، بخش تکالیف و آزمون‌ها و لندینگ پیج‌ها.',
        'فراتر از وظایف تعریف‌شده: بهبود تجربهٔ کاربری محصول و فرایندهای CI/CD تیم.',
      ],
    },
  },
];

export const bosses: {
  id: string;
  name: L10n;
  quest: string;
  stat?: { value: number; suffix: string; label: L10n };
  sfx: L10n;
  story: L10n;
}[] = [
  {
    id: 'sluggish-page',
    name: { en: 'The Sluggish Page Div', fa: 'دیو صفحهٔ کُند' },
    quest: 'Armani English',
    stat: { value: 30, suffix: '%', label: { en: 'faster page loads', fa: 'بارگذاری سریع‌تر' } },
    sfx: { en: 'KA-BOOM', fa: 'بوم!' },
    story: {
      en: 'A bloated page that took ages to load. Defeated by fixing Core Web Vitals, one render-blocking script at a time.',
      fa: 'صفحه‌ای سنگین که دیر بالا می‌آمد. با اصلاح Core Web Vitals، اسکریپت به اسکریپت، شکست خورد.',
    },
  },
  {
    id: 'scoring-golem',
    name: { en: 'The Scoring Golem', fa: 'گولم نمره‌دهنده' },
    quest: 'Armani English',
    sfx: { en: 'CLANK', fa: 'تق!' },
    story: {
      en: 'Thousands of exams, one tireless grader. Tamed with an AI-powered automated exam and scoring system.',
      fa: 'هزاران آزمون و یک مصحح خستگی‌ناپذیر. با سامانهٔ آزمون و تصحیح خودکار مبتنی بر هوش مصنوعی رام شد.',
    },
  },
  {
    id: 'stream-hydra',
    name: { en: 'The Hydra of Live Streams', fa: 'اژدهای هفت‌سرِ استریم' },
    quest: 'InnoLearn',
    sfx: { en: 'WHOOSH', fa: 'ووش!' },
    story: {
      en: 'Cut one head, two grow back: chat, video, audio, images, quizzes, polls. InnoMeet keeps them all in sync.',
      fa: 'یک سر را بزنی دو سر درمی‌آید: چت، ویدیو، صدا، تصویر، کوییز، نظرسنجی. اینومیت همه را همگام نگه می‌دارد.',
    },
  },
  {
    id: 'blank-canvas',
    name: { en: 'The Blank Canvas', fa: 'بوم سفید' },
    quest: 'InnoLearn',
    sfx: { en: 'SWISH', fa: 'فیش!' },
    story: {
      en: 'Everyone wanted an image tool. No AI allowed. So he drew one from scratch, natively, in the browser.',
      fa: 'همه ابزار تصویرسازی می‌خواستند، بدون هوش مصنوعی. پس یکی را از صفر و native در مرورگر ساخت.',
    },
  },
];

export const grimoire: { id: string; school: L10n; plain: L10n; spells: string[] }[] = [
  { id: 'core', school: { en: 'Core Spells', fa: 'طلسم‌های اصلی' }, plain: { en: 'Languages & frameworks', fa: 'زبان‌ها و فریم‌ورک‌ها' }, spells: ['TypeScript', 'JavaScript (ES6+)', 'React 18/19', 'Next.js (App Router)', 'Astro', 'Remix', 'Refine', 'TanStack Start', 'HTML5', 'CSS3'] },
  { id: 'style', school: { en: 'Glamours', fa: 'افسون‌های ظاهر' }, plain: { en: 'Styling & UI', fa: 'استایل و UI' }, spells: ['Tailwind CSS', 'Shadcn UI', 'Chakra UI', 'Material UI', 'PandaCSS'] },
  { id: 'state', school: { en: 'Memory Charms', fa: 'طلسم‌های حافظه' }, plain: { en: 'State & data', fa: 'State و داده' }, spells: ['Zustand', 'Jotai', 'Redux', 'TanStack Query', 'SWR'] },
  { id: 'forge', school: { en: 'The Forge', fa: 'آهنگری' }, plain: { en: 'Tools & DevOps', fa: 'ابزارها و DevOps' }, spells: ['Git', 'GitHub', 'GitLab', 'Turborepo', 'pnpm', 'Docker', 'CI/CD'] },
  { id: 'wards', school: { en: 'Wards', fa: 'حفاظ‌ها' }, plain: { en: 'Performance & SEO', fa: 'پرفورمنس و سئو' }, spells: ['Core Web Vitals', 'Technical SEO', 'Performance'] },
  { id: 'familiars', school: { en: 'Familiars', fa: 'همزادها' }, plain: { en: 'AI-assisted development', fa: 'توسعه با هوش مصنوعی' }, spells: ['Claude Code', 'Cursor', 'Antigravity', 'Hermes'] },
];
