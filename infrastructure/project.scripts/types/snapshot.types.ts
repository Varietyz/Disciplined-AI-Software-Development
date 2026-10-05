export interface SnapshotOptions {
    readonly url: string;
    readonly out: string | null;
    readonly log: string | null;
    readonly browser: string | null;
    readonly width: number;
    readonly height: number;
    readonly settleMs: number;
    readonly timeoutMs: number;
    readonly clickAt: readonly number[] | null;
    readonly clickAfterMs: number;
    readonly software: boolean;
}
