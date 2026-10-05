import { afterAll, describe, expect, it } from "vitest";
import { brokenPaths, frontmatterFileRefs } from "@govlab/docs/core/analyzers/reference.analyzer.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "doc-refs-"));
mkdirSync(join(root, "src"), { recursive: true });
mkdirSync(join(root, "docs"), { recursive: true });
writeVerbatim(join(root, "src", "real.ts"), "");
const DOC = join(root, "docs", "a.md");
const CONTEXT = {
    codeExtensions: new Set([".ts"]),
    fileIndex: new Map([["real.ts", ["src/real.ts"]]]),
    root,
    runtimeRoots: ["runtime/"],
    topLevel: new Set(["src", "docs"]),
};

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("brokenPaths", () => {
    it("reports a checkable path that exists nowhere and skips out-of-scope targets", () => {
        const source = "See `src/real.ts`, `src/gone.ts`, `runtime/x.ts`, `/abs/x.ts` and `real.ts`.";
        expect(brokenPaths(CONTEXT, DOC, source).map((ref) => ref.path)).toStrictEqual(["src/gone.ts"]);
    });
});

describe("frontmatterFileRefs", () => {
    it("reports a file token in a frontmatter field and ignores prose fields and globs", () => {
        const source = "---\nsummary: covers gone.ts\ngoverns: [src/real.ts, src/gone.ts, src/*.ts]\n---\n# A\n";
        expect(frontmatterFileRefs(CONTEXT, DOC, source)).toStrictEqual([{ col: 1, line: 3, path: "src/gone.ts" }]);
        expect(frontmatterFileRefs(CONTEXT, DOC, "# no frontmatter")).toStrictEqual([]);
        expect(frontmatterFileRefs(CONTEXT, DOC, "---\nunclosed")).toStrictEqual([]);
    });
});
