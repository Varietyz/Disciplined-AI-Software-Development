import { loadCategories, readJsonDir, readJsonFile } from "@govlab/context/core/loaders/ontology.loader.ts";
import { GRAPH_FILE } from "@govlab/context/configuration/constants/layer.constants.ts";
import { ReadAudit } from "@govlab/context/core/observers/record.observer.ts";
import { absolutePath } from "@ssot/paths";
import assert from "node:assert/strict";
import path from "node:path";
import { test } from "vitest";

const LAYERS = absolutePath("govlab.context.layers");

const isGraph = (name: string): boolean => name === GRAPH_FILE;

test("readJsonDir reads each data file once, filtered by only and exclude", () => {
    const all = readJsonDir(LAYERS);
    assert.ok(all.length > 1);
    assert.equal(readJsonDir(LAYERS, { only: isGraph }).length, 1);
    assert.equal(readJsonDir(LAYERS, { exclude: isGraph }).length, all.length - 1);
    assert.deepEqual(readJsonFile(path.join(LAYERS, GRAPH_FILE)), readJsonDir(LAYERS, { only: isGraph })[0]);
});

test("loadCategories folds every category of a data folder through the normalizer", () => {
    const ids = loadCategories(
        absolutePath("govlab.context.principles"),
        (raw) => String(raw["id"] ?? raw["name"]),
        new ReadAudit("architecture"),
    );
    assert.ok(ids.length > 0);
});
