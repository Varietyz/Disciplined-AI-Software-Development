import { PAG_FACE, createGovlabContext, createPagGrammar, keywordIdOf, validate } from "@govlab/context";
import assert from "node:assert/strict";
import { test } from "vitest";

const pag = createPagGrammar();

const emptyData = { documentTypes: [], keywords: [], productions: [], templates: [], terminals: [] };

const slot = (name: string): { description: string; kind: string; name: string; required: boolean } => ({
    description: name,
    kind: "text",
    name,
    required: true,
});

test("the bundled grammar loads its keywords, document types, productions, templates and categories", () => {
    assert.ok(pag.keywords().length > 0);
    assert.ok(pag.documentTypes().length > 0);
    assert.ok(pag.productions().length > 0);
    assert.ok(pag.templates().length > 0);
    for (const category of ["action", "semantic_operation", "validation", "report", "invariant", "coordination"]) {
        assert.ok(pag.categories().includes(category), category);
    }
    assert.equal(PAG_FACE.name, "pag");
});

test("a keyword id is its token, finds its keyword back, and a token defined once holds every role it plays", () => {
    const [keyword] = pag.keywords();
    assert.ok(keyword, "the grammar holds a keyword");
    assert.equal(pag.keyword(keywordIdOf(keyword))?.keyword, keyword.keyword);
    assert.ok(pag.keyword("READ")?.roles[0].meaning.startsWith("Input acquisition") === true);
    assert.ok(pag.keyword("POPULATION")?.roles[0].grounds?.includes("reasoning:node:ver-population") === true);
    assert.equal(pag.keyword("action:READ"), null, "a keyword is addressed by its token alone");
    const wait = pag.keyword("WAIT");
    assert.ok(wait, "the grammar holds WAIT");
    assert.deepEqual(
        wait.roles.map((role) => role.category),
        ["action", "coordination"],
    );
    assert.ok(pag.keywords("action").includes(wait));
    assert.ok(pag.keywords("coordination").includes(wait));
});

test("every keyword role outside contextual grounds into the reasoning collection", () => {
    const ungrounded = pag
        .keywords()
        .flatMap((keyword) => keyword.roles.map((role) => ({ keyword: keyword.keyword, role })))
        .filter((entry) => entry.role.category !== "contextual" && (entry.role.grounds ?? []).length === 0)
        .map((entry) => entry.keyword);
    assert.deepEqual(ungrounded, []);
    const coordination = new Set(pag.keywords("coordination").map((keyword) => keyword.keyword));
    for (const token of ["SURFACE", "RECORD", "ITEM", "SATISFIED_BY", "WAIT", "BARRIER", "SWAP"]) {
        assert.ok(coordination.has(token), token);
    }
    const validation = new Set(pag.keywords("validation").map((keyword) => keyword.keyword));
    for (const token of ["POPULATION", "REFUSE", "FRESHNESS", "STANDING", "UNKNOWN", "BLOCKED", "PROMOTE", "PUBLISH"]) {
        assert.ok(validation.has(token), token);
    }
});

test("the bundled grammar validates clean", () => {
    const issues = pag.validateOntology();
    assert.deepEqual(issues.duplicateKeywordIds, []);
    assert.deepEqual(issues.danglingTemplateSlots, []);
    assert.deepEqual(issues.docTypesWithoutVerb, []);
    assert.deepEqual(issues.unknownTemplateTypes, []);
    assert.deepEqual(issues.unrecognizedDocumentTypes, []);
    assert.deepEqual(issues.unrecognizedDocumentVerbs, []);
    assert.deepEqual(issues.danglingNonterminals, []);
    assert.deepEqual(issues.unusedTerminals, []);
});

test("a right-hand reference that is neither a production nor a terminal dangles, and a declared one does not", () => {
    const dangling = createPagGrammar({
        data: {
            ...emptyData,
            productions: [
                { group: "g", lhs: "root", rhs: "<known> <ghost>" },
                { group: "g", lhs: "known", rhs: '"x"' },
            ],
        },
    }).validateOntology();
    assert.deepEqual(dangling.danglingNonterminals, [{ production: "root", ref: "ghost" }]);
    const resolved = createPagGrammar({
        data: {
            ...emptyData,
            productions: [
                { group: "g", lhs: "root", rhs: "<leaf> <known>" },
                { group: "g", lhs: "known", rhs: '"x"' },
            ],
            terminals: ["leaf"],
        },
    }).validateOntology();
    assert.deepEqual(resolved.danglingNonterminals, []);
    assert.deepEqual(resolved.unusedTerminals, []);
});

test("a declared terminal no production names is unused", () => {
    const issues = createPagGrammar({
        data: { ...emptyData, productions: [{ group: "g", lhs: "root", rhs: '"x"' }], terminals: ["orphan"] },
    }).validateOntology();
    assert.deepEqual(issues.unusedTerminals, ["orphan"]);
});

test("a document type or verb the keyword vocabulary lacks is unrecognized, and one it covers is not", () => {
    const documentTypes = [{ defaultVerb: "DOES", purpose: "x", type: "GHOST", verbs: ["DOES"] }];
    const bare = createPagGrammar({ data: { ...emptyData, documentTypes } }).validateOntology();
    assert.deepEqual(bare.unrecognizedDocumentTypes, ["GHOST"]);
    assert.ok(bare.unrecognizedDocumentVerbs.some((entry) => entry.type === "GHOST" && entry.verb === "DOES"));
    const covered = createPagGrammar({
        data: {
            ...emptyData,
            documentTypes,
            keywords: [
                { keyword: "GHOST", roles: [{ category: "document_type", example: "", meaning: "" }] },
                { keyword: "DOES", roles: [{ category: "document_verb", example: "", meaning: "" }] },
            ],
        },
    }).validateOntology();
    assert.deepEqual(covered.unrecognizedDocumentTypes, []);
    assert.deepEqual(covered.unrecognizedDocumentVerbs, []);
});

test("a slot the body never carries dangles, and a template of an unregistered type is unknown", () => {
    const issues = createPagGrammar({
        data: {
            ...emptyData,
            documentTypes: [{ defaultVerb: "DOES", purpose: "x", type: "KNOWN", verbs: ["DOES"] }],
            templates: [
                {
                    body: "{present}",
                    constraints: [],
                    slots: [slot("present"), slot("absent")],
                    title: "t",
                    type: "KNOWN",
                },
                { body: "", constraints: [], slots: [], title: "g", type: "GHOST" },
            ],
        },
    }).validateOntology();
    assert.deepEqual(issues.danglingTemplateSlots, [{ slot: "absent", type: "KNOWN" }]);
    assert.deepEqual(issues.unknownTemplateTypes, ["GHOST"]);
});

test("every bundled template resolves with every slot filled and validates clean", () => {
    for (const template of pag.templates()) {
        const slots = Object.fromEntries(
            template.slots.map((entry) => [entry.name, entry.name.toLowerCase().split("_").join(" ")]),
        );
        const resolved = pag.resolvePagTemplate(template.type, slots);
        assert.deepEqual(resolved.violations, [], template.type);
        assert.deepEqual(resolved.unresolved, [], template.type);
        assert.deepEqual(validate(resolved.text).defects, [], template.type);
    }
});

test("contextFor surfaces the resolver's contracts for an applicable type and none for an inapplicable one", () => {
    const context = createGovlabContext();
    assert.ok(context.pag.contextFor("AGENT").contracts.length > 0);
    assert.deepEqual(context.pag.contextFor("NONSENSE").contracts, []);
});
