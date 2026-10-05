import {
    collectSpellingFindings,
    filesUnder,
    spellingFindingsIn,
} from "@ssot/govlab/codemods/analyzers/word.analyzer.ts";
import { describe, expect, it } from "vitest";
import { join, relative } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { pathExclusion } from "@govlab/quality/config";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const replaced = function replaced(fileName: string, content: string): string[] {
    return spellingFindingsIn(fileName, content).map((finding) => `${finding.from}>${finding.to}`);
};

describe("spellingFindingsIn", () => {
    it("replaces whole British words and keeps each word's case", () => {
        expect(replaced("probe.md", "Behaviour and BEHAVIOUR and behaviour.")).toEqual([
            "Behaviour>Behavior",
            "BEHAVIOUR>BEHAVIOR",
            "behaviour>behavior",
        ]);
    });

    it("rewrites the -ise family through its stems and leaves unrelated words alone", () => {
        expect(
            replaced("probe.md", "normalised, organisation, prioritising, externalisation; the emphasis and the rise"),
        ).toEqual([
            "normalised>normalized",
            "organisation>organization",
            "prioritising>prioritizing",
            "externalisation>externalization",
        ]);
    });

    it("never reads an inherited object property as a spelling", () => {
        expect(replaced("probe.md", "a constructor and a toString")).toEqual([]);
    });

    it("leaves a word spelled the same in both as written", () => {
        expect(replaced("probe.md", "two analyses")).toEqual([]);
    });

    it("reads every word of a kebab, snake or camelCase name and keeps the case of that part", () => {
        expect(
            replaced(
                "probe.md",
                "behaviour_tree and rule-behaviour and BEHAVIOUR_DOCUMENT and parseBehaviour and HTMLColour2",
            ),
        ).toEqual([
            "behaviour>behavior",
            "behaviour>behavior",
            "BEHAVIOUR>BEHAVIOR",
            "Behaviour>Behavior",
            "Colour>Color",
        ]);
        expect(replaced("probe.md", "toString and XMLHttpRequest and kebab-case-name")).toEqual([]);
    });

    it("skips Markdown code spans and fenced blocks", () => {
        const content = "a `behaviour` span\n```\nbehaviour\n```\nplain behaviour";
        const findings = spellingFindingsIn("probe.md", content);
        expect(findings.map((finding) => finding.line)).toEqual([5]);
    });

    it("reads code spans as prose outside Markdown", () => {
        expect(replaced("probe.ts", 'const note = "the `licence` field";')).toEqual(["licence>license"]);
    });
});

describe("collectSpellingFindings", () => {
    it("walks a root for the declared extensions and skips the excluded folders and generated files", () => {
        const root = mkdtempSync(join(tmpdir(), "word-"));
        mkdirSync(join(root, "excluded"));
        writeVerbatim(join(root, "a.md"), "a colour\n");
        writeVerbatim(join(root, "b.ts"), "a colour\n");
        writeVerbatim(join(root, "c.generated.md"), "a colour\n");
        writeVerbatim(join(root, "excluded", "d.md"), "a colour\n");
        const skipped = pathExclusion(root, ["excluded", "*.generated.*"]);
        const found = collectSpellingFindings({ extensions: [".md"], roots: [root], skipped }).map(
            (finding) => finding.to,
        );
        const listed = filesUnder(root, skipped).map((file) => relative(root, file));
        rmSync(root, { force: true, recursive: true });
        expect(found).toEqual(["color"]);
        expect(listed.toSorted((a, b) => a.localeCompare(b))).toEqual(["a.md", "b.ts"]);
    });
});
