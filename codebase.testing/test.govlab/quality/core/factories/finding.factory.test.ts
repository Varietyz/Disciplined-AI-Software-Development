import {
    EMPTY_RESULT,
    advisoryFinding,
    advisoryNotice,
    findingsResult,
    fixedResult,
    gatingNotice,
    notInstalled,
    reportedPass,
    signalDeathResult,
    spawnFailure,
    terminatedPass,
    toolError,
    toolErrorRule,
    toolFailure,
    toolFinding,
} from "@govlab/quality/core/factories/finding.factory.ts";
import type { Finding, RunResult } from "@govlab/quality/types/finding.types.ts";
import { describe, expect, it, test } from "vitest";
import type { AdvisoryContext } from "@govlab/quality/types/tool.types.ts";

const finding: Finding = {
    advisory: false,
    column: 1,
    ecosystem: "typescript",
    file: "a.ts",
    fixable: false,
    line: 1,
    message: "A rule reported a defect.",
    ruleId: "tool/rule",
    severity: "error",
    tool: "tool",
};

const result: RunResult = { findings: [finding], fixedCount: 0, output: "" };

const advisory: AdvisoryContext = { ecosystem: "go", installHint: "Install the tool.", root: "/repo", tool: "tool" };
const gating: AdvisoryContext = { ...advisory, failureSeverity: "error", gating: true };

test("reportedPass carries the findings a completed pass produced", () => {
    const outcome = reportedPass([finding]);
    expect(outcome.terminal).toBe(false);
    expect(outcome.terminal ? [] : outcome.findings).toStrictEqual([finding]);
});

test("terminatedPass carries the run result a pass that could not complete produced", () => {
    const outcome = terminatedPass(result);
    expect(outcome.terminal).toBe(true);
    expect(outcome.terminal ? outcome.result : null).toBe(result);
});

test("an empty reported pass is still a completed pass, not a terminated one", () => {
    expect(reportedPass([]).terminal).toBe(false);
});

test("findingsResult formats the findings and fixedResult counts what the fix removed", () => {
    expect(EMPTY_RESULT.findings).toStrictEqual([]);
    expect(findingsResult([finding]).output).toContain("a.ts");
    expect(fixedResult([finding, finding], [finding]).fixedCount).toBe(1);
});

test("toolFinding defaults to a gating finding and advisoryFinding marks it advisory", () => {
    const input = { column: 1, ecosystem: "go", file: "a.go", line: 2, message: "m", ruleId: "r", tool: "t" };
    expect(toolFinding(input)).toMatchObject({ advisory: false, fixable: false, severity: "error" });
    expect(advisoryFinding(input).advisory).toBe(true);
});

describe("notices", () => {
    it("names the tool error rule after the tool", () => {
        expect(toolErrorRule("ruff")).toBe("ruff/tool-error");
    });

    it("keeps an advisory notice advisory and a gating failure gating", () => {
        expect(advisoryNotice(advisory, "tool/x", "m").findings[0]).toMatchObject({
            advisory: true,
            severity: "notice",
        });
        expect(gatingNotice(gating, "tool/x", "m").findings[0]).toMatchObject({ advisory: false, severity: "error" });
        expect(toolFailure(gating, "m").findings[0]?.ruleId).toBe("tool/tool-error");
    });

    it("reports a missing tool with its install hint and a spawn or exit failure with its detail", () => {
        expect(notInstalled(advisory).findings[0]?.message).toBe("Install the tool.");
        expect(spawnFailure(gating, new Error("boom")).findings[0]?.message).toContain("boom");
        expect(toolError(gating, { status: 2, stderr: "bad config", stdout: "" }).findings[0]?.message).toContain(
            "bad config",
        );
    });
});

describe("signalDeathResult", () => {
    it("returns exactly one gating finding keyed <tool>/tool-error", () => {
        const death = signalDeathResult({ ecosystem: "kotlin", root: "/repo", tool: "detekt" }, "SIGKILL");
        expect(death.fixedCount).toBe(0);
        expect(death.findings).toHaveLength(1);
        expect(death.findings[0]).toMatchObject({
            advisory: false,
            ecosystem: "kotlin",
            file: "/repo",
            fixable: false,
            ruleId: "detekt/tool-error",
            severity: "error",
            tool: "detekt",
        });
        expect(death.findings[0]?.message).toContain("SIGKILL");
        expect(death.findings[0]?.message).toContain("terminated by a signal");
    });

    it("renders an unknown signal defensively rather than emitting 'null'", () => {
        const death = signalDeathResult({ ecosystem: "typescript", root: "/repo", tool: "knip" }, null);
        expect(death.findings[0]?.message).toContain("unknown");
        expect(death.findings[0]?.message).not.toContain("null");
    });
});
