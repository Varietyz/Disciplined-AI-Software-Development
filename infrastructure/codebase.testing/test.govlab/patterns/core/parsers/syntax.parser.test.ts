import { branch, leaf } from "./syntax.fixture.ts";
import { describe, expect, it } from "vitest";
import { codeRecords } from "@govlab/patterns/core/parsers/syntax.parser.ts";

describe("codeRecords", () => {
    it("extracts records from any tree, whatever its language", () => {
        const tree = branch("source_file", [branch("function_item", [leaf("identifier"), leaf("call_expression")])]);
        for (const language of ["rust", "haskell", "some-new-language"]) {
            const records = codeRecords(tree, language);
            expect(records.map((record) => record["nodeType"])).toStrictEqual([
                "source_file",
                "function_item",
                "identifier",
                "call_expression",
            ]);
            expect(records.every((record) => record["language"] === language)).toBe(true);
        }
    });

    it("carries the enclosing definition as the caller and the nesting depth", () => {
        const tree = branch("x", [branch("function_declaration", [leaf("call_expression")])]);
        const call = codeRecords(tree, "any").find((record) => record["nodeType"] === "call_expression");
        expect(call?.["caller"]).toBe("function_declaration");
        expect(call?.["depth"]).toBe(2);
    });
});
