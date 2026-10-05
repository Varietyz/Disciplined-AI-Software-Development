import { LEX_FACE, createLexicon } from "@govlab/context";
import assert from "node:assert/strict";
import { test } from "vitest";

test("a term without its own enforcedBy takes its category's, and its own wins where it has one", () => {
    const lex = createLexicon({
        data: [
            {
                category: "planted",
                enforcedBy: ["the category gate"],
                records: [
                    { definition: "A formal definition of a planted tag.", kind: "artifact", name: "Planted Tag" },
                    {
                        definition: "A formal definition of an owned tag.",
                        enforcedBy: ["its own gate"],
                        kind: "artifact",
                        name: "Owned Tag",
                    },
                ],
            },
        ],
    });
    assert.deepEqual(lex.get("planted-tag")?.enforcedBy, ["the category gate"]);
    assert.deepEqual(lex.get("owned-tag")?.enforcedBy, ["its own gate"]);
    assert.equal(LEX_FACE.name, "lexicon");
});
