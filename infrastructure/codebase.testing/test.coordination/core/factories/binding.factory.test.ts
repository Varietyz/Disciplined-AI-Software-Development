import { describe, it } from "vitest";
import { misSectioned, unhonored, unresolvedSlot } from "coordination-surface/tools/core/factories/binding.factory.ts";
import assert from "node:assert/strict";

describe("binding findings", () => {
    it("anchor each slot defect at the consuming line, and heal only a misplaced section", () => {
        const unresolved = unresolvedSlot("rules/a.md", 4, "{project.x}");
        assert.equal(unresolved.rule, "binding/unresolvedSlot");
        assert.deepEqual([unresolved.path, unresolved.line, unresolved.locus], ["rules/a.md", 4, "{project.x}"]);
        assert.equal(unresolved.remediation.deterministic, false);

        const moved = misSectioned("rules/a.md", 5, "{limits.x}", "{convention.x}");
        assert.equal(moved.rule, "binding/slotInWrongSection");
        assert.deepEqual([moved.remediation.from, moved.remediation.to], ["{limits.x}", "{convention.x}"]);
        assert.equal(moved.remediation.deterministic, true);

        const ignored = unhonored("rules/a.md", 6, "{project.y}", "ABSENT");
        assert.equal(ignored.rule, "binding/stateNotHonored");
        assert.ok(ignored.actual.includes("ABSENT"));
        assert.equal(ignored.remediation.to, "ABSENT");
    });
});
