import { describe, expect, it } from "vitest";
import { absolutePath } from "@ssot/paths";
import { entrySeeds } from "@govlab/docs/core/factories/seed.factory.ts";
import { loadPackage } from "@govlab/docs/core/factories/diagram.factory.ts";

const seedNames = function seedNames(key: string): string[] {
    const dir = absolutePath(key);
    return entrySeeds(dir, loadPackage(dir)).map((seed) => seed.name);
};

describe("entrySeeds", () => {
    it("finds the exported entry symbols of a module's barrels", () => {
        expect(seedNames("govlab.context")).toContain("createGovlabContext");
        expect(seedNames("govlab.utils.contentFingerprint")).toContain("fingerprint");
    });
});
