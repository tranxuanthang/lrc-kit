export declare const TAGS_REGEXP: RegExp;
export declare const INFO_REGEXP: RegExp;
export declare const TIME_REGEXP: RegExp;
export declare enum LineType {
    INVALID = "INVALID",
    INFO = "INFO",
    TIME = "TIME"
}
export interface InvalidLine {
    type: LineType.INVALID;
}
export interface TimeLine {
    type: LineType.TIME;
    timestamps: number[];
    content: string;
}
export interface InfoLine {
    type: LineType.INFO;
    key: string;
    value: string;
}
export declare function parseTags(line: string): null | [string[], string];
export declare function parseTime(tags: string[], content: string): TimeLine;
export declare function parseInfo(tag: string): InfoLine;
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
export declare function parseLine(line: string): InfoLine | TimeLine | InvalidLine;
