import { describe, it } from "vitest";
import { manifestFinding, reachFinding } from "coordination-surface/tools/core/factories/manifest.factory.ts";
import assert from "node:assert/strict";

describe("manifest findings", () => {
    it("file a missing declaration and an unreached dependency against the manifest", () => {
        const missing = manifestFinding("package.json", "missingScript", "script govern", "no such file", "decide");
        assert.equal(missing.rule, "declaration/missingScript");
        assert.deepEqual([missing.path, missing.locus], ["package.json", "script govern"]);

        const reach = reachFinding("package.json", "left-pad");
        assert.equal(reach.rule, "declaration/unreachedDependency");
        assert.equal(reach.locus, 'dependency "left-pad"');
    });
});
