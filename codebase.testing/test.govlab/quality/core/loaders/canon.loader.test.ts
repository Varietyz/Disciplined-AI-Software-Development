import { expect, test } from "vitest";
import { loadCanonicalData } from "@govlab/quality/core/loaders/canon.loader.ts";

test("loadCanonicalData joins the generated settings and rows with the authored values and surfaces", () => {
    const data = loadCanonicalData();
    expect(data.settings.length).toBeGreaterThan(0);
    expect(data.rows.length).toBeGreaterThan(0);
    expect(data.ownership.every((surface) => typeof surface.id === "string")).toBe(true);
    expect(Array.isArray(data.conflicts)).toBe(true);
});
