import { MILESTONE_MARKER, PHASE_MARKER } from "coordination-surface/tools/core/constants/checklist.constants.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { phaseSpans } from "coordination-surface/tools/core/analyzers/checklist.analyzer.ts";

describe("phaseSpans", () => {
    it("reads each phase with its title, start line, body and the band above it, and resets at a milestone", () => {
        const lines = [
            "band line",
            `${PHASE_MARKER}one`,
            "first body",
            `${PHASE_MARKER}two`,
            "second body",
            `${MILESTONE_MARKER}1`,
            "new band",
            `${PHASE_MARKER}three`,
        ];
        assert.deepEqual(phaseSpans(lines), [
            { band: "band line", line: 2, text: "first body", title: "one" },
            { band: "band line", line: 4, text: "second body", title: "two" },
            { band: "new band", line: 8, text: "", title: "three" },
        ]);
    });

    it("returns no span for lines that open no phase", () => {
        assert.deepEqual(phaseSpans(["just prose", "more prose"]), []);
    });
});
