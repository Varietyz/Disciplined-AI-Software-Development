import assert from "node:assert/strict";
import { createLexicon } from "@govlab/context";
import { matchesTerm } from "@govlab/context/core/matchers/lexicon.matcher.ts";
import { test } from "vitest";

const [term] = createLexicon({
    data: [
        {
            category: "planted",
            records: [
                { definition: "A planted term.", enforcedBy: ["a gate"], kind: "constraint", name: "Planted Term" },
            ],
        },
    ],
}).all();

test("an empty filter matches, and the kind, category and enforcer each narrow the match", () => {
    assert.ok(term);
    assert.equal(matchesTerm(term, {}), true);
    assert.equal(matchesTerm(term, { category: "planted", enforcedBy: "a gate", kind: "constraint" }), true);
    assert.equal(matchesTerm(term, { kind: "artifact" }), false);
    assert.equal(matchesTerm(term, { category: "other" }), false);
    assert.equal(matchesTerm(term, { enforcedBy: "another gate" }), false);
});
