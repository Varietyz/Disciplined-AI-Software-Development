import { describe, expect, it } from "vitest";
import { bracketAccess } from "@govlab/quality/core/converters/access.converter.ts";
import { hitsByFile } from "@govlab/quality/core/parsers/access.parser.ts";

describe("bracketAccess", () => {
    it("rewrites the dot access a TS4111 diagnostic points at to bracket access", () => {
        const text = "const value = record.field;\nconst other = maybe?.key;\n";
        const rewritten = bracketAccess(text, [
            { column: 22, line: 1 },
            { column: 22, line: 2 },
        ]);
        expect(rewritten).toBe('const value = record["field"];\nconst other = maybe?.["key"];\n');
    });
});

describe("hitsByFile", () => {
    it("groups the TS4111 diagnostics by file and ignores every other error", () => {
        const output = [
            "a.ts(3,7): error TS4111: Property 'x' comes from an index signature.",
            "a.ts(9,2): error TS2322: Type mismatch.",
        ].join("\n");
        const hits = [...hitsByFile(output).values()];
        expect(hits).toStrictEqual([[{ column: 7, line: 3 }]]);
    });
});
