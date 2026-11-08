import { fetchApi } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { load as parseHTML } from 'cheerio';
import { NovelStatus } from '@libs/novelStatus';

/**
 * Ragnar Scans (Turkish) - UNTESTED, selector-agnostic first draft.
 * Put at: plugins/turkish/ragnarscans.ts
 * Icon at: public/static/src/tr/ragnarscans/icon.png
 *
 * Site layout (observed):
 *   list:     /novel/ , /novel/page/N/
 *   novel:    /novel/<slug>/
 *   chapter:  /novel/<slug>/bolum-<N>/
 */
class RagnarScans implements Plugin.PluginBase {
  id = 'ragnarscans';
  name = 'Ragnar Scans';
  icon = 'src/tr/ragnarscans/icon.png';
  site = 'https://ragnarscans.net';
  version = '1.0.0';

  private toPath(href: string): string {
    return href.replace(this.site, '');
  }

  private parseList(html: string): Plugin.NovelItem[] {
    const $ = parseHTML(html);
    const novels: Plugin.NovelItem[] = [];
    const seen = new Set<string>();

    $('a[href*="/novel/"]').each((_, el) => {
      const a = $(el);
      const href = this.toPath(a.attr('href') || '');
      // only /novel/<slug>/ (not /novel/page/2/ or chapter links)
      if (!/^\/novel\/[^/]+\/$/.test(href) || href.startsWith('/novel/page/')) {
        return;
      }
      const img = a.find('img').first();
      if (!img.length || seen.has(href)) return;

      const cover =
        img.attr('data-src') || img.attr('data-lazy-src') || img.attr('src');
      let name = (img.attr('alt') || a.attr('title') || a.text() || '')
        .replace(/için kapak görseli/i, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (!name) return;

      seen.add(href);
      novels.push({ name, path: href, cover });
    });
    return novels;
  }

  async popularNovels(
    pageNo: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options: Plugin.PopularNovelsOptions,
  ): Promise<Plugin.NovelItem[]> {
    const url =
      pageNo > 1
        ? `${this.site}/novel/page/${pageNo}/`
        : `${this.site}/novel/`;
    const html = await fetchApi(url).then(r => r.text());
    return this.parseList(html);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = this.site + novelPath;
    const html = await fetchApi(url).then(r => r.text());
    const $ = parseHTML(html);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: $('h1').first().text().trim() || 'Untitled',
      cover: $('meta[property="og:image"]').attr('content'),
    };

    // Summary: text under the "Özet" heading
    const ozet = $('h2')
      .filter((_, el) => $(el).text().trim() === 'Özet')
      .first();
    if (ozet.length) {
      const parts: string[] = [];
      let node = ozet.next();
      // collect until the next heading
      while (node.length && !/^h[1-6]$/i.test(node.prop('tagName') || '')) {
        parts.push(node.text().trim());
        node = node.next();
      }
      novel.summary = parts.filter(Boolean).join('\n\n');
    }
    if (!novel.summary) {
      novel.summary = $('meta[property="og:description"]').attr('content');
    }

    const bodyText = $('body').text();
    if (/Tamamland/i.test(bodyText) && !/Devam Edi/i.test(bodyText)) {
      novel.status = NovelStatus.Completed;
    } else if (/Devam Edi/i.test(bodyText)) {
      novel.status = NovelStatus.Ongoing;
    }

    const genres: string[] = [];
    $('a[href*="/genre/"]').each((_, el) => {
      const g = $(el).text().trim();
      if (g && !genres.includes(g)) genres.push(g);
    });
    if (genres.length) novel.genres = genres.join(',');

    // Chapters: URLs are /bolum-<N>/, so build 1..max from the highest seen.
    const slug = novelPath.replace(/\/+$/, '').split('/').pop();
    const re = new RegExp(`/novel/${slug}/bolum-(\\d+)/?$`);
    let max = 0;
    $('a[href*="/bolum-"]').each((_, el) => {
      const m = ($(el).attr('href') || '').match(re);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });

    const chapters: Plugin.ChapterItem[] = [];
    for (let i = 1; i <= max; i++) {
      chapters.push({
        name: `Bölüm ${i}`,
        path: `/novel/${slug}/bolum-${i}/`,
        chapterNumber: i,
      });
    }
    novel.chapters = chapters;
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const html = await fetchApi(this.site + chapterPath).then(r => r.text());
    const $ = parseHTML(html);

    $('script, style, ins, iframe, noscript, form, nav, header, footer').remove();

    // Pick the element with the most direct <p> children = the chapter body.
    let best: ReturnType<typeof $> | null = null;
    let bestCount = 0;
    $('div, article, section, main').each((_, el) => {
      const count = $(el).children('p').length;
      if (count > bestCount) {
        bestCount = count;
        best = $(el);
      }
    });

    if (!best || bestCount < 3) {
      return $('article').html() || $('body').html() || '';
    }
    return (best as ReturnType<typeof $>).html() || '';
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const page = pageNo > 1 ? `page/${pageNo}/` : '';
    const url = `${this.site}/${page}?s=${encodeURIComponent(searchTerm)}`;
    const html = await fetchApi(url).then(r => r.text());
    // Search also returns manga (/manga/); keep only novels.
    return this.parseList(html);
  }
}

export default new RagnarScans();
