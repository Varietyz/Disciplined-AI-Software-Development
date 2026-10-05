import assert from "node:assert/strict";
import { createArchRelations } from "@govlab/context";
import { matchesPrinciple } from "@govlab/context/core/matchers/architecture.matcher.ts";
import { plantedPrinciple } from "../validators/ontology.fixture.ts";
import { test } from "vitest";

const [principle] = createArchRelations({
    data: [plantedPrinciple("planted-rule", { requires: ["other-rule"], tensions_with: ["care-rule"] })],
}).all();

test("an empty filter matches, and each scalar and list field narrows the match", () => {
    assert.ok(principle);
    assert.equal(matchesPrinciple(principle, {}), true);
    assert.equal(
        matchesPrinciple(principle, { category: "planted", requires: "other-rule", severity: "recommended" }),
        true,
    );
    assert.equal(matchesPrinciple(principle, { tensionsWith: "care-rule", type: "principle" }), true);
    assert.equal(matchesPrinciple(principle, { severity: "mandatory" }), false);
    assert.equal(matchesPrinciple(principle, { enables: "ghost" }), false);
});
