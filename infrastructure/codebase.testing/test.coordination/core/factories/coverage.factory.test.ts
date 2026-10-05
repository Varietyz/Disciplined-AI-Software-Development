import { coverageFinding, unbuiltFinding } from "coordination-surface/tools/core/factories/coverage.factory.ts";
import { describe, it } from "vitest";
import { ROSTER } from "coordination-surface/tools/core/constants/conduct.constants.ts";
import { UNBUILT_HALF } from "coordination-surface/tools/core/validators/coverage.validator.ts";
import assert from "node:assert/strict";

describe("coverage findings", () => {
    it("file a coverage defect at the declared rule, and an unbuilt half against the roster", () => {
        const rule = { gate: "board/missingField", line: 3, locked: true, slug: "fields-declared" };
        const finding = coverageFinding("unregisteredGate", "rules/a.md", rule, "no such gate", "decide");
        assert.equal(finding.rule, "coverage/unregisteredGate");
        assert.deepEqual([finding.path, finding.line, finding.locus], ["rules/a.md", 3, "fields-declared"]);

        const unbuilt = unbuiltFinding({ line: 7, slug: "one-writer" });
        assert.equal(unbuilt.rule, "coverage/unbuiltCheckableHalf");
        assert.deepEqual([unbuilt.path, unbuilt.line], [ROSTER, 7]);
        assert.ok(unbuilt.stack.some((entry) => entry.resolved === UNBUILT_HALF));
    });
});
