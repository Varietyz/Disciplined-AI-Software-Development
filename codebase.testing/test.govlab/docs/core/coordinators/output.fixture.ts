import process from "node:process";
import { vi } from "vitest";

export interface CapturedOutput {
    err: string[];
    out: string[];
}

export const captureOutput = function captureOutput(): CapturedOutput {
    const captured: CapturedOutput = { err: [], out: [] };
    vi.spyOn(process.stdout, "write").mockImplementation((chunk: Uint8Array | string) => {
        captured.out.push(String(chunk));
        return true;
    });
    vi.spyOn(process.stderr, "write").mockImplementation((chunk: Uint8Array | string) => {
        captured.err.push(String(chunk));
        return true;
    });
    return captured;
};
