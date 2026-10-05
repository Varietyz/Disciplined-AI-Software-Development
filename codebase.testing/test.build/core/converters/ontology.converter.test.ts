import { describe, expect, it } from "vitest";
import type { EdgeRef } from "@banes-lab/web/types/link.types.ts";
import { createGovlabContext } from "@govlab/context";
import { snapshotOf } from "@banes-lab/build-scripts/core/converters/ontology.converter.ts";
import { vocabularyAnchor } from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";

const context = createGovlabContext();
const snapshot = snapshotOf(context);

const FACE_SEPARATOR = ":";

const isEdgeRef = function isEdgeRef(value: unknown): value is EdgeRef {
    return typeof value === "object" && value !== null && "label" in value && "ref" in value;
};

const edgeRefsOf = function edgeRefsOf(value: unknown): EdgeRef[] {
    if (isEdgeRef(value)) {
        return [value];
    }
    if (Array.isArray(value)) {
        return value.flatMap(edgeRefsOf);
    }
    if (typeof value === "object" && value !== null) {
        return Object.values(value).flatMap(edgeRefsOf);
    }
    return [];
};

const anchorsOf = function anchorsOf(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.flatMap(anchorsOf);
    }
    if (typeof value !== "object" || value === null) {
        return [];
    }
    const own = "anchor" in value && typeof value.anchor === "string" ? [value.anchor] : [];
    return [...own, ...Object.values(value).flatMap(anchorsOf)];
};

const publishedIds = function publishedIds(): ReadonlySet<string> {
    const prefixed = function prefixed(face: string, ids: readonly string[]): string[] {
        return ids.map((id) => face + FACE_SEPARATOR + id);
    };
    return new Set([
        ...prefixed("architecture", context.arch.ids()),
        ...prefixed("lexicon", context.lex.ids()),
        ...prefixed("algorithms", context.algo.ids()),
        ...prefixed("reasoning", anchorsOf(snapshot.reason)),
        ...prefixed("pag", anchorsOf(snapshot.grammar)),
        ...prefixed(
            "stage",
            snapshot.reason.derivationLoop.stages.map((stage) => stage.id),
        ),
        ...prefixed(
            "tension",
            snapshot.layers.resolutions.map((tension) => tension.id),
        ),
        ...prefixed(
            "layer",
            snapshot.layers.nodes.map((layer) => layer.id),
        ),
        ...prefixed(
            "force",
            snapshot.forces.map((force) => force.id),
        ),
        ...prefixed(
            "kind",
            snapshot.kinds.map((kind) => kind.kind),
        ),
        ...prefixed(
            "relation",
            snapshot.ranges.map((range) => range.relation),
        ),
        ...prefixed(
            "architecture-category",
            snapshot.principles.map((group) => group.id),
        ),
        ...prefixed(
            "lexicon-category",
            snapshot.terms.map((group) => group.id),
        ),
        ...prefixed(
            "algorithms-domain",
            snapshot.contracts.map((group) => group.id),
        ),
        ...prefixed(
            "vocabulary",
            snapshot.vocabularies.flatMap((held) =>
                held.entries.map((entry) => vocabularyAnchor(held.id, entry.value)),
            ),
        ),
    ]);
};

describe("snapshotOf", () => {
    it("carries every principle, term and contract the collections hold, grouped by category and domain", () => {
        expect(snapshot.principles.reduce((total, group) => total + group.principles.length, 0)).toBe(
            context.arch.ids().length,
        );
        expect(snapshot.terms.reduce((total, group) => total + group.terms.length, 0)).toBe(context.lex.ids().length);
        expect(snapshot.contracts.reduce((total, group) => total + group.contracts.length, 0)).toBe(
            context.algo.ids().length,
        );
    });

    it("resolves every edge reference anywhere in the snapshot to a record that is published", () => {
        const known = publishedIds();
        const refs = edgeRefsOf(snapshot);
        expect(refs.length).toBeGreaterThan(10_000);
        const dangling = refs.filter((edge) => edge.ref !== null && !known.has(edge.ref));
        expect(dangling).toStrictEqual([]);
    });

    it("joins the collections both ways: a principle knows its contracts, term and tensions, a contract what composes it, a term who names it", () => {
        const principles = snapshot.principles.flatMap((group) => group.principles);
        expect(principles.some((principle) => principle.contracts.length > 0)).toBe(true);
        expect(principles.some((principle) => principle.tensions.length > 0)).toBe(true);
        expect(principles.some((principle) => principle.referencedBy.length > 0)).toBe(true);
        expect(principles.every((principle) => principle.kind.ref === `kind:${principle.kind.label}`)).toBe(true);
        const contracts = snapshot.contracts.flatMap((group) => group.contracts);
        expect(contracts.some((contract) => contract.composedBy.length > 0)).toBe(true);
        expect(contracts.some((contract) => contract.stage?.ref?.startsWith("stage:") === true)).toBe(true);
        expect(contracts.some((contract) => contract.layer !== null)).toBe(true);
        const terms = snapshot.terms.flatMap((group) => group.terms);
        expect(terms.some((term) => term.referencedBy.length > 0)).toBe(true);
        expect(terms.some((term) => term.contract !== null)).toBe(true);
    });

    it("carries the grammar constructs a principle names and the records a principle or term declares distinct", () => {
        const principles = snapshot.principles.flatMap((group) => group.principles);
        const stated = principles.find((principle) => principle.id === "stated-invariant");
        expect(stated?.expressedBy.length).toBeGreaterThan(0);
        expect(stated?.expressedBy.every((edge) => edge.ref?.startsWith("pag:") === true)).toBe(true);
        const distincts = [
            ...principles.flatMap((principle) => principle.distinctFrom),
            ...snapshot.terms.flatMap((group) => group.terms.flatMap((term) => term.distinctFrom)),
        ];
        expect(distincts.length).toBeGreaterThan(0);
        expect(distincts.every((entry) => entry.record.ref !== null && entry.reason.length > 0)).toBe(true);
    });

    it("normalizes a lexicon category slug to its principle category label where one matches, else to title case", () => {
        const labels = new Map(snapshot.terms.map((group) => [group.id, group.category]));
        expect(labels.get("core-vocabulary")).toBe("Core Vocabulary");
        expect(labels.get("scalability-performance-optimization")).toBe("Scalability / Performance / Optimization");
    });

    it("names every layer node as a contract, resolves every tension edge and links the reasoning spine", () => {
        for (const layer of snapshot.layers.nodes) {
            expect(context.algo.get(layer.id)).not.toBeNull();
            expect(layer.contract.ref).toBe(`algorithms:${layer.id}`);
        }
        expect(snapshot.layers.resolutions.length).toBeGreaterThan(0);
        expect(snapshot.reason.derivationLoop.stages.some((stage) => stage.contracts.length > 0)).toBe(true);
        expect(snapshot.reason.axes.every((axis) => axis.nodes.length > 0)).toBe(true);
        expect(snapshot.reason.modes.some((mode) => mode.techniques.length > 0)).toBe(true);
        expect(snapshot.kinds.map((kind) => kind.kind)).toContain("anti-pattern");
        expect(snapshot.forces.every((force) => force.contracts.length > 0 || force.principles.length > 0)).toBe(true);
    });
});
