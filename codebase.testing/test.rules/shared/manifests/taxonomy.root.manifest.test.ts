import { describe, expect, it } from "vitest";
import {
    fixtureMarkerOf,
    isTestRoot,
    mirrorSourceOf,
    taxonomyRoots,
    testMarkerOf,
    testMarkers,
} from "@ssot/govlab/shared/manifests/taxonomy.root.manifest.ts";
import { relativePath } from "@ssot/paths";

const MIRROR = relativePath("codebase.testing.coordination");
const SOURCE = `${relativePath("app.coordination")}/tools`;

describe("the test mirrors", () => {
    it("list every declared root, the mirrors included", () => {
        expect(taxonomyRoots()).toContain(MIRROR);
        expect(taxonomyRoots()).toContain(SOURCE);
    });

    it("tell a test root apart from a source root and name the source it mirrors", () => {
        expect(isTestRoot(MIRROR)).toBe(true);
        expect(isTestRoot(SOURCE)).toBe(false);
        expect(isTestRoot()).toBe(false);
        expect(mirrorSourceOf(MIRROR)).toBe(SOURCE);
        expect(mirrorSourceOf()).toBeUndefined();
    });
});

describe("the test markers", () => {
    it("read the test and fixture marker in the slot before the extension", () => {
        expect(testMarkerOf("board.runner.test.ts")).toBe("test");
        expect(testMarkerOf("board.runner.ts")).toBeUndefined();
        expect(fixtureMarkerOf("gate.ts")).toBeUndefined();
        expect(fixtureMarkerOf("gate.fixture.ts")).toBe("fixture");
        expect(testMarkers()).toContain("fixture");
    });
});
