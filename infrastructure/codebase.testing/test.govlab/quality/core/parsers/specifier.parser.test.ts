import { expect, test } from "vitest";
import { specifiersIn } from "@govlab/quality/core/parsers/specifier.parser.ts";

test("specifiersIn reads every quoted module specifier after an import keyword", () => {
    const text = "import a from 'x';\nconst b = require(\"y\");\nvi.mock('z');\nconst reimport = 1;";
    expect(specifiersIn(text).sort()).toStrictEqual(["x", "y", "z"]);
});

test("specifiersIn ignores a keyword that is part of a longer identifier", () => {
    expect(specifiersIn("myfrom 'x'")).toStrictEqual([]);
});
