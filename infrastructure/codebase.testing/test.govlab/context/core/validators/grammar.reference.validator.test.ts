import type {
    DocumentTypeRecord,
    KeywordRecord,
    KeywordRole,
    ProductionRecord,
} from "@govlab/context/types/grammar.types.ts";
import {
    doctypeModelAxisOf,
    ungroundedPagConstructsOf,
    unresolvedPagGroundsOf,
} from "@govlab/context/core/validators/grammar.reference.validator.ts";
import type { PagGroundingFaces } from "@govlab/context/types/reference.types.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const KIND_MEMBERS: ReadonlyMap<string, ReadonlySet<string>> = new Map([
    ["axis", new Set(["ontology", "formalization"])],
    ["lens", new Set(["structural", "sequential"])],
    ["mode", new Set(["comparison", "abstraction"])],
    ["model", new Set(["cognition", "epistemology"])],
]);

const idsOf = (ids: string[]): { id: string }[] => ids.map((id) => ({ id }));

const role = (category: string, grounds?: string[]): KeywordRole => ({
    category,
    example: "e",
    meaning: "m",
    ...(grounds === undefined ? {} : { grounds }),
});

const keyword = (token: string, first: KeywordRole, ...further: KeywordRole[]): KeywordRecord => ({
    keyword: token,
    roles: [first, ...further],
});

const production = (lhs: string, grounds?: string[]): ProductionRecord => ({
    group: "g",
    lhs,
    rhs: "r",
    ...(grounds === undefined ? {} : { grounds }),
});

const doctype = (type: string, over: { axis?: string; model?: string }): DocumentTypeRecord => ({
    defaultVerb: "IS",
    purpose: "p",
    type,
    verbs: ["IS"],
    ...over,
});

const pagFaces = (over: {
    documentTypes?: DocumentTypeRecord[];
    keywords?: KeywordRecord[];
    productions?: ProductionRecord[];
}): PagGroundingFaces => ({
    pag: {
        documentTypes: () => over.documentTypes ?? [],
        keywords: () => over.keywords ?? [],
        productions: () => over.productions ?? [],
    },
    reason: {
        axes: () => idsOf(["ontology", "formalization"]),
        kindMembers: () => KIND_MEMBERS,
        models: () => idsOf(["cognition", "epistemology"]),
    },
});

test("unresolvedPagGroundsOf reports an unknown reason id, and a real id under the wrong kind", () => {
    const unknown = pagFaces({ keywords: [keyword("META", role("meta", ["reasoning:mode:ghost"]))] });
    assert.deepEqual(unresolvedPagGroundsOf(unknown), [{ from: "meta:META", target: "reasoning:mode:ghost" }]);
    const mismatch = pagFaces({ productions: [production("phase", ["reasoning:lens:comparison"])] });
    assert.deepEqual(unresolvedPagGroundsOf(mismatch), [{ from: "phase", target: "reasoning:lens:comparison" }]);
});

test("unresolvedPagGroundsOf passes a well-formed kind-qualified ground, and checks every role of a keyword", () => {
    const faces = pagFaces({ keywords: [keyword("META", role("meta", ["reasoning:mode:comparison"]))] });
    assert.deepEqual(unresolvedPagGroundsOf(faces), []);
    const shared = pagFaces({
        keywords: [
            keyword(
                "WAIT",
                role("action", ["reasoning:mode:comparison"]),
                role("coordination", ["reasoning:mode:ghost"]),
            ),
        ],
    });
    assert.deepEqual(unresolvedPagGroundsOf(shared), [{ from: "coordination:WAIT", target: "reasoning:mode:ghost" }]);
});

test("ungroundedPagConstructsOf reports ungrounded roles and productions, and exempts contextual and structural ones", () => {
    const faces = pagFaces({
        keywords: [
            keyword("META", role("meta")),
            keyword("OF", role("contextual")),
            keyword("WAIT", role("action", ["reasoning:mode:comparison"]), role("coordination", [])),
        ],
        productions: [production("node"), production("frontmatter"), production("document_declaration")],
    });
    assert.deepEqual(ungroundedPagConstructsOf(faces), ["coordination:WAIT", "meta:META", "node"]);
});

test("doctypeModelAxisOf reports a missing model and an unresolvable one, and passes both resolved", () => {
    const missing = pagFaces({ documentTypes: [doctype("X", { axis: "ontology" })] });
    assert.deepEqual(doctypeModelAxisOf(missing), ["X"]);
    const badModel = pagFaces({ documentTypes: [doctype("Y", { axis: "ontology", model: "ghost" })] });
    assert.deepEqual(doctypeModelAxisOf(badModel), ["Y"]);
    const clean = pagFaces({ documentTypes: [doctype("AGENT", { axis: "ontology", model: "cognition" })] });
    assert.deepEqual(doctypeModelAxisOf(clean), []);
});
