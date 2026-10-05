import {
    ambiguousReasonRefsOf,
    ungroundedGatesOf,
    unresolvedGrammarGroundsOf,
} from "@govlab/context/core/validators/algorithm.reference.validator.ts";
import type { GrammarGroundingFaces } from "@govlab/context/types/reference.types.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

interface Contract {
    domain: string;
    grounds?: readonly string[];
    id: string;
}

const facesOf = (algo: Contract[], reasonIds: ReadonlySet<string> = new Set()): GrammarGroundingFaces => ({
    algo: { all: () => algo },
    reason: { kindMembers: () => new Map([["node", reasonIds]]), resolve: (id) => (reasonIds.has(id) ? { id } : null) },
});

test("ungroundedGatesOf reports a process gate with no grounds", () => {
    assert.deepEqual(ungroundedGatesOf(facesOf([{ domain: "verification", grounds: [], id: "foo-gate" }])), [
        "foo-gate",
    ]);
});

test("ungroundedGatesOf passes a grounded gate and excludes a domain concept gate", () => {
    const grounded = facesOf([{ domain: "verification", grounds: ["reasoning:ter-stop"], id: "foo-gate" }]);
    assert.deepEqual(ungroundedGatesOf(grounded), []);
    const concept = facesOf([{ domain: "arch-relationships", grounds: [], id: "enforcement-gate" }]);
    assert.deepEqual(ungroundedGatesOf(concept), []);
});

test("unresolvedGrammarGroundsOf reports a ground that resolves to no reason id, and passes one that does", () => {
    assert.deepEqual(unresolvedGrammarGroundsOf(facesOf([{ domain: "x", grounds: ["reasoning:nope"], id: "c1" }])), [
        { from: "c1", target: "reasoning:nope" },
    ]);
    const clean = facesOf([{ domain: "x", grounds: ["reasoning:ter-stop"], id: "c1" }], new Set(["ter-stop"]));
    assert.deepEqual(unresolvedGrammarGroundsOf(clean), []);
});

test("unresolvedGrammarGroundsOf resolves a kind-qualified ground only under its kind", () => {
    const faces = facesOf(
        [{ domain: "x", grounds: ["reasoning:node:ter-stop", "reasoning:lens:ter-stop"], id: "c1" }],
        new Set(["ter-stop"]),
    );
    assert.deepEqual(unresolvedGrammarGroundsOf(faces), [{ from: "c1", target: "reasoning:lens:ter-stop" }]);
});

test("ambiguousReasonRefsOf reports a bare ground that two kinds hold, and passes a qualified one", () => {
    const faces: GrammarGroundingFaces = {
        algo: { all: () => [{ domain: "x", grounds: ["reasoning:invariant", "reasoning:lens:invariant"], id: "c1" }] },
        reason: {
            kindMembers: () =>
                new Map([
                    ["lens", new Set(["invariant"])],
                    ["substrate-node", new Set(["invariant"])],
                ]),
            resolve: () => null,
        },
    };
    assert.deepEqual(ambiguousReasonRefsOf(faces), [
        { from: "c1", kinds: ["lens", "substrate-node"], target: "reasoning:invariant" },
    ]);
});
