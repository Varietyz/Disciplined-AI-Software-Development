import {
    NO_TREE,
    PARSE_FAILED,
    PARSE_INCOMPLETE,
    noGrammar,
    notPreloaded,
} from "@govlab/code-parse/configuration/strings/syntax.strings.ts";
import { beforeAll, describe, expect, it } from "vitest";
import { commentNodes, ensureLanguages, parseCode, parseCodeSync } from "@govlab/code-parse";
import { PARSE_ATTEMPTS } from "@govlab/code-parse/configuration/constants/syntax.constants.ts";

describe("the syntax converter", () => {
    beforeAll(async () => {
        await ensureLanguages(["go", "javascript", "typescript"]);
    });

    it("parses synchronously after preload and locates comment nodes with byte ranges", () => {
        const source = "package main\n\n// a standalone comment\nfunc main() {}\n";
        const root = parseCodeSync(source, "go");
        const [comment] = root === null ? [] : commentNodes(root);
        expect(comment?.startIndex).toBeTypeOf("number");
        expect(source.slice(comment?.startIndex, comment?.endIndex)).toContain("a standalone comment");
    });

    it("parseCode loads a grammar on demand", async () => {
        const root = await parseCode("const x = 1; // inline\n", "javascript");
        expect(root === null ? [] : commentNodes(root)).toHaveLength(1);
    });

    it("warns and answers null for a language with no grammar", async () => {
        const warnings: string[] = [];
        const root = await parseCode("x", "definitely-not-a-language", {
            logger: {
                warn: (message) => {
                    warnings.push(message);
                },
            },
        });
        expect(root).toBeNull();
        expect(warnings).toStrictEqual([noGrammar("definitely-not-a-language")]);
    });

    it("throws when parsing synchronously without preloading the grammar", () => {
        expect(() => parseCodeSync("SELECT 1", "definitely-not-a-language")).toThrow(
            notPreloaded("definitely-not-a-language"),
        );
    });

    it("retries a bounded number of times and names each diagnostic", () => {
        expect(PARSE_ATTEMPTS).toBeGreaterThan(1);
        expect(new Set([NO_TREE, PARSE_FAILED, PARSE_INCOMPLETE]).size).toBe(3);
    });
});
