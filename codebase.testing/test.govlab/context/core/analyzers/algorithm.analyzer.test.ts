import {
    allForces,
    clustersOf,
    concernJoinOf,
    traverseComposes,
} from "@govlab/context/core/analyzers/algorithm.analyzer.ts";
import type { Contract } from "@govlab/context";
import assert from "node:assert/strict";
import { test } from "vitest";

const contract = (id: string, force: string[], composes: string[] = []): Contract => ({
    composes,
    domain: "g",
    flow: [],
    force,
    id,
    intent: "",
    invariant: "",
    productions: [],
    tier: "leaf",
    title: id,
});

const CONTRACTS = [
    contract("hub", ["speed"], ["spoke-a", "spoke-b"]),
    contract("spoke-a", ["speed"]),
    contract("spoke-b", ["speed", "care"]),
];

test("allForces lists each force once, sorted", () => {
    assert.deepEqual(allForces(CONTRACTS), ["care", "speed"]);
});

test("clustersOf splits each force's contracts into a composed core and the rest", () => {
    const speed = clustersOf(CONTRACTS).find((cluster) => cluster.force === "speed");
    assert.ok(speed);
    assert.deepEqual([...speed.core, ...speed.supporting].toSorted(), ["hub", "spoke-a", "spoke-b"]);
});

test("concernJoinOf joins each force to its contracts and to what the resolvers answer", () => {
    const rows = concernJoinOf(CONTRACTS, { principlesForForce: (force) => [`${force}-principle`] });
    assert.deepEqual(
        rows.find((row) => row.force === "care"),
        { concerns: [], contracts: ["spoke-b"], force: "care", principles: ["care-principle"] },
    );
});

test("traverseComposes walks breadth first from the seed and visits each contract once", () => {
    const byId = new Map(CONTRACTS.map((entry) => [entry.id, entry]));
    assert.deepEqual(traverseComposes(byId, ["hub", "hub"]), ["hub", "spoke-a", "spoke-b"]);
    assert.deepEqual(traverseComposes(byId, ["ghost"]), ["ghost"]);
});
