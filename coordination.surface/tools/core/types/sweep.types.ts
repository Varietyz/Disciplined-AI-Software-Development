export interface ItemSpan {
    readonly key: string;
    readonly agent: string;
    readonly at: number;
    readonly to: readonly string[];
    readonly from: number;
    readonly through: number;
}
