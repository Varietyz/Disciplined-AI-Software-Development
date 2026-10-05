import { describe, expect, it } from "vitest";
import { createGovlabContext } from "@govlab/context";
import { createResolver } from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";
import { grammarOf } from "@banes-lab/build-scripts/core/converters/grammar.converter.ts";

const context = createGovlabContext();
const grammar = grammarOf(context, createResolver(context));

describe("grammarOf", () => {
    it("groups every keyword once under its primary role's category, carrying each role with resolved grounds", () => {
        const total = grammar.categories.reduce((sum, category) => sum + category.keywords.length, 0);
        expect(total).toBe(context.pag.keywords().length);
        expect(new Set(grammar.categories.map((category) => category.category)).size).toBe(grammar.categories.length);
        const validation = grammar.categories.find((category) => category.category === "validation");
        const population = validation?.keywords.find((keyword) => keyword.name === "POPULATION");
        expect(population?.roles[0].grounds.map((ground) => ground.ref)).toContain("reasoning:node-ver-population");
        expect(population?.roles[0].meaning.length).toBeGreaterThan(0);
        const action = grammar.categories.find((category) => category.category === "action");
        const wait = action?.keywords.find((keyword) => keyword.name === "WAIT");
        expect(wait?.roles.map((role) => role.category)).toStrictEqual(["action", "coordination"]);
    });

    it("groups every production under its group once", () => {
        const total = grammar.groups.reduce((sum, group) => sum + group.productions.length, 0);
        expect(total).toBe(context.pag.productions().length);
        expect(new Set(grammar.groups.map((group) => group.group)).size).toBe(grammar.groups.length);
    });

    it("carries every document type and every template with its body and constraints", () => {
        expect(grammar.documentTypes.map((record) => record.type)).toStrictEqual(
            context.pag.documentTypes().map((record) => record.type),
        );
        expect(grammar.templates.map((template) => template.type)).toStrictEqual(
            context.pag.templates().map((template) => template.type),
        );
        expect(grammar.templates.every((template) => template.body.length > 0 && template.constraints.length > 0)).toBe(
            true,
        );
    });
});
