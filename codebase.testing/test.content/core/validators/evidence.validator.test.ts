import type { ContentGraph, DeclaredAbsence, Evidence } from "@banes-lab/content/types/coverage.types.ts";
import { citeFindings, groundingOf } from "@banes-lab/content/core/validators/evidence.validator.ts";
import { describe, expect, it } from "vitest";
import { EVIDENCE } from "@banes-lab/web/configuration/constants/evidence.source.constants.ts";
import { EVIDENCE_ABSENT } from "@banes-lab/content/configuration/constants/evidence.constants.ts";
import { citeUnresolved } from "@banes-lab/content/configuration/strings/coverage.strings.ts";
import { treeLabelOf } from "@banes-lab/web/domain/converters/source.converter.ts";

const GRAPHS: readonly ContentGraph[] = [
    {
        page: "page",
        sections: {
            grounded: { requires: [], teaches: ["a"], traces: [] },
            open: { requires: [], teaches: ["b"], traces: [] },
            practice: { requires: [], teaches: ["c"], traces: [] },
            story: { narrative: true, requires: [], teaches: [], traces: [] },
        },
    },
];

const chapter = function chapter(section: string): Evidence["subject"] & { readonly kind: "chapter" } {
    return { kind: "chapter", page: "page", section, tab: "tab" };
};

const keyOf = function keyOf(node: Evidence["nodes"][number]): string | null {
    if (node.kind === "folder") {
        return null;
    }
    return node.kind === "definition" ? (node.file ?? node.name) : node.name;
};

const EVIDENCE_FIXTURE: readonly Evidence[] = [{ nodes: [], subject: chapter("grounded") }];
const ABSENCE_FIXTURE: readonly DeclaredAbsence[] = [
    { reason: "a-practice-not-a-construct", subject: chapter("practice") },
];
const EVERY_OTHER_ABSENT: readonly DeclaredAbsence[] = [
    ...ABSENCE_FIXTURE,
    { reason: "named-not-built", subject: chapter("open") },
];

describe("groundingOf", () => {
    it("sorts every teaching section into grounded, declared absent or not yet assessed, and skips narrative", () => {
        const report = groundingOf(GRAPHS, EVIDENCE_FIXTURE, ABSENCE_FIXTURE);
        expect(report.grounded).toStrictEqual(["page#grounded"]);
        expect(report.absent).toStrictEqual(["page#practice"]);
        expect(report.unassessed).toStrictEqual(["page#open"]);
    });

    it("fails a teaching section that is neither grounded nor declared absent", () => {
        const report = groundingOf(GRAPHS, EVIDENCE_FIXTURE, ABSENCE_FIXTURE);
        expect(report.findings.map((held) => held.section)).toStrictEqual(["open"]);
    });

    it("fails a section that is both grounded and declared absent", () => {
        const absences: readonly DeclaredAbsence[] = [
            ...EVERY_OTHER_ABSENT,
            { reason: "outside-the-web-member", subject: chapter("grounded") },
        ];
        const report = groundingOf(GRAPHS, EVIDENCE_FIXTURE, absences);
        expect(report.findings.map((held) => held.section)).toStrictEqual(["grounded"]);
    });

    it("fails a declaration that names a section no graph declares", () => {
        const evidence = [...EVIDENCE_FIXTURE, { nodes: [], subject: chapter("ghost") }];
        const report = groundingOf(GRAPHS, evidence, EVERY_OTHER_ABSENT);
        expect(report.findings.map((held) => held.section)).toStrictEqual(["ghost"]);
    });

    it("holds the site's own registry free of contradictions between grounding and absence", () => {
        const grounded = new Set(
            EVIDENCE.flatMap((entry) => (entry.subject.kind === "chapter" ? [entry.subject.section] : [])),
        );
        expect(
            EVIDENCE_ABSENT.filter((entry) => entry.subject.kind === "chapter" && grounded.has(entry.subject.section)),
        ).toStrictEqual([]);
    });
});

describe("citeFindings", () => {
    const located: Readonly<Record<string, string>> = {
        "coordination~tools/a.ts": "coordination~tools/a.ts",
        "site.ts": "core/site.ts",
        "stray.ts": "content~core/stray.ts",
    };
    const locate = (node: Evidence["nodes"][number]): string | null => {
        const key = keyOf(node);
        return key === null ? null : (located[key] ?? null);
    };

    it("accepts a node in the Site tree and a qualified node in another tree", () => {
        const entry: Evidence = {
            nodes: [
                { kind: "file", name: "site.ts" },
                { kind: "file", name: "coordination~tools/a.ts" },
                { file: "coordination~tools/a.ts", kind: "definition", name: "run" },
            ],
            subject: chapter("grounded"),
        };
        expect(citeFindings([entry], locate)).toStrictEqual([]);
    });

    it("reports a node that resolves nowhere and one that leaves the Site tree unqualified", () => {
        const entry: Evidence = {
            nodes: [
                { kind: "file", name: "gone.ts" },
                { kind: "file", name: "stray.ts" },
            ],
            subject: { kind: "record", ref: "arch:x" },
        };
        const messages = citeFindings([entry], locate).map((held) => `${held.page} ${held.message}`);
        expect(messages).toHaveLength(2);
        expect(messages[0]).toContain("arch:x The EVIDENCE entry names gone.ts, and no file");
        expect(messages[1]).toContain(`which exists only in the ${treeLabelOf("content")} tree.`);
        expect(messages[1]).toContain("write the entry as content~core/stray.ts.");
    });
});

describe("citeUnresolved", () => {
    it("names every tree it is given, the last one after or", () => {
        expect(citeUnresolved(["Site tree", "Build tree", "Governance tree"])).toContain(
            "in the Site tree, Build tree or Governance tree has that name",
        );
        expect(citeUnresolved(["Site tree"])).toContain("in the Site tree has that name");
    });
});
