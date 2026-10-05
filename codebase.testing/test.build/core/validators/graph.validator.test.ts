import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
    ambiguousRelation,
    duplicateNode,
    emptyPopulation,
    tooltipGap,
    unbalancedPopulation,
    uncoveredSection,
    undeclaredAbsence,
    unresolvedTarget,
} from "@banes-lab/build-scripts/configuration/strings/graph.strings.ts";
import { mkdtempSync, rmSync } from "node:fs";
import type { GraphNode } from "@banes-lab/web/types/graph.types.js";
import { graphFindings } from "@banes-lab/build-scripts/core/validators/graph.validator.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeCanonicalJson } from "@govlab/canonical-write";

const SECTION_REF = "chapter:/a#x";
let root = "";

beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "graph-"));
});

afterEach(() => {
    rmSync(root, { force: true, recursive: true });
});

const EMPTY_REPORT = {
    ambiguous: [],
    dangling: [],
    duplicates: [],
    graph: { edges: [], nodes: [] },
    populations: [],
    tooltipGaps: [],
    uncovered: [],
    undeclared: [],
    unresolved: [],
};

const report = async function report(value: Record<string, unknown>): Promise<string> {
    const file = join(root, "graph.generated.json");
    await writeCanonicalJson(file, value);
    return file;
};

const node = function node(ref: string, number: string | null): Record<string, unknown> {
    return { kind: "section", layer: "site", number, ref };
};

describe("graphFindings", () => {
    it("accepts a report whose every list is present and empty", async () => {
        expect(graphFindings(await report(EMPTY_REPORT))).toStrictEqual([]);
    });

    it("reports each undeclared relation by collection and each dangling edge by its source", async () => {
        const findings = graphFindings(
            await report({
                ...EMPTY_REPORT,
                dangling: [{ from: "architecture:a", relation: "requires", to: "architecture:gone" }],
                undeclared: [{ face: "reasoning", kind: "universal-axis", relation: "subsumes" }],
            }),
        );
        expect(findings.map((finding) => finding.file)).toStrictEqual(["reasoning", "architecture:a"]);
        expect(findings[0]?.message).toContain(
            '"subsumes", which neither RELATION_PAIRS nor GRAPH_FIELD_RULES declares',
        );
        expect(findings[1]?.message).toContain("from architecture:a to architecture:gone");
    });

    it("reports a number carried by two nodes, and accepts nodes with distinct or no numbers", async () => {
        const nodes = [
            node(SECTION_REF, "76"),
            node("chapter:/b#y", "76"),
            node("chapter:/c#z", "77"),
            node("architecture:p", null),
        ];
        const findings = graphFindings(await report({ ...EMPTY_REPORT, graph: { edges: [], nodes } }));
        expect(findings).toStrictEqual([
            { file: SECTION_REF, message: "The number 76 is carried by both chapter:/a#x and chapter:/b#y." },
        ]);
    });

    it("reports an empty population, parts that do not add up, and an undeclared absent part, and accepts a balanced one", async () => {
        const balanced = { name: "node links", parts: { "linked site section": 3 }, whole: 3 };
        expect(graphFindings(await report({ ...EMPTY_REPORT, populations: [balanced] }))).toStrictEqual([]);
        const file = await report({
            ...EMPTY_REPORT,
            populations: [
                { name: "records", parts: {}, whole: 0 },
                { name: "relation fields", parts: { read: 2 }, whole: 3 },
                { name: "node links", parts: { "absent site section": 2, "linked site section": 1 }, whole: 3 },
            ],
        });
        expect(graphFindings(file).map((finding) => finding.message)).toStrictEqual([
            emptyPopulation("records"),
            unbalancedPopulation("relation fields", 2, 3),
            undeclaredAbsence(2, "section", "site", "link"),
        ]);
    });

    it("reports each ambiguous relation, unresolved target, duplicate node, uncovered section and tooltip gap", async () => {
        const kept: GraphNode = {
            address: null,
            citation: null,
            fields: {},
            href: null,
            kind: "section",
            layer: "site",
            number: null,
            ref: SECTION_REF,
            title: "x",
        };
        const dropped: GraphNode = { ...kept, kind: "part" };
        const gap = { from: SECTION_REF, relation: "links-to", to: "architecture:p" };
        const findings = graphFindings(
            await report({
                ...EMPTY_REPORT,
                ambiguous: [{ face: "reasoning", kind: "lens", relation: "maps" }],
                duplicates: [{ dropped, kept }],
                tooltipGaps: [gap],
                uncovered: [SECTION_REF],
                unresolved: [{ from: "architecture:p", label: "gone", relation: "requires" }],
            }),
        );
        expect(findings.map((finding) => finding.message)).toStrictEqual([
            ambiguousRelation("reasoning", "maps"),
            unresolvedTarget("architecture:p", "gone", "requires"),
            duplicateNode(kept, dropped),
            uncoveredSection(SECTION_REF),
            tooltipGap(gap),
        ]);
    });

    it("reports a list the report lost and an entry whose shape the check cannot read", async () => {
        const { dangling, ...withoutDangling } = EMPTY_REPORT;
        const file = await report({ ...withoutDangling, undeclared: [...dangling, { face: "reasoning" }] });
        expect(graphFindings(file).map((finding) => finding.message)).toStrictEqual([
            "1 entry(s) in the undeclared list of the relation graph report do not have the shape the check reads, so they were not checked.",
            "The relation graph report holds no dangling list, so none of its entries were checked.",
        ]);
    });

    it("reports a build that wrote no graph report", () => {
        expect(graphFindings(join(root, "missing.json"))).toHaveLength(1);
    });
});
