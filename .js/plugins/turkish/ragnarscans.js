"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("@libs/fetch");
var plugin_1 = require("@/types/plugin");
var cheerio_1 = require("cheerio");
var novelStatus_1 = require("@libs/novelStatus");
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
var RagnarScans = /** @class */ (function () {
    function RagnarScans() {
        this.id = 'ragnarscans';
        this.name = 'Ragnar Scans';
        this.icon = 'src/tr/ragnarscans/icon.png';
        this.site = 'https://ragnarscans.net';
        this.version = '1.0.0';
    }
    RagnarScans.prototype.toPath = function (href) {
        return href.replace(this.site, '');
    };
    RagnarScans.prototype.parseList = function (html) {
        var _this = this;
        var $ = (0, cheerio_1.load)(html);
        var novels = [];
        var seen = new Set();
        $('a[href*="/novel/"]').each(function (_, el) {
            var a = $(el);
            var href = _this.toPath(a.attr('href') || '');
            // only /novel/<slug>/ (not /novel/page/2/ or chapter links)
            if (!/^\/novel\/[^/]+\/$/.test(href) || href.startsWith('/novel/page/')) {
                return;
            }
            var img = a.find('img').first();
            if (!img.length || seen.has(href))
                return;
            var cover = img.attr('data-src') || img.attr('data-lazy-src') || img.attr('src');
            var name = (img.attr('alt') || a.attr('title') || a.text() || '')
                .replace(/için kapak görseli/i, '')
                .replace(/\s+/g, ' ')
                .trim();
            if (!name)
                return;
            seen.add(href);
            novels.push({ name: name, path: href, cover: cover });
        });
        return novels;
    };
    RagnarScans.prototype.popularNovels = function (pageNo, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = pageNo > 1
                            ? "".concat(this.site, "/novel/page/").concat(pageNo, "/")
                            : "".concat(this.site, "/novel/");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        html = _a.sent();
                        return [2 /*return*/, this.parseList(html)];
                }
            });
        });
    };
    RagnarScans.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, html, $, novel, ozet, parts, node, bodyText, genres, slug, re, max, chapters, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        html = _a.sent();
                        $ = (0, cheerio_1.load)(html);
                        novel = {
                            path: novelPath,
                            name: $('h1').first().text().trim() || 'Untitled',
                            cover: $('meta[property="og:image"]').attr('content'),
                        };
                        ozet = $('h2')
                            .filter(function (_, el) { return $(el).text().trim() === 'Özet'; })
                            .first();
                        if (ozet.length) {
                            parts = [];
                            node = ozet.next();
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
                        bodyText = $('body').text();
                        if (/Tamamland/i.test(bodyText) && !/Devam Edi/i.test(bodyText)) {
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        }
                        else if (/Devam Edi/i.test(bodyText)) {
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        }
                        genres = [];
                        $('a[href*="/genre/"]').each(function (_, el) {
                            var g = $(el).text().trim();
                            if (g && !genres.includes(g))
                                genres.push(g);
                        });
                        if (genres.length)
                            novel.genres = genres.join(',');
                        slug = novelPath.replace(/\/+$/, '').split('/').pop();
                        re = new RegExp("/novel/".concat(slug, "/bolum-(\\d+)/?$"));
                        max = 0;
                        $('a[href*="/bolum-"]').each(function (_, el) {
                            var m = ($(el).attr('href') || '').match(re);
                            if (m)
                                max = Math.max(max, parseInt(m[1], 10));
                        });
                        chapters = [];
                        for (i = 1; i <= max; i++) {
                            chapters.push({
                                name: "B\u00F6l\u00FCm ".concat(i),
                                path: "/novel/".concat(slug, "/bolum-").concat(i, "/"),
                                chapterNumber: i,
                            });
                        }
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    RagnarScans.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, $, best, bestCount, stop, keep, out, _i, _a, el, node, tag;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (r) { return r.text(); })];
                    case 1:
                        html = _b.sent();
                        $ = (0, cheerio_1.load)(html);
                        $('script, style, ins, iframe, noscript, form, nav, header, footer').remove();
                        best = null;
                        bestCount = 0;
                        $('div, article, section, main').each(function (_, el) {
                            var count = $(el).children('p').length;
                            if (count > bestCount) {
                                bestCount = count;
                                best = $(el);
                            }
                        });
                        if (!best || bestCount < 3) {
                            return [2 /*return*/, $('article').html() || ''];
                        }
                        stop = /Yazarı Destekle|Hediye Gönder|Yorumlar|Ne Düşünüyorsun|Benzer Seriler/;
                        keep = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'blockquote'];
                        out = '';
                        for (_i = 0, _a = best.children().toArray(); _i < _a.length; _i++) {
                            el = _a[_i];
                            node = $(el);
                            tag = (el.tagName || '').toLowerCase();
                            if (/^h[1-6]$/.test(tag) && stop.test(node.text()))
                                break;
                            if (!keep.includes(tag))
                                continue;
                            node
                                .find('img[src*="avatar"], img[src*="gravatar"], img[src*="init-user-engine"]')
                                .remove();
                            out += $.html(node);
                        }
                        return [2 /*return*/, out];
                }
            });
        });
    };
    return RagnarScans;
}());
async;
searchNovels(searchTerm, string, pageNo, number);
Promise < plugin_1.Plugin.NovelItem[] > {
    const: page = pageNo > 1 ? "page/".concat(pageNo, "/") : '',
    const: url = "".concat(this.site, "/").concat(page, "?s=").concat(encodeURIComponent(searchTerm)),
    const: html = await (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); }),
    // Search also returns manga (/manga/); keep only novels.
    return: this.parseList(html)
};
exports.default = new RagnarScans();
