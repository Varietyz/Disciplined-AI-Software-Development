import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { unscopedRead } from "coordination-surface/tools/core/validators/source.validator.ts";

const FS_IMPORT = 'import { readFileSync } from "node:fs";';

describe("unscopedRead", () => {
    it("passes a rule that reads the declared path set or declares the tree, and names one that builds its own or reads the filesystem", () => {
        assert.equal(unscopedRead(`${FS_IMPORT}\nconst readsTree: "the tree";`), null);
        assert.equal(unscopedRead("const files = context.paths;"), null);
        assert.equal(unscopedRead("const files = walk(root);")?.locus, "declared scope");
        assert.equal(unscopedRead(`${FS_IMPORT}\nconst files = context.paths;`)?.locus, "filesystem import");
    });
});
