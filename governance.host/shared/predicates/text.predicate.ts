import { closeSync, openSync, readSync } from "node:fs";

const PROBE_BYTES = 8000;
const NUL = 0;

export const isTextFile = function isTextFile(absPath: string): boolean {
    const probe = Buffer.alloc(PROBE_BYTES);
    const handle = openSync(absPath, "r");
    try {
        const read = readSync(handle, probe, 0, PROBE_BYTES, 0);
        return !probe.subarray(0, read).includes(NUL);
    } finally {
        closeSync(handle);
    }
};
