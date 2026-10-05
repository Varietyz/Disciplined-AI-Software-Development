import {
    absentFinding,
    artifactFinding,
    axisFinding,
    foreignFinding,
    leftoverFinding,
    readsOf,
} from "coordination-surface/tools/core/factories/declaration.factory.ts";
import { describe, it } from "vitest";
import { BEHAVIOR_TREE_PLACEHOLDER } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";

const CONSUMER = { asserted: "mutability", line: 14, name: "isFrozen", read: ["retention", "removal"] };

describe("readsOf", () => {
    it("joins the axes a consumer reads, or answers the empty text when it reads none", () => {
        assert.equal(readsOf(CONSUMER, "+", "none"), "retention+removal");
        assert.equal(readsOf({ ...CONSUMER, read: [] }, "+", "none"), "none");
    });
});

describe("declaration findings", () => {
    it("file each declaration defect under its own rule with its operand as the locus", () => {
        const absent = absentFinding("missingRoot", "tools/gone", 'root "tools/gone"', "decide");
        assert.equal(absent.rule, "declaration/missingRoot");
        assert.equal(absent.locus, 'root "tools/gone"');

        const foreign = foreignFinding("vendor", { evidence: "a package.json", why: "It is a package." });
        assert.equal(foreign.rule, "declaration/foreignGrammarClaimed");
        assert.equal(foreign.remediation.decide?.startsWith("It is a package."), true);

        const root = { binding: "surface", field: "history", key: "history", path: "", unresolved: "unbound" };
        const artifact = artifactFinding(root, "history resolves to nothing");
        assert.equal(artifact.rule, "declaration/unresolvedArtifactRoot");
        assert.equal(artifact.actual, "history resolves to nothing");

        const axis = axisFinding("tools/a.ts", CONSUMER);
        assert.equal(axis.rule, "declaration/unreadAssertedAxis");
        assert.deepEqual([axis.line, axis.locus, axis.remediation.to], [14, "isFrozen", "mutability"]);

        const leftover = leftoverFinding("skills/a/SKILL.md");
        assert.equal(leftover.rule, "declaration/unrenamedPlaceholder");
        assert.equal(leftover.locus, BEHAVIOR_TREE_PLACEHOLDER);
    });
});
