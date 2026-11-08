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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var SITE_URL = /^https?:\/\/(?:www\.)?rezeroturkce\.com\//i;
// Sections that hold the translated stories; anything else on the site
// (anime, manga, announcements, info pages) is not a novel.
var STORY_SECTIONS = [
    'ana-hikaye',
    'if-hikayeleri',
    'yan-hikayeler',
    'ex-romanlari',
];
var CHALLENGE_TITLES = [
    'bot verification',
    'you are being redirected...',
    'just a moment...',
    'bir dakika lütfen...',
    'redirecting...',
];
var MONTHS = [
    'ocak',
    'şubat',
    'mart',
    'nisan',
    'mayıs',
    'haziran',
    'temmuz',
    'ağustos',
    'eylül',
    'ekim',
    'kasım',
    'aralık',
];
var COMPLETED = /cevirisi tamamlan(?:mistir|di)(?![a-z])/;
var normalize = function (text) {
    return text
        .toLowerCase()
        .replace(/ı/g, 'i')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .trim();
};
var cleanText = function (text) { return text.replace(/\s+/g, ' ').trim(); };
var ReZeroTurkce = /** @class */ (function () {
    function ReZeroTurkce() {
        this.id = 'rezeroturkce';
        this.name = 'Re:Zero Türkçe';
        this.icon = 'src/tr/rezeroturkce/icon.png';
        this.site = 'https://www.rezeroturkce.com/';
        this.version = '1.0.0';
    }
    ReZeroTurkce.prototype.getCheerio = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var res, html, title;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + path)];
                    case 1:
                        res = _b.sent();
                        return [4 /*yield*/, res.text()];
                    case 2:
                        html = _b.sent();
                        title = (_a = html.match(/<title[^>]*>([^<]*)<\/title>/i)) === null || _a === void 0 ? void 0 : _a[1];
                        if (title && CHALLENGE_TITLES.includes(cleanText(title).toLowerCase()))
                            throw new Error('Captcha error, please open in webview');
                        if (!res.ok)
                            throw new Error('Could not reach site (' + res.status + '), try to open in webview');
                        return [2 /*return*/, (0, cheerio_1.load)(html)];
                }
            });
        });
    };
    /** Site-relative path of an on-site link, or undefined for anything else. */
    ReZeroTurkce.prototype.toPath = function (href) {
        if (!href || !SITE_URL.test(href))
            return undefined;
        var path = href.replace(SITE_URL, '').split(/[?#]/)[0];
        if (!path)
            return undefined;
        return path.endsWith('/') ? path : path + '/';
    };
    /** A story page lives directly under one of the story sections. */
    ReZeroTurkce.prototype.isStoryPath = function (path) {
        if (!path)
            return false;
        var parts = path.split('/').filter(Boolean);
        return parts.length === 2 && STORY_SECTIONS.includes(parts[0]);
    };
    /** Index pages show each story as a column block with a cover and a link. */
    ReZeroTurkce.prototype.parseStoryIndex = function ($, seen) {
        var _this = this;
        var novels = [];
        $('article .wp-block-columns').each(function (_i, el) {
            var _a;
            var block = $(el);
            // Bare-domain images only redirect to www, so request www directly.
            var cover = (_a = block
                .find('img')
                .first()
                .attr('src')) === null || _a === void 0 ? void 0 : _a.replace(SITE_URL, _this.site);
            var name = cleanText(block.find('h2').first().text());
            if (!cover || !name)
                return;
            var path = block
                .find('a')
                .toArray()
                .map(function (a) { return _this.toPath($(a).attr('href')); })
                .find(function (p) { return _this.isStoryPath(p); });
            if (!path || seen.has(path))
                return;
            seen.add(path);
            novels.push({ name: name, path: path, cover: cover });
        });
        return novels;
    };
    ReZeroTurkce.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, main, ifStories, exNovels, sideStories, seen, novels;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, Promise.all(['ana-hikaye/', 'if-hikayeleri/', 'ex-romanlari/', 'yan-hikayeler/'].map(function (path) { return _this.getCheerio(path); }))];
                    case 1:
                        _a = _b.sent(), main = _a[0], ifStories = _a[1], exNovels = _a[2], sideStories = _a[3];
                        seen = new Set();
                        novels = __spreadArray(__spreadArray(__spreadArray([], this.parseStoryIndex(main, seen), true), this.parseStoryIndex(ifStories, seen), true), this.parseStoryIndex(exNovels, seen), true);
                        // Side stories are single pages, so their index page is one novel.
                        novels.push({
                            name: cleanText(sideStories('main h1').first().text()) || 'Yan Hikâyeler',
                            path: 'yan-hikayeler/',
                            cover: sideStories('meta[property="og:image"]').attr('content') ||
                                defaultCover_1.defaultCover,
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    ReZeroTurkce.prototype.parseDate = function (text) {
        var match = text.trim().match(/^(\d{1,2})\s+(\S+)\s+(\d{4})$/);
        if (!match)
            return undefined;
        var month = MONTHS.indexOf(match[2].toLowerCase());
        if (month < 0)
            return undefined;
        return (match[3] +
            '-' +
            String(month + 1).padStart(2, '0') +
            '-' +
            match[1].padStart(2, '0'));
    };
    ReZeroTurkce.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, article, novel, summary, _a, _b, el, node, text, dates, siblingPrefix, chapters, seen, addChapter;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(novelPath)];
                    case 1:
                        $ = _c.sent();
                        article = $('main article').first();
                        novel = {
                            path: novelPath,
                            name: cleanText($('main h1').first().text()) || 'Untitled',
                            cover: $('meta[property="og:image"]').attr('content') || defaultCover_1.defaultCover,
                            status: novelStatus_1.NovelStatus.Unknown,
                        };
                        summary = [];
                        article.find('br').replaceWith(' ');
                        for (_a = 0, _b = article.find('h2, p, ul, ol, table').toArray(); _a < _b.length; _a++) {
                            el = _b[_a];
                            node = $(el);
                            if (node.is('ul, ol, table'))
                                break;
                            text = cleanText(node.text());
                            if (/^bolumler/.test(normalize(text)))
                                break;
                            if (text)
                                summary.push(text);
                        }
                        if (summary.length)
                            novel.summary = summary.join('\n\n');
                        // Only "tamamlanmıştır"/"tamamlandı" (completed), not "tamamlanmadı" etc.
                        if (COMPLETED.test(normalize(article.find('h2').text())))
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        dates = new Map();
                        article.find('tr').each(function (_i, el) {
                            var path = _this.toPath($(el).find('a').attr('href'));
                            var date = _this.parseDate($(el).find('td').last().text());
                            if (path && date)
                                dates.set(path, date);
                        });
                        siblingPrefix = novelPath.replace(/\/$/, '-');
                        chapters = [];
                        seen = new Set();
                        addChapter = function (href, name) {
                            var path = _this.toPath(href);
                            // Only chapters hosted on this site; older arcs also link out to
                            // EpikNovel, which this plugin cannot read.
                            if (!path || path === novelPath)
                                return;
                            if (!path.startsWith(novelPath) && !path.startsWith(siblingPrefix))
                                return;
                            if (seen.has(path) || !name)
                                return;
                            seen.add(path);
                            chapters.push({ name: name, path: path, releaseTime: dates.get(path) });
                        };
                        article.find('a').each(function (_i, el) {
                            var link = $(el);
                            // A list item can split one title over several links to the same
                            // chapter, so name it after the whole item.
                            var item = link.closest('li');
                            if (item.length && item.find('a').length > 1) {
                                if (link.is(item.find('a').last()))
                                    addChapter(link.attr('href'), cleanText(item.text()));
                                return;
                            }
                            addChapter(link.attr('href'), cleanText(link.text()).replace(/:$/, ''));
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    ReZeroTurkce.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(chapterPath)];
                    case 1:
                        $ = _a.sent();
                        content = $('article.entry-content').first();
                        content
                            .find('script, style, noscript, iframe, ins, .wp-block-post-navigation-link')
                            .remove();
                        // Previous/next navigation rows are left empty once their links go.
                        content.find('.wp-block-columns').each(function (_i, el) {
                            var block = $(el);
                            if (!cleanText(block.text()) && !block.find('img').length)
                                block.remove();
                        });
                        content
                            .find('p')
                            .filter(function (_i, el) {
                            return /^\[adinserter[^\]]*\]$/.test(cleanText($(el).text()));
                        })
                            .remove();
                        // Drop inline event handlers and script URLs from the site's markup.
                        content.find('*').each(function (_i, el) {
                            for (var _a = 0, _b = Object.entries(el.attribs); _a < _b.length; _a++) {
                                var _c = _b[_a], name_1 = _c[0], value = _c[1];
                                if (/^on/i.test(name_1) || /^\s*javascript:/i.test(value))
                                    $(el).removeAttr(name_1);
                            }
                        });
                        return [2 /*return*/, content.html() || ''];
                }
            });
        });
    };
    ReZeroTurkce.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var term, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        term = normalize(searchTerm);
                        return [4 /*yield*/, this.popularNovels(1)];
                    case 1:
                        novels = _a.sent();
                        return [2 /*return*/, novels.filter(function (novel) { return normalize(novel.name).includes(term); })];
                }
            });
        });
    };
    return ReZeroTurkce;
}());
exports.default = new ReZeroTurkce();
