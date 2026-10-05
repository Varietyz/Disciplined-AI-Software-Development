import {
    isAlgoGrammar,
    isArchRelations,
    isLexicon,
    isPagGrammar,
    isReasonOntology,
    requireFace,
} from "@govlab/context/core/guards/context.guard.ts";
import assert from "node:assert/strict";
import { createGovlabContext } from "@govlab/context";
import { test } from "vitest";

const context = createGovlabContext();

test("each guard admits its own collection and refuses the others", () => {
    assert.equal(isArchRelations(context.arch), true);
    assert.equal(isArchRelations(context.lex), false);
    assert.equal(isLexicon(context.lex), true);
    assert.equal(isLexicon(context.arch), false);
    assert.equal(isAlgoGrammar(context.algo), true);
    assert.equal(isPagGrammar(context.pag), true);
    assert.equal(isReasonOntology(context.reason), true);
    assert.equal(isReasonOntology(null), false);
});

test("requireFace hands back a built collection and throws on an unbuilt one", () => {
    assert.equal(requireFace(context.pag, isPagGrammar, "pag"), context.pag);
    assert.throws(() => requireFace(undefined, isPagGrammar, "pag"), {
        message: 'govlab.context: collection "pag" was not built',
    });
});
