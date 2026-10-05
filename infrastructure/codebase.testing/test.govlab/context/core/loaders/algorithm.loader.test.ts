import { buildSymbolIndex, symbolIndexesMatch } from "@govlab/context";
import { loadBundledSymbols, loadContracts, symbolsPath } from "@govlab/context/core/loaders/algorithm.loader.ts";
import { ReadAudit } from "@govlab/context/core/observers/record.observer.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("the bundled contracts load and the committed symbol index matches them", () => {
    const contracts = loadContracts(new ReadAudit("algorithms"));
    assert.ok(contracts.length > 0);
    assert.ok(symbolsPath().endsWith(".generated.json"));
    assert.equal(symbolIndexesMatch(loadBundledSymbols(), buildSymbolIndex(contracts)), true);
});

test("loadContracts folds planted categories instead of the bundled data", () => {
    const contracts = loadContracts(new ReadAudit("algorithms"), [
        {
            category: "planted",
            records: [
                {
                    composes: [],
                    flow: [],
                    force: [],
                    id: "c1",
                    intent: "i",
                    invariant: "v",
                    productions: [],
                    title: "t",
                },
            ],
            tier: "leaf",
        },
    ]);
    assert.deepEqual(
        contracts.map((entry) => entry.id),
        ["c1"],
    );
});
