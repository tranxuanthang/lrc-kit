import { Lrc } from './lrc';
export declare class Runner {
    offset: boolean;
    _currentIndex: number;
    lrc: Lrc;
    constructor(lrc?: Lrc, offset?: boolean);
    setLrc(lrc: Lrc): void;
    lrcUpdate(): void;
    _offsetAlign(): void;
    _sort(): void;
    timeUpdate(timestamp: number): void;
    _findIndex(timestamp: number, startIndex: number): number;
    _findIndex2(timestamp: number): number;
    getInfo(): Record<string, string>;
    getLyrics(): import("./lrc").Lyric[];
    getLyric(index?: number): import("./lrc").Lyric;
    curIndex(): number;
    curLyric(): import("./lrc").Lyric;
}
