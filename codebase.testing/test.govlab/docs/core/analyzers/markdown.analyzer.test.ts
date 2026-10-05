import { describe, expect, it } from "vitest";
import { conventionHits } from "@govlab/docs/core/analyzers/markdown.analyzer.ts";

const UNLABELED = "unlabeled-code-fence";

const codesOf = function codesOf(source: string, code: string): string[] {
    return conventionHits(source)
        .filter((hit) => hit.code === code)
        .map((hit) => hit.token);
};

describe("conventionHits", () => {
    it("flags a bare path in prose, not a backticked or linked one", () => {
        const bare = codesOf("See src/index.ts here. But `src/ok.ts` and [x](./y.md) are fine.", "bare-path");
        expect(bare).toContain("src/index.ts");
        expect(bare).not.toContain("src/ok.ts");
        expect(bare.some((token) => token.includes("y.md"))).toBe(false);
    });

    it("ignores slashes that are not paths, and still sees a path before a CRLF", () => {
        expect(codesOf("either and/or, TCP/IP, or 12/25 dates", "bare-path")).toStrictEqual([]);
        expect(codesOf("see config/foo.js\r\nmore", "bare-path")).toHaveLength(1);
    });

    it("flags a fence with no language, not a tagged one", () => {
        expect(codesOf("```\ncode\n```\n\ntext\n\n```ts EXAMPLE: ok\nok\n```", "untagged-code-fence")).toHaveLength(1);
    });

    it("requires an intent label from the vocabulary on a code fence", () => {
        expect(codesOf("```ts\nconst x = 1;\n```", UNLABELED)).toHaveLength(1);
        expect(codesOf("```ts EXAMPLE: usage\nconst x = 1;\n```", UNLABELED)).toHaveLength(0);
        expect(codesOf("```ts API: createFoo(o)\nx\n```", UNLABELED)).toHaveLength(0);
        expect(codesOf("```ts NOTE: whatever\nx\n```", UNLABELED)).toHaveLength(1);
        expect(codesOf("```text\ntree\n```", UNLABELED)).toHaveLength(0);
        expect(codesOf("````ts\ncode\n````", UNLABELED)).toHaveLength(1);
    });
});
