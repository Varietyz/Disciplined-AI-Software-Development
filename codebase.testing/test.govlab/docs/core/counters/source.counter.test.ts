import { afterAll, describe, expect, it } from "vitest";
import { collectSourceStats, countSourceFiles } from "@govlab/docs/core/counters/source.counter.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { relativePath } from "@ssot/paths";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "docs-count-"));
const tree = join(root, "tree");
const skipped = join(tree, relativePath("moduleInfo.root"));

mkdirSync(skipped, { recursive: true });
writeVerbatim(join(tree, "a.ts"), "export const a = 1;\n");
writeVerbatim(join(tree, "b.css"), "a{}\n");
writeVerbatim(join(tree, "notes.md"), "# notes\n");
writeVerbatim(join(tree, "c.generated.ts"), "export const c = 1;\n");
writeVerbatim(join(skipped, "d.ts"), "export const d = 1;\n");

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("countSourceFiles", () => {
    it("counts only the source suffixes it recognizes and skips generated files and excluded folders", () => {
        expect(countSourceFiles(tree)).toBe(2);
        expect(countSourceFiles(skipped)).toBe(1);
    });

    it("reports zero for a folder that is not there", () => {
        expect(countSourceFiles(join(root, "absent"))).toBe(0);
    });
});

describe("collectSourceStats", () => {
    it("counts script files and their non-blank, non-comment lines, skipping barrels and configs", () => {
        const pkg = join(root, "pkg");
        mkdirSync(pkg, { recursive: true });
        writeVerbatim(join(pkg, "a.ts"), "const a = 1;\n\n// note\nexport { a };\n");
        writeVerbatim(join(pkg, "index.ts"), "export * from './a.ts';\n");
        writeVerbatim(join(pkg, "tool.config.ts"), "export default {};\n");
        expect(collectSourceStats(pkg, () => false)).toStrictEqual({ fileCount: 1, loc: 2 });
    });
});
