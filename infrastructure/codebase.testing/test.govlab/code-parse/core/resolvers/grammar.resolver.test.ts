import { GRAMMAR_SUFFIX, RUNTIME_SPECIFIER } from "@govlab/code-parse/configuration/constants/grammar.constants.ts";
import { absolutePath, relativePath } from "@ssot/paths";
import { availableLanguages, resolveGrammarDir } from "@govlab/code-parse";
import { describe, expect, it } from "vitest";
import { grammarPath, runtimeWasm } from "@govlab/code-parse/core/resolvers/grammar.resolver.ts";
import { existsSync } from "node:fs";
import { join } from "node:path";

describe("the grammar resolver", () => {
    it("resolves the grammar folder through the paths key", () => {
        expect(resolveGrammarDir()).toBe(absolutePath("govlab.utils.codeParse.generated"));
        expect(
            relativePath("govlab.utils.codeParse.generated").startsWith(relativePath("govlab.utils.codeParse")),
        ).toBe(true);
    });

    it("names a grammar file by its language and the generated suffix", () => {
        expect(grammarPath("g", "go")).toBe(join("g", `go${GRAMMAR_SUFFIX}`));
    });

    it("finds the parser runtime the installed package ships", () => {
        expect(existsSync(runtimeWasm())).toBe(true);
        expect(runtimeWasm().endsWith(RUNTIME_SPECIFIER.split("/").at(-1) ?? "")).toBe(true);
    });
});

describe("availableLanguages", () => {
    it("lists the built grammars in order", () => {
        const languages = availableLanguages();
        expect(languages).toContain("go");
        expect(languages).toContain("typescript");
        expect(languages).not.toContain("language-extensions");
        expect(languages).toStrictEqual([...languages].sort((a, b) => a.localeCompare(b)));
    });
});
