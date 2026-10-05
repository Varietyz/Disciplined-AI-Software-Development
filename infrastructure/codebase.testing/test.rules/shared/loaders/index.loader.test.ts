import { buildTreeIndex, resolvesAgainst } from "@ssot/govlab/shared/loaders/index.loader.ts";
import { describe, expect, it } from "vitest";
import { relativePath } from "@ssot/paths";

describe("buildTreeIndex and resolvesAgainst", () => {
    const index = buildTreeIndex();

    it("indexes the tree's paths and basenames, the rule host's labels included", () => {
        expect(index.paths.length).toBeGreaterThan(0);
        expect(index.basenames.has("package.json")).toBe(true);
        expect(index.paths.some((p) => p.startsWith("local/"))).toBe(true);
    });

    it("resolves a declared path by prefix and by basename and refuses an absent one", () => {
        expect(resolvesAgainst(index, relativePath("govlabHost.shared"))).toBe(true);
        expect(resolvesAgainst(index, "paths.yaml")).toBe(true);
        expect(resolvesAgainst(index, "nowhere/at/all")).toBe(false);
    });
});
