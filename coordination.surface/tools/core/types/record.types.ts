export interface RecordEntry {
    readonly id: string;
    readonly line: number;
    readonly keys: Readonly<Record<string, string>>;
}

export interface RecordDocument {
    readonly shape: string;
    readonly records: readonly RecordEntry[];
}
