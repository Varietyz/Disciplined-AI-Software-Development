import {
    collectVocabularyFindings,
    vocabularyFindingsIn,
} from "@ssot/govlab/codemods/analyzers/vocabulary.analyzer.ts";
import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathExclusion } from "@govlab/quality/config";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const renamed = function renamed(fileName: string, content: string, wholeIds = false): string[] {
    return vocabularyFindingsIn(fileName, content, wholeIds).map((finding) => `${finding.from}>${finding.to}`);
};

describe("vocabularyFindingsIn", () => {
    it("renames a retired id in a reference, an anchor, a catalog path and a collection name", () => {
        expect(renamed("probe.ts", 'const a = "arch:x"; const b = "#lex-y"; const c = "/records/algo/z.md";')).toEqual([
            "arch>architecture",
            "lex>lexicon",
            "algo>algorithms",
        ]);
        expect(renamed("probe.ts", 'const d = "The reason collection holds the loop.";')).toEqual(["reason>reasoning"]);
    });

    it("renames a renamed word in prose and keeps its case, only where the literal is prose", () => {
        expect(renamed("probe.ts", 'const a = "Each face has a Markdown twin."; const b = "face";')).toEqual([
            "face>collection",
            "twin>alternate",
        ]);
    });

    it("renames a literal that is exactly an id only where whole ids are declared, and never a field name", () => {
        const code = 'const a = { face: "arch" }; const b = x["arch"]; const c = "arch" in y;';
        expect(renamed("probe.ts", code)).toEqual([]);
        expect(renamed("probe.ts", code, true)).toEqual(["arch>architecture"]);
    });

    it("leaves module specifiers, JSON keys and the words of a hyphenated identifier as written", () => {
        expect(renamed("probe.ts", 'import x from "./arch:y";')).toEqual([]);
        expect(renamed("probe.json", '{ "arch:x": "lex:y" }')).toEqual(["lex>lexicon"]);
        expect(renamed("probe.ts", 'const a = "the font-face rule and a face_value";')).toEqual([]);
    });

    it("reads shapes everywhere in Markdown and words only outside code", () => {
        const content = "the `face` field and `arch:x`\n```\nface\n```\na face";
        expect(renamed("probe.md", content)).toEqual(["arch>architecture", "face>collection"]);
    });
});

describe("collectVocabularyFindings", () => {
    it("walks the roots, skips excluded folders, skipped paths and generated files, and marks whole-id roots", () => {
        const root = mkdtempSync(join(tmpdir(), "vocabulary-"));
        mkdirSync(join(root, "excluded"));
        mkdirSync(join(root, "ids"));
        writeVerbatim(join(root, "a.ts"), 'const a = "arch";\n');
        writeVerbatim(join(root, "ids", "b.ts"), 'const b = "arch";\n');
        writeVerbatim(join(root, "c.generated.ts"), 'const c = "arch:x";\n');
        writeVerbatim(join(root, "excluded", "d.ts"), 'const d = "arch:x";\n');
        writeVerbatim(join(root, "e.ts"), 'const e = "arch:x";\n');
        const found = collectVocabularyFindings({
            extensions: [".ts"],
            roots: [root],
            skipped: pathExclusion(root, ["excluded", "*.generated.*"]),
            skippedPaths: [join(root, "e.ts")],
            wholeIdRoots: [join(root, "ids")],
        }).map((finding) => finding.file.slice(finding.file.lastIndexOf("/") + 1));
        rmSync(root, { force: true, recursive: true });
        expect(found).toEqual(["b.ts"]);
    });
});
