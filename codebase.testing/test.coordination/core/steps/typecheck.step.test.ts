import { describe, it } from "vitest";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { runTypecheck, typecheckStage } from "coordination-surface/tools/core/steps/typecheck.step.ts";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { ruleReportName } from "coordination-surface/tools/core/reporters/rule.reporter.ts";
import { tmpdir } from "node:os";

type Options = Parameters<typeof typecheckStage>[0];

describe("runTypecheck and typecheckStage", () => {
    it("record a bypass, compile the package with no diagnostic, and write the stage's report", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-typecheck-step-"));
        try {
            const options: Options = {
                authoritative: false,
                bypass: [],
                fix: false,
                repoRoot,
                scanned: 0,
                scope: "whole",
            };
            assert.equal(typecheckStage({ ...options, bypass: ["typecheck"] }).stage.bypassed, true);
            assert.deepEqual(runTypecheck(), { findings: [], ran: true });
            assert.equal(typecheckStage(options).stage.findings, 0);
            const report = join(repoRoot, GENERATED_DIR, ruleReportName("typecheck"));
            assert.equal(existsSync(report), true);
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});
