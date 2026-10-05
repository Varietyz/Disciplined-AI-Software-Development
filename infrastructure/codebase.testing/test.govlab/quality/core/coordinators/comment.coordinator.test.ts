import { expect, test } from "vitest";
import { runExtract, runStrip } from "@govlab/quality/core/coordinators/comment.coordinator.ts";
import { mkdtempSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";

const nothingExcluded = (): boolean => false;

test("runStrip over an empty tree resolves without cleaning any file", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "tree-strip-"));
    await expect(runStrip(dir, nothingExcluded)).resolves.toBeUndefined();
});

test("runExtract over an empty tree resolves with nothing to collect", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "tree-extract-"));
    await expect(runExtract(dir, null, nothingExcluded)).resolves.toBeUndefined();
});
