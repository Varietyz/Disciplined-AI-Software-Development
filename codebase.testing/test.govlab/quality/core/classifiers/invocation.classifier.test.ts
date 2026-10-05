import type { AdvisoryContext, ToolSpawn } from "@govlab/quality/types/tool.types.ts";
import { describe, expect, it } from "vitest";
import {
    exitOf,
    failedOnStatus,
    failedWhenEmpty,
    passOf,
    terminalOf,
} from "@govlab/quality/core/classifiers/invocation.classifier.ts";

const advisory: AdvisoryContext = { ecosystem: "go", installHint: "Install it.", root: "/repo", tool: "tool" };

const spawnOf = function spawnOf(status: number | null, stdout = "", error?: Error): ToolSpawn {
    const spawned: ToolSpawn = { output: [], pid: 1, signal: null, status, stderr: "", stdout };
    return error === undefined ? spawned : { ...spawned, error };
};

describe("invocation classifier", () => {
    it("reads the exit of a spawn, defaulting a missing status", () => {
        expect(exitOf(spawnOf(null)).status).toBe(-1);
    });

    it("turns a missing binary and a signal death into terminal results", () => {
        const missing = Object.assign(new Error("spawn tool ENOENT"), { code: "ENOENT" });
        expect(terminalOf(advisory, spawnOf(null, "", missing))?.findings[0]?.ruleId).toBe("tool/not-installed");
        expect(terminalOf(advisory, spawnOf(null))?.findings[0]?.ruleId).toBe("tool/tool-error");
        expect(terminalOf(advisory, spawnOf(0))).toBeNull();
    });

    it("fails an empty pass only on a status outside the accepted set", () => {
        expect(failedWhenEmpty(new Set([0]))(spawnOf(2), [])).toBe(true);
        expect(failedOnStatus(new Set([0]))(spawnOf(0))).toBe(false);
    });

    it("classifies a spawn into a reported or terminated pass", () => {
        const spec = {
            failed: () => false,
            failure: () => ({ findings: [], fixedCount: 0, output: "" }),
            parse: () => [],
        };
        expect(passOf(advisory, spawnOf(0), spec).terminal).toBe(false);
        expect(passOf(advisory, spawnOf(0), { ...spec, failed: () => true }).terminal).toBe(true);
    });
});
