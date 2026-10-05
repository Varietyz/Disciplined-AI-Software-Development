import type { Edge, OntologyIssues } from "@govlab/context/types/ontology.types.ts";
import { BaseOntology } from "@govlab/context/core/stores/ontology.store.ts";
import { ReadAudit } from "@govlab/context/core/observers/record.observer.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

interface Row {
    id: string;
    group: string;
}

class RowStore extends BaseOntology<Row, { group: string }> {
    public edges(edgesOf: (row: Row) => Edge[]): OntologyIssues {
        return this.validateEdges(edgesOf);
    }
}

const store = new RowStore(
    [
        { group: "x", id: "a" },
        { group: "y", id: "b" },
    ],
    {
        audit: new ReadAudit("rows"),
        idOf: (row) => row.id,
        label: "rows",
        matches: (row, filter) => row.group === filter.group,
    },
);

test("BaseOntology answers by id, lists and indexes its records, and filters by the matcher it is given", () => {
    assert.equal(store.get("a")?.group, "x");
    assert.deepEqual(store.ids(), ["a", "b"]);
    assert.equal(store.all().length, 2);
    assert.equal(store.index().size, 2);
    assert.deepEqual(
        store.query({ group: "y" }).map((row) => row.id),
        ["b"],
    );
    assert.equal(store.query().length, 2);
    assert.deepEqual(store.attributions(), []);
    assert.deepEqual(store.unreadKeys(), []);
    assert.deepEqual(store.edges(() => []).danglingEdges, []);
});
