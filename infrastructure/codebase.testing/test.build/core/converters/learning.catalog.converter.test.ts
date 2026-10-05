import type { Identity, NumberRow } from "@banes-lab/build-scripts/types/catalog.types.ts";
import { describe, expect, it } from "vitest";
import {
    navigationOf,
    numberRows,
    numbersLeaves,
    routeLeaf,
    routeStops,
} from "@banes-lab/build-scripts/core/converters/learning.catalog.converter.ts";
import type { LearningBlock } from "@banes-lab/web/types/learning.types.js";
import { createLinker } from "@banes-lab/build-scripts/core/resolvers/link.resolver.ts";
import { graphNode } from "./graph.fixture.ts";

const SITE = "https://example.test";
const ONE = "chapter:/method#one";

const BLOCKS: readonly LearningBlock[] = [
    {
        code: "aa",
        label: "Start",
        owner: "method",
        stops: [
            { id: "aa1", label: "01 - One", path: "/method#one", requires: [] },
            { id: "aa2", label: "02 - Two", path: "/method#two", requires: ["aa1"] },
        ],
    },
    {
        code: "ab",
        label: "Next",
        owner: "method",
        stops: [{ id: "ab3", label: "03 - Three", path: "/method/next#three", requires: ["aa1", "aa2"] }],
    },
];

const identityOf = function identityOf(path: string, title: string): Identity {
    const [page = "", section = ""] = path.split("#");
    return {
        address: { json: `/json${page}/${section}`, markdown: `${page}/${section}.md` },
        href: path,
        kind: "section",
        ref: `chapter:${path}`,
        summary: null,
        title,
    };
};

const LINKER = createLinker(
    [identityOf("/method#one", "One"), identityOf("/method#two", "Two"), identityOf("/method/next#three", "Three")],
    SITE,
    (href) => href,
);

describe("routeStops", () => {
    it("numbers every stop across the blocks in teaching order", () => {
        expect(routeStops(BLOCKS).map((stop) => [stop.id, stop.position, stop.block])).toStrictEqual([
            ["aa1", 1, "Start"],
            ["aa2", 2, "Start"],
            ["ab3", 3, "Next"],
        ]);
    });
});

describe("navigationOf", () => {
    it("gives a section its place, its neighbors and the stops it builds on", () => {
        const navigate = navigationOf(routeStops(BLOCKS), LINKER);
        const middle = navigate("/method#two");
        expect(middle?.position).toBe(2);
        expect(middle?.total).toBe(3);
        expect(middle?.previous?.ref).toBe(ONE);
        expect(middle?.next?.ref).toBe("chapter:/method/next#three");
        expect(middle?.requires.map((link) => link.ref)).toStrictEqual([ONE]);
        expect(navigate("/method#one")?.previous).toBeNull();
        expect(navigate("/method/next#three")?.next).toBeNull();
        expect(navigate("/elsewhere#x")).toBeNull();
    });
});

const numberRow = function numberRow(index: number): NumberRow {
    return { kind: "section", link: LINKER.link("One", ONE), number: String(index), part: null };
};

describe("numberRows", () => {
    it("numbers each site section by the graph's number and each captioned part within its section", () => {
        const section = { ...graphNode(ONE, "/method#one"), kind: "section", number: "12" };
        const part = { ...graphNode("part:/method#one/1", null), kind: "part", number: "12.1" };
        const record = { ...graphNode("architecture:x", null), layer: "ontology" as const, number: "9" };
        const graph = {
            edges: [{ from: ONE, relation: "contains", to: "part:/method#one/1" }],
            nodes: [section, part, record],
        };
        const rows = numberRows(graph, [], LINKER);
        expect(rows.map((row) => [row.number, row.kind, row.part, row.link.ref])).toStrictEqual([
            ["12", "section", null, ONE],
            ["12.1", "part", 1, ONE],
        ]);
    });
});

describe("numbersLeaves", () => {
    it("publishes the numbers whole while they fit, and as parts under a head that names them when they do not", () => {
        const rows = Array.from({ length: 40 }, (_, index) => numberRow(index + 1));
        const [whole] = numbersLeaves(rows, SITE, "Numbers");
        expect(whole?.identity.address.json).toBe("/json/api/numbers");
        expect(Reflect.get(whole?.data ?? {}, "total")).toBe(40);
        const split = numbersLeaves(rows, SITE, "Numbers", 2000, 1000);
        const head = split.at(-1);
        const parts = split.slice(0, -1);
        expect(parts.length).toBeGreaterThan(1);
        expect(parts[0]?.identity.address.json).toBe("/json/api/numbers/_1");
        expect(parts.every((leaf) => leaf.identity.kind === "index-part")).toBe(true);
        expect(head?.identity.address.json).toBe("/json/api/numbers");
        const listed: unknown = Reflect.get(head?.data ?? {}, "parts");
        expect(Array.isArray(listed) ? listed.length : 0).toBe(parts.length);
        expect(head?.markdown).toContain("/api/numbers/_1.md");
    });
});

describe("routeLeaf", () => {
    it("publishes the route as data and as a numbered Markdown list", () => {
        const leaf = routeLeaf(routeStops(BLOCKS), LINKER, "Learning route");
        expect(leaf.identity.address.json).toBe("/json/api/route");
        expect(leaf.markdown).toContain(
            "3. [03 - Three](https://example.test/method/next/three.md) (Next, after stop 1, 2)",
        );
    });
});
