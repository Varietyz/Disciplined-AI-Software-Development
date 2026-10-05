import {
    applyByFile,
    applyEdits,
    disjoint,
    parsesAsJson,
    splice,
} from "@ssot/govlab/codemods/selectors/edit.selector.ts";
import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import type { Edit } from "@ssot/govlab/types/codemod.types.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const SOURCE = "const a = 1;";

const withFile = function withFile(content: string, run: (fileName: string) => void, name = "probe.ts"): void {
    const dir = mkdtempSync(join(tmpdir(), "codemod-edit-"));
    const fileName = join(dir, name);
    writeVerbatim(fileName, content);
    try {
        run(fileName);
    } finally {
        rmSync(dir, { force: true, recursive: true });
    }
};

describe("applyEdits", () => {
    it("writes nothing and reports zero when there is no edit", () => {
        withFile(SOURCE, (fileName) => {
            expect(applyEdits(fileName, [])).toBe(0);
            expect(readFileSync(fileName, "utf8")).toBe(SOURCE);
        });
    });

    it("applies a single replacement", () => {
        withFile(SOURCE, (fileName) => {
            const edits: Edit[] = [{ end: 11, replacement: "2", start: 10 }];
            expect(applyEdits(fileName, edits)).toBe(1);
            expect(readFileSync(fileName, "utf8")).toBe("const a = 2;");
        });
    });

    it("applies several edits without letting an earlier one shift a later one", () => {
        withFile("const a = 1; const b = 2;", (fileName) => {
            const edits: Edit[] = [
                { end: 11, replacement: "9", start: 10 },
                { end: 24, replacement: "8", start: 23 },
            ];
            expect(applyEdits(fileName, edits)).toBe(2);
            expect(readFileSync(fileName, "utf8")).toBe("const a = 9; const b = 8;");
        });
    });

    it("keeps only the first of two overlapping edits, so a rewrite never half-applies", () => {
        withFile(SOURCE, (fileName) => {
            const edits: Edit[] = [
                { end: 11, replacement: "b = 2", start: 6 },
                { end: 11, replacement: "3", start: 10 },
            ];
            expect(applyEdits(fileName, edits)).toBe(1);
        });
    });

    it("refuses to write a rewrite that introduces a syntax error, leaving the file untouched", () => {
        withFile(SOURCE, (fileName) => {
            const edits: Edit[] = [{ end: 12, replacement: "const = ;", start: 0 }];
            expect(() => applyEdits(fileName, edits)).toThrow("refused to write");
            expect(readFileSync(fileName, "utf8")).toBe(SOURCE);
        });
    });
});

describe("applyEdits on JSON", () => {
    it("writes a rewrite that still parses", () => {
        withFile(
            '{"a": "x"}',
            (fileName) => {
                expect(applyEdits(fileName, [{ end: 8, replacement: "y", start: 7 }])).toBe(1);
                expect(readFileSync(fileName, "utf8")).toBe('{"a": "y"}');
            },
            "probe.json",
        );
    });

    it("refuses a rewrite that no longer parses, leaving the file untouched", () => {
        withFile(
            '{"a": 1}',
            (fileName) => {
                expect(() => applyEdits(fileName, [{ end: 7, replacement: "1,", start: 6 }])).toThrow(
                    "refused to write",
                );
                expect(readFileSync(fileName, "utf8")).toBe('{"a": 1}');
            },
            "probe.json",
        );
    });
});

describe("parsesAsJson", () => {
    it("answers whether the text parses as JSON", () => {
        expect(parsesAsJson('{"a": [1, 2]}')).toBe(true);
        expect(parsesAsJson('{"a": 1,}')).toBe(false);
    });
});

describe("disjoint", () => {
    it("keeps each edit that overlaps none kept before it, in the given order", () => {
        const first: Edit = { end: 8, replacement: "x", start: 4 };
        const overlapping: Edit = { end: 6, replacement: "y", start: 2 };
        const apart: Edit = { end: 2, replacement: "z", start: 0 };
        expect(disjoint([first, overlapping, apart])).toStrictEqual([first, apart]);
    });
});

describe("splice", () => {
    it("applies edits ordered from the end of the text back to the start", () => {
        const edits: Edit[] = [
            { end: 24, replacement: "8", start: 23 },
            { end: 11, replacement: "9", start: 10 },
        ];
        expect(splice("const a = 1; const b = 2;", edits)).toBe("const a = 9; const b = 8;");
    });
});

describe("applyByFile", () => {
    it("totals the edits applied across every file", () => {
        withFile(SOURCE, (fileName) => {
            const byFile = new Map<string, Edit[]>([[fileName, [{ end: 11, replacement: "4", start: 10 }]]]);
            expect(applyByFile(byFile)).toBe(1);
            expect(readFileSync(fileName, "utf8")).toBe("const a = 4;");
        });
    });

    it("reports zero for an empty plan", () => {
        expect(applyByFile(new Map<string, Edit[]>())).toBe(0);
    });
});
