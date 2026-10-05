import { describe, expect, it } from "vitest";
import { tokenizeCommand } from "@govlab/docs/core/lexers/shell.lexer.ts";

describe("tokenizeCommand", () => {
    it("splits on whitespace and keeps a quoted run as one word", () => {
        expect(tokenizeCommand("concurrently \"npm run a\" 'npm run b'\tvite")).toStrictEqual([
            "concurrently",
            "npm run a",
            "npm run b",
            "vite",
        ]);
        expect(tokenizeCommand("   ")).toStrictEqual([]);
    });
});
