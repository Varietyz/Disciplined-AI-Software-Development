import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { projectRoot } from "coordination-surface/config/surface.config.ts";
import { runGates } from "coordination-surface/tools/core/runners/gate.runner.ts";

describe("runGates", () => {
    it("proves every registered rule and branch fixture of the package, with every declared kind fixtured", async () => {
        const report = await runGates(projectRoot());
        assert.equal(report.failed, 0);
        assert.equal(report.untested, 0);
        assert.equal(report.branchesOpen, 0);
        assert.deepEqual(report.unfixturedKinds, []);
        assert.equal(report.outcomes.length, report.proven + report.exempt);
    }, 180_000);
});
