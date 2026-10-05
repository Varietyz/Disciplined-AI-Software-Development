import { branch, leaf } from "../parsers/syntax.fixture.ts";
import { childNodes, fieldText, fieldType, lineOf } from "@govlab/patterns/core/selectors/syntax.selector.ts";
import { describe, expect, it } from "vitest";

describe("the syntax selectors", () => {
    it("childNodes lists every present child in order", () => {
        const root = branch("root", [leaf("a"), leaf("b")]);
        expect(childNodes(root).map((node) => node.type)).toStrictEqual(["a", "b"]);
    });

    it("fieldText and fieldType read a named field, and fall back when it is absent", () => {
        const node = leaf("call_expression", { function: leaf("member_expression") });
        expect(fieldText(node, "function")).toBe("member_expression");
        expect(fieldType(node, "function")).toBe("member_expression");
        expect(fieldText(node, "missing")).toBe("");
        expect(fieldType(node, "missing")).toBeUndefined();
    });

    it("lineOf numbers lines from one", () => {
        expect(lineOf(leaf("x"))).toBe(1);
        expect(lineOf(branch("y", []))).toBe(1);
    });
});
