import { describe, it } from "vitest";
import {
    scopeGapFinding,
    unevaluableFinding,
    unrepairableFinding,
} from "coordination-surface/tools/core/factories/report.factory.ts";
import assert from "node:assert/strict";

describe("scopeGapFinding", () => {
    it("counts the files handed and neither reached nor named, and reads a reached operand without members as unusable", () => {
        const gap = scopeGapFinding({ handed: 10, named: 2, reached: 5, report: "a.report.json" });
        assert.equal(gap.rule, "governance/undeclaredExclusion");
        assert.ok(gap.actual.startsWith("3 "));
        const unusable = scopeGapFinding({ handed: 10, named: 0, reached: -1, report: "a.report.json" });
        assert.equal(unusable.rule, "governance/unusableOperand");
    });
});

describe("unevaluableFinding and unrepairableFinding", () => {
    it("name a report with no population, and a finding whose repair target or span cannot take the repair", () => {
        const unevaluable = unevaluableFinding({ handed: 4, report: "b.report.json" });
        assert.equal(unevaluable.rule, "governance/unevaluableScope");
        assert.ok(unevaluable.actual.startsWith("4 "));

        const frozen = unrepairableFinding({
            reason: "frozenTarget",
            report: "c.report.json",
            rule: "board/x",
            target: "board.md",
        });
        const span = unrepairableFinding({
            reason: "permanentSpan",
            report: "c.report.json",
            rule: "board/x",
            target: "board.md",
        });
        assert.equal(frozen.rule, "governance/unrepairableLocus");
        assert.notEqual(frozen.actual, span.actual);
        assert.ok(span.stack.some((entry) => entry.resolved === "permanentSpan"));
    });
});
