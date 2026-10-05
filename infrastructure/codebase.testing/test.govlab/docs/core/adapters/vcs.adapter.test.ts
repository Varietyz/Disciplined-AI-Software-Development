import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { deriveRepoMetrics } from "@govlab/docs/core/adapters/vcs.adapter.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

const outside = mkdtempSync(join(tmpdir(), "doc-vcs-"));

afterAll(() => {
    rmSync(outside, { force: true, recursive: true });
});

describe("deriveRepoMetrics", () => {
    it("derives nothing for a folder outside any work tree", () => {
        expect(deriveRepoMetrics(outside)).toBeNull();
    });
});
