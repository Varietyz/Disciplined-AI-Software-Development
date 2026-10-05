import type { Evidence, EvidenceNode } from "@banes-lab/web/types/evidence.types.ts";
import { describe, expect, it } from "vitest";
import { evidenceEdges, linkEdges, routeEdges } from "@banes-lab/build-scripts/core/converters/graph.link.converter.ts";
import type { Discovery } from "@banes-lab/build-scripts/types/site.types.ts";
import type { ReferenceTarget } from "@banes-lab/web/types/reference.types.ts";
import { createLinker } from "@banes-lab/build-scripts/core/resolvers/link.resolver.ts";
import { sectionPlans } from "@banes-lab/build-scripts/core/converters/section.converter.ts";
import { unresolvedEvidence } from "@banes-lab/build-scripts/configuration/strings/graph.strings.ts";

const SITE = "https://example.test";
const LOOP = "chapter:/method#loop";
const GATE = "chapter:/method/build#gate";

const METHOD = {
    content: {
        kind: "tabbed",
        tabs: [
            { id: "start", label: "Start", sections: [{ id: "loop", title: "The loop" }] },
            {
                id: "build",
                label: "Build",
                sections: [{ id: "gate", intro: "See [the loop](/method#loop).", title: "The gate" }],
            },
        ],
    },
    description: "The method.",
    id: "method",
    label: "Method",
    markdown: "",
    page: "method",
    path: "/method",
    tab: null,
    title: "Method",
};

const DISCOVERY: Discovery = {
    author: "Ada",
    consent: "Yes.",
    name: "Site",
    pages: [METHOD],
    routes: [METHOD, { ...METHOD, label: "Build", path: "/method/build", tab: "build" }],
    site: SITE,
    summary: "A site.",
};

const plans = sectionPlans(DISCOVERY, () => null);
const linker = createLinker(
    plans.map((plan) => plan.identity),
    SITE,
    (href) => href,
);

describe("linkEdges", () => {
    it("draws a links-to edge from each section to every section its prose links", () => {
        const edges = linkEdges({ linker, plans });
        expect(edges.map((edge) => [edge.from, edge.to])).toStrictEqual([[GATE, LOOP]]);
    });
});

const TERM = "lexicon:term";
const FOUND: EvidenceNode = { kind: "file", name: "found.ts" };
const LOST: EvidenceNode = { kind: "file", name: "lost.ts" };

const webOf = function webOf(nodes: readonly EvidenceNode[]): Parameters<typeof evidenceEdges>[0] {
    const entry: Evidence = { nodes, subject: { kind: "record", ref: TERM } };
    return {
        evidence: { evidenceFor: (target: ReferenceTarget) => (target.ref === TERM ? [entry] : []) },
        evidenceConstants: { EVIDENCE: [entry] },
    };
};

const targetOf = function targetOf(node: EvidenceNode): string | null {
    return node === FOUND ? "anatomy:found" : null;
};

describe("evidenceEdges", () => {
    it("draws an evidence edge from each subject to every node the resolver finds", () => {
        const edges = evidenceEdges(webOf([FOUND]), targetOf, [TERM, "lexicon:other"]);
        expect(edges.map((edge) => [edge.from, edge.to])).toStrictEqual([[TERM, "anatomy:found"]]);
    });

    it("fails on a declared node the resolver no longer finds, so an evidence edge is never lost silently", () => {
        expect(() => evidenceEdges(webOf([FOUND, LOST]), targetOf, [TERM])).toThrow(unresolvedEvidence(TERM, LOST));
    });
});

describe("routeEdges", () => {
    it("draws a builds-on edge for each prerequisite a stop names and reports one that names no stop", () => {
        const stops = [
            { block: "b", code: "aa", id: "s1", label: "One", path: "/p#one", position: 1, requires: [] },
            { block: "b", code: "aa", id: "s2", label: "Two", path: "/p#two", position: 2, requires: ["s1", "gone"] },
        ];
        const { edges, unresolved } = routeEdges(stops);
        expect(edges.map((edge) => [edge.from, edge.to])).toStrictEqual([["chapter:/p#two", "chapter:/p#one"]]);
        expect(unresolved.map((entry) => entry.label)).toStrictEqual(["gone"]);
    });
});
