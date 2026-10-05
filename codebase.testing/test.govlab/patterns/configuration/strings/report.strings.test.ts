import { describe, expect, it } from "vitest";
import {
    driftModules,
    healNote,
    healedModules,
    masterWritten,
    moduleDrift,
    moduleWritten,
    modulesClean,
    nestedCount,
    nestedTip,
    pageLabel,
    rewrittenModules,
    summaryLine,
    svgCollection,
    unreadableManifest,
    writeSummary,
} from "@govlab/patterns/configuration/strings/report.strings.ts";

const THREE = 3;

describe("the report strings", () => {
    it("compose the page labels and the summary line", () => {
        expect(pageLabel("mod", "core")).toBe("mod / core");
        expect(nestedTip("core", THREE, 2, 1)).toContain("3 nodes");
        expect(summaryLine(THREE, 1, nestedCount(2))).toContain("2 nested concerns");
    });

    it("end every log line with a line break", () => {
        const lines = [
            healNote("up to date"),
            moduleWritten("mod", THREE),
            writeSummary(1, THREE),
            moduleDrift("mod"),
            healedModules(["a"]),
            rewrittenModules(["a"]),
            driftModules(["a"]),
            modulesClean(THREE),
            svgCollection(1, 0, "dir"),
            masterWritten("path"),
            unreadableManifest("path", "reason"),
        ];
        expect(lines.every((line) => line.startsWith("[hex] ") && line.endsWith("\n"))).toBe(true);
    });

    it("count what a write pass skipped", () => {
        expect(writeSummary(1, THREE)).toBe("[hex] regenerated 1, skipped 2 of 3 module(s)\n");
    });
});
