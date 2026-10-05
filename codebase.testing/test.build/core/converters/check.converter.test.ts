import { describe, expect, it } from "vitest";
import { recordRefOf, resolutionOf } from "@banes-lab/build-scripts/core/converters/check.converter.ts";
import { createGovlabContext } from "@govlab/context";
import { createResolver } from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";

const context = createGovlabContext();

describe("recordRefOf", () => {
    it("anchors a tabled record by its kind and id, and keeps a plain record's id", () => {
        expect(recordRefOf("architecture", "modularity")).toBe("architecture:modularity");
        expect(recordRefOf("reasoning", "node:ver-population")).toBe("reasoning:node-ver-population");
    });
});

describe("resolutionOf", () => {
    it("gives every checked record an entry, shares identical answers, and carries evidence and authority", () => {
        const resolution = resolutionOf(context, createResolver(context));
        expect(resolution.records).toBe(context.checkedRecords().length);
        expect(Object.keys(resolution.byRecord)).toHaveLength(resolution.records);
        expect(resolution.answers.length).toBeLessThan(resolution.records);
        expect(resolution.answers.every((answers) => answers.evidence !== null && answers.authority !== null)).toBe(
            true,
        );
        const questions = resolution.coverage.flatMap((collection) =>
            collection.questions.map((entry) => entry.question),
        );
        expect(questions).toContain("evidence");
        expect(questions).toContain("authority");
    });
});
