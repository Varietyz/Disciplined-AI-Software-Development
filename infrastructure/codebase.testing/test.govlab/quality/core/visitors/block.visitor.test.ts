import { expect, test } from "vitest";
import { functionNamesIn, functionRangesIn } from "@govlab/quality/core/visitors/block.visitor.ts";
import { mkdtempSync, rmSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

test("the block visitor names each function and finds the line range of a named one", () => {
    const root = mkdtempSync(path.join(tmpdir(), "block-visitor-"));
    try {
        writeVerbatim(path.join(root, "a.ts"), "const x = 1;\nexport const kept = () => {\n    return x;\n};\n");
        expect(functionNamesIn(root, "a.ts")).toStrictEqual(new Set(["kept"]));
        expect(functionRangesIn(root, "a.ts", new Set(["kept"]))).toStrictEqual([{ end: 4, start: 2 }]);
        expect(functionNamesIn(root, "missing.ts")).toBeNull();
        expect(functionRangesIn(root, "missing.ts", new Set(["kept"]))).toStrictEqual([]);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
});
