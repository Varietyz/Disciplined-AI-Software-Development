import { LexiconStore } from "@govlab/context/core/stores/lexicon.store.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const store = new LexiconStore({
    data: [
        {
            category: "planted",
            records: [
                {
                    aliases: ["Velocity"],
                    definition: "The degree to which work is fast.",
                    kind: "quality-attribute",
                    name: "Speed",
                },
            ],
        },
    ],
});

test("the lexicon store resolves a term by its id, its name or an alias", () => {
    assert.equal(store.resolve("speed")?.id, "speed");
    assert.equal(store.resolve("Speed")?.id, "speed");
    assert.equal(store.resolve("Velocity")?.id, "speed");
    assert.equal(store.resolve("ghost"), null);
});
