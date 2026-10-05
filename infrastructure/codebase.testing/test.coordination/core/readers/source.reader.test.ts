import { describe, it } from "vitest";
import { importSource, importSources } from "coordination-surface/tools/core/readers/source.reader.ts";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const SIBLING = fileURLToPath(import.meta.resolve("coordination-surface/tools/core/readers/json.reader.ts"));

describe("importSource and importSources", () => {
    it("loads a module's exports, and reports a module that cannot load instead of throwing", async () => {
        const results = await importSources([SIBLING, `${SIBLING}.missing.ts`]);
        assert.deepEqual(
            results.map((result) => [typeof result.exports?.["tryParse"], result.error === null]),
            [
                ["function", true],
                ["undefined", false],
            ],
        );
        assert.equal((await importSource(SIBLING)).file, SIBLING);
    });
});
