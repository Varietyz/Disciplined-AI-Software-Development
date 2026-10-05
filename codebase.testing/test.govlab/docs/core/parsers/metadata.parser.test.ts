import { describe, expect, it } from "vitest";
import {
    fieldLine,
    fileTokens,
    listValues,
    parseFrontmatter,
    splitOn,
} from "@govlab/docs/core/parsers/metadata.parser.ts";

describe("parseFrontmatter", () => {
    it("reads the fields and where the body starts, and reports an absent block", () => {
        const frontmatter = parseFrontmatter("---\ntype: readme\nname: foo\n---\n# Title\nbody");
        expect(frontmatter).toStrictEqual({ bodyStart: 4, fields: { name: "foo", type: "readme" }, present: true });
        expect(parseFrontmatter("# Title").present).toBe(false);
        expect(parseFrontmatter("---\ntype: open").present).toBe(false);
    });
});

describe("listValues", () => {
    it("reads a bracketed list, an empty pair as empty, and anything else as no list", () => {
        expect(listValues("[a, b, c]")).toStrictEqual(["a", "b", "c"]);
        expect(listValues("[]")).toStrictEqual([]);
        expect(listValues("a, b")).toBeNull();
        expect(listValues("[a, , b,]")).toStrictEqual(["a", "b"]);
    });
});

describe("fieldLine", () => {
    it("finds the line of a field, and the first line when it is absent", () => {
        expect(fieldLine("---\ntype: guide\nstatus: current\n---", "status")).toBe(3);
        expect(fieldLine("---\ntype: guide\n---", "status")).toBe(1);
    });
});

describe("splitOn and fileTokens", () => {
    it("split on the separators and drop empty tokens", () => {
        expect(splitOn("a,,b,", (char) => char === ",")).toStrictEqual(["a", "b"]);
        expect(fileTokens('depends-on: [a.md, "b.md"]')).toStrictEqual(["depends-on", "a.md", "b.md"]);
    });
});
