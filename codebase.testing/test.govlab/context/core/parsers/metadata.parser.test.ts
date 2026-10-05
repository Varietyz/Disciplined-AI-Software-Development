import { fieldOf, parseDeclaration, readFrontmatter } from "@govlab/context/core/parsers/metadata.parser.ts";
import { LINE } from "./document.fixture.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("parseDeclaration reads the type, the verb and the description", () => {
    assert.deepEqual(parseDeclaration("THIS AGENT PERFORMS a sample task", LINE), {
        description: "a sample task",
        line: LINE,
        type: "AGENT",
        verb: "PERFORMS",
    });
});

test("readFrontmatter reads a fenced block and reports where the body starts", () => {
    assert.deepEqual(readFrontmatter(["", "---", "name: x", "---", "body"]), { end: 4, frontmatter: "name: x" });
    assert.deepEqual(readFrontmatter(["body"]), { end: 0, frontmatter: null });
});

test("fieldOf splits a line at its first colon and refuses a line that opens with one", () => {
    assert.deepEqual(fieldOf("verdict: pass: now"), { key: "verdict", value: "pass: now" });
    assert.equal(fieldOf(": no key"), null);
    assert.equal(fieldOf("no colon"), null);
});
