import { CART, STORES, marker, placedCategory, rename, tag } from "./lexicon.fixture.ts";
import {
    folderOfTerm,
    isMirrored,
    statesPlacement,
    statesRefusal,
    tagOfTerm,
} from "@govlab/context/core/selectors/lexicon.selector.ts";
import type { TermRecord } from "@govlab/context/types/lexicon.types.ts";
import assert from "node:assert/strict";
import { createLexicon } from "@govlab/context";
import { test } from "vitest";

const termsOf = (records: TermRecord[]): ReturnType<ReturnType<typeof createLexicon>["all"]> =>
    createLexicon({ data: [placedCategory(records)] }).all();

test("a tag term names its tag by its id and its folder by the clause its definition ends on", () => {
    const schemas: TermRecord = {
        definition: "A formal definition of the collection tag for a planted file, plural in both folder and tag.",
        kind: "artifact",
        name: "Schemas Tag",
    };
    const config: TermRecord = {
        definition: "A formal definition of the mass tag for a planted file, singular in both folder and tag.",
        kind: "artifact",
        name: "Config Tag",
    };
    const terms = termsOf([CART, schemas, config, tag("Entity Tag", "entities")]);
    assert.deepEqual(
        terms.map((term) => [tagOfTerm(term), folderOfTerm(term)]),
        [
            ["store", STORES],
            ["schemas", "schemas"],
            ["config", "config"],
            ["entity", "entities"],
        ],
    );
});

test("a mirrored marker states its placement without a folder, and a refusal states a refusal", () => {
    const [mirrored, refusal, store] = termsOf([marker("stores/cart.store.test.ts"), rename("a", "b"), CART]);
    assert.ok(mirrored && refusal && store);
    assert.equal(isMirrored(mirrored), true);
    assert.equal(statesPlacement(mirrored), true);
    assert.equal(statesPlacement(store), true);
    assert.equal(statesPlacement(refusal), false);
    assert.equal(statesRefusal(refusal), true);
    assert.equal(statesRefusal(store), false);
});
