import { describe, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { gateStage } from "coordination-surface/tools/core/steps/gate.step.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

type Options = Parameters<typeof gateStage>[0];

describe("gateStage", () => {
    it("records a bypassed stage without running the gates", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-gate-step-"));
        try {
            const options: Options = {
                authoritative: false,
                bypass: ["gates"],
                fix: false,
                repoRoot,
                scanned: 0,
                scope: "whole",
            };
            assert.deepEqual(gateStage(options), {
                findings: [],
                stage: {
                    bypassed: true,
                    findings: 0,
                    healed: 0,
                    invariant: "every registered rule is proven to fire on a violation and to accept a clean input",
                    rule: "gates",
                    stage: "meta",
                },
            });
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});
