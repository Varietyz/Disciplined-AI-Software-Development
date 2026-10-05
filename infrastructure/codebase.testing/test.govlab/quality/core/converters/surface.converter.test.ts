import { expect, test } from "vitest";
import { mergeOwnership } from "@govlab/quality/core/converters/surface.converter.ts";

const SURFACES = [{ fixedOwners: ["go"], id: "format", ownerByLanguage: { go: "gofmt", ts: "prettier" } }];

test("mergeOwnership applies an override except where the surface's owner is fixed", () => {
    expect(mergeOwnership(SURFACES)).toBe(SURFACES);
    const [merged] = mergeOwnership(SURFACES, { format: { go: "other", ts: "biome" } });
    expect(merged?.ownerByLanguage).toStrictEqual({ go: "gofmt", ts: "biome" });
});
