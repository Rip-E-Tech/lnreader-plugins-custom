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
var novelStatus_1 = require("@libs/novelStatus");
var filterInputs_1 = require("@libs/filterInputs");
var BakaInUa = /** @class */ (function () {
    function BakaInUa() {
        this.id = 'bakainua';
        this.name = 'BakaInUA';
        this.icon = 'src/uk/bakainua/icon.png';
        this.site = 'https://baka.in.ua';
        this.version = '3.1.7';
        this.filters = {
            genre: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Жанр',
                value: '',
                options: [
                    { label: 'Всі жанри', value: '' },
                    { label: 'BL', value: '19' },
                    { label: 'GL', value: '20' },
                    { label: 'Авторське', value: '32' },
                    { label: 'Бойовик', value: '2' },
                    { label: 'Вуся', value: '16' },
                    { label: 'Гарем', value: '5' },
                    { label: 'Детектив', value: '22' },
                    { label: 'Драма', value: '12' },
                    { label: 'Жахи', value: '10' },
                    { label: 'Ісекай', value: '13' },
                    { label: 'Історичне', value: '15' },
                    { label: 'Комедія', value: '11' },
                    { label: 'ЛГБТ', value: '3' },
                    { label: 'Містика', value: '18' },
                    { label: 'Омегаверс', value: '30' },
                    { label: 'Повсякденність', value: '17' },
                    { label: 'Пригоди', value: '7' },
                    { label: 'Психологія', value: '28' },
                    { label: 'Романтика', value: '1' },
                    { label: 'Спорт', value: '9' },
                    { label: 'Сюаньхвань', value: '27' },
                    { label: 'Сянься', value: '26' },
                    { label: 'Трагедія', value: '24' },
                    { label: 'Трилер', value: '21' },
                    { label: 'Фантастика', value: '8' },
                    { label: 'Фанфік', value: '23' },
                    { label: 'Фентезі', value: '4' },
                    { label: 'Школа', value: '6' },
                ],
            },
            only_new: { type: filterInputs_1.FilterTypes.Switch, label: 'Новинки', value: false },
            longreads: { type: filterInputs_1.FilterTypes.Switch, label: 'Довгочити', value: false },
            finished: { type: filterInputs_1.FilterTypes.Switch, label: 'Завершене', value: false },
        };
    }
    BakaInUa.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var fictionIds, url, result, body, $, requests, novels;
            var _this = this;
            var filters = _b.filters, showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fictionIds = [];
                        url = new URL(this.site + '/fictions/alphabetical');
                        if (pageNo > 1)
                            url.searchParams.append('page', pageNo.toString());
                        if (showLatestNovels || (filters && filters.only_new.value))
                            url.searchParams.append('only_new', '1');
                        if (filters) {
                            if (filters.longreads.value)
                                url.searchParams.append('longreads', '1');
                            if (filters.finished.value)
                                url.searchParams.append('finished', '1');
                            if (filters.genre.value !== '')
                                url.searchParams.append('genre', filters.genre.value);
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url.toString(), {
                                headers: { 'user-agent': 'Mozilla/5.0' },
                            })];
                    case 1:
                        result = _c.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _c.sent();
                        $ = (0, cheerio_1.load)(body);
                        $('[data-fiction-picker-id-param]').each(function (_, elem) {
                            var id = $(elem).attr('data-fiction-picker-id-param');
                            if (id)
                                fictionIds.push(id);
                        });
                        requests = fictionIds.map(function (id) { return __awaiter(_this, void 0, void 0, function () {
                            var res, detailHtml, $d, link, e_1;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/fictions/").concat(id, "/details"), {
                                                headers: { 'user-agent': 'Mozilla/5.0' },
                                            })];
                                    case 1:
                                        res = _b.sent();
                                        return [4 /*yield*/, res.text()];
                                    case 2:
                                        detailHtml = _b.sent();
                                        $d = (0, cheerio_1.load)(detailHtml);
                                        link = $d('a').first();
                                        return [2 /*return*/, {
                                                name: $d('h3').text().trim(),
                                                path: ((_a = link.attr('href')) === null || _a === void 0 ? void 0 : _a.replace(this.site + '/', '')) || '',
                                                cover: this.site + link.find('img').attr('src'),
                                            }];
                                    case 3:
                                        e_1 = _b.sent();
                                        return [2 /*return*/, null];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(requests)];
                    case 3:
                        novels = _c.sent();
                        return [2 /*return*/, novels.filter(function (n) { return n !== null; })];
                }
            });
        });
    };
    BakaInUa.prototype.parseNovel = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, $, translators, selected, url, translatedRes, translatedBody, $$, cover, novel, statusText, chapters;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/' + novelUrl, {
                            headers: { 'user-agent': 'Mozilla/5.0' },
                        })];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        $ = (0, cheerio_1.load)(body);
                        translators = $('turbo-frame#alternative-tabs form')
                            .map(function (_, form) {
                            var name = $(form).find('button span').first().text().trim();
                            var ids = $(form)
                                .find('input[name="translator[]"]')
                                .map(function (_, input) { return $(input).attr('value') || ''; })
                                .get();
                            return { name: name, ids: ids };
                        })
                            .get();
                        selected = translators[0];
                        url = new URL(this.site + '/' + novelUrl);
                        if ((_a = selected === null || selected === void 0 ? void 0 : selected.ids) === null || _a === void 0 ? void 0 : _a.length) {
                            selected.ids.forEach(function (id) { return url.searchParams.append('translator[]', id); });
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url.toString(), {
                                headers: { 'user-agent': 'Mozilla/5.0' },
                            })];
                    case 3:
                        translatedRes = _b.sent();
                        return [4 /*yield*/, translatedRes.text()];
                    case 4:
                        translatedBody = _b.sent();
                        $$ = (0, cheerio_1.load)(translatedBody);
                        cover = $$('meta[property="og:image"]').attr('content') || '';
                        if (cover && !cover.startsWith('http')) {
                            cover = this.site + cover;
                        }
                        novel = {
                            path: novelUrl,
                            name: $$('h1').first().text().trim(),
                            author: $$('#fictions-author-search').text().trim() || 'Невідомо',
                            artist: $$('#fictions-author-search').text().trim() || 'Невідомо',
                            cover: cover,
                            summary: $$('div.whitespace-pre-line')
                                .first()
                                .text()
                                .replace(/\s+/g, ' ')
                                .trim(),
                            genres: $$('div.flex.flex-wrap.gap-2 span')
                                .map(function (_, el) { return $$(el).text().trim(); })
                                .get()
                                .join(', '),
                        };
                        statusText = $$('div.text-sm:contains("Статус")') // Знаходимо підпис "Статус"
                            .prev('div.text-2xl') // Беремо попередній div з класом text-2xl
                            .text()
                            .trim();
                        if (statusText.includes('Заверш')) {
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        }
                        else if (statusText.includes('Видаєт')) {
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        }
                        else if (statusText.includes('Покину')) {
                            novel.status = novelStatus_1.NovelStatus.OnHiatus;
                        }
                        else {
                            novel.status = novelStatus_1.NovelStatus.Unknown;
                        }
                        chapters = [];
                        $$('li.group a[href*="/chapters/"]').each(function (_, elem) {
                            var href = $$(elem).attr('href') || '';
                            chapters.push({
                                name: $$(elem).find('span').eq(1).text().trim() || 'Розділ',
                                path: href.replace(_this.site + '/', ''),
                                chapterNumber: parseFloat($$(elem).find('span').eq(0).text().replace(',', '.')) || 0,
                                releaseTime: $$(elem).find('span').eq(2).text().trim(),
                            });
                        });
                        novel.chapters = chapters.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    BakaInUa.prototype.parseChapter = function (chapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, $, content, hiddenData, chapterHtml, match;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/' + chapterUrl, {
                            headers: { 'user-agent': 'Mozilla/5.0' },
                        })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        content = $('.trix-content, .prose, article, #chapter-content').first();
                        // Якщо основний селектор порожній, шукаємо прихований текст у data-атрібутах (особливість Hotwire/Turbo)
                        if (!content.text().trim()) {
                            hiddenData = $('[data-chapter-content-value]').attr('data-chapter-content-value');
                            if (hiddenData)
                                return [2 /*return*/, hiddenData];
                        }
                        content.find('script, style, button, form, .ads, .social-share').remove();
                        chapterHtml = content.html();
                        // Останній шанс: пошук тексту в JSON всередині скриптів через Regex
                        if (!chapterHtml || chapterHtml.trim().length < 100) {
                            match = body.match(/"content\\":\\"(.*?)\\"/);
                            if (match && match[1]) {
                                chapterHtml = match[1]
                                    .replace(/\\n/g, '<br>')
                                    .replace(/\\"/g, '"')
                                    .replace(/\\u003c/g, '<')
                                    .replace(/\\u003e/g, '>');
                            }
                        }
                        return [2 /*return*/, (chapterHtml ||
                                'Контент не знайдено. Можливо, потрібна авторизація на сайті.')];
                }
            });
        });
    };
    BakaInUa.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, $, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/search?filter=fiction&search[]=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: { 'user-agent': 'Mozilla/5.0' },
                            })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        $('turbo-frame#fictions-section a[href^="/fictions/"]').each(function (_, elem) {
                            var link = $(elem);
                            var href = link.attr('href') || '';
                            if (!href)
                                return;
                            // витягуємо id
                            var id = href.replace(/^\/fictions\//, '').replace(/^\/+/, '');
                            var name = link.find('h3').first().text().trim();
                            var img = link.closest('.group').find('img').attr('src');
                            novels.push({
                                path: "/fictions/".concat(id), // гарантуємо правильний формат
                                name: name,
                                cover: img ? _this.site + img : '',
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return BakaInUa;
}());
exports.default = new BakaInUa();
