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
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var novelStatus_1 = require("@libs/novelStatus");
var CHAPTER_PATH = /^\/truyen\/([^/]+)\/chuong-(\d+)$/;
var TruyenSS = /** @class */ (function () {
    function TruyenSS() {
        this.id = 'truyenss.com';
        this.name = 'TruyenSS';
        this.icon = 'src/vi/truyenss/icon.png';
        this.site = 'https://truyenss.com';
        this.version = '1.0.0';
        this.imageRequestInit = {
            headers: { Referer: this.site + '/' },
        };
        this.filters = {
            genre: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Thể loại',
                value: 'tien-hiep',
                options: [
                    { label: 'Tiên Hiệp', value: 'tien-hiep' },
                    { label: 'Nữ Cường', value: 'nu-cuong' },
                    { label: 'Xuyên Không', value: 'xuyen-khong' },
                    { label: 'Điền Văn', value: 'dien-van' },
                    { label: 'Thám Hiểm', value: 'tham-hiem' },
                    { label: 'Linh Dị', value: 'linh-di' },
                    { label: 'Truyện Ngược', value: 'truyen-nguoc' },
                    { label: 'Truyện Sủng', value: 'truyen-sung' },
                    { label: 'Đông Phương', value: 'dong-phuong' },
                    { label: 'Hài Hước', value: 'hai-huoc' },
                    { label: 'Hiện Đại', value: 'hien-dai' },
                    { label: 'Quân Sự', value: 'quan-su' },
                    { label: 'Mạt Thế', value: 'mat-the' },
                    { label: 'Trọng Sinh', value: 'trong-sinh' },
                    { label: 'Đồng Nhân', value: 'dong-nhan' },
                    { label: 'Quan Trường', value: 'quan-truong' },
                    { label: 'Cổ Đại', value: 'co-dai' },
                    { label: 'Hệ Thống', value: 'he-thong' },
                    { label: 'Phương Tây', value: 'phuong-tay' },
                    { label: 'Lịch Sử', value: 'lich-su' },
                    { label: 'Ngôn Tình', value: 'ngon-tinh' },
                    { label: 'Huyền Huyễn', value: 'huyen-huyen' },
                    { label: 'Kiếm Hiệp', value: 'kiem-hiep' },
                    { label: 'Võng Du', value: 'vong-du' },
                    { label: 'Trinh Thám', value: 'trinh-tham' },
                    { label: 'Khoa Huyễn', value: 'khoa-huyen' },
                    { label: 'Dị Năng', value: 'di-nang' },
                    { label: 'Gia Đấu Cung Đấu', value: 'gia-dau-cung-dau' },
                    { label: 'Góc Nhìn Nữ', value: 'goc-nhin-nu' },
                    { label: 'Góc Nhìn Nam', value: 'goc-nhin-nam' },
                ],
            },
        };
    }
    Object.defineProperty(TruyenSS.prototype, "sitePlaceholderCover", {
        /** Host-local placeholder from the site (og:image); works with plugin Referer headers. */
        get: function () {
            return "".concat(this.site, "/images/no_avatar.jpg");
        },
        enumerable: false,
        configurable: true
    });
    TruyenSS.prototype.resolveCoverUrl = function (raw, pageUrl) {
        if (!raw)
            return undefined;
        var u = raw.trim();
        if (!u || u.startsWith('data:'))
            return undefined;
        try {
            if (u.startsWith('//'))
                return 'https:' + u;
            if (u.startsWith('http'))
                return u;
            return new URL(u, pageUrl).href;
        }
        catch (_a) {
            return undefined;
        }
    };
    TruyenSS.prototype.coverFromTruyenAnchor = function (loadedCheerio, el, pageUrl) {
        var _this = this;
        var $a = loadedCheerio(el);
        var fromImg = function (img) {
            var src = img.attr('data-src') ||
                img.attr('data-lazy-src') ||
                img.attr('data-original') ||
                img.attr('src');
            return _this.resolveCoverUrl(src, pageUrl);
        };
        var inner = fromImg($a.find('img').first());
        if (inner)
            return inner;
        var cardImg = $a.closest('.card').find('img').first();
        var fromCard = fromImg(cardImg);
        if (fromCard)
            return fromCard;
        var rowImg = $a.closest('.row').find('img').first();
        var fromRow = fromImg(rowImg);
        if (fromRow)
            return fromRow;
        return this.sitePlaceholderCover;
    };
    TruyenSS.prototype.collectTruyenLinks = function (loadedCheerio, pageUrl) {
        var _this = this;
        var novels = [];
        var seen = new Set();
        loadedCheerio('a[href^="/truyen/"]').each(function (_, el) {
            var href = el.attribs['href'];
            if (!href || href.split('/').length !== 3)
                return;
            var path = href.split('?')[0];
            if (seen.has(path))
                return;
            seen.add(path);
            var name = loadedCheerio(el).text().replace(/\s+/g, ' ').trim();
            if (!name)
                return;
            var cover = _this.coverFromTruyenAnchor(loadedCheerio, el, pageUrl);
            novels.push({ path: path, name: name, cover: cover });
        });
        return novels;
    };
    TruyenSS.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var body_1, genre, url, body;
            var _c;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!showLatestNovels) return [3 /*break*/, 2];
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/').then(function (r) { return r.text(); })];
                    case 1:
                        body_1 = _d.sent();
                        return [2 /*return*/, this.collectTruyenLinks((0, cheerio_1.load)(body_1), "".concat(this.site, "/"))];
                    case 2:
                        genre = (_c = filters === null || filters === void 0 ? void 0 : filters.genre.value) !== null && _c !== void 0 ? _c : 'tien-hiep';
                        url = pageNo <= 1
                            ? "".concat(this.site, "/").concat(genre)
                            : "".concat(this.site, "/").concat(genre, "?page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 3:
                        body = _d.sent();
                        return [2 /*return*/, this.collectTruyenLinks((0, cheerio_1.load)(body), url)];
                }
            });
        });
    };
    TruyenSS.prototype.parseStatusLine = function (raw) {
        var t = raw.toLowerCase();
        if (t.includes('hoàn') || t.includes('full'))
            return novelStatus_1.NovelStatus.Completed;
        if (t.includes('đang') || t.includes('ra chương'))
            return novelStatus_1.NovelStatus.Ongoing;
        return novelStatus_1.NovelStatus.Unknown;
    };
    TruyenSS.prototype.parseChapters = function (loadedCheerio, novelPath) {
        var chapters = [];
        var h2 = loadedCheerio('h2')
            .filter(function (_, el) { return loadedCheerio(el).text().includes('Danh Sách Chương'); })
            .first();
        var container = h2.next('div.position-relative');
        var anchors = container.length
            ? container.find('a[href^="#"]')
            : loadedCheerio('#inner-page a[href^="#"]');
        anchors.each(function (_, el) {
            var href = el.attribs['href'];
            if (!(href === null || href === void 0 ? void 0 : href.startsWith('#')))
                return;
            var num = Number(href.slice(1));
            if (!Number.isFinite(num) || num <= 0)
                return;
            var name = loadedCheerio(el).text().replace(/\s+/g, ' ').trim();
            chapters.push({
                name: name || "Ch\u01B0\u01A1ng ".concat(num),
                path: "".concat(novelPath, "/chuong-").concat(num),
                chapterNumber: num,
            });
        });
        chapters.sort(function (a, b) { var _a, _b; return ((_a = a.chapterNumber) !== null && _a !== void 0 ? _a : 0) - ((_b = b.chapterNumber) !== null && _b !== void 0 ? _b : 0); });
        return chapters;
    };
    TruyenSS.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var path, url, body, loadedCheerio, novel, coverSrc, infoBlock, infoText, authorMatch, statusMatch, intro, block;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        path = novelPath;
                        url = this.site + path;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: path,
                            name: loadedCheerio('#inner-page > h1').first().text().trim() ||
                                loadedCheerio('main#main h1').first().text().trim() ||
                                'Không có tiêu đề',
                            chapters: [],
                        };
                        coverSrc = loadedCheerio('.info_truyen img.avatar').attr('src');
                        novel.cover =
                            (_a = this.resolveCoverUrl(coverSrc, url)) !== null && _a !== void 0 ? _a : this.sitePlaceholderCover;
                        infoBlock = loadedCheerio('.info_truyen').first();
                        infoText = infoBlock.text();
                        authorMatch = infoText.match(/Tác\s*Giả:\s*([^\n\r]+)/i);
                        if (authorMatch)
                            novel.author = authorMatch[1].trim();
                        statusMatch = infoText.match(/Tình\s*Trạng:\s*([^\n\r]+)/i);
                        if (statusMatch)
                            novel.status = this.parseStatusLine(statusMatch[1]);
                        novel.genres = loadedCheerio('p.tags a.badge')
                            .toArray()
                            .map(function (a) { return loadedCheerio(a).text().trim(); })
                            .filter(Boolean)
                            .join(', ');
                        intro = loadedCheerio('#inner-page .position-relative.mt-4 .line-height-3').first();
                        if (intro.length) {
                            block = intro.clone();
                            block.find('script, style').remove();
                            block.find('br').replaceWith('\n');
                            block.find('p').before('\n').after('\n\n');
                            novel.summary = block
                                .text()
                                .split('\n')
                                .map(function (line) { return line.replace(/\s+/g, ' ').trim(); })
                                .filter(Boolean)
                                .join('\n')
                                .replace(/\n{3,}/g, '\n\n')
                                .trim();
                        }
                        novel.chapters = this.parseChapters(loadedCheerio, path);
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    TruyenSS.prototype.extractChapterBody = function ($) {
        var _a, _b;
        $('script, style').remove();
        var best = '';
        var bestP = 0;
        $('div').each(function (_, el) {
            var _a;
            var div = $(el);
            var pCount = div.find('p').length;
            if (pCount > bestP) {
                bestP = pCount;
                best = (_a = div.html()) !== null && _a !== void 0 ? _a : '';
            }
        });
        if (bestP >= 2)
            return best;
        var fallback = (_b = (_a = $('body').html()) !== null && _a !== void 0 ? _a : $.root().html()) !== null && _b !== void 0 ? _b : '';
        return fallback;
    };
    TruyenSS.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var rel, m, folder, chuong, referer, qs, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rel = chapterPath;
                        if (rel.startsWith(this.site)) {
                            rel = rel.slice(this.site.length);
                        }
                        m = rel.match(CHAPTER_PATH);
                        if (!m)
                            throw new Error("TruyenSS: invalid chapter path: ".concat(rel));
                        folder = m[1];
                        chuong = m[2];
                        referer = "".concat(this.site, "/truyen/").concat(folder);
                        qs = new URLSearchParams({ folder: folder, chuong: chuong }).toString();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/layout/xem-chuong.php?").concat(qs), {
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest',
                                    Referer: referer,
                                },
                            }).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        if (!body.trim()) {
                            throw new Error('TruyenSS: empty chapter response');
                        }
                        return [2 /*return*/, this.extractChapterBody((0, cheerio_1.load)(body))];
                }
            });
        });
    };
    TruyenSS.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var q, tryUrls, _i, tryUrls_1, tryUrl, body, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = encodeURIComponent(searchTerm.trim());
                        if (!q)
                            return [2 /*return*/, []];
                        tryUrls = [
                            "".concat(this.site, "/tim-kiem?q=").concat(q, "&page=").concat(pageNo),
                            "".concat(this.site, "/tim-kiem/").concat(q, "?page=").concat(pageNo),
                            "".concat(this.site, "/tim-truyen?tu-khoa=").concat(q, "&page=").concat(pageNo),
                        ];
                        _i = 0, tryUrls_1 = tryUrls;
                        _a.label = 1;
                    case 1:
                        if (!(_i < tryUrls_1.length)) return [3 /*break*/, 4];
                        tryUrl = tryUrls_1[_i];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(tryUrl).then(function (r) { return r.text(); })];
                    case 2:
                        body = _a.sent();
                        novels = this.collectTruyenLinks((0, cheerio_1.load)(body), tryUrl);
                        if (novels.length)
                            return [2 /*return*/, novels];
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, []];
                }
            });
        });
    };
    return TruyenSS;
}());
exports.default = new TruyenSS();
