export interface LoadedSource {
    readonly file: string;
    readonly exports: Readonly<Record<string, unknown>> | null;
    readonly error: string | null;
}

export interface CleanedFile {
    readonly path: string;
    readonly removed: number;
    readonly kept: number;
}

export interface CleanResult {
    readonly files: readonly CleanedFile[];
    readonly reached: readonly string[];
    readonly refused: readonly string[];
    readonly removed: number;
    readonly kept: number;
    readonly scanned: number;
}

export interface StripResult {
    readonly text: string;
    readonly removed: number;
    readonly kept: number;
}
