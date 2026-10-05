import { describe, it } from "vitest";
import {
    importsWriter,
    reachableFrom,
    unsanctionedWriters,
} from "coordination-surface/tools/core/validators/writer.validator.ts";
import assert from "node:assert/strict";

const SOURCES: Record<string, string> = {
    "src/entry.ts": 'import { helper } from "./helper.ts";\nimport { writer } from "./writer.ts";',
    "src/helper.ts": 'import { mkdirSync } from "node:fs";',
    "src/unreached.ts": 'import { rmSync } from "node:fs";',
    "src/writer.ts": 'import { writeFileSync } from "node:fs";',
};

const read = (path: string): string => SOURCES[path] ?? "";

const KNOWN = new Set(Object.keys(SOURCES));

describe("importsWriter", () => {
    it("names the first filesystem write member a source imports, and none for a read-only import", () => {
        assert.equal(importsWriter('import { readFileSync, rmSync } from "node:fs";'), "rmSync");
        assert.equal(importsWriter('import { readFileSync } from "node:fs";'), null);
    });
});

describe("reachableFrom and unsanctionedWriters", () => {
    it("walk the local imports from the entries, and name each reached writer outside the sanctioned set", () => {
        assert.deepEqual(reachableFrom(["src/entry.ts", ""], KNOWN, read), [
            "src/entry.ts",
            "src/helper.ts",
            "src/writer.ts",
        ]);
        assert.deepEqual(unsanctionedWriters(["src/entry.ts"], KNOWN, read, ["src/writer.ts"]), [
            { member: "mkdirSync", path: "src/helper.ts" },
        ]);
    });
});
