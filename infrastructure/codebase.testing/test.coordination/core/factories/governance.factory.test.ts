import {
    contractFinding,
    orphanFinding,
    staleChannelFinding,
    writerFinding,
} from "coordination-surface/tools/core/factories/governance.factory.ts";
import { describe, it } from "vitest";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";

describe("governance findings", () => {
    it("heal an orphan report and a stale channel by deleting them, and leave the contract and writer to judgment", () => {
        const contract = contractFinding("tools/rules/a.rule.ts", "id", "no id", "decide", "absent");
        assert.equal(contract.rule, "governance/ruleContract");
        assert.ok(contract.stack.some((entry) => entry.resolved === "a.rule.ts"));

        const orphan = orphanFinding("ghost.report.json");
        assert.equal(orphan.rule, "governance/orphanReport");
        assert.deepEqual([orphan.healed, orphan.remediation.action], [true, "delete"]);
        assert.equal(orphan.path, `${GENERATED_DIR}/ghost.report.json`);

        const writer = writerFinding({ member: "writeFileSync", path: "tools/core/x.ts" });
        assert.equal(writer.rule, "governance/unsanctionedWriter");
        assert.equal(writer.locus, "writeFileSync");

        const stale = staleChannelFinding({ declared: null, name: "chan.json", removable: true, scope: "gone/scope" });
        assert.equal(stale.rule, "governance/staleChannel");
        assert.equal(stale.path, `${GENERATED_DIR}/chan.json`);
    });
});
