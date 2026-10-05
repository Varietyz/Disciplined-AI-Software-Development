import { concernOf, labelOf } from "@govlab/quality/core/classifiers/concern.classifier.ts";
import { describe, expect, it } from "vitest";

describe("labelOf and concernOf", () => {
    it("labels a rule by its name, falling back to its id", () => {
        expect(labelOf({ name: "max-lines", ruleId: "a" })).not.toBe("");
        expect(labelOf({ ruleId: "no-console" })).not.toBe("");
    });

    it("derives the same concern for two rules whose names differ only in word order and plural", () => {
        const one = concernOf({ name: "max-nested-callbacks", ruleId: "a" });
        const two = concernOf({ name: "nested-callback-max", ruleId: "b" });
        expect(one).toBe(two);
    });

    it("falls back to a prefixed label when the name carries no meaningful word", () => {
        expect(concernOf({ name: "E1", ruleId: "E1" }).startsWith("x:")).toBe(true);
    });
});
