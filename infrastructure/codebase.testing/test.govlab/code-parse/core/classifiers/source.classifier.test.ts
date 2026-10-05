import { DETECTABLE_LANGUAGES, detectLanguage } from "@govlab/code-parse";
import {
    EXTENSION_DOT,
    SHEBANG_PREFIX,
    SHEBANG_TOKENS,
    UNDECLARED_EXTENSIONS,
} from "@govlab/code-parse/configuration/constants/source.constants.ts";
import { describe, expect, it } from "vitest";
import { loadDerivedExtensions } from "@govlab/code-parse/core/loaders/source.loader.ts";

describe("detectLanguage", () => {
    it("detects languages from the derived extension map", () => {
        expect(detectLanguage("main.go")).toBe("go");
        expect(detectLanguage("app.mjs")).toBe("javascript");
        expect(detectLanguage("APP.CJS")).toBe("javascript");
    });

    it("detects the ecosystem alias extensions the grammars omit", () => {
        for (const [extension, language] of UNDECLARED_EXTENSIONS) {
            expect(detectLanguage(`file${extension}`)).toBe(language);
        }
    });

    it("falls back to the shebang for a file with no known extension", () => {
        expect(detectLanguage("script", `${SHEBANG_PREFIX}/usr/bin/env node\n`)).toBe("javascript");
        expect(detectLanguage("script", "echo")).toBeNull();
        expect(detectLanguage("script", `${SHEBANG_PREFIX}/usr/bin/unknown`)).toBeNull();
    });

    it("names every language it can return", () => {
        for (const language of SHEBANG_TOKENS.values()) {
            expect(DETECTABLE_LANGUAGES.has(language)).toBe(true);
        }
    });
});

describe("loadDerivedExtensions", () => {
    it("keys every extension with its dot and in lower case", () => {
        const map = loadDerivedExtensions();
        expect(map.size).toBeGreaterThan(0);
        expect([...map.keys()].every((key) => key.startsWith(EXTENSION_DOT) && key === key.toLowerCase())).toBe(true);
    });
});
