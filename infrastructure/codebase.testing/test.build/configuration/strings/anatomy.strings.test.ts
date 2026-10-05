import {
    anatomyLine,
    treeSummaryLine,
    treesLine,
    unlabeledTree,
    unlicensedTree,
    unpublishedFiles,
} from "@banes-lab/build-scripts/configuration/strings/anatomy.strings.ts";
import { describe, expect, it } from "vitest";
import { UNQUALIFIED } from "@banes-lab/build-scripts/configuration/constants/anatomy.constants.ts";
import { convert } from "../../core/converters/anatomy.fixture.ts";

describe("treeSummaryLine and anatomyLine", () => {
    it("summarize each derived tree and name the files the derivation wrote", () => {
        const summary = treeSummaryLine({ exportName: "ANATOMY", snapshot: convert(), tab: "tree" }, 2);
        expect(summary).toBe("ANATOMY: 2 folder(s), 1 file(s), 1 definition(s)");
        const line = anatomyLine([summary], { anatomy: "a.ts", sources: "sources", walks: "walks" });
        expect(line).toBe(`anatomy: derived ${summary} into a.ts, walks under walks, sources under sources\n`);
    });
});

describe("the tree lines", () => {
    it("count the declared trees, and name the tree or the files a refusal is about", () => {
        expect(treesLine(3, "trees.ts")).toBe("anatomy: declared 3 tree(s) from the workspace members into trees.ts\n");
        expect(unlicensedTree("docs", "member")).toContain("the docs tree publishes");
        expect(unlicensedTree("docs", "member")).toContain("member declares no license");
        expect(unlabeledTree("docs")).toBe("anatomy: docs: no declaration label");
        expect(unpublishedFiles("out", ["a.ts", "b.ts"])).toContain("out lacks 2 file(s) the site links to");
        expect(unpublishedFiles("out", ["a.ts", "b.ts"])).toContain("a.ts, b.ts");
    });
});

describe("UNQUALIFIED", () => {
    it("leaves every path as it is and resolves no reference, record or specifier", () => {
        expect(UNQUALIFIED.qualifyPath("tab", "a.ts")).toBe("a.ts");
        expect(UNQUALIFIED.refer).toBeNull();
        expect(UNQUALIFIED.record ?? UNQUALIFIED.specifiers).toBeNull();
    });
});
