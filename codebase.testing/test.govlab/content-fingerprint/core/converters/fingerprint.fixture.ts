import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

export const withTemp = function withTemp(body: (dir: string) => void): void {
    const dir = mkdtempSync(join(tmpdir(), "cfp-"));
    try {
        body(dir);
    } finally {
        rmSync(dir, { force: true, recursive: true });
    }
};
