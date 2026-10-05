import { describe, expect, it } from "vitest";
import { INPUT } from "../loaders/stats.fixture.ts";
import { abstractionSection } from "@govlab/stats/core/reporters/metric.reporter.ts";
import { deriveMetrics } from "@govlab/stats/core/converters/metric.converter.ts";

describe("abstractionSection", () => {
    it("renders the file-type mix, the ratios and the governed modules", () => {
        const text = abstractionSection(INPUT, deriveMetrics(INPUT.state)).join("\n");
        expect(text).toContain("### File-type mix");
        expect(text).toContain("### Ratios");
        expect(text).toContain("taxonomy conformance");
        expect(text).toContain("### Governed modules");
    });
});
