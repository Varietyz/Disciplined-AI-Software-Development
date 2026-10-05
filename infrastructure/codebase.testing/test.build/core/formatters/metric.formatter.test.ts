import { describe, expect, it } from "vitest";
import { renderMetrics } from "@banes-lab/build-scripts/core/formatters/metric.formatter.ts";

describe("renderMetrics", () => {
    it("writes a typed module whose one export parses back to the metrics", () => {
        const metrics = { principles: 3, rules: 1, steps: 2, terms: 4 };
        const source = renderMetrics(metrics);
        expect(source.startsWith('import type { SiteMetrics } from "#types/metric.types";')).toBe(true);
        const start = source.indexOf("JSON.parse(") + "JSON.parse(".length;
        const literal: unknown = JSON.parse(source.slice(start, source.lastIndexOf(");")));
        const parsed: unknown = JSON.parse(String(literal));
        expect(parsed).toStrictEqual(metrics);
    });
});
