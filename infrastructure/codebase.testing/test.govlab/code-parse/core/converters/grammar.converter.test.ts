import {
    SKIPPED_PREFIX,
    WASM_UNBUILT_PREFIX,
    noteOf,
} from "@govlab/code-parse/configuration/strings/grammar.strings.ts";
import { describe, expect, it } from "vitest";
import type { BuildResult } from "@govlab/code-parse/types/grammar.types.ts";
import { GRAMMAR_SOURCES } from "@govlab/code-parse/configuration/configs/grammar.config.ts";
import { extensionMapOf } from "@govlab/code-parse/core/converters/grammar.converter.ts";
import { reportBuild } from "@govlab/code-parse/core/reporters/grammar.reporter.ts";

const RESULTS: readonly BuildResult[] = [
    { fileTypes: ["zz", "aa", "aa"], kind: "built", lang: "zeta", note: "zeta" },
    { fileTypes: [], kind: "skipped", lang: "beta", note: noteOf("beta", "no wasm target") },
    { fileTypes: ["b"], kind: "wasm-failed", lang: "alpha", note: noteOf("alpha", "failed") },
];

describe("extensionMapOf", () => {
    it("keys each language with file types in order, deduplicated, and drops a language with none", () => {
        expect(extensionMapOf(RESULTS)).toStrictEqual({ alpha: ["b"], zeta: ["aa", "zz"] });
        expect(Object.keys(extensionMapOf(RESULTS))).toStrictEqual(["alpha", "zeta"]);
    });
});

describe("reportBuild", () => {
    it("passes when no fetch failed and fails when one did", () => {
        expect(SKIPPED_PREFIX).not.toBe(WASM_UNBUILT_PREFIX);
        expect(reportBuild(RESULTS)).toBe(true);
        expect(reportBuild([{ fileTypes: [], kind: "fetch-failed", lang: "x", note: noteOf("x", "down") }])).toBe(
            false,
        );
    });
});

describe("GRAMMAR_SOURCES", () => {
    it("declares each language once, fetched from npm or git", () => {
        const languages = GRAMMAR_SOURCES.map((source) => source.lang);
        expect(new Set(languages).size).toBe(languages.length);
        expect(GRAMMAR_SOURCES.every((source) => source.npm !== undefined || source.git !== undefined)).toBe(true);
    });
});
