"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("@libs/fetch");
var htmlparser2_1 = require("htmlparser2");
var cheerio_1 = require("cheerio");
var novelStatus_1 = require("@libs/novelStatus");
var filterInputs_1 = require("@libs/filterInputs");
var ParseNovelAction;
(function (ParseNovelAction) {
    ParseNovelAction["Unknown"] = "Unknown";
    ParseNovelAction["GetName"] = "GetName";
    ParseNovelAction["GetSummary"] = "GetSummary";
    ParseNovelAction["GetInfos"] = "GetInfos";
    ParseNovelAction["GetGenres"] = "GetGenres";
    ParseNovelAction["GetCover"] = "GetCover";
    ParseNovelAction["GetVolumes"] = "GetVolumes";
})(ParseNovelAction || (ParseNovelAction = {}));
var HakoPlugin = /** @class */ (function () {
    function HakoPlugin() {
        this.id = 'ln.hako';
        this.name = 'Hako';
        this.icon = 'src/vi/hakolightnovel/icon.png';
        this.site = 'https://ln.hako.vn';
        this.version = '1.2.1';
        this.imageRequestInit = {
            headers: {
                Referer: this.site,
            },
        };
        this.filters = {
            alphabet: {
                type: filterInputs_1.FilterTypes.Picker,
                value: '',
                label: 'Chữ cái',
                options: [
                    { label: 'Tất cả', value: '' },
                    { label: 'Khác', value: 'khac' },
                    { label: 'A', value: 'a' },
                    { label: 'B', value: 'b' },
                    { label: 'C', value: 'c' },
                    { label: 'D', value: 'd' },
                    { label: 'E', value: 'e' },
                    { label: 'F', value: 'f' },
                    { label: 'G', value: 'g' },
                    { label: 'H', value: 'h' },
                    { label: 'I', value: 'i' },
                    { label: 'J', value: 'j' },
                    { label: 'K', value: 'k' },
                    { label: 'L', value: 'l' },
                    { label: 'M', value: 'm' },
                    { label: 'N', value: 'n' },
                    { label: 'O', value: 'o' },
                    { label: 'P', value: 'p' },
                    { label: 'Q', value: 'q' },
                    { label: 'R', value: 'r' },
                    { label: 'S', value: 's' },
                    { label: 'T', value: 't' },
                    { label: 'U', value: 'u' },
                    { label: 'V', value: 'v' },
                    { label: 'W', value: 'w' },
                    { label: 'X', value: 'x' },
                    { label: 'Y', value: 'y' },
                    { label: 'Z', value: 'z' },
                ],
            },
            type: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Phân loại',
                value: [],
                options: [
                    { label: 'Truyện dịch', value: 'truyendich' },
                    { label: 'Truyện sáng tác', value: 'sangtac' },
                    { label: 'Convert', value: 'convert' },
                ],
            },
            status: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Tình trạng',
                value: [],
                options: [
                    { label: 'Đang tiến hành', value: 'dangtienhanh' },
                    { label: 'Tạm ngưng', value: 'tamngung' },
                    { label: 'Đã hoàn thành', value: 'hoanthanh' },
                ],
            },
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Sắp xếp',
                value: 'top',
                options: [
                    { label: 'A-Z', value: 'tentruyen' },
                    { label: 'Z-A', value: 'tentruyenza' },
                    { label: 'Mới cập nhật', value: 'capnhat' },
                    { label: 'Truyện mới', value: 'truyenmoi' },
                    { label: 'Theo dõi', value: 'theodoi' },
                    { label: 'Top toàn thời gian', value: 'top' },
                    { label: 'Top tháng', value: 'topthang' },
                    { label: 'Số từ', value: 'sotu' },
                ],
            },
        };
    }
    HakoPlugin.prototype.parseNovels = function (url) {
        return (0, fetch_1.fetchApi)(url)
            .then(function (res) { return res.text(); })
            .then(function (html) {
            var novels = [];
            var tempNovel = {};
            var isGettingUrl = false;
            var isParsingNovel = false;
            var parser = new htmlparser2_1.Parser({
                onopentag: function (name, attribs) {
                    var _a, _b, _c;
                    if ((_a = attribs['class']) === null || _a === void 0 ? void 0 : _a.includes('thumb-item-flow')) {
                        isParsingNovel = true;
                    }
                    if (isParsingNovel) {
                        if ((_b = attribs['class']) === null || _b === void 0 ? void 0 : _b.includes('series-title')) {
                            isGettingUrl = true;
                        }
                        if ((_c = attribs['class']) === null || _c === void 0 ? void 0 : _c.includes('img-in-ratio')) {
                            tempNovel.cover = attribs['data-bg'];
                        }
                        if (isGettingUrl && name === 'a') {
                            tempNovel.name = attribs['title'];
                            tempNovel.path = attribs['href'];
                            novels.push(tempNovel);
                            tempNovel = {}; // re-assign new reference
                            isGettingUrl = false;
                            isParsingNovel = false;
                        }
                    }
                },
            });
            parser.write(html);
            parser.end();
            return novels;
        });
    };
    HakoPlugin.prototype.popularNovels = function (pageNo, _a) {
        var showLatestNovels = _a.showLatestNovels, filters = _a.filters;
        var link = this.site + '/danh-sach';
        if (showLatestNovels) {
            link += '?sapxep=capnhat&page=' + pageNo;
        }
        else if (filters) {
            if (filters.alphabet.value) {
                link += '/' + filters.alphabet.value;
            }
            var params = new URLSearchParams();
            for (var _i = 0, _b = filters.type.value; _i < _b.length; _i++) {
                var novelType = _b[_i];
                params.append(novelType, '1');
            }
            for (var _c = 0, _d = filters.status.value; _c < _d.length; _c++) {
                var status_1 = _d[_c];
                params.append(status_1, '1');
            }
            params.append('sapxep', filters.sort.value);
            link += '?' + params.toString() + '&page=' + pageNo;
        }
        else {
            link += '?page=' + pageNo;
        }
        return this.parseNovels(link);
    };
    HakoPlugin.prototype.parseNovel = function (novelPath) {
        var novel = {
            path: novelPath,
            name: '',
            author: '',
            artist: '',
            summary: '',
            genres: '',
            status: '',
        };
        var chapters = [];
        var getNameHandler = {
            isDone: false,
            isStarted: false,
            onopentag: function (name) {
                if (name === 'a') {
                    this.isStarted = true;
                }
            },
            ontext: function (data) {
                novel.name += data;
            },
            onclosetag: function () {
                if (this.isStarted) {
                    this.isDone = true;
                }
            },
        };
        var getSummaryHandler = {
            newLine: false,
            ontext: function (data) {
                if (this.newLine) {
                    this.newLine = false;
                    novel.summary += '\n' + data;
                }
                else {
                    novel.summary += data;
                }
            },
            onclosetag: function () {
                this.newLine = true;
            },
        };
        var getGenresHandler = {
            ontext: function (data) {
                novel.genres += data;
            },
        };
        var InfoItem;
        (function (InfoItem) {
            InfoItem[InfoItem["Author"] = 0] = "Author";
            InfoItem[InfoItem["Artist"] = 1] = "Artist";
            InfoItem[InfoItem["Status"] = 2] = "Status";
            InfoItem[InfoItem["Unknown"] = 3] = "Unknown";
        })(InfoItem || (InfoItem = {}));
        // Rows are identified by their label: the site omits rows (e.g. author) on most series now.
        var getInfosHandler = {
            isStarted: false,
            isDone: false,
            info: InfoItem.Unknown,
            label: '',
            isReadingLabel: false,
            onopentag: function (name, attribs) {
                if (attribs['class'] === 'info-name') {
                    this.isReadingLabel = true;
                    this.label = '';
                }
                else if (name === 'a') {
                    this.isStarted = true;
                }
            },
            ontext: function (data) {
                if (this.isReadingLabel) {
                    this.label += data;
                }
                else if (this.isStarted) {
                    switch (this.info) {
                        case InfoItem.Author:
                            novel.author += data;
                            break;
                        case InfoItem.Artist:
                            novel.artist += data;
                            break;
                        case InfoItem.Status:
                            novel.status += data;
                            break;
                        default:
                            break;
                    }
                }
            },
            onclosetag: function (name) {
                if (this.isReadingLabel) {
                    this.isReadingLabel = false;
                    if (this.label.includes('Tác giả')) {
                        this.info = InfoItem.Author;
                    }
                    else if (this.label.includes('Họa sĩ')) {
                        this.info = InfoItem.Artist;
                    }
                    else if (this.label.includes('Tình trạng')) {
                        this.info = InfoItem.Status;
                    }
                    else {
                        this.info = InfoItem.Unknown;
                    }
                }
                else if (name === 'a') {
                    this.isStarted = false;
                }
                else if (name === 'div') {
                    this.isDone = true;
                }
            },
        };
        var getChapterListHandler = {
            currentVolume: '',
            num: 0,
            part: 1,
            isStarted: false,
            readingTime: false,
            tempChapter: {},
            onopentag: function (name, attribs) {
                var _a, _b;
                if (this.isStarted) {
                    if (name === 'a' && attribs['title']) {
                        var chapterName = attribs['title'];
                        var chapterNumber = Number((_a = chapterName.match(/Chương\s*(\d+)/i)) === null || _a === void 0 ? void 0 : _a[1]);
                        if (chapterNumber) {
                            if (this.num === chapterNumber) {
                                chapterNumber = this.num + this.part / 10;
                                this.part += 1;
                            }
                            else {
                                this.num = chapterNumber;
                                this.part = 1;
                            }
                        }
                        else {
                            chapterNumber = this.num + this.part / 10;
                            this.part++;
                        }
                        this.tempChapter = {
                            path: (_b = attribs['href']) === null || _b === void 0 ? void 0 : _b.replace(/^(https?:\/\/[^/]+)/, ''),
                            name: chapterName,
                            page: this.currentVolume,
                            chapterNumber: chapterNumber,
                        };
                    }
                    else if (attribs['class'] === 'chapter-time' &&
                        this.tempChapter.path) {
                        this.readingTime = true;
                    }
                }
            },
            ontext: function (data) {
                if (this.readingTime) {
                    // DD/MM/YYYY -> YYYY-MM-DD: a date-only value has no timezone to shift it by a day.
                    var chapterTime = data.trim().split('/');
                    if (chapterTime.length === 3) {
                        this.tempChapter.releaseTime = [
                            chapterTime[2],
                            chapterTime[1],
                            chapterTime[0],
                        ].join('-');
                    }
                    chapters.push(this.tempChapter);
                    this.readingTime = false;
                    this.tempChapter = {};
                }
            },
            onclosetag: function () {
                if (this.readingTime)
                    this.readingTime = false;
            },
        };
        var getVolumesHandler = {
            isStarted: false,
            isDone: false,
            isParsingChapterList: false,
            onopentag: function (name, attribs) {
                var _a;
                if (attribs['class'] === 'sect-title') {
                    this.isStarted = true;
                    getChapterListHandler.currentVolume = '';
                }
                if (name === 'ul') {
                    getChapterListHandler.isStarted = true;
                    getChapterListHandler.num = 0;
                    getChapterListHandler.part = 1;
                }
                (_a = getChapterListHandler.onopentag) === null || _a === void 0 ? void 0 : _a.call(getChapterListHandler, name, attribs);
            },
            ontext: function (data) {
                var _a;
                if (this.isStarted) {
                    getChapterListHandler.currentVolume += data.trim();
                }
                (_a = getChapterListHandler.ontext) === null || _a === void 0 ? void 0 : _a.call(getChapterListHandler, data);
            },
            onclosetag: function (name, isImplied) {
                var _a;
                (_a = getChapterListHandler.onclosetag) === null || _a === void 0 ? void 0 : _a.call(getChapterListHandler, name, isImplied);
                this.isStarted = false;
                if (name === 'ul') {
                    getChapterListHandler.isStarted = false;
                }
            },
        };
        var parseNovelRouter = {
            handlers: {
                Unknown: undefined,
                GetName: getNameHandler,
                GetCover: undefined,
                GetSummary: getSummaryHandler,
                GetGenres: getGenresHandler,
                GetInfos: getInfosHandler,
                GetVolumes: getVolumesHandler,
            },
            action: ParseNovelAction.Unknown,
            onopentag: function (name, attribs) {
                var _a, _b, _c;
                if (attribs['class'] === 'series-name') {
                    this.action = ParseNovelAction.GetName;
                }
                else if (!novel.cover && ((_a = attribs['class']) === null || _a === void 0 ? void 0 : _a.includes('img-in-ratio'))) {
                    var background = attribs['style'];
                    if (background) {
                        novel.cover = background.substring(background.indexOf('http'), background.length - 2);
                    }
                }
                else if (attribs['class'] === 'summary-content') {
                    this.action = ParseNovelAction.GetSummary;
                }
                else if ((_b = attribs['class']) === null || _b === void 0 ? void 0 : _b.includes('series-gerne-item')) {
                    this.action = ParseNovelAction.GetGenres;
                }
                else if (attribs['class'] === 'info-item') {
                    this.action = ParseNovelAction.GetInfos;
                }
                else if ((_c = attribs['class']) === null || _c === void 0 ? void 0 : _c.includes('volume-list')) {
                    this.action = ParseNovelAction.GetVolumes;
                }
            },
            onclosetag: function (name) {
                var _a, _b, _c;
                switch (this.action) {
                    case ParseNovelAction.GetName:
                        if ((_a = this.handlers.GetName) === null || _a === void 0 ? void 0 : _a.isDone) {
                            this.action = ParseNovelAction.Unknown;
                        }
                        break;
                    case ParseNovelAction.GetSummary:
                        if (name === 'div') {
                            this.action = ParseNovelAction.Unknown;
                        }
                        break;
                    case ParseNovelAction.GetGenres:
                        this.action = ParseNovelAction.Unknown;
                        novel.genres += ',';
                        break;
                    case ParseNovelAction.GetInfos:
                        if ((_b = this.handlers.GetInfos) === null || _b === void 0 ? void 0 : _b.isDone) {
                            this.handlers.GetInfos.isDone = false;
                            this.action = ParseNovelAction.Unknown;
                        }
                        break;
                    case ParseNovelAction.GetVolumes:
                        if ((_c = this.handlers.GetVolumes) === null || _c === void 0 ? void 0 : _c.isDone) {
                            this.action = ParseNovelAction.Unknown;
                        }
                        break;
                    default:
                        break;
                }
            },
        };
        return (0, fetch_1.fetchApi)(this.site + novelPath)
            .then(function (res) { return res.text(); })
            .then(function (html) {
            // Original works listed under /truyen/<id> answer with a meta refresh to /sang-tac/<id>-<slug>.
            var redirect = html.match(/http-equiv="refresh"[^>]*url='([^']+)'/i);
            return redirect ? (0, fetch_1.fetchApi)(redirect[1]).then(function (res) { return res.text(); }) : html;
        })
            .then(function (html) {
            var _a, _b, _c, _d, _e;
            var parser = new htmlparser2_1.Parser({
                onopentag: function (name, attributes) {
                    var _a, _b, _c;
                    (_a = parseNovelRouter.onopentag) === null || _a === void 0 ? void 0 : _a.call(parseNovelRouter, name, attributes);
                    if (parseNovelRouter.action) {
                        (_c = (_b = parseNovelRouter.handlers[parseNovelRouter.action]) === null || _b === void 0 ? void 0 : _b.onopentag) === null || _c === void 0 ? void 0 : _c.call(_b, name, attributes);
                    }
                },
                ontext: function (data) {
                    var _a, _b;
                    if (parseNovelRouter.action) {
                        (_b = (_a = parseNovelRouter.handlers[parseNovelRouter.action]) === null || _a === void 0 ? void 0 : _a.ontext) === null || _b === void 0 ? void 0 : _b.call(_a, data);
                    }
                },
                onclosetag: function (name, isImplied) {
                    var _a, _b, _c;
                    if (parseNovelRouter.action) {
                        (_b = (_a = parseNovelRouter.handlers[parseNovelRouter.action]) === null || _a === void 0 ? void 0 : _a.onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, name, isImplied);
                    }
                    (_c = parseNovelRouter.onclosetag) === null || _c === void 0 ? void 0 : _c.call(parseNovelRouter, name, isImplied);
                },
            });
            parser.write(html);
            parser.end();
            novel.chapters = chapters;
            switch ((_a = novel.status) === null || _a === void 0 ? void 0 : _a.trim()) {
                case 'Đang tiến hành':
                    novel.status = novelStatus_1.NovelStatus.Ongoing;
                    break;
                case 'Tạm ngưng':
                    novel.status = novelStatus_1.NovelStatus.OnHiatus;
                    break;
                case 'Đã hoàn thành':
                case 'Completed':
                    novel.status = novelStatus_1.NovelStatus.Completed;
                    break;
                default:
                    novel.status = novelStatus_1.NovelStatus.Unknown;
            }
            novel.genres = (_b = novel.genres) === null || _b === void 0 ? void 0 : _b.split(',').map(function (genre) { return genre.trim(); }).filter(Boolean).join(',');
            novel.author = (_c = novel.author) === null || _c === void 0 ? void 0 : _c.trim();
            novel.artist = (_d = novel.artist) === null || _d === void 0 ? void 0 : _d.trim();
            novel.name = novel.name.trim();
            novel.summary = (_e = novel.summary) === null || _e === void 0 ? void 0 : _e.trim();
            return novel;
        });
    };
    HakoPlugin.prototype.parseChapter = function (chapterPath) {
        return (0, fetch_1.fetchApi)(this.site + chapterPath)
            .then(function (res) { return res.text(); })
            .then(function (html) {
            var $ = (0, cheerio_1.load)(html);
            var protectedEl = $('#chapter-c-protected');
            if (protectedEl.length) {
                var s_1 = protectedEl.attr('data-s') || 'none';
                var k_1 = protectedEl.attr('data-k') || '';
                var c = [];
                try {
                    c = JSON.parse(protectedEl.attr('data-c') || '[]');
                }
                catch (_a) {
                    // ignore
                }
                if (Array.isArray(c) && c.length > 0) {
                    c.sort(function (a, b) { return +a.substring(0, 4) - +b.substring(0, 4); });
                    var decryptedChunks = c.map(function (chunk) {
                        var ciphertext = chunk.substring(4);
                        if (s_1 === 'xor_shuffle') {
                            return decryptXor(ciphertext, k_1);
                        }
                        else if (s_1 === 'base64_reverse') {
                            return decryptBase64Reverse(ciphertext);
                        }
                        else {
                            return decryptNone(ciphertext);
                        }
                    });
                    var decryptedHtml = decryptedChunks.join('');
                    decryptedHtml = decryptedHtml.replace(/\[note(\d+)\]/gi, '<span id="anchor-note$1" class="note-icon none-print inline note-tooltip" data-tooltip-content="#note$1 .note-content" data-note-id="note$1"><i class="fas fa-sticky-note"></i></span><a id="anchor-note$1" class="inline-print none" href="#note$1">[note]</a>');
                    protectedEl.replaceWith(decryptedHtml);
                }
            }
            $('a[href^="/truyen/"]').has('img[src*="chapter-banners"]').remove();
            return $('#chapter-content').html() || 'Không tìm thấy nội dung';
        });
    };
    HakoPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        var url = this.site + '/tim-kiem?keywords=' + searchTerm + '&page=' + pageNo;
        return this.parseNovels(url);
    };
    return HakoPlugin;
}());
function decodeBase64(str) {
    return Uint8Array.from(atob(str), function (c) { return c.charCodeAt(0); });
}
function decryptXor(ciphertext, key) {
    var data = decodeBase64(ciphertext);
    var keyLen = key.length;
    var decrypted = data.map(function (byte, i) { return byte ^ key.charCodeAt(i % keyLen); });
    return new TextDecoder('utf-8').decode(decrypted);
}
function decryptBase64Reverse(ciphertext) {
    var reversed = ciphertext.split('').reverse().join('');
    return new TextDecoder('utf-8').decode(decodeBase64(reversed));
}
function decryptNone(ciphertext) {
    return new TextDecoder('utf-8').decode(decodeBase64(ciphertext));
}
exports.default = new HakoPlugin();
