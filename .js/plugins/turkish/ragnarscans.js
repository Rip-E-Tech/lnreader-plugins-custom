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
var cheerio_1 = require("cheerio");
var novelStatus_1 = require("@libs/novelStatus");
var RagnarScans = /** @class */ (function () {
    function RagnarScans() {
        this.id = 'ragnarscans';
        this.name = 'Ragnar Scans';
        this.icon = 'src/tr/ragnarscans/icon.png';
        this.site = 'https://ragnarscans.net';
        this.version = '1.0.1';
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
                        url = pageNo > 1 ? "".concat(this.site, "/novel/page/").concat(pageNo, "/") : "".concat(this.site, "/novel/");
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
            var html, $, box;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (r) { return r.text(); })];
                    case 1:
                        html = _a.sent();
                        $ = (0, cheerio_1.load)(html);
                        box = $('#chapter-content');
                        box.find('script, style, ins, iframe, noscript, form, button').remove();
                        return [2 /*return*/, box.html() || $('.chapter-body').html() || ''];
                }
            });
        });
    };
    RagnarScans.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var page, url, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = pageNo > 1 ? "page/".concat(pageNo, "/") : '';
                        url = "".concat(this.site, "/").concat(page, "?s=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        html = _a.sent();
                        return [2 /*return*/, this.parseList(html)];
                }
            });
        });
    };
    return RagnarScans;
}());
exports.default = new RagnarScans();
cd / workspaces / lnreader - plugins - custom;
git;
checkout--;
gitignore;
npm;
run;
build: compile;
npm;
run;
build: manifest;
2 >  & 1 | tail - 3;
sed - i;
's#lnreader-plugins-custom/master/.js/src/plugins/#lnreader-plugins-custom/plugins/.js/plugins/#g'.dist / plugins.min.json.dist / plugins.json;
grep - o;
'"id":"ragnarscans".\{0,160\}'.dist / plugins.min.json;
