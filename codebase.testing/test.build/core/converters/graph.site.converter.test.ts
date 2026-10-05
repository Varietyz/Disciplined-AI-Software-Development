import { BUILD_TAB, PLANS, ROUTE, STOPS } from "./graph.fixture.ts";
import {
    captionsOf,
    partGraph,
    routeGraph,
    siteNodes,
} from "@banes-lab/build-scripts/core/converters/graph.site.converter.ts";
import { describe, expect, it } from "vitest";
import { sectionNumbers, siteCodes } from "@banes-lab/build-scripts/core/converters/graph.code.converter.ts";

const codes = siteCodes([ROUTE, BUILD_TAB], PLANS, STOPS);
const numbers = sectionNumbers(PLANS, STOPS);

describe("routeGraph", () => {
    it("emits a page node and a tab node, with the page containing the tab and the tab containing its sections", () => {
        const graph = routeGraph([ROUTE, BUILD_TAB], PLANS, codes, "contains");
        expect(graph.nodes.map((node) => `${node.kind} ${node.ref} ${String(node.number)}`)).toStrictEqual([
            "page route:/p a",
            "tab route:/p/build ab",
        ]);
        expect(graph.edges).toContainEqual({ from: "route:/p", relation: "contains", to: "route:/p/build" });
        expect(graph.edges).toContainEqual({ from: "route:/p", relation: "contains", to: "chapter:/p#taught" });
    });
});

describe("siteNodes", () => {
    it("gives each section node its number and its citation", () => {
        const nodes = siteNodes(PLANS, numbers, codes);
        expect(nodes.map((node) => [node.ref, node.number, node.citation])).toStrictEqual([
            ["chapter:/p#narrative", "2", "aa2"],
            ["chapter:/p#taught", "1", "aa1"],
        ]);
    });
});

describe("captionsOf and partGraph", () => {
    it("reads captions and code titles in page order and numbers each part within its section", () => {
        expect(captionsOf(PLANS[1]?.section)).toStrictEqual(["the model", "a sample"]);
        const parts = partGraph(PLANS, numbers, codes, "contains");
        expect(
            parts.nodes.map((node) => `${String(node.number)} ${String(node.citation)} ${node.title}`),
        ).toStrictEqual(["1.1 aa1.1 the model", "1.2 aa1.2 a sample"]);
        expect(parts.edges).toContainEqual({ from: "chapter:/p#taught", relation: "contains", to: "part:/p#taught/1" });
    });
});
