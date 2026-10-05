import { describe, expect, it } from "vitest";
import {
    targetClean,
    targetFatal,
    targetFixed,
    targetLine,
    targetStale,
    targetSummary,
} from "@govlab/quality/configuration/strings/target.strings.ts";

const FIXED = 2;
const STALE = 3;

describe("target strings", () => {
    it("name the config, the stale tokens and the enforced release", () => {
        expect(targetFixed("tsconfig.json", "ES2020", "ES2025")).toContain("ES2020 → ES2025");
        expect(targetLine("tsconfig.json", "ES2019")).toContain("ES2019");
        expect(targetClean("ES2025")).toContain("ES2025");
        expect(targetFatal("no root")).toContain("no root");
    });

    it("carry the count of configs bumped or below the release", () => {
        expect(targetSummary(FIXED, "ES2025")).toContain("bumped 2 config(s)");
        expect(targetStale(STALE, "ES2025")).toContain("3 config(s) below ES2025");
    });
});
