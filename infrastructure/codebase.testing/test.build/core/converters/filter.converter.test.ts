import { describe, expect, it } from "vitest";
import { facetGroups, kindFacetGroups } from "@banes-lab/build-scripts/core/converters/filter.converter.ts";
import { FACET_FIELDS } from "@banes-lab/build-scripts/configuration/constants/filter.constants.ts";
import type { ReferenceFaces } from "@banes-lab/build-scripts/types/ontology.types.ts";
import type { ReferenceRecord } from "@banes-lab/web/types/reference.types.js";
import { createGovlabContext } from "@govlab/context";

const CONTEXT = createGovlabContext();

const record = function record(kind: string): ReferenceRecord {
    return { code: null, kind, layer: null, name: kind, relations: [], summary: null };
};

describe("kindFacetGroups", () => {
    it("adds a kind facet to a collection with no declared facet and more than one kind", () => {
        const collections: ReferenceFaces = new Map([
            [
                "reasoning",
                { "reasoning:a": record("node"), "reasoning:b": record("axis"), "reasoning:c": record("node") },
            ],
            ["stage", { "stage:x": record("stage") }],
            ["architecture", { "architecture:p": record("principle"), "architecture:q": record("pattern") }],
        ]);
        expect(kindFacetGroups(collections)).toStrictEqual([
            { collection: "reasoning", field: "kind", ids: ["b"], slug: "axis", value: "axis" },
            { collection: "reasoning", field: "kind", ids: ["a", "c"], slug: "node", value: "node" },
        ]);
    });
});

describe("facetGroups", () => {
    it("gives every declared field's values exactly the members the collection's own query returns", () => {
        const groups = facetGroups(CONTEXT);
        const declared = new Set(FACET_FIELDS.map((field) => `${field.collection}.${field.field}`));
        expect(groups.every((group) => declared.has(`${group.collection}.${group.field}`))).toBe(true);
        const severity = groups.filter((group) => group.collection === "architecture" && group.field === "severity");
        for (const group of severity) {
            expect(group.ids).toStrictEqual(
                CONTEXT.arch.query({ severity: group.value }).map((principle) => principle.id),
            );
        }
        expect(severity.reduce((total, group) => total + group.ids.length, 0)).toBe(CONTEXT.arch.all().length);
    });
});
