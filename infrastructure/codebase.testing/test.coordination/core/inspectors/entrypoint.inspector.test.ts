import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { unpublishedBranchOperands } from "coordination-surface/tools/core/inspectors/entrypoint.inspector.ts";

const SOURCE = [
    'const mode = flag ? "a" : "b";',
    'const quiet = "x";',
    "runThing({",
    "    mode: mode,",
    "    quiet: quiet,",
    "});",
    "writeReport(root, report);",
    "const report = {",
    "    other: other,",
    "};",
].join("\n");

describe("unpublishedBranchOperands", () => {
    it("names a branching operand the run takes and the report never publishes", () => {
        assert.deepEqual(unpublishedBranchOperands(SOURCE, "runThing", "writeReport"), [{ line: 4, name: "mode" }]);
        const published = SOURCE.replace("    other: other,", "    mode: mode,");
        assert.deepEqual(unpublishedBranchOperands(published, "runThing", "writeReport"), []);
    });
});
