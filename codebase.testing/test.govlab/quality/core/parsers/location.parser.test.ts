import { expect, test } from "vitest";
import { parseLines, parseLocation } from "@govlab/quality/core/parsers/location.parser.ts";

test("parseLocation reads file:line:column, keeping colons inside the file", () => {
    expect(parseLocation("D:/src/a.cpp:3:7")).toStrictEqual({ column: 7, file: "D:/src/a.cpp", line: 3 });
    expect(parseLocation("a.cpp:x:7")).toBeNull();
    expect(parseLocation("a.cpp")).toBeNull();
});

test("parseLines trims each line and drops the ones the line parser rejects", () => {
    expect(parseLines(" a \n\n b ", (line) => (line.length > 0 ? line : null))).toStrictEqual(["a", "b"]);
});
