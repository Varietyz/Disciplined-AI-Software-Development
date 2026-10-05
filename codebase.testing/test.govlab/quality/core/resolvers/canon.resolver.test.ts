import { buildCanonIndex, canonFor } from "@govlab/quality/core/resolvers/canon.resolver.ts";
import { expect, test } from "vitest";

test("canonFor reads a rule's canon by its full id, then by its bare id", () => {
    const index = new Map([["no-x", ["quality:concept:x"]]]);
    expect(canonFor("plugin/no-x", index)).toStrictEqual(["quality:concept:x"]);
    expect(canonFor("no-y", index)).toStrictEqual([]);
    expect(buildCanonIndex().size).toBeGreaterThan(0);
});
