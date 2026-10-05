import { splitLines, valueAfter } from "@govlab/context/core/converters/text.converter.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("valueAfter trims what follows a prefix", () => {
    assert.equal(valueAfter("input:   raw", "input:"), "raw");
});

test("splitLines splits on line feeds, drops a carriage return and keeps empty lines", () => {
    assert.deepEqual(splitLines("a\r\n\nb"), ["a", "", "b"]);
});
