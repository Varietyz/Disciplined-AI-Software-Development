import { describe, expect, it } from "vitest";
import { gridFindings } from "@govlab/patterns/core/converters/finding.grid.converter.ts";

const POINTS = 3;

describe("gridFindings", () => {
    it("reports the densest cell as one density finding supported by every point", () => {
        const [density, ...rest] = gridFindings("point", {
            densestCell: "0,0",
            densestCount: 2,
            distinctCells: 2,
            field: "point",
            points: POINTS,
        });
        expect(rest).toStrictEqual([]);
        expect(density?.name).toBe("density");
        expect(density?.support).toBe(POINTS);
        expect(density?.narrative.explanation).toContain("0,0");
    });
});
