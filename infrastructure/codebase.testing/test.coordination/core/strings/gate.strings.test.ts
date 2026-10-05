import {
    branchDisagrees,
    cleanNoisy,
    contractContradicted,
    gateSummary,
    healOnlyProven,
    healSurvived,
    healedNothing,
    healedSuffix,
    judgmentAstray,
    kindProven,
    outcomeLine,
    proofRunEmpty,
    unfixturedKind,
    violatingSilent,
} from "coordination-surface/tools/core/strings/gate.strings.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("the gate messages", () => {
    it("name each contradicted field description, and the kind no fixture pair covers", () => {
        assert.ok(
            contractContradicted(["keys is composite-keyed", "names is flat"]).includes(
                "keys is composite-keyed; names is flat",
            ),
        );
        assert.ok(unfixturedKind("board/missingField").includes("board/missingField"));
    });

    it("tally the run and name each open outcome", () => {
        const tally = {
            branchesOpen: 0,
            branchesProven: 2,
            exempt: 1,
            failed: 0,
            proven: 5,
            unfixtured: 0,
            untested: 0,
        };
        assert.ok(gateSummary("PASS", tally, "gate.json").startsWith("PASS  rules: proven=5 exempt=1"));
        assert.ok(outcomeLine("failed", "board", "why").includes("board"));
    });

    it("name the kind, the samples and the counts behind each fixture outcome", () => {
        const kind = "board/drift";
        assert.ok(healedNothing(kind).includes(`${kind} healed nothing`));
        assert.ok(healSurvived(kind, 2).includes("2 finding(s) still stand"));
        assert.ok(healOnlyProven(kind, "a.md").includes("HEALED a.md"));
        assert.ok(violatingSilent(kind, "a.md").endsWith("Samples: a.md"));
        assert.ok(cleanNoisy(kind, 3, "board at a.md:1").includes("produced 3 findings"));
        assert.ok(judgmentAstray("b.md", "a.md").includes("targets b.md while it reports a.md"));
        assert.equal(
            `${kindProven(kind, 1, "a.md", "b.md")}${healedSuffix("c.md")}`,
            "kind board/drift · FIRED 1 finding(s) on a.md · ACCEPTED b.md · HEALED c.md, and the repair passed its own re-check",
        );
    });

    it("carry the disagreeing effect of a branch and the output of an empty proof run", () => {
        assert.ok(branchDisagrees("wrote true where false is declared").includes("wrote true where false is declared"));
        assert.ok(proofRunEmpty("exit 1").endsWith("every pair passed. Output: exit 1"));
    });
});
