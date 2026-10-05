import { describe, expect, it } from "vitest";
import { absolutePath } from "@ssot/paths";
import { loadPackage } from "@govlab/docs/core/factories/diagram.factory.ts";
import { shapeOf } from "@govlab/docs/core/classifiers/package.classifier.ts";

const shapeAt = function shapeAt(key: string): string {
    const dir = absolutePath(key);
    return shapeOf(dir, loadPackage(dir));
};

describe("shapeOf", () => {
    it("separates a composing framework from a leaf by its sibling dependencies", () => {
        expect(shapeAt("govlab.quality.root")).toBe("framework");
        expect(shapeAt("govlab.utils.contentFingerprint")).toBe("leaf");
    });

    it("reads a package exporting both a frontend and a backend entry as full-stack", () => {
        expect(shapeOf("module", { exports: { "./backend": "./b.ts", "./frontend": "./f.ts" } })).toBe("full-stack");
    });
});
