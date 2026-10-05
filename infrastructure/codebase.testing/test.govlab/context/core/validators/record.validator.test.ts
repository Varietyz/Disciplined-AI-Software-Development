import { ARCH_FACE, LEX_FACE } from "@govlab/constants";
import {
    type PrincipleRecord,
    createArchRelations,
    createGovlabContext,
    createLexicon,
    createPagGrammar,
} from "@govlab/context";
import {
    invalidRecordDistinctsOf,
    undeclaredAdjacentPairsOf,
} from "@govlab/context/core/validators/record.validator.ts";
import type { KeywordRecord } from "@govlab/context/types/grammar.types.ts";
import type { TermRecord } from "@govlab/context/types/lexicon.types.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const PARENT = "planted-parent";
const CHILD = "planted-child";
const REASON = "the parent governs a module, while the child governs one file";

const principle = (id: string, extra: Partial<PrincipleRecord> = {}): PrincipleRecord => ({
    conflicts_with: [],
    definition: "A design rule that is planted for the test.",
    detected_by: ["d"],
    enables: [],
    enforced_by: ["a planted gate"],
    exemplar: { after: "a planted after", before: "a planted before", lang: "ts", medium: "code" },
    id,
    measured_by: ["m"],
    name: id,
    refactored_by: [],
    reinforces: [],
    requires: [],
    scope: ["module"],
    severity: "recommended",
    tensions_with: [],
    type: "principle",
    ...extra,
});

const term = (name: string, kind: string): TermRecord => ({
    definition: "A rule or precondition planted for the test.",
    kind,
    name,
});

const facesOf = (
    principles: PrincipleRecord[],
    terms: TermRecord[] = [],
    keywords: KeywordRecord[] = [],
): Parameters<typeof invalidRecordDistinctsOf>[0] => ({
    arch: createArchRelations({ data: [{ category: "planted", records: principles }] }),
    lex: createLexicon({ data: [{ category: "planted", records: terms }] }),
    pag: createPagGrammar({ data: { documentTypes: [], keywords, productions: [], templates: [], terminals: [] } }),
});

const keyword = (word: string, distinctFrom: KeywordRecord["distinctFrom"] = []): KeywordRecord => ({
    distinctFrom,
    keyword: word,
    roles: [{ category: "action", example: `${word} a planted target`, meaning: "A keyword planted for the test" }],
});

const ref = (face: string, id: string): string => `${face}:${id}`;

test("two principles joined by an edge are an open pair until one declares the other distinct with a reason", () => {
    const open = undeclaredAdjacentPairsOf(facesOf([principle(PARENT, { requires: [CHILD] }), principle(CHILD)]));
    assert.deepEqual(open, [
        { a: ref(ARCH_FACE, PARENT), b: ref(ARCH_FACE, CHILD), basis: "requires", kind: "principle" },
    ]);
    const distinctParent = principle(PARENT, {
        distinctFrom: [{ id: ref(ARCH_FACE, CHILD), reason: REASON }],
        requires: [CHILD],
    });
    const declared = facesOf([distinctParent, principle(CHILD)]);
    assert.deepEqual(undeclaredAdjacentPairsOf(declared), []);
});

test("two terms of one kind listed under one relation are an open pair, and terms of two kinds are not", () => {
    const siblings = undeclaredAdjacentPairsOf(
        facesOf(
            [principle(PARENT, { requires: ["First Term", "Second Term", "Third Term"] })],
            [term("First Term", "constraint"), term("Second Term", "constraint"), term("Third Term", "artifact")],
        ),
    );
    assert.deepEqual(siblings, [
        {
            a: ref(LEX_FACE, "first-term"),
            b: ref(LEX_FACE, "second-term"),
            basis: `siblings under ${ref(ARCH_FACE, PARENT)} requires`,
            kind: "constraint",
        },
    ]);
});

test("a distinct declaration that names no record, names itself, or gives no reason is reported", () => {
    const distinctFrom = [
        { id: ref(ARCH_FACE, "ghost-rule"), reason: REASON },
        { id: ref(ARCH_FACE, PARENT), reason: REASON },
        { id: ref(ARCH_FACE, CHILD), reason: " " },
    ];
    const invalid = invalidRecordDistinctsOf(facesOf([principle(PARENT, { distinctFrom }), principle(CHILD)]));
    assert.deepEqual(
        invalid.map((entry) => entry.reason),
        ["names no architecture, lexicon or keyword record", "names the record itself", "gives no reason"],
    );
});

test("a keyword's distinct declaration is held to the same rules as a principle's", () => {
    const keywords = [
        keyword("PLANT", [
            { id: "pag:keyword:PLANTS", reason: REASON },
            { id: "pag:keyword:GHOST", reason: REASON },
        ]),
        keyword("PLANTS", [{ id: "pag:keyword:PLANT", reason: " " }]),
    ];
    const invalid = invalidRecordDistinctsOf(facesOf([], [], keywords));
    assert.deepEqual(
        invalid.map((entry) => [entry.from, entry.target, entry.reason]),
        [
            ["pag:keyword:PLANT", "pag:keyword:GHOST", "names no architecture, lexicon or keyword record"],
            ["pag:keyword:PLANTS", "pag:keyword:PLANT", "gives no reason"],
        ],
    );
});

test("the bundled ontology holds no undeclared adjacent pair and no invalid distinct declaration", () => {
    const issues = createGovlabContext().validateResolution();
    assert.deepEqual(issues.undeclaredAdjacentPairs, []);
    assert.deepEqual(issues.invalidRecordDistincts, []);
});
