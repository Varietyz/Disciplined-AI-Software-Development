import { type Contract, buildSymbolIndex } from "@govlab/context";
import type { DomainTier, SymbolEntry } from "@govlab/context/types/algorithm.types.ts";
import assert from "node:assert/strict";
import { integrityIssuesOf } from "@govlab/context/core/validators/algorithm.validator.ts";
import { test } from "vitest";

const FIXTURE_TIERS: Readonly<Record<string, DomainTier>> = {
    "arch-relationships": "leaf",
    architecture: "leaf",
    automation: "process",
    "living-profile": "process",
    pag: "process",
};

const makeContract = (over: Partial<Contract>): Contract => ({
    composes: [],
    domain: "",
    flow: [],
    force: [],
    id: "",
    intent: "",
    invariant: "",
    productions: [],
    tier: FIXTURE_TIERS[over.domain ?? ""] ?? "exempt",
    title: "",
    ...over,
});

const facesOf = (
    contracts: readonly Contract[],
    symbols: readonly SymbolEntry[],
): Parameters<typeof integrityIssuesOf>[0] => ({ algo: { all: () => contracts, symbols: () => symbols } });

const inSyncFaces = (contracts: Partial<Contract>[]): Parameters<typeof integrityIssuesOf>[0] => {
    const built = contracts.map(makeContract);
    return facesOf(built, buildSymbolIndex(built));
};

test("integrityIssuesOf reports a symbol with two right-hand sides in one grammar", () => {
    const issues = integrityIssuesOf(
        inSyncFaces([
            { domain: "living-profile", id: "r1", productions: [{ lhs: "Delta", rhs: "<a>" }], title: "one" },
            { domain: "living-profile", id: "r2", productions: [{ lhs: "Delta", rhs: "<b>" }], title: "two" },
        ]),
    );
    assert.deepEqual(issues.intraGrammarDivergentSymbols, [
        { definedIn: ["r1", "r2"], grammar: "living-profile", name: "Delta" },
    ]);
    assert.ok(issues.subtotal > 0);
});

test("integrityIssuesOf passes the same symbol across two grammars", () => {
    const issues = integrityIssuesOf(
        inSyncFaces([
            { domain: "living-profile", id: "r1", productions: [{ lhs: "Delta", rhs: "<a>" }], title: "one" },
            { domain: "automation", id: "r2", productions: [{ lhs: "Delta", rhs: "<b>" }], title: "two" },
        ]),
    );
    assert.deepEqual(issues.intraGrammarDivergentSymbols, []);
    assert.equal(issues.subtotal, 0);
});

test("integrityIssuesOf reports a committed symbol index that differs from the generated one", () => {
    const contract = makeContract({ domain: "pag", id: "r1", productions: [{ lhs: "Node", rhs: "<x>" }], title: "n" });
    const issues = integrityIssuesOf(facesOf([contract], []));
    assert.equal(issues.symbolIndexStale, true);
    assert.ok(issues.subtotal >= 1);
});

test("integrityIssuesOf passes a committed symbol index that matches the generated one", () => {
    const issues = integrityIssuesOf(
        inSyncFaces([{ domain: "pag", id: "r1", productions: [{ lhs: "Node", rhs: "<x>" }], title: "n" }]),
    );
    assert.equal(issues.symbolIndexStale, false);
    assert.equal(issues.subtotal, 0);
});

test("integrityIssuesOf reports titles across catalogs sharing two tokens, and counts them", () => {
    const issues = integrityIssuesOf(
        inSyncFaces([
            { domain: "architecture", id: "a1", productions: [], title: "canonical data model" },
            { domain: "arch-relationships", id: "b1", productions: [], title: "canonical data semantics" },
        ]),
    );
    assert.deepEqual(issues.crossCatalogRedundancy, [{ a: "a1", b: "b1" }]);
    assert.equal(issues.subtotal, 1);
});

const pairOf = (extra: Partial<Contract> = {}): Partial<Contract>[] => [
    { domain: "architecture", id: "a", title: "Streaming Dataflow Engine" },
    { domain: "arch-relationships", id: "b", title: "Streaming Dataflow Engine", ...extra },
];

test("a redundant pair stays open until one record declares the other distinct with a reason", () => {
    const open = inSyncFaces(pairOf());
    assert.deepEqual(integrityIssuesOf(open).crossCatalogRedundancy, [{ a: "a", b: "b" }]);
    const declared = inSyncFaces(pairOf({ distinctFrom: [{ id: "a", reason: "b checks what a builds" }] }));
    assert.deepEqual(integrityIssuesOf(declared).crossCatalogRedundancy, []);
    const dangling = inSyncFaces([{ distinctFrom: [{ id: "ghost", reason: "r" }], domain: "architecture", id: "a" }]);
    assert.deepEqual(integrityIssuesOf(dangling).invalidDistinctDeclarations, [
        { from: "a", reason: "names no algorithms record", target: "ghost" },
    ]);
});

test("integrityIssuesOf does not pair titles sharing fewer than two tokens", () => {
    const issues = integrityIssuesOf(
        inSyncFaces([
            { domain: "architecture", id: "a1", productions: [], title: "canonical data model" },
            { domain: "arch-relationships", id: "b1", productions: [], title: "runtime discovery model" },
        ]),
    );
    assert.deepEqual(issues.crossCatalogRedundancy, []);
});
