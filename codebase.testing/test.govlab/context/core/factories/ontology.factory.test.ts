import assert from "node:assert/strict";
import { createOntology } from "@govlab/context/core/factories/ontology.factory.ts";
import { test } from "vitest";

interface Row {
    id: string;
    links: string[];
}

const ROWS: Row[] = [
    { id: "b", links: ["a", "ghost"] },
    { id: "a", links: [] },
    { id: "a", links: [] },
];

test("createOntology indexes by id, keeps the later duplicate, and warns on each duplicate and empty id", () => {
    const warnings: string[] = [];
    const ontology = createOntology<Row>({
        idOf: (row) => row.id,
        label: "rows",
        logger: {
            warn: (message) => {
                warnings.push(message);
            },
        },
        records: [...ROWS, { id: "", links: [] }],
    });
    assert.deepEqual(ontology.ids(), ["a", "b"]);
    assert.equal(ontology.get("ghost"), null);
    assert.equal(ontology.query((row) => row.id === "b").length, 1);
    assert.equal(warnings.length, 2);
    assert.equal(Object.isFrozen(ontology.all()[0]), true);
});

test("validateOntology reports a dangling edge and a duplicate id", () => {
    const ontology = createOntology<Row>({ idOf: (row) => row.id, label: "rows", records: ROWS });
    const issues = ontology.validateOntology((row) => [{ relation: "links", targets: row.links }]);
    assert.deepEqual(issues.danglingEdges, [{ from: "b", relation: "links", target: "ghost" }]);
    assert.deepEqual(issues.duplicateIds, ["a"]);
});
