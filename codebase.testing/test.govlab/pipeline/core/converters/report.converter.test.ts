import {
    VERIFY_REPORT_FILE,
    VIOLATIONS_REPORT_FILE,
} from "@govlab/pipeline/configuration/constants/report.constants.ts";
import {
    buildArtifact,
    outputOf,
    rowOf,
    rowsOf,
    tallyByStage,
} from "@govlab/pipeline/core/converters/report.converter.ts";
import { describe, expect, it } from "vitest";
import type { ReportRow } from "@govlab/pipeline/types/stage.types.ts";

const LABEL = "verify-codebase";

const row = function row(over: Partial<ReportRow> = {}): ReportRow {
    return { code: 0, count: null, label: "step", out: "", stage: "prepare", ...over };
};

describe("report locations", () => {
    it("names two distinct artifacts", () => {
        expect(VERIFY_REPORT_FILE).not.toBe(VIOLATIONS_REPORT_FILE);
    });
});

describe("tallyByStage", () => {
    it("separates passed from failed within one stage", () => {
        const tally = tallyByStage([row(), row({ code: 1 }), row()]);
        expect(tally.get("prepare")).toStrictEqual({ failed: 1, passed: 2, violations: 0 });
    });

    it("sums counted violations and reads an absent count as zero", () => {
        const tally = tallyByStage([row({ count: 4 }), row({ count: null }), row({ count: 6 })]);
        expect(tally.get("prepare")?.violations).toBe(10);
    });

    it("keeps stages apart", () => {
        const tally = tallyByStage([row(), row({ code: 1, stage: "linting" })]);
        expect([...tally.keys()]).toStrictEqual(["prepare", "linting"]);
    });

    it("tallies nothing for no rows", () => {
        expect(tallyByStage([]).size).toBe(0);
    });
});

describe("buildArtifact", () => {
    it("reports ok only when every step passed", () => {
        expect(buildArtifact([row(), row()], LABEL).ok).toBe(true);
        expect(buildArtifact([row(), row({ code: 1 })], LABEL).ok).toBe(false);
    });

    it("totals steps, passes, failures and violations across the run", () => {
        const artifact = buildArtifact([row({ count: 2 }), row({ code: 1, count: 3, stage: "linting" })], LABEL);
        expect(artifact.totals).toStrictEqual({ failed: 1, passed: 1, steps: 2, violations: 5 });
    });

    it("keeps stages in the order they first appear", () => {
        const artifact = buildArtifact([row({ stage: "linting" }), row({ stage: "prepare" })], LABEL);
        expect(artifact.stages.map((entry) => entry.stage)).toStrictEqual(["linting", "prepare"]);
    });

    it("carries each step's outcome into its stage", () => {
        const artifact = buildArtifact([row({ code: 1, count: 9, label: "Lint" })], LABEL);
        expect(artifact.stages[0]?.steps).toStrictEqual([{ label: "Lint", ok: false, violations: 9 }]);
    });

    it("reports an empty run as ok with no stages", () => {
        const artifact = buildArtifact([], LABEL);
        expect(artifact.ok).toBe(true);
        expect(artifact.stages).toStrictEqual([]);
    });
});

describe("rowOf, outputOf and rowsOf", () => {
    it("read the violation count off a captured outcome", () => {
        expect(rowOf("linting", "Lint", { code: 1, out: "3 errors" }).count).toBe(3);
    });

    it("round-trip a row through its stored output, keeping pass and fail", () => {
        const failed = rowOf("linting", "Lint", { code: 2, out: "3 errors" });
        const [back] = rowsOf([outputOf(failed)]);
        expect(back?.code).not.toBe(0);
        expect(back?.count).toBe(3);
        const passed = outputOf(row());
        expect(rowsOf([passed])[0]?.code).toBe(0);
    });
});
