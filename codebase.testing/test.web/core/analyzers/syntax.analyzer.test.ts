import {
    BNF_LANGUAGE,
    PAG_LANGUAGE,
    TEXT_LANGUAGE,
    TYPESCRIPT_LANGUAGE,
} from "@banes-lab/web/configuration/constants/code.constants.ts";
import { describe, expect, it } from "vitest";
import { renderSyntax } from "@banes-lab/web/presentation/renderers/syntax.renderer.ts";
import { tokenize } from "@banes-lab/web/core/analyzers/syntax.analyzer.ts";

const kindsOf = function kindsOf(code: string, language: string): readonly string[] {
    return tokenize(code, language).map((token) => `${token.kind}:${token.text}`);
};

describe("tokenize", () => {
    it("classifies keywords, types, strings, numbers and comments in a script language", () => {
        expect(kindsOf('const x: Foo = "a\\"b"; // note\n42', TYPESCRIPT_LANGUAGE)).toStrictEqual([
            "keyword:const",
            "plain: x: ",
            "type:Foo",
            "plain: = ",
            String.raw`string:"a\"b"`,
            "plain:; ",
            "comment:// note",
            "plain:\n",
            "number:42",
        ]);
    });

    it("treats shouted words as keywords, angle names as types and hash lines as headings in the grammar languages", () => {
        expect(kindsOf("<Registry> ::= FOR EACH item", BNF_LANGUAGE)).toStrictEqual([
            "type:<Registry>",
            "plain: ::= ",
            "keyword:FOR",
            "plain: ",
            "keyword:EACH",
            "plain: item",
        ]);
        expect(kindsOf("# PHASE 1\nSET x = 1", PAG_LANGUAGE)[0]).toBe("heading:# PHASE 1");
    });

    it("reassembles the source text exactly and leaves plain text as one run", () => {
        const source = "plain words only here";
        expect(
            tokenize(source, TEXT_LANGUAGE)
                .map((token) => token.text)
                .join(""),
        ).toBe(source);
        expect(tokenize(source, TEXT_LANGUAGE)).toHaveLength(1);
    });
});

describe("renderSyntax", () => {
    it("wraps every classified token in a span and keeps the text intact", () => {
        const element = renderSyntax("const n = 1", TYPESCRIPT_LANGUAGE);
        expect(element.textContent).toBe("const n = 1");
        expect(element.querySelector(".syntax-keyword")?.textContent).toBe("const");
        expect(element.querySelector(".syntax-number")?.textContent).toBe("1");
    });
});
