import { aliasPhrasesOf, keyOf, vocabularyOf } from "@banes-lab/build-scripts/core/converters/vocabulary.converter.ts";
import { describe, expect, it } from "vitest";
import { createGovlabContext } from "@govlab/context";

describe("aliasPhrasesOf", () => {
    it("keys every alias the ontology declares to its record's catalog ref", () => {
        const phrases = aliasPhrasesOf(createGovlabContext());
        expect(phrases).toContainEqual({ phrase: "DRY", ref: "architecture:duplicate-code" });
        expect(phrases).toContainEqual({ phrase: "SoC", ref: "architecture:separation-of-concerns" });
        expect(phrases.every((phrase) => phrase.ref.includes(":"))).toBe(true);
    });
});

const context = createGovlabContext();
const vocabulary = vocabularyOf(context);

describe("vocabularyOf", () => {
    it("derives one linkable phrase per principle name, acronym and alias, plus one per layer label, with no key twice", () => {
        const keys = vocabulary.map((entry) => keyOf(entry.phrase));
        expect(new Set(keys).size).toBe(keys.length);
        expect(vocabulary.length).toBeGreaterThan(context.arch.ids().length);
        const srp = vocabulary.filter((entry) => entry.ref === "architecture:single-responsibility");
        expect(srp.map((entry) => entry.phrase)).toContain("Single Responsibility Principle");
        expect(srp.map((entry) => entry.phrase)).toContain("SRP");
        expect(
            srp.every(
                (entry) => entry.code === "SRP" && entry.kind === "principle" && entry.layer === "Structural Core",
            ),
        ).toBe(true);
    });

    it("adds every lexicon term for whole-term joins only, behind the principle that shares its name", () => {
        const yagni = vocabulary.find((entry) => keyOf(entry.phrase) === "yagni");
        expect(yagni?.ref).toBe("lexicon:yagni");
        expect(yagni?.prose).toBe(false);
        expect(vocabulary.find((entry) => keyOf(entry.phrase) === "fail fast")?.ref).toBe("architecture:fail-fast");
        expect(vocabulary.filter((entry) => entry.ref.startsWith("architecture:")).every((entry) => entry.prose)).toBe(
            true,
        );
    });

    it("lets a principle name win over a layer label and keeps the other layers linkable", () => {
        expect(vocabulary.find((entry) => keyOf(entry.phrase) === "observability")?.ref).toBe(
            "architecture:observability",
        );
        expect(vocabulary.find((entry) => keyOf(entry.phrase) === "structural core")?.ref).toBe(
            "layer:structural-core",
        );
        expect(vocabulary.filter((entry) => entry.ref.startsWith("layer:")).length).toBeGreaterThan(0);
    });

    it("reads a short code only from a parenthetical acronym", () => {
        expect(vocabulary.find((entry) => entry.ref === "architecture:single-source-of-truth")?.code).toBeNull();
        expect(
            vocabulary.find((entry) => entry.ref === "architecture:command-query-responsibility-segregation")?.code,
        ).toBe("CQRS");
        expect(vocabulary.find((entry) => entry.ref === "architecture:domain-driven-design")?.code).toBe("DDD");
        expect(keyOf("Open/Closed Principle (OCP)")).toBe("open closed principle ocp");
    });
});
