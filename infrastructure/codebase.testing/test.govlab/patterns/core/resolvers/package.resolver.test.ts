import { describe, expect, it } from "vitest";
import { isSelfGoverned, titleFor } from "@govlab/patterns/core/resolvers/package.resolver.ts";
import { mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("the package resolver", () => {
    const root = mkdtempSync(join(tmpdir(), "pl-titles-"));
    const governed = join(root, "group", "governed");
    const plain = join(root, "group", "plain");
    mkdirSync(governed, { recursive: true });
    mkdirSync(plain, { recursive: true });
    writeVerbatim(join(governed, "_manifest.json"), JSON.stringify({ selfGoverned: {} }));

    it("reads the self-governance marker from the manifest", () => {
        expect(isSelfGoverned(governed)).toBe(true);
        expect(isSelfGoverned(plain)).toBe(false);
    });

    it("titles a self-governed module by its folder and any other by its path from the root", () => {
        expect(titleFor(root, governed)).toBe("governed");
        expect(titleFor(root, plain)).toBe("group/plain");
    });
});
