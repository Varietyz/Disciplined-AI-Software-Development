import { describe, expect, it } from "vitest";
import { isEntryAnswer, isValueAnswer } from "@ssot/secrets/core/predicates/environment.predicate.ts";

describe("isValueAnswer", () => {
    it("accepts the vault's value answer and refuses any other answer", () => {
        expect(isValueAnswer({ answer: "value", value: "x" })).toBe(true);
        expect(isValueAnswer({ answer: "done" })).toBe(false);
        expect(isValueAnswer({ answer: "value", value: 1 })).toBe(false);
        expect(isValueAnswer(null)).toBe(false);
    });
});

describe("isEntryAnswer", () => {
    it("accepts an entry answer whose fields each carry a label", () => {
        expect(isEntryAnswer({ answer: "entry", entry: { fields: [{ label: "A", value: null }] } })).toBe(true);
        expect(isEntryAnswer({ answer: "entry", entry: { fields: [{ value: null }] } })).toBe(false);
        expect(isEntryAnswer({ answer: "entry", entry: [] })).toBe(false);
        expect(isEntryAnswer({ answer: "value", value: "x" })).toBe(false);
    });
});
