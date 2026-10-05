import {
    closureLeaves,
    recordIdentities,
    recordLeaves,
    relationNamesOf,
} from "@banes-lab/build-scripts/core/converters/record.converter.ts";
import { describe, expect, it } from "vitest";
import type { ReferenceFaces } from "@banes-lab/build-scripts/types/ontology.types.ts";
import { createGovlabContext } from "@govlab/context";
import { createLinker } from "@banes-lab/build-scripts/core/resolvers/link.resolver.ts";

const SITE = "https://example.test";
const CONTEXT = createGovlabContext();

const [PRINCIPLE] = CONTEXT.arch.all();
const [CONTRACT] = CONTEXT.algo.all();
const REQUIRED_BY = "required-by";
const ELSEWHERE = { label: "Elsewhere", ref: "architecture:elsewhere" };

const FACES: ReferenceFaces = new Map([
    [
        "architecture",
        {
            [`architecture:${PRINCIPLE?.id ?? ""}`]: {
                code: "X",
                kind: "principle",
                layer: null,
                name: PRINCIPLE?.name ?? "",
                relations: [
                    { edges: [ELSEWHERE], relation: "requires" },
                    { edges: [{ label: "Stored", ref: "architecture:stored" }], relation: "referenced-by" },
                ],
                summary: null,
            },
        },
    ],
]);

describe("recordIdentities and recordLeaves", () => {
    it("addresses every record by collection and id and publishes its relations with no separate repair block", () => {
        const identities = recordIdentities(FACES, (ref) => `/ontology#${ref.split(":").join("-")}`);
        expect(identities[0]?.address.json).toBe(`/json/records/architecture/${PRINCIPLE?.id ?? ""}`);
        expect(identities[0]?.title).toBe(`${PRINCIPLE?.name ?? ""} (X)`);
        const linker = createLinker(identities, SITE, (href) => href);
        const teaching = { href: null, json: null, label: "Teaching section", markdown: null, ref: "chapter:/p#s" };
        const [leaf] = recordLeaves(FACES, {
            context: CONTEXT,
            evidence: () => [],
            inbound: () => [
                { edges: [ELSEWHERE, { label: "Other", ref: "architecture:other" }], relation: REQUIRED_BY },
            ],
            linkedBy: () => [teaching],
            linker,
            placement: () => null,
        });
        expect(leaf?.data).toMatchObject({
            collection: "architecture",
            relations: [
                { links: [{ json: null, label: "Elsewhere" }], relation: "requires" },
                { links: [{ json: null, label: "Other" }], relation: REQUIRED_BY },
                { links: [teaching], relation: "linked-from" },
            ],
            siblings: null,
            up: null,
        });
        expect(leaf?.markdown).toContain("## Required by");
        expect(leaf?.markdown).toContain("Linked from");
        expect(leaf?.markdown).toContain("## Requires");
        expect(Reflect.has(leaf?.data ?? {}, "repair")).toBe(false);
        expect(Reflect.has(leaf?.data ?? {}, "linkedBy")).toBe(false);
        expect(Reflect.get(leaf?.data ?? {}, "formedBy")).toBe(PRINCIPLE?.formed_by ?? null);
    });
});

describe("recordLeaves with an inbound relation of a stored name", () => {
    it("merges the inbound edges into the stored relation once, without repeating a listed edge", () => {
        const identities = recordIdentities(FACES, () => null);
        const [leaf] = recordLeaves(FACES, {
            context: CONTEXT,
            evidence: () => [],
            inbound: () => [
                { edges: [ELSEWHERE, { label: "Graph", ref: "architecture:graph" }], relation: "requires" },
            ],
            linkedBy: () => [],
            linker: createLinker(identities, SITE, (href) => href),
            placement: () => null,
        });
        expect(leaf?.data).toMatchObject({
            relations: [{ links: [{ label: "Elsewhere" }, { label: "Graph" }], relation: "requires" }],
        });
        expect(Reflect.get(leaf?.data ?? {}, "relations")).toHaveLength(1);
    });
});

describe("relationNamesOf", () => {
    it("names every relation a record leaf carries, its stored ones and the inbound ones it adds", () => {
        const inbound = [{ edges: [{ label: "Other", ref: "architecture:other" }], relation: REQUIRED_BY }];
        expect(relationNamesOf(FACES, () => inbound)).toStrictEqual(["requires", REQUIRED_BY]);
    });

    it("leaves out the stored back-reference the graph replaces, and an inbound relation with no new edge", () => {
        const inbound = [{ edges: [ELSEWHERE], relation: REQUIRED_BY }];
        expect(relationNamesOf(FACES, () => inbound)).toStrictEqual(["requires"]);
    });
});

describe("closureLeaves", () => {
    it("writes each contract's composition closure in resolution order", () => {
        const linker = createLinker([], SITE, (href) => href);
        const leaves = closureLeaves(CONTEXT, linker);
        expect(leaves).toHaveLength(CONTEXT.algo.all().length);
        const own = leaves.find((leaf) => leaf.identity.ref === `algorithms:${CONTRACT?.id ?? ""}/closure`);
        const order: unknown = Reflect.get(own?.data ?? {}, "order");
        expect(Array.isArray(order) ? order.length : 0).toBe(
            CONTEXT.algo.resolveClosure([CONTRACT?.id ?? ""]).order.length,
        );
    });
});
