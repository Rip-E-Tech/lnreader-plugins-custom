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
var filterInputs_1 = require("@libs/filterInputs");
var novelStatus_1 = require("@libs/novelStatus");
var defaultCover_1 = require("@libs/defaultCover");
var VERIFY_MESSAGE = 'Cloudflare protection detected (HTTP error). Please try opening the plugin in WebView first to solve the challenge.';
var EDITION_TYPE = {
    '': undefined,
    ai: 'ai',
    cv: 'convert',
};
var TruyenDichPlugin = /** @class */ (function () {
    function TruyenDichPlugin() {
        var _this = this;
        this.id = 'truyendich';
        this.name = 'TruyenDich';
        this.icon = 'src/vi/truyendich/icon.png';
        this.site = 'https://truyendich.space';
        this.version = '1.0.0';
        this.resolveUrl = function (path) { return _this.site + '/' + path.replace(/^\//, ''); };
        this.filters = {
            list: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'List',
                value: 'truyen-hot',
                options: [
                    { label: 'Hot', value: 'truyen-hot' },
                    { label: 'New', value: 'truyen-moi' },
                    { label: 'Translated', value: 'truyen-dich' },
                    { label: 'AI translated', value: 'truyen-dich-ai' },
                    { label: 'Convert', value: 'truyen-convert' },
                    { label: 'Completed', value: 'truyen-full' },
                ],
            },
            edition: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Edition',
                value: '',
                options: [
                    { label: 'Default (translated if available)', value: '' },
                    { label: 'AI translated', value: 'ai' },
                    { label: 'Convert', value: 'cv' },
                ],
            },
        };
    }
    TruyenDichPlugin.prototype.getJson = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var res, body, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + path)];
                    case 1:
                        res = _a.sent();
                        if (res.status === 429) {
                            throw new Error('truyendich.space rate limited the request (HTTP 429), try again later.');
                        }
                        return [4 /*yield*/, res.text()];
                    case 2:
                        body = _a.sent();
                        try {
                            data = JSON.parse(body);
                        }
                        catch (_b) {
                            throw new Error("".concat(path, " -> HTTP ").concat(res.status, ", not JSON"));
                        }
                        if ((data === null || data === void 0 ? void 0 : data.detail) === 'VERIFY_HUMAN') {
                            throw new Error(VERIFY_MESSAGE);
                        }
                        if (!res.ok) {
                            throw new Error("".concat(path, " -> HTTP ").concat(res.status));
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    TruyenDichPlugin.prototype.novelPath = function (slug, edition) {
        return 'doc-truyen/' + (edition ? edition + '/' : '') + slug;
    };
    TruyenDichPlugin.prototype.parsePath = function (novelPath) {
        var m = novelPath.match(/^\/?doc-truyen\/(?:(ai|cv)\/)?([^/]+)/);
        if (!m) {
            throw new Error('Unrecognised path: ' + novelPath);
        }
        return { slug: m[2], edition: m[1] || '' };
    };
    TruyenDichPlugin.prototype.toNovelItem = function (item, edition) {
        return {
            name: item.title,
            path: this.novelPath(item.slug, edition),
            cover: item.image_url ? this.site + item.image_url : defaultCover_1.defaultCover,
        };
    };
    TruyenDichPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var list, edition, page;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        list = showLatestNovels ? 'truyen-moi' : filters.list.value;
                        edition = filters.edition.value;
                        return [4 /*yield*/, this.getJson("/api/lists/".concat(list, "?page=").concat(pageNo, "&size=24"))];
                    case 1:
                        page = _c.sent();
                        return [2 /*return*/, page.items.map(function (item) { return _this.toNovelItem(item, edition); })];
                }
            });
        });
    };
    TruyenDichPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, slug, edition, data, novel, PAGE_SIZE, CONCURRENT_PAGES, editionQuery, chaptersUrl, first, pages, pageCount, p, batch, q, results;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.parsePath(novelPath), slug = _a.slug, edition = _a.edition;
                        return [4 /*yield*/, this.getJson("/api/novels/".concat(encodeURIComponent(slug)))];
                    case 1:
                        data = _c.sent();
                        novel = {
                            path: novelPath,
                            name: data.title,
                            cover: data.image_url ? this.site + data.image_url : defaultCover_1.defaultCover,
                            author: data.author || undefined,
                            genres: ((_b = data.categories) === null || _b === void 0 ? void 0 : _b.map(function (c) { return c.name; }).join(', ')) || undefined,
                            summary: data.description
                                ? data.description
                                    .replace(/<br\s*\/?>/gi, '\n')
                                    .replace(/<\/p>/gi, '\n')
                                    .replace(/<[^>]+>/g, '')
                                    .replace(/\n{3,}/g, '\n\n')
                                    .trim()
                                : undefined,
                            status: data.status === 'ongoing'
                                ? novelStatus_1.NovelStatus.Ongoing
                                : data.status === 'completed'
                                    ? novelStatus_1.NovelStatus.Completed
                                    : novelStatus_1.NovelStatus.Unknown,
                        };
                        PAGE_SIZE = 200;
                        CONCURRENT_PAGES = 4;
                        editionQuery = EDITION_TYPE[edition]
                            ? '&edition_type=' + EDITION_TYPE[edition]
                            : '';
                        chaptersUrl = function (page) {
                            return "/api/novels/".concat(encodeURIComponent(slug), "/chapters?page=").concat(page, "&size=").concat(PAGE_SIZE).concat(editionQuery);
                        };
                        return [4 /*yield*/, this.getJson(chaptersUrl(1))];
                    case 2:
                        first = _c.sent();
                        pages = [first.items];
                        pageCount = Math.ceil(first.total / PAGE_SIZE);
                        p = 2;
                        _c.label = 3;
                    case 3:
                        if (!(p <= pageCount)) return [3 /*break*/, 6];
                        batch = [];
                        for (q = p; q < p + CONCURRENT_PAGES && q <= pageCount; q++) {
                            batch.push(this.getJson(chaptersUrl(q)));
                        }
                        return [4 /*yield*/, Promise.all(batch)];
                    case 4:
                        results = _c.sent();
                        pages.push.apply(pages, results.map(function (r) { return r.items; }));
                        _c.label = 5;
                    case 5:
                        p += CONCURRENT_PAGES;
                        return [3 /*break*/, 3];
                    case 6:
                        novel.chapters = pages
                            .flat()
                            .sort(function (a, b) { return a.chapter_number - b.chapter_number; })
                            .map(function (ch) { return ({
                            name: ch.title
                                ? "Chapter ".concat(ch.chapter_number, ": ").concat(ch.title)
                                : "Chapter ".concat(ch.chapter_number),
                            path: "".concat(_this.novelPath(slug, edition), "/chuong-").concat(ch.chapter_number),
                            chapterNumber: ch.chapter_number,
                            releaseTime: ch.update_time || undefined,
                        }); });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    TruyenDichPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, slug, edition, num, editionQuery, data, content;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.parsePath(chapterPath), slug = _a.slug, edition = _a.edition;
                        num = (_b = chapterPath.match(/\/chuong-(\d+)\s*$/)) === null || _b === void 0 ? void 0 : _b[1];
                        if (!num) {
                            throw new Error('Unrecognised chapter path: ' + chapterPath);
                        }
                        editionQuery = EDITION_TYPE[edition]
                            ? '?edition_type=' + EDITION_TYPE[edition]
                            : '';
                        return [4 /*yield*/, this.getJson("/api/novels/".concat(encodeURIComponent(slug), "/chapters/").concat(num).concat(editionQuery))];
                    case 1:
                        data = _c.sent();
                        // After a few chapters the site returns an empty body and asks for a
                        // Turnstile check; the app's WebView shares its cookies with fetchApi.
                        if (!data.content && data.trust_challenge) {
                            throw new Error(VERIFY_MESSAGE);
                        }
                        content = (data.content || '').replace(/<\/?content>/gi, '').trim();
                        if (!/<(br|p)\b/i.test(content)) {
                            content = content.replace(/\n/g, '<br>');
                        }
                        return [2 /*return*/, content];
                }
            });
        });
    };
    TruyenDichPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getJson("/api/novels/search?q=".concat(encodeURIComponent(searchTerm), "&page=").concat(pageNo, "&size=24"))];
                    case 1:
                        page = _a.sent();
                        return [2 /*return*/, page.items.map(function (item) { return _this.toNovelItem(item, ''); })];
                }
            });
        });
    };
    return TruyenDichPlugin;
}());
exports.default = new TruyenDichPlugin();
