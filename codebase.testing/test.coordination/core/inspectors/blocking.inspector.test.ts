import { describe, it } from "vitest";
import { RESOLUTION_HEADING } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import assert from "node:assert/strict";
import { venueFindings } from "coordination-surface/tools/core/inspectors/blocking.inspector.ts";

type Scope = Parameters<typeof venueFindings>[2];

const PATH = "probe.blocking.md";

const SCOPE: Scope = { agenda: "", archive: "", boardText: "", indexText: "", open: [], repoRoot: "", template: "" };

const kindsOf = function kindsOf(source: string): string[] {
    return venueFindings(PATH, source, SCOPE).map((finding) => finding.rule.slice(finding.rule.indexOf("/") + 1));
};

describe("venueFindings", () => {
    it("holds every venue on disk, names a missing exit condition, and a position posted outside every record", () => {
        assert.deepEqual(kindsOf("# Venue\n"), ["unresolvedDiscussion", "noExitCondition"]);
        assert.deepEqual(kindsOf(`# Venue\n${RESOLUTION_HEADING}\nPosition A-1 — stray\n`), [
            "unresolvedDiscussion",
            "handPlacedPosition",
        ]);
    });
});
