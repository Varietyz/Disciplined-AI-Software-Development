import {
    FINDING_KINDS,
    REMEDY,
    crossConcernDetail,
    cycleDetail,
    duplicateDetail,
    importCycleDetail,
} from "@govlab/patterns/configuration/strings/code.strings.ts";
import { describe, expect, it } from "vitest";

const COUNT = 3;

describe("the code finding strings", () => {
    it("carry a remedy for every finding kind", () => {
        expect(Object.values(FINDING_KINDS).every((kind) => (REMEDY.get(kind) ?? "").length > 0)).toBe(true);
    });

    it("count the members each detail names", () => {
        expect(cycleDetail(COUNT, "a → b")).toContain("3 definitions: a → b");
        expect(importCycleDetail(COUNT, "a → b")).toContain("3 modules");
        expect(duplicateDetail(COUNT, "a, b")).toContain("3 files: a, b");
        expect(crossConcernDetail(COUNT)).toContain("3 distinct concerns");
    });
});
