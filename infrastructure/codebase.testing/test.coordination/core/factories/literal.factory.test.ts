import { describe, it } from "vitest";
import { enumerationFinding, rawPathFinding } from "coordination-surface/tools/core/factories/literal.factory.ts";
import assert from "node:assert/strict";

describe("literal findings", () => {
    it("anchor a raw path at the line its literal closes on, naming the composer it reached or none", () => {
        const source = 'const a = 1;\nconst b = join("config/x");';
        const close = source.lastIndexOf('"');
        const quoted = { close, open: source.indexOf('"'), value: "config/x" };
        const raw = rawPathFinding("tools/a.ts", source, quoted, "join");
        assert.equal(raw.rule, "literal/rawPath");
        assert.deepEqual([raw.line, raw.locus], [2, "config/x"]);
        assert.ok(raw.stack.some((entry) => entry.resolved === "join"));
        assert.ok(rawPathFinding("tools/a.ts", source, quoted, "").stack.some((entry) => entry.resolved === "none"));

        const enumeration = enumerationFinding("tools/a.ts", { line: 4, root: "repoRoot" });
        assert.equal(enumeration.rule, "literal/unboundedEnumeration");
        assert.deepEqual([enumeration.line, enumeration.locus], [4, "repoRoot"]);
    });
});
