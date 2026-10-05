import { describe, expect, it } from "vitest";
import { REFERENCED_BY_RELATION } from "@govlab/constants";
import { createGovlabContext } from "@govlab/context";
import { referencesOf } from "@banes-lab/build-scripts/core/converters/reference.converter.ts";
import { snapshotOf } from "@banes-lab/build-scripts/core/converters/ontology.converter.ts";

const context = createGovlabContext();
const snapshot = snapshotOf(context);
const faces = referencesOf(snapshot);

describe("referencesOf", () => {
    it("indexes one record per principle, term, contract, layer and tension under its collection", () => {
        expect(Object.keys(faces.get("architecture") ?? {})).toHaveLength(context.arch.ids().length);
        expect(Object.keys(faces.get("lexicon") ?? {})).toHaveLength(context.lex.ids().length);
        expect(Object.keys(faces.get("algorithms") ?? {})).toHaveLength(context.algo.ids().length);
        expect(Object.keys(faces.get("layer") ?? {})).toHaveLength(snapshot.layers.nodes.length);
        expect(Object.keys(faces.get("tension") ?? {})).toHaveLength(snapshot.layers.resolutions.length);
    });

    it("carries a principle's short code, layer, relations and the alternate term's definition as its summary", () => {
        const srp = faces.get("architecture")?.["architecture:single-responsibility"];
        expect(srp?.code).toBe("SRP");
        expect(srp?.name).toBe("Single Responsibility Principle");
        expect(srp?.layer?.ref).toBe("layer:structural-core");
        expect(
            srp?.relations.some(
                (relation) => relation.relation === REFERENCED_BY_RELATION && relation.edges.length > 0,
            ),
        ).toBe(true);
        expect(srp?.relations.every((relation) => relation.edges.length > 0)).toBe(true);
        expect(srp?.summary?.length ?? 0).toBeGreaterThan(0);
        expect(
            Object.values(faces.get("architecture") ?? {}).every((principle) => (principle.summary?.length ?? 0) > 0),
        ).toBe(true);
    });

    it("types every contract as an algorithm and names its domain by title", () => {
        const contracts = Object.values(faces.get("algorithms") ?? {});
        expect(contracts.every((contract) => contract.kind === "algorithm")).toBe(true);
        const domains = contracts.map(
            (contract) => contract.relations.find((relation) => relation.relation === "domain")?.edges[0],
        );
        expect(domains.every((domain) => domain?.ref?.startsWith("algorithms-domain:") === true)).toBe(true);
        expect(domains.some((domain) => domain?.label === "CSS cascade")).toBe(true);
    });

    it("labels a principle's tension by its pair", () => {
        const tensions = Object.values(faces.get("architecture") ?? {}).flatMap(
            (principle) => principle.relations.find((relation) => relation.relation === "tensions")?.edges ?? [],
        );
        expect(tensions.length).toBeGreaterThan(0);
        expect(tensions.every((edge) => edge.label.includes(" / "))).toBe(true);
    });

    it("indexes every reasoning record, every loop stage, every category, domain, force, kind and relation range", () => {
        const reasonIndex = faces.get("reasoning") ?? {};
        expect(Object.keys(reasonIndex).length).toBeGreaterThan(
            snapshot.reason.nodes.length + snapshot.reason.axes.length,
        );
        const [firstNode] = snapshot.reason.nodes;
        const node = reasonIndex[`reasoning:${firstNode?.anchor ?? ""}`];
        expect(node?.kind).toBe("node");
        expect(node?.relations.some((relation) => relation.relation === "axis")).toBe(true);
        expect(Object.keys(faces.get("stage") ?? {})).toHaveLength(snapshot.reason.derivationLoop.stages.length);
        expect(faces.get("stage")?.["stage:orient"]?.relations.some((relation) => relation.relation === "axis")).toBe(
            true,
        );
        expect(Object.keys(faces.get("architecture-category") ?? {})).toHaveLength(snapshot.principles.length);
        expect(Object.keys(faces.get("lexicon-category") ?? {})).toHaveLength(snapshot.terms.length);
        expect(Object.keys(faces.get("algorithms-domain") ?? {})).toHaveLength(snapshot.contracts.length);
        expect(Object.keys(faces.get("force") ?? {})).toHaveLength(snapshot.forces.length);
        expect(Object.keys(faces.get("kind") ?? {})).toHaveLength(snapshot.kinds.length);
        expect(Object.keys(faces.get("relation") ?? {})).toHaveLength(snapshot.ranges.length);
    });

    it("carries a term's definition and a contract's intent as the summary", () => {
        const [term] = Object.values(faces.get("lexicon") ?? {});
        expect(term?.summary?.length ?? 0).toBeGreaterThan(0);
        const [contract] = Object.values(faces.get("algorithms") ?? {});
        expect(contract?.summary?.length ?? 0).toBeGreaterThan(0);
    });
});
