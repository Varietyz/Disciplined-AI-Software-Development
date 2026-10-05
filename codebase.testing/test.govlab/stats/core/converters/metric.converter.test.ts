import { MEDIAN, NINETIETH, TOP_LARGEST } from "@govlab/stats/configuration/constants/metric.constants.ts";
import { bucketOf, deriveMetrics } from "@govlab/stats/core/converters/metric.converter.ts";
import { describe, expect, it } from "vitest";
import { INPUT } from "../loaders/stats.fixture.ts";

describe("deriveMetrics", () => {
    const derived = deriveMetrics(INPUT.state);

    it("orders the percentiles and caps the largest list", () => {
        expect(derived.medianLines).toBeLessThanOrEqual(derived.p90Lines);
        expect(derived.p90Lines).toBeLessThanOrEqual(derived.largestLines);
        expect(derived.topLargest.length).toBeLessThanOrEqual(TOP_LARGEST);
        expect(MEDIAN).toBeLessThan(NINETIETH);
    });

    it("totals the authored files across every role", () => {
        expect(derived.authoredFiles).toBe(
            [...INPUT.state.authored.values()].reduce((sum, bucket) => sum + bucket.files, 0),
        );
    });
});

describe("bucketOf", () => {
    it("reads an empty bucket for a key the map lacks", () => {
        expect(bucketOf(new Map(), "absent")).toStrictEqual({ blank: 0, bytes: 0, code: 0, files: 0, total: 0 });
    });
});
