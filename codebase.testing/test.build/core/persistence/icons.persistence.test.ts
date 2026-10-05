import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { SUBSET_FILE } from "@banes-lab/build-scripts/configuration/constants/icons.constants.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeFontSubset } from "@banes-lab/build-scripts/core/persistence/icons.persistence.ts";

const WOFF2_SIGNATURE = "wOF2";

describe("writeFontSubset", () => {
    it("writes a woff2 font holding only the glyphs it is given", async () => {
        const dir = mkdtempSync(join(tmpdir(), "icons-"));
        try {
            await writeFontSubset(["x"], dir);
            const font = readFileSync(join(dir, SUBSET_FILE));
            expect(font.subarray(0, WOFF2_SIGNATURE.length).toString("latin1")).toBe(WOFF2_SIGNATURE);
        } finally {
            rmSync(dir, { force: true, recursive: true });
        }
    });
});
