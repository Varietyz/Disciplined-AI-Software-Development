import { declaredKinds, qualityStage } from "coordination-surface/tools/core/steps/quality.step.ts";
import { describe, it } from "vitest";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { ruleReportName } from "coordination-surface/tools/core/reporters/rule.reporter.ts";
import { tmpdir } from "node:os";

type Options = Parameters<typeof qualityStage>[0];

describe("qualityStage and declaredKinds", () => {
    it("records a bypass, reports a toolchain that is not declared as a pass that ran nothing, and declares that kind", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-quality-step-"));
        try {
            const options: Options = {
                authoritative: false,
                bypass: [],
                fix: false,
                repoRoot,
                scanned: 0,
                scope: "whole",
            };
            assert.equal(qualityStage({ ...options, bypass: ["quality"] }).stage.bypassed, true);
            assert.equal(declaredKinds()[0], "quality/notDeclared");
            const outcome = qualityStage(options);
            assert.deepEqual([outcome.findings, outcome.stage.findings], [[], 0]);
            const report = join(repoRoot, GENERATED_DIR, ruleReportName("quality"));
            assert.equal(existsSync(report), true);
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});
