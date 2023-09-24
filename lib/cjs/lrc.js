"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var line_parser_1 = require("./line-parser");
function padZero(num, size) {
    if (size === void 0) { size = 2; }
    while (num.toString().split('.')[0].length < size)
        num = '0' + num;
    return num;
}
exports.padZero = padZero;
/**
 * get lrc time string
 * @example
 * Lrc.timestampToString(143.54)
 * // return '02:23.54':
 * @param timestamp second timestamp
 */
function timestampToString(timestamp) {
    return padZero(Math.floor(timestamp / 60)) + ":" + padZero((timestamp % 60).toFixed(2));
}
exports.timestampToString = timestampToString;
var Lrc = /** @class */ (function () {
    function Lrc() {
        this.info = {};
        this.lyrics = [];
    }
    /**
     * parse lrc text and return a Lrc object
     */
    Lrc.parse = function (text) {
        var lyrics = [];
        var info = {};
        text
            .split(/\r\n|[\n\r]/g)
            .map(function (line) {
            return line_parser_1.parseLine(line);
        })
            .forEach(function (line) {
            switch (line.type) {
                case line_parser_1.LineType.INFO:
                    info[line.key] = line.value;
                    break;
                case line_parser_1.LineType.TIME:
                    line.timestamps.forEach(function (timestamp) {
                        lyrics.push({
                            timestamp: timestamp,
                            content: line.content,
                        });
                    });
                    break;
                default:
                    break;
            }
        });
        var lrc = new this();
        lrc.lyrics = lyrics;
        lrc.info = info;
        return lrc;
    };
    Lrc.prototype.offset = function (offsetTime) {
        this.lyrics.forEach(function (lyric) {
            lyric.timestamp += offsetTime;
            if (lyric.timestamp < 0) {
                lyric.timestamp = 0;
            }
        });
    };
    Lrc.prototype.clone = function () {
        function clonePlainObject(obj) {
            var newObj = {};
            for (var key in obj) {
                newObj[key] = obj[key];
            }
            return newObj;
        }
        var lrc = new Lrc();
        lrc.info = clonePlainObject(this.info);
        lrc.lyrics = this.lyrics.reduce(function (ret, lyric) {
            ret.push(clonePlainObject(lyric));
            return ret;
        }, []);
        return lrc;
    };
    /**
     * get lrc text
     * @param opts.combine lyrics combine by same content
     * @param opts.sort lyrics sort by timestamp
     * @param opts.lineFormat newline format
     */
    Lrc.prototype.toString = function (opts) {
        if (opts === void 0) { opts = {}; }
        opts.combine = 'combine' in opts ? opts.combine : true;
        opts.lineFormat = 'lineFormat' in opts ? opts.lineFormat : '\r\n';
        opts.sort = 'sort' in opts ? opts.sort : true;
        var lines = [], lyricsMap = {}, lyricsList = [];
        // generate info
        for (var key in this.info) {
            lines.push("[" + key + ":" + this.info[key] + "]");
        }
        if (opts.combine) {
            // uniqueness
            this.lyrics.forEach(function (lyric) {
                if (lyric.content in lyricsMap) {
                    lyricsMap[lyric.content].push(lyric.timestamp);
                }
                else {
                    lyricsMap[lyric.content] = [lyric.timestamp];
                }
            });
            // sorted
            for (var content in lyricsMap) {
                if (opts.sort) {
                    lyricsMap[content].sort();
                }
                lyricsList.push({
                    timestamps: lyricsMap[content],
                    content: content,
                });
            }
            if (opts.sort) {
                lyricsList.sort(function (a, b) { return a.timestamps[0] - b.timestamps[0]; });
            }
            // generate lyrics
            lyricsList.forEach(function (lyric) {
                lines.push("[" + lyric.timestamps
                    .map(function (timestamp) { return timestampToString(timestamp); })
                    .join('][') + "]" + (lyric.content || ''));
            });
        }
        else {
            this.lyrics.forEach(function (lyric) {
                lines.push("[" + timestampToString(lyric.timestamp) + "]" + (lyric.content || ''));
            });
        }
        return lines.join(opts.lineFormat);
    };
    return Lrc;
}());
exports.Lrc = Lrc;
