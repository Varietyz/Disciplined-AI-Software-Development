import { describe, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { snapshotStage } from "coordination-surface/tools/core/steps/snapshot.step.ts";
import { tmpdir } from "node:os";

type Options = Parameters<typeof snapshotStage>[0];

describe("snapshotStage", () => {
    it("records a bypass, and takes a first extent with no finding when nothing was retained", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-snapshot-step-"));
        try {
            const options: Options = {
                authoritative: false,
                bypass: [],
                fix: false,
                repoRoot,
                scanned: 0,
                scope: "whole",
            };
            assert.equal(snapshotStage({ ...options, bypass: ["snapshot"] }, []).stage.bypassed, true);
            assert.deepEqual(snapshotStage(options, []).findings, []);
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});
