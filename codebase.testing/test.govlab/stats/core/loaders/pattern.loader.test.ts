import { BARE, INPUT } from "./stats.fixture.ts";
import { describe, expect, it } from "vitest";
import { FINDINGS_FILE } from "@govlab/stats/configuration/constants/pattern.constants.ts";
import { collectFindings } from "@govlab/stats/core/loaders/pattern.loader.ts";

describe("collectFindings", () => {
    it("reports an empty tally when no findings artifact exists", () => {
        const stats = collectFindings(BARE);
        expect(stats.total).toBe(0);
        expect(stats.topModules).toStrictEqual([]);
        expect(FINDINGS_FILE.endsWith(".generated.json")).toBe(true);
    });

    it("never lists more top modules than it finds with findings", () => {
        expect(INPUT.findings.topModules.length).toBeLessThanOrEqual(INPUT.findings.modulesWithFindings);
    });
});
