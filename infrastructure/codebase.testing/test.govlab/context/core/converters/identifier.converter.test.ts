import { describe, expect, it } from "vitest";
import { nameKeyOf, slugify } from "@govlab/context/core/converters/identifier.converter.ts";

describe("slugify", () => {
    it("lowercases a name and joins its runs of letters and digits with one hyphen", () => {
        expect(slugify("Open/Closed Principle (OCP)")).toBe("open-closed-principle-ocp");
        expect(slugify("  package.json  ")).toBe("package-json");
    });
});

describe("nameKeyOf", () => {
    it("folds every word of the slug through the shared word rules, so a plural or British form keys its concept", () => {
        expect(nameKeyOf("Single Sources of Truth")).toBe("single-source-of-truth");
        expect(nameKeyOf("Normalisation")).toBe(nameKeyOf("normalization"));
        expect(nameKeyOf("Registries")).toBe("registry");
        expect(nameKeyOf("  ")).toBe("");
    });

    it("splits a camel or pascal identifier at its case boundaries before keying it", () => {
        expect(nameKeyOf("questionCoverageView")).toBe("question-coverage-view");
        expect(nameKeyOf("SRP")).toBe("srp");
    });

    it("returns a key that keys to itself", () => {
        const phrases = ["Offences", "Breaking Changes", "Normalisation Rules", "createLinker"];
        expect(phrases.filter((phrase) => nameKeyOf(nameKeyOf(phrase)) !== nameKeyOf(phrase))).toStrictEqual([]);
    });
});
