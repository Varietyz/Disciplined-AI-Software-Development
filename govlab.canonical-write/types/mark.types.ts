export interface GeneratedMark {
    readonly time: string;
    readonly version: number;
}

export interface MarkSpan {
    readonly end: number;
    readonly start: number;
}
