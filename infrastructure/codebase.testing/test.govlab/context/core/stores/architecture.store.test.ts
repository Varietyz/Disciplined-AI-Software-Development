import { ArchitectureStore } from "@govlab/context/core/stores/architecture.store.ts";
import assert from "node:assert/strict";
import { plantedPrinciple } from "../validators/ontology.fixture.ts";
import { test } from "vitest";

const store = new ArchitectureStore({
    data: [
        plantedPrinciple("parent-rule", { requires: ["Child Alias", "a free label"] }),
        plantedPrinciple("child-rule", { aliases: ["Child Alias"] }),
    ],
});

test("resolve follows an alias to its principle and keeps a free label as text", () => {
    const resolved = store.resolve(["parent-rule", "ghost"]);
    assert.deepEqual(
        resolved.principles.map((principle) => principle.id),
        ["parent-rule"],
    );
    const [child, label] = resolved.edges.requires;
    assert.equal(typeof child === "object" ? child.id : child, "child-rule");
    assert.equal(label, "a free label");
    assert.equal(resolved.refactorRecipes[0]?.id, "parent-rule");
});

test("validateOntology reports the free label as a dangling edge and resolves the alias", () => {
    const targets = store.validateOntology().danglingEdges.map((edge) => edge.target);
    assert.deepEqual(targets, ["a free label"]);
});
