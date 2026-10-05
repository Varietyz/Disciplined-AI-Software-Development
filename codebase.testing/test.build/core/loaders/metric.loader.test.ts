import { describe, expect, it } from "vitest";
import { loadMetricSnapshot } from "@banes-lab/build-scripts/core/loaders/metric.loader.ts";

describe("loadMetricSnapshot", () => {
    it("reads the principle and term groups out of the generated ontology snapshot", async () => {
        const snapshot = await loadMetricSnapshot();
        expect(snapshot.principles.length).toBeGreaterThan(0);
        expect(snapshot.terms.length).toBeGreaterThan(0);
    });
});
