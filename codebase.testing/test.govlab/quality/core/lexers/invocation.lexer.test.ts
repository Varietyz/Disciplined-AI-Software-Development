import { commandOf, tokenizeCommand } from "@govlab/quality/core/lexers/invocation.lexer.ts";
import { expect, test } from "vitest";

test("commandOf splits a command into its binary and prefix, with a fallback binary", () => {
    expect(commandOf("python -m bandit", "bandit")).toStrictEqual({ bin: "python", prefix: ["-m", "bandit"] });
    expect(commandOf("", "bandit")).toStrictEqual({ bin: "bandit", prefix: [] });
});

test("tokenizeCommand splits a plain invocation on spaces", () => {
    expect(tokenizeCommand("npx eslint --fix")).toStrictEqual(["npx", "eslint", "--fix"]);
    expect(tokenizeCommand("  npx   eslint  ")).toStrictEqual(["npx", "eslint"]);
    expect(tokenizeCommand("")).toStrictEqual([]);
});

test("tokenizeCommand keeps a quoted argument whole and drops its quotes", () => {
    expect(tokenizeCommand('npx eslint "src/**/*.ts" --format json')).toStrictEqual([
        "npx",
        "eslint",
        "src/**/*.ts",
        "--format",
        "json",
    ]);
    expect(tokenizeCommand("tool 'a b' c")).toStrictEqual(["tool", "a b", "c"]);
});

test("tokenizeCommand preserves an explicitly empty quoted argument", () => {
    expect(tokenizeCommand('tool "" x')).toStrictEqual(["tool", "", "x"]);
});

test("tokenizeCommand joins a quoted run onto the token it touches", () => {
    expect(tokenizeCommand('--config="a b"')).toStrictEqual(["--config=a b"]);
});
