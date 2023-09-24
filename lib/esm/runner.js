var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
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
import { Lrc } from './lrc';
var Runner = /** @class */ (function () {
    function Runner(lrc, offset) {
        if (lrc === void 0) { lrc = new Lrc(); }
        if (offset === void 0) { offset = true; }
        this.offset = offset;
        this._currentIndex = -1;
        this.setLrc(lrc);
    }
    Runner.prototype.setLrc = function (lrc) {
        this.lrc = lrc.clone();
        this.lrcUpdate();
    };
    Runner.prototype.lrcUpdate = function () {
        if (this.offset) {
            this._offsetAlign();
        }
        // this._sort();
    };
    Runner.prototype._offsetAlign = function () {
        if ('offset' in this.lrc.info) {
            var offset = parseInt(this.lrc.info.offset) / 1000;
            if (!isNaN(offset)) {
                this.lrc.offset(offset);
                delete this.lrc.info.offset;
            }
        }
    };
    Runner.prototype._sort = function () {
        this.lrc.lyrics.sort(function (a, b) { return a.timestamp - b.timestamp; });
    };
    Runner.prototype.timeUpdate = function (timestamp) {
        if (this._currentIndex >= this.lrc.lyrics.length) {
            this._currentIndex = this.lrc.lyrics.length - 1;
        }
        else if (this._currentIndex < -1) {
            this._currentIndex = -1;
        }
        this._currentIndex = this._findIndex2(timestamp);
    };
    Runner.prototype._findIndex = function (timestamp, startIndex) {
        var curFrontTimestamp = startIndex == -1
            ? Number.NEGATIVE_INFINITY
            : this.lrc.lyrics[startIndex].timestamp;
        var curBackTimestamp = startIndex == this.lrc.lyrics.length - 1
            ? Number.POSITIVE_INFINITY
            : this.lrc.lyrics[startIndex + 1].timestamp;
        if (timestamp < curFrontTimestamp) {
            return this._findIndex(timestamp, startIndex - 1);
        }
        else if (timestamp === curBackTimestamp) {
            if (curBackTimestamp === Number.POSITIVE_INFINITY) {
                return startIndex;
            }
            else {
                return startIndex + 1;
            }
        }
        else if (timestamp > curBackTimestamp) {
            return this._findIndex(timestamp, startIndex + 1);
        }
        else {
            return startIndex;
        }
    };
    Runner.prototype._findIndex2 = function (timestamp) {
        var e_1, _a;
        var currentIndex = -1;
        var largestTimestamp = -1.0;
        try {
            for (var _b = __values(this.lrc.lyrics.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], line = _d[1];
                if (line.timestamp <= largestTimestamp) {
                    break;
                }
                if (line.timestamp <= timestamp) {
                    currentIndex = key;
                    largestTimestamp = line.timestamp;
                }
                if (line.timestamp > timestamp) {
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return currentIndex;
    };
    Runner.prototype.getInfo = function () {
        return this.lrc.info;
    };
    Runner.prototype.getLyrics = function () {
        return this.lrc.lyrics;
    };
    Runner.prototype.getLyric = function (index) {
        if (index === void 0) { index = this.curIndex(); }
        if (index >= 0 && index <= this.lrc.lyrics.length - 1) {
            return this.lrc.lyrics[index];
        }
        else {
            throw new Error('Index not exist');
        }
    };
    Runner.prototype.curIndex = function () {
        return this._currentIndex;
    };
    Runner.prototype.curLyric = function () {
        return this.getLyric();
    };
    return Runner;
}());
export { Runner };
