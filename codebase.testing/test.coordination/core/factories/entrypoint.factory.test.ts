import { describe, it } from "vitest";
import {
    duplicateEntry,
    optInFinding,
    presenceBackedGuard,
    unpublishedOperand,
    unwitnessed,
} from "coordination-surface/tools/core/factories/entrypoint.factory.ts";
import { NO_FIX_FLAG } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";

const ENTRY = "tools/core/entrypoints/probe.entrypoint.ts";

describe("entrypoint findings", () => {
    it("file each entry point defect at its line with the operand that decides it", () => {
        const optIn = optInFinding(ENTRY, 3, "--fix");
        assert.equal(optIn.rule, "entrypoint/healingIsOptIn");
        assert.deepEqual([optIn.remediation.from, optIn.remediation.to], ["--fix", NO_FIX_FLAG]);

        const operand = unpublishedOperand(ENTRY, { line: 8, name: "authoritative" });
        assert.equal(operand.rule, "entrypoint/unpublishedBranchOperand");
        assert.deepEqual([operand.line, operand.locus], [8, "authoritative"]);

        const duplicate = duplicateEntry(ENTRY, ["a.ts", "b.ts"]);
        assert.equal(duplicate.rule, "entrypoint/secondPipelineEntry");
        assert.ok(duplicate.actual.startsWith("2 "));
        assert.equal(duplicate.remediation.to, "a.ts");

        const write = unwitnessed(ENTRY, { line: 21, reads: 1, target: "board.md", witnessed: false });
        assert.equal(write.rule, "entrypoint/unwitnessedWrite");
        assert.deepEqual([write.line, write.locus, write.remediation.to], [21, "board.md", "compare-and-swap"]);

        const guard = presenceBackedGuard(ENTRY, { chain: ["a", "b"], guard: "quiet", line: 30, reader: "roster" });
        assert.equal(guard.rule, "entrypoint/presenceBackedMutationGuard");
        assert.ok(guard.stack.some((entry) => entry.resolved === "a → b"));
    });
});
