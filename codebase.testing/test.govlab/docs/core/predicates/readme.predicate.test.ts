import { describe, expect, it } from "vitest";
import {
    isApiNote,
    isNonEmptyString,
    isRenderable,
    isStringArray,
} from "@govlab/docs/core/predicates/readme.predicate.ts";

describe("the readme predicates", () => {
    it("accept renderable manifest values and refuse empty or mixed ones", () => {
        expect([isNonEmptyString("x"), isNonEmptyString("  "), isNonEmptyString(1)]).toStrictEqual([
            true,
            false,
            false,
        ]);
        expect([isStringArray(["a"]), isStringArray([]), isStringArray(["a", ""])]).toStrictEqual([true, false, false]);
        expect([
            isRenderable("x"),
            isRenderable(["a"]),
            isRenderable([{ k: "v" }]),
            isRenderable([{ k: 1 }]),
        ]).toStrictEqual([true, true, true, false]);
        expect([isApiNote({ name: "x", note: "n" }), isApiNote({ name: "x" })]).toStrictEqual([true, false]);
    });
});
