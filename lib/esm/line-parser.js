var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
// match `[12:30.1][12:30.2]`
export var TAGS_REGEXP = /^(\[.+\])+/;
// match `[ti: The Title]`
export var INFO_REGEXP = /^\s*(\w+)\s*:(.*)$/;
// match `[512:34.1] lyric content`
export var TIME_REGEXP = /^\s*(\d+)\s*:\s*(\d+(\s*[\.:]\s*\d+)?)\s*$/;
export var LineType;
(function (LineType) {
    LineType["INVALID"] = "INVALID";
    LineType["INFO"] = "INFO";
    LineType["TIME"] = "TIME";
})(LineType || (LineType = {}));
export function parseTags(line) {
    line = line.trim();
    var matches = TAGS_REGEXP.exec(line);
    if (matches === null) {
        return null;
    }
    var tag = matches[0];
    var content = line.substr(tag.length);
    return [tag.slice(1, -1).split(/\]\s*\[/), content];
}
export function parseTime(tags, content) {
    var timestamps = [];
    tags.forEach(function (tag) {
        var matches = TIME_REGEXP.exec(tag);
        var minutes = parseFloat(matches[1]);
        var seconds = parseFloat(matches[2].replace(/\s+/g, '').replace(':', '.'));
        timestamps.push(minutes * 60 + seconds);
    });
    return {
        type: LineType.TIME,
        timestamps: timestamps,
        content: content.trim(),
    };
}
export function parseInfo(tag) {
    var matches = INFO_REGEXP.exec(tag);
    return {
        type: LineType.INFO,
        key: matches[1].trim(),
        value: matches[2].trim(),
    };
}
/**
 * line parse lrc of timestamp
 * @example
 * const lp = parseLine('[ti: Song title]')
 * lp.type === LineParser.TYPE.INFO
 * lp.key === 'ti'
 * lp.value === 'Song title'
 *
 * const lp = parseLine('[10:10.10]hello')
 * lp.type === LineParser.TYPE.TIME
 * lp.timestamps === [10*60+10.10]
 * lp.content === 'hello'
 */
export function parseLine(line) {
    var parsedTags = parseTags(line);
    try {
        if (parsedTags) {
            var _a = __read(parsedTags, 2), tags = _a[0], content = _a[1];
            if (TIME_REGEXP.test(tags[0])) {
                return parseTime(tags, content);
            }
            else {
                return parseInfo(tags[0]);
            }
        }
        return {
            type: LineType.INVALID,
        };
    }
    catch (_e) {
        return {
            type: LineType.INVALID,
        };
    }
}
