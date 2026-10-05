import { describe, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { comparison } from "coordination-surface/tools/core/comparators/snapshot.comparator.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

type Options = Parameters<typeof comparison>[0];

describe("comparison", () => {
    it("carries a fresh baseline over the run's range when nothing was retained, with no finding", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-compare-"));
        try {
            const options: Options = {
                authoritative: false,
                bypass: [],
                fix: false,
                repoRoot,
                scanned: 0,
                scope: "whole",
            };
            const compared = comparison(options, []);
            assert.equal(compared.retained, null);
            assert.equal(compared.carried.range, "whole");
            assert.deepEqual(compared.findings, []);
            assert.deepEqual(compared.renamed, []);
            assert.ok(Object.values(compared.verdicts).every((verdict) => verdict === "first-seen"));
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});
