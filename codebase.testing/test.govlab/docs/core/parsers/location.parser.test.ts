import { describe, expect, it } from "vitest";
import { pathReferences } from "@govlab/docs/core/parsers/location.parser.ts";
import { relativePath } from "@ssot/paths";

const pathsOf = function pathsOf(source: string): string[] {
    return pathReferences(source).map((ref) => ref.path);
};

describe("pathReferences", () => {
    it("extracts backtick and link paths and skips what is not a path", () => {
        const sample = `${relativePath("govlab.root")}/foo/bar.ts`;
        const refs = pathsOf(
            `See \`${sample}\` and [x](./rel/y.js), not \`@govlab/pkg\`, \`a b/c\`, \`https://x/y\`, or \`plain\`.`,
        );
        expect(refs).toContain(sample);
        expect(refs).toContain("./rel/y.js");
        expect(refs).not.toContain("@govlab/pkg");
        expect(refs.some((ref) => ref.includes(" ") || ref.includes("://") || !ref.includes("/"))).toBe(false);
    });

    it("records the line of each reference", () => {
        expect(pathReferences("line one\n`dir/file.ts` here").map((ref) => ref.line)).toStrictEqual([2]);
    });

    it("skips fenced and indented code, but not a list continuation", () => {
        expect(pathsOf("~~~\n`in/fence.js`\n~~~\nsee `out/side.js`")).toStrictEqual(["out/side.js"]);
        expect(pathsOf("````\n`in/fence.js`\n```\n`still/inner.js`\n````\nsee `out/side.js`")).toStrictEqual([
            "out/side.js",
        ]);
        expect(pathsOf("```\n`fake/x.js` and [y](fake/y.js)\n```")).toStrictEqual([]);
        expect(pathsOf("text\n\n    `skipped/x.js`\n")).toStrictEqual([]);
        expect(pathsOf("- item\n\n    still `list/x.js`\n")).toStrictEqual(["list/x.js"]);
    });
});
