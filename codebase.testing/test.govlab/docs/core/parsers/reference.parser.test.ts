import { describe, expect, it } from "vitest";
import { parseReferences } from "@govlab/docs/core/parsers/reference.parser.ts";

describe("parseReferences", () => {
    it("reads a declared construct once and reports an undeclared verb", () => {
        const source = [
            "# T",
            "",
            'see: `run` "`src/run.ts`" and again see: `run` "`src/run.ts`"',
            'seee: `run` "`src/run.ts`"',
            "```",
            'see: `ignored` "`in/code.ts`"',
            "```",
        ].join("\n");
        const scan = parseReferences(source, ["see", "defined at"]);
        expect(
            scan.constructs.map((construct) => [construct.line, construct.identifier, construct.path]),
        ).toStrictEqual([[3, "run", "src/run.ts"]]);
        expect(scan.defects.map((defect) => [defect.code, defect.line])).toStrictEqual([["unknown-verb", 4]]);
    });
});
