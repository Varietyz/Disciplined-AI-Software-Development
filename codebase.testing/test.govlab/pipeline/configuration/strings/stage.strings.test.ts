import {
    allPassed,
    bypassNote,
    bypassedStage,
    commandLine,
    concurrentGroup,
    countNote,
    elapsedNote,
    exitMark,
    exitNote,
    failedInGroup,
    failedOutputDivider,
    failedTitle,
    headerLine,
    noQualityRoot,
    notRunLine,
    outputDivider,
    passedLine,
    reportTitle,
    reportWritten,
    scopeNote,
    skippedWide,
    someFailed,
    stageHeading,
    stepLine,
    tableRow,
    totalsLine,
    unknownMembers,
    unknownSlugs,
    violationsWritten,
} from "@govlab/pipeline/configuration/strings/stage.strings.ts";
import { describe, expect, it } from "vitest";

describe("stage strings", () => {
    it("name the operands a reader needs to act on a refusal", () => {
        expect(noQualityRoot("config.ts")).toContain("config.ts");
        expect(unknownMembers(["x"], ["app"])).toContain("Known ids: app.");
        expect(unknownSlugs("gate", ["x"], ["prepare"])).toBe("gate: unknown stage slug x. Known slugs: prepare.");
        expect(skippedWide(["Knip"])).toContain("Knip");
    });

    it("carry the counts and labels of a running plan", () => {
        expect(headerLine("gate", 7, 2)).toBe("gate: 7 steps across 2 stage(s)");
        expect(bypassNote(0)).toBe("");
        expect(bypassNote(2)).toBe(", 2 bypassed");
        expect(scopeNote(["a", "b"])).toBe(", scoped to a + b");
        expect(bypassedStage("Linting", "linting")).toContain("[linting]");
        expect(stageHeading("Linting", "linting")).toContain("Linting [linting]");
        expect(stepLine("[1/2]", "Knip", "npx govlab unused")).toBe("[1/2] Knip: npx govlab unused");
        expect(concurrentGroup("[1-2/9]", "Codemods", 2)).toContain("2 concurrent");
        expect(elapsedNote("1.0")).toBe("(1.0s)");
        expect(exitNote("1.0", 2)).toBe("(1.0s, exit 2)");
        expect(countNote(4)).toBe("(4)");
        expect(outputDivider("Knip")).toBe("--- Knip ---");
    });

    it("state the outcome of a failed or finished run", () => {
        expect(failedTitle("gate")).toBe("gate FAILED");
        expect(failedInGroup(1, 3, "Codemods")).toBe('1/3 in "Codemods"');
        expect(commandLine("npm prune")).toContain("npm prune");
        expect(notRunLine(5)).toContain("5 step(s) not run.");
        expect(exitMark(2)).toContain("exit 2");
        expect(failedOutputDivider("Linting", "Knip", 1)).toContain("Linting / Knip (exit 1)");
        expect(passedLine("gate", 3, "1.0")).toBe("✔ gate passed: 3 steps in 1.0s");
        expect(allPassed(2)).toContain("all 2 steps passed");
        expect(someFailed(1, 2)).toContain("1/2 steps failed");
        expect(totalsLine("10", "1.0")).toContain("10 total violations counted");
        expect(reportTitle("gate")).toContain("per-stage totals");
        expect(tableRow("Linting", 2, 1, "4")).toBe("| Linting | 2 | 1 | 4 |");
        expect(violationsWritten(3, 2, "out.json")).toContain("3 across 2 file(s)");
        expect(reportWritten("out.json")).toContain("out.json");
    });
});
