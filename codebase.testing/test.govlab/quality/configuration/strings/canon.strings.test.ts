import { canonFailed, canonReport } from "@govlab/quality/configuration/strings/canon.strings.ts";
import { describe, expect, it } from "vitest";

const ARCH_RECORDS = 7;
const ALGO_RECORDS = 5;
const TOTAL = 2;

describe("canon strings", () => {
    it("report the record counts and the defect total", () => {
        const report = canonReport({
            algoRecords: ALGO_RECORDS,
            archRecords: ARCH_RECORDS,
            defects: {
                algoForce: [],
                algoId: ["x"],
                archEdge: [],
                archId: ["y"],
                archRename: [],
                archType: [],
                unknownType: new Set(),
            },
            total: TOTAL,
        });
        expect(
            report
                .split("\n")
                .find((line) => line.includes("arch records:"))
                ?.trim()
                .endsWith("7"),
        ).toBe(true);
        expect(report).toContain("TOTAL canon defects (id + type): 2");
        expect(canonFailed(TOTAL)).toContain("2 defect(s)");
    });
});
