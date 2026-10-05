import {
    chartsStale,
    checkSummary,
    conceptFinding,
    declaredDocFinding,
    docsFieldFinding,
    docsIncomplete,
    duplicatePrinciple,
    entryUndeclared,
    entryUnresolved,
    generateSummary,
    healedCount,
    inventoryRow,
    manifestMissing,
    mermaidFence,
    noDocsBlock,
    noManifest,
    principleFinding,
    writtenLabel,
} from "@govlab/docs/configuration/strings/package.strings.ts";
import { describe, expect, it } from "vitest";
import { unmatched } from "./strings.fixture.ts";

describe("the package strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [
                    principleFinding("m", "unresolved-principle", "d"),
                    "[governance.principles] unresolved-principle — d",
                ],
                [conceptFinding("m", "unresolved-concept", "d"), "[governedBy] unresolved-concept — d"],
                [declaredDocFinding("m", "x", "Rules", "magic-number", "d"), "[documents.x.Rules] magic-number d"],
                [docsFieldFinding("m", "overview", "history-smell", "d"), "[docs.overview] history-smell d"],
                [docsIncomplete("m"), "m [docs-incomplete]"],
                [entryUnresolved("m", "src/*.ts"), '"src/*.ts"'],
                [entryUndeclared("m", "d"), "[entry-undeclared] d"],
                [chartsStale("m/charts.md"), "m/charts.md [charts-stale]"],
                [manifestMissing("apps/api"), "apps/api"],
                [duplicatePrinciple("dup"), "[duplicate-principle] dup"],
                [noManifest("m"), "m: no _manifest.json"],
                [noDocsBlock("m"), "m: manifest has no docs block"],
                [writtenLabel("m"), "✓ m"],
                [checkSummary(3, ", 1 healed"), "3 module-doc finding(s), 1 healed"],
                [healedCount(2), ", 2 healed"],
                [generateSummary(5), "5 module document(s)"],
                [inventoryRow("mod", "utils", "stable", 2), "| `mod` | utils | stable | 2 |"],
                [mermaidFence("flowchart TD"), "```mermaid\nflowchart TD\n```"],
            ]),
        ).toStrictEqual([]);
    });
});
