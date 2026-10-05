import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { walkPrinciples } from "coordination-surface/tools/core/readers/architecture.reader.ts";

const CATALOG = ["### ARC-1 one", "### ARC-12 twelve", "prose naming ARC-3", "### ARC- no number"].join("\n");

describe("walkPrinciples", () => {
    it("counts declared records, the ones cited, the uncited and the citations that resolve to nothing", () => {
        const walk = walkPrinciples(CATALOG, ["see ARC-1 and ARC-99", "ARC-1ARC-7 run together"]);
        assert.deepEqual(walk, { cited: 1, danglingCitations: ["ARC-7", "ARC-99"], declared: 2, uncited: ["ARC-12"] });
    });
});
