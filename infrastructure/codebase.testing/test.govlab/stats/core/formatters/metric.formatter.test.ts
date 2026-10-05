import { BYTES_PER_UNIT, BYTE_UNITS } from "@govlab/stats/configuration/constants/metric.constants.ts";
import { describe, expect, it } from "vitest";
import { humanBytes, num, pct } from "@govlab/stats/core/formatters/metric.formatter.ts";

describe("humanBytes", () => {
    it("reports plain bytes without a decimal and steps up a unit past each threshold", () => {
        expect(humanBytes(512)).toBe("512 B");
        expect(humanBytes(BYTES_PER_UNIT)).toBe("1.0 KB");
        expect(humanBytes(BYTES_PER_UNIT ** 2)).toBe("1.0 MB");
    });

    it("stops at the largest declared unit rather than inventing one", () => {
        expect(humanBytes(BYTES_PER_UNIT ** 4)).toContain(BYTE_UNITS.at(-1) ?? "");
    });
});

describe("num and pct", () => {
    it("group thousands and report a share to one decimal, zero when the whole is empty", () => {
        expect(num(1000)).toBe("1,000");
        expect(pct(5, 10)).toBe("50.0%");
        expect(pct(5, 0)).toBe("0.0%");
    });
});
