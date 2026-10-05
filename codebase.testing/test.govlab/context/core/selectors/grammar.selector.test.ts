import { categoriesOf, hasRoleIn, keywordIdOf, roleIdOf } from "@govlab/context/core/selectors/grammar.selector.ts";
import type { KeywordRecord } from "@govlab/context/types/grammar.types.ts";
import assert from "node:assert/strict";
import { createPagGrammar } from "@govlab/context";
import { test } from "vitest";

const pag = createPagGrammar();

const roleIn = (category: string): KeywordRecord["roles"][number] => ({ category, example: "", meaning: "" });

const keyword = (token: string, first: string, ...further: string[]): KeywordRecord => ({
    keyword: token,
    roles: [roleIn(first), ...further.map(roleIn)],
});

test("keywordIdOf is the token, and roleIdOf joins a role's category and the token", () => {
    const wait = keyword("WAIT", "action", "coordination");
    assert.equal(keywordIdOf(wait), "WAIT");
    assert.deepEqual(
        wait.roles.map((role) => roleIdOf(wait, role)),
        ["action:WAIT", "coordination:WAIT"],
    );
    assert.equal(hasRoleIn(wait, "coordination"), true);
    assert.equal(hasRoleIn(wait, "meta"), false);
});

test("categoriesOf lists each category of every role once, sorted", () => {
    const categories = categoriesOf({
        documentTypes: [],
        keywords: [keyword("X", "b"), keyword("Y", "a", "c"), keyword("Z", "b")],
        productions: [],
        templates: [],
        terminals: [],
    });
    assert.deepEqual(categories, ["a", "b", "c"]);
});

test("contextFor derives a palette and a template, and an unknown type is not applicable", () => {
    const context = pag.contextFor("AGENT");
    assert.equal(context.applicable, true);
    assert.ok(context.palette.verbs.includes("PERFORMS"));
    assert.ok(context.palette.constructs.includes("action"));
    assert.ok(context.template);
    assert.ok(context.requiredSections.includes("gates"));
    assert.ok(context.requiredSections.includes("invariants"));
    assert.equal(pag.contextFor("NONSENSE").applicable, false);
});
