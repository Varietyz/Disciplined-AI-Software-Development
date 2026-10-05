import { describe, expect, it } from "vitest";
import { foldedOf, templatePartsOf } from "@banes-lab/web/core/converters/template.converter.ts";

const hole = function hole(name: string): string {
    return ["$", "{", name, "}"].join("");
};

const TEMPLATE = `shelf/${hole("NAME")}.config.ts`;

describe("templatePartsOf", () => {
    it("splits a template into its literal parts and its holes, and leaves plain text alone", () => {
        expect(templatePartsOf(TEMPLATE)).toStrictEqual({ holes: ["NAME"], literals: ["shelf/", ".config.ts"] });
        expect(templatePartsOf("shelf/surface.config.ts")).toBeNull();
    });
});

describe("foldedOf", () => {
    it("folds a template whose holes are all string constants of the same file", () => {
        const parts = templatePartsOf(TEMPLATE);
        expect(parts === null ? null : foldedOf(parts, 'const NAME = "surface";')).toBe("shelf/surface.config.ts");
    });

    it("leaves a template open when a hole has no string constant in the file", () => {
        const parts = templatePartsOf(`shelf/${hole("imported")}.config.ts`);
        expect(parts === null ? "" : foldedOf(parts, "const other = 1;")).toBeNull();
    });
});
