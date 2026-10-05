import { mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { loadDeclaredChecks } from "@govlab/context/core/loaders/check.loader.ts";
import { missingCheckIndex } from "@govlab/context/configuration/strings/ontology.report.strings.ts";
import { test } from "vitest";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

test("the check index loads its well-formed entries and reads a missing index as absent", () => {
    const folder = mkdtempSync(join(tmpdir(), "checks-"));
    const file = join(folder, "check-index.json");
    writeVerbatim(file, JSON.stringify([{ check: "a.ts", detects: [], enforces: ["x:y"] }, { check: 1 }]));
    const loaded = loadDeclaredChecks(file);
    const missing = loadDeclaredChecks(join(folder, "absent.json"));
    rmSync(folder, { force: true, recursive: true });
    assert.deepEqual(loaded, [{ check: "a.ts", detects: [], enforces: ["x:y"] }]);
    assert.equal(missing, null);
    assert.equal(missingCheckIndex("index.json").includes("index.json is missing"), true);
});
