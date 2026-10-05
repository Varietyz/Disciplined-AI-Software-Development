import {
    commandFailed,
    duplicateGiver,
    duplicateProducer,
    duplicateStep,
    missingNeed,
    productLine,
    stepLine,
    stuckSteps,
    undeclaredConcept,
    unknownCanonRef,
    unknownProducer,
} from "@govlab/quality/configuration/strings/catalog.strings.ts";
import { describe, expect, it } from "vitest";

const STEP_MILLISECONDS = 12.6;

describe("catalog strings", () => {
    it("name the command, the producer, the step and the key each line reports", () => {
        const lines: [string, string][] = [
            [commandFailed("ruff rule --all", "boom"), "ruff rule --all"],
            [productLine("ruff", "{}"), "ruff"],
            [unknownProducer("nope", "a, b"), '"nope"'],
            [duplicateProducer("ruff"), '"ruff"'],
            [duplicateStep("knob"), '"knob"'],
            [duplicateGiver("rules", "a", "b"), '"rules"'],
            [missingNeed("index", "rules"), '"index"'],
            [stuckSteps(["a", "b"]), "a, b"],
            [undeclaredConcept("ruff", "E501", "ghost"), "ruff:E501"],
            [unknownCanonRef("ref", "ghost"), '"ghost"'],
        ];
        for (const [line, part] of lines) {
            expect(line).toContain(part);
        }
    });

    it("rounds the step time to whole milliseconds", () => {
        expect(stepLine("knob", STEP_MILLISECONDS)).toContain("(13 ms)");
    });
});
