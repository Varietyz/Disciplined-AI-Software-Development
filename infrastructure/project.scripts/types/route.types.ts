import type { ChildProcess } from "node:child_process";

export interface CaptureOptions {
    readonly browser: string | null;
    readonly outDir: string;
    readonly routes: readonly string[];
    readonly settleMs: number;
    readonly software: boolean;
}

export interface StartedServer {
    readonly output: readonly string[];
    readonly process: ChildProcess;
}
