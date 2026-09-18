import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, slugOf } from './content';
import { ui, type Lang } from '../i18n/ui';
import { lp } from '../i18n/utils';

/** One feed per language: /rss.xml and /fa/rss.xml */
export const feed = (lang: Lang) => async (context: APIContext) => {
  const posts = await getPosts(lang);
  return rss({
    title: `${ui[lang]['ch.omake']} · ${ui[lang]['site.name']}`,
    description: ui[lang]['site.description'],
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      categories: p.data.tags,
      link: lp(lang, `/omake/${slugOf(p)}/`),
    })),
    customData: `<language>${lang === 'fa' ? 'fa-IR' : 'en'}</language>`,
  });
};
