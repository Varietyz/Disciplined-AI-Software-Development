import { describe, expect, it } from "vitest";
import { canonicalForceOf } from "@govlab/context/core/normalizers/vocabulary.normalizer.ts";
import { createGovlabContext } from "@govlab/context";

describe("canonicalForceOf", () => {
    it("names the canonical force a token folds to when it is spelled differently", () => {
        expect(canonicalForceOf("object creation")).toBe("object_creation");
        expect(canonicalForceOf("Object-Creation")).toBe("object_creation");
    });

    it("answers nothing for a canonical spelling, an anti-force or a free-form scope", () => {
        expect(canonicalForceOf("object_creation")).toBeNull();
        expect(canonicalForceOf("hardcoded-secrets (exposure)")).toBeNull();
        expect(canonicalForceOf("service")).toBeNull();
    });

    it("finds no misspelled force in the bundled canon", () => {
        expect(createGovlabContext().validateResolution().misspelledForces).toStrictEqual([]);
    });
});
