export interface Lyric {
    timestamp: number;
    content: string;
}
export interface CombineLyric {
    timestamps: number[];
    content: string;
}
export declare type Info = Record<string, string>;
export declare function padZero(num: number | string, size?: number): string;
/**
 * get lrc time string
 * @example
 * Lrc.timestampToString(143.54)
 * // return '02:23.54':
 * @param timestamp second timestamp
 */
export declare function timestampToString(timestamp: number): string;
export declare type LineFormat = '\r\n' | '\r' | '\n';
export interface ToStringOptions {
    combine: boolean;
    sort: boolean;
    lineFormat: LineFormat;
}
export declare class Lrc {
    info: Info;
    lyrics: Lyric[];
    /**
     * parse lrc text and return a Lrc object
     */
    static parse(text: string): Lrc;
    offset(offsetTime: number): void;
    clone(): Lrc;
    /**
     * get lrc text
     * @param opts.combine lyrics combine by same content
     * @param opts.sort lyrics sort by timestamp
     * @param opts.lineFormat newline format
     */
    toString(opts?: Partial<ToStringOptions>): string;
}
