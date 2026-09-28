export interface ProcessResult {
    readonly step: string;
    readonly tool: string;
    readonly checks: string;
    readonly verdict: "fail" | "pass";
    readonly exitCode: number;
    readonly output: string;
}

export interface Launch {
    readonly command: string;
    readonly args: readonly string[];
}
