import { describe, expect, it } from "vitest";
import { vocabularyFor } from "@ssot/govlab/shared/manifests/taxonomy.manifest.ts";
import { vocabularyRows } from "@govlab/stats/core/converters/taxonomy.converter.ts";

describe("vocabularyRows", () => {
    it("counts every declared word as unused when no root used it", () => {
        const host = vocabularyFor();
        const rows = vocabularyRows(host, [], {
            declared: 4,
            layerTotals: new Map([["domain", 1]]),
            layers: 2,
            present: 3,
        });
        const byName = new Map(rows.map((row) => [row.name, row]));
        expect(byName.get("concern tags")?.unused).toBe(host.byTag.size);
        expect(byName.get("containers")).toStrictEqual({ declared: 4, name: "containers", unused: 1, used: 3 });
        expect(byName.get("layers")?.used).toBe(1);
    });
});
