import { afterAll, describe, expect, it } from "vitest";
import { collectFiles, commentGrammars, langOf, preload } from "@govlab/quality/core/loaders/comment.loader.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const dir = mkdtempSync(join(tmpdir(), "comment-loader-"));
mkdirSync(join(dir, "nested"));
mkdirSync(join(dir, "skipped"));
writeVerbatim(join(dir, "a.ts"), "export const a = 1;\n");
writeVerbatim(join(dir, "nested", "b.py"), "b = 1\n");
writeVerbatim(join(dir, "notes.unknownext"), "text\n");
writeVerbatim(join(dir, "skipped", "c.ts"), "export const c = 1;\n");

const isSkipped = function isSkipped(full: string): boolean {
    return full.endsWith("skipped");
};

afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
});

describe("commentGrammars", () => {
    it("keys the policy table by tree-sitter grammar name (tsx, python), never a display name", () => {
        const grammars = commentGrammars();
        for (const lang of ["go", "typescript", "tsx", "python", "ruby"]) {
            expect(grammars.has(lang)).toBe(true);
        }
    });

    it("holds no row for a language whose comments are all stripped", () => {
        expect(commentGrammars().has("c_sharp")).toBe(false);
    });
});

describe("langOf and collectFiles", () => {
    it("names the grammar of a file by its extension and answers null for an unknown one", () => {
        expect(langOf(join(dir, "a.ts"))).toBe("typescript");
        expect(langOf(join(dir, "notes.unknownext"))).toBeNull();
    });

    it("collects every parsable file below the root, skipping excluded paths and unknown extensions", () => {
        expect(collectFiles(dir, isSkipped).toSorted()).toStrictEqual(
            [join(dir, "a.ts"), join(dir, "nested", "b.py")].toSorted(),
        );
    });

    it("preloads the grammars of the collected files", async () => {
        await expect(preload([join(dir, "a.ts")])).resolves.toBeUndefined();
    });
});
