import type { AdvisoryContext, RunnerContext } from "@govlab/quality/types/tool.types.ts";
import { describe, expect, it } from "vitest";
import {
    fixCycle,
    messageScan,
    passTool,
    residualOf,
    runAdvisory,
    runSelectable,
    scanTargets,
    scanTool,
    standardScan,
    statusOkIn,
} from "@govlab/quality/core/adapters/tool.adapter.ts";
import type { Finding } from "@govlab/quality/types/finding.types.ts";
import process from "node:process";

const advisory: AdvisoryContext = { ecosystem: "go", installHint: "Install it.", root: process.cwd(), tool: "node" };
const context: RunnerContext = { ecosystem: "go", fix: false, languageId: "go", paths: [], root: process.cwd() };

const finding: Finding = {
    advisory: false,
    column: 1,
    ecosystem: "go",
    file: "a.go",
    fixable: true,
    line: 1,
    message: "m",
    ruleId: "r",
    severity: "error",
    tool: "node",
};

const echo = { args: ["-e", "process.stdout.write('[]')"], bin: process.execPath, cwd: process.cwd() };

describe("tool scanning", () => {
    it("scans a tool and parses what it prints", () => {
        const spec = standardScan(advisory, new Set([0]), (result) => (result.stdout === "[]" ? [finding] : []));
        expect(scanTool(advisory, echo, spec).findings).toStrictEqual([finding]);
        expect(passTool(advisory, echo, spec).terminal).toBe(false);
    });

    it("reports a custom failure message when an empty scan exits outside the accepted set", () => {
        const failing = { ...echo, args: ["-e", "process.exit(3)"] };
        const spec = messageScan(
            advisory,
            new Set([0]),
            () => [],
            (exit) => `exit ${String(exit.status)}`,
        );
        expect(scanTool(advisory, failing, spec).findings[0]?.message).toBe("exit 3");
    });

    it("joins the findings of every target and stops at the first terminal target", () => {
        const pass = { findings: [finding], terminal: false as const };
        expect(scanTargets(["a", "b"], () => pass).findings).toHaveLength(2);
        expect(scanTargets(["a"], () => null).findings).toStrictEqual([]);
    });

    it("fixes only when asked and counts the residual", () => {
        const reported = { findings: [finding], terminal: false as const };
        expect(
            fixCycle(
                reported,
                () => false,
                () => residualOf([finding], { findings: [], terminal: false }),
            ).fixedCount,
        ).toBe(0);
        expect(
            fixCycle(
                reported,
                () => true,
                (found) => residualOf(found, { findings: [], terminal: false }),
            ).fixedCount,
        ).toBe(1);
    });

    it("accepts a status only from its set", () => {
        expect(statusOkIn(new Set([0, 1]))(1)).toBe(true);
        expect(statusOkIn(new Set([0]))(2)).toBe(false);
    });
});

describe("advisory and selectable strategies", () => {
    it("runs an advisory tool and returns nothing when the binary is missing", () => {
        const spec = {
            argsFor: () => [],
            cwdFor: () => process.cwd(),
            parse: () => [finding],
            statusOk: () => true,
            tool: "govlab-missing-tool",
        };
        expect(runAdvisory(spec, context).findings).toStrictEqual([]);
    });

    it("stays silent for a selectable tool that was not elected", async () => {
        const spec = {
            argsFor: () => [],
            configFilename: "x.cfg",
            cwdFor: () => process.cwd(),
            loadConfig: async () => {
                await Promise.resolve();
                return "";
            },
            parse: () => [finding],
            statusOk: () => true,
            tool: "govlab-missing-tool",
        };
        expect((await runSelectable(spec, { ...context, elected: false })).findings).toStrictEqual([]);
    });
});
