import {
    ambiguousPrinciple,
    conflictingPrinciples,
    hardcodedCount,
    historySmell,
    unresolvedConcept,
    unresolvedPrinciple,
} from "@govlab/docs/configuration/strings/governance.strings.ts";
import { describe, expect, it } from "vitest";
import { hookLabel } from "@govlab/docs/configuration/strings/graph.strings.ts";
import { unmatched } from "./strings.fixture.ts";

describe("the governance and graph strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [historySmell("formerly"), '"formerly"'],
                [hardcodedCount("42"), '"42"'],
                [unresolvedPrinciple("ghost"), '"ghost"'],
                [conflictingPrinciples("alpha", "beta"), '"alpha" conflicts_with also-declared "beta"'],
                [ambiguousPrinciple("same"), '"same"'],
                [unresolvedConcept("csp"), '"csp"'],
                [hookLabel("close"), "hook close"],
            ]),
        ).toStrictEqual([]);
    });
});
