import { describe, it } from "vitest";
import {
    enumeratesVocabulary,
    slotStates,
    slotsIn,
} from "coordination-surface/tools/core/analyzers/binding.analyzer.ts";
import { RESOLUTION_STATES } from "coordination-surface/tools/core/constants/binding.constants.ts";
import assert from "node:assert/strict";

describe("slotsIn", () => {
    it("finds each slot with its line, and skips empty braces and braces holding other characters", () => {
        const source =
            "uses {project.root} and {convention.mode}\n{}\n{not a slot}\n{execution_command}\n{{nested}} {open{inner}";
        assert.deepEqual(slotsIn(source), [
            { line: 1, name: "{project.root}" },
            { line: 1, name: "{convention.mode}" },
            { line: 4, name: "{execution_command}" },
            { line: 5, name: "{nested}" },
            { line: 5, name: "{inner}" },
        ]);
    });
});

describe("slotStates", () => {
    it("binds each slot to the earliest resolution word on its line and keeps the first binding", () => {
        const source =
            "{project.root} RESOLVED, not ABSENT\n{limits.max} DEFERRED\n{project.root} ABSENT\nno word {plain}";
        const states = slotStates(source);
        assert.equal(states.get("{project.root}"), "RESOLVED");
        assert.equal(states.get("{limits.max}"), "DEFERRED");
        assert.equal(states.has("{plain}"), false);
    });

    it("declares exactly the three resolution states a slot can hold", () => {
        assert.deepEqual([...RESOLUTION_STATES], ["RESOLVED", "ABSENT", "DEFERRED"]);
    });
});

describe("enumeratesVocabulary", () => {
    it("recognizes a line that enumerates a vocabulary through a wildcard slot", () => {
        assert.equal(enumeratesVocabulary("{convention.*}"), true);
        assert.equal(enumeratesVocabulary("{convention.mode}"), false);
    });
});
