import { createReverseIndex, lookup } from "@banes-lab/build-scripts/core/converters/ontology.index.converter.ts";
import { describe, expect, it } from "vitest";
import { createGovlabContext } from "@govlab/context";
import { createResolver } from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";

const context = createGovlabContext();
const resolve = createResolver(context);
const index = createReverseIndex(context, resolve);

const refsOf = function refsOf(relation: string, face: string, id: string): readonly (string | null)[] {
    return lookup(index, relation, face, id).map((edge) => edge.ref);
};

describe("createReverseIndex and lookup", () => {
    it("inverts every composes edge so a composed contract knows its composers", () => {
        const composer = context.algo.all().find((contract) => contract.composes.length > 0);
        const target = composer?.composes[0];
        if (composer === undefined || target === undefined) {
            throw new Error("no composing contract");
        }
        expect(refsOf("composed-by", "algorithms", context.slugify(target))).toContain(`algorithms:${composer.id}`);
    });

    it("inverts a principle reference so a principle knows the contracts that answer to it", () => {
        const bound = context.algo.all().find((contract) => contract.principleRef !== undefined);
        if (bound?.principleRef === undefined) {
            throw new Error("no contract with a principle");
        }
        const principle = resolve.arch(bound.principleRef);
        expect(principle.ref).not.toBeNull();
        expect(refsOf("contracts", "architecture", principle.ref?.slice("architecture:".length) ?? "")).toContain(
            `algorithms:${bound.id}`,
        );
    });

    it("groups contracts by their stage, axis and math type and points every principle edge back at its source", () => {
        const staged = context.algo.all().find((contract) => contract.stage !== undefined);
        if (staged?.stage === undefined || staged.axis === undefined || staged.mathType === undefined) {
            throw new Error("no positioned contract");
        }
        expect(refsOf("contracts", "stage", staged.stage)).toContain(`algorithms:${staged.id}`);
        expect(refsOf("contracts", "reasoning", `axis-${staged.axis}`)).toContain(`algorithms:${staged.id}`);
        expect(refsOf("contracts", "reasoning", `math-type-${staged.mathType}`)).toContain(`algorithms:${staged.id}`);
        const source = context.arch.all().find((principle) => principle.requires.length > 0);
        const required = source?.requires[0];
        if (source === undefined || required === undefined) {
            throw new Error("no requiring principle");
        }
        const target = resolve.arch(required);
        const back = refsOf(
            "referenced-by",
            target.ref?.slice(0, target.ref.indexOf(":")) ?? "",
            target.ref?.slice(target.ref.indexOf(":") + 1) ?? "",
        );
        expect(back).toContain(`architecture:${source.id}`);
        expect(lookup(index, "referenced-by", "architecture", "no-such-principle")).toStrictEqual([]);
        expect(lookup(index, "no-such-relation", "architecture", source.id)).toStrictEqual([]);
    });

    it("records which lenses a contract detects for and what grounds itself in a record", () => {
        const lens = context.reason.lenses().find((candidate) => (candidate.detectedBy ?? []).length > 0);
        const detector = lens?.detectedBy?.[0];
        if (lens === undefined || detector === undefined) {
            throw new Error("no lens with detectors");
        }
        const target = resolve.target(detector);
        expect(target.ref).not.toBeNull();
        expect(refsOf("detects", "algorithms", target.ref?.slice("algorithms:".length) ?? "")).toContain(
            `reasoning:lens-${lens.id}`,
        );
        expect(index.get("grounded-by")?.size ?? 0).toBeGreaterThan(0);
    });

    it("derives the reasoning lists from the declared inverses, in record order", () => {
        const [dimension] = context.reason.dimensions();
        const [axis] = context.reason.axes();
        const [mode] = context.reason.modes();
        if (dimension === undefined || axis === undefined || mode === undefined) {
            throw new Error("no reasoning records");
        }
        const surfaces = context.reason
            .testSurfaces()
            .filter((surface) => surface.dimension === dimension.id)
            .map((surface) => `reasoning:test-surface-${surface.id}`);
        const nodes = context.reason.nodes(axis.id).map((node) => `reasoning:node-${node.id}`);
        const techniques = context.reason
            .techniques()
            .filter((technique) => technique.mode === mode.id)
            .map((technique) => `reasoning:technique-${technique.id}`);
        expect(refsOf("surfaces", "reasoning", `dimension-${dimension.id}`)).toStrictEqual(surfaces);
        expect(refsOf("nodes", "reasoning", `axis-${axis.id}`)).toStrictEqual(nodes);
        expect(refsOf("techniques", "reasoning", `mode-${mode.id}`)).toStrictEqual(techniques);
    });

    it("grounds an edge's target in the stage or node the edge leaves", () => {
        const edge = context.reason.edges().find((candidate) => candidate.to !== undefined);
        if (edge?.to === undefined) {
            throw new Error("no edge with a target");
        }
        const target = resolve.target(edge.to);
        const source = resolve.edgeSource(edge.from);
        if (target.ref === null) {
            throw new Error("an edge target that does not resolve");
        }
        const at = target.ref.indexOf(":");
        expect(refsOf("grounded-by", target.ref.slice(0, at), target.ref.slice(at + 1))).toContain(source.ref);
    });
});
