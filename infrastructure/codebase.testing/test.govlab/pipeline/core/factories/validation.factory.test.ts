import { describe, expect, it } from "vitest";
import { scopeFor, stepLabels } from "./stage.fixture.ts";
import { validationStage } from "@govlab/pipeline/core/factories/validation.factory.ts";

describe("validationStage", () => {
    it("adds the application's validators only when the application is in scope", () => {
        const withApp = validationStage(scopeFor(["app"], false));
        const without = validationStage(scopeFor(["content"], false));
        expect(stepLabels(withApp)).toContain("Validate content leaks");
        expect(stepLabels(without)).toStrictEqual(["Validate spelling"]);
    });

    it("checks the spelling of every scoped member without rewriting, and adds no check with no member", () => {
        const [spelling] = validationStage(scopeFor(["content"], false)).steps;
        const run = spelling !== undefined && "run" in spelling ? spelling.run : "";
        expect(run).toContain("word.entrypoint.ts --check --root ");
        expect(run).toContain("--ext .md");
        const unscoped = validationStage(scopeFor([], false));
        expect(stepLabels(unscoped)).toStrictEqual([]);
    });

    it("runs the validators and the document gate on a full run", () => {
        const labels = stepLabels(validationStage(scopeFor([], true)));
        expect(labels).toContain("Validate config");
        expect(labels).toContain("Validate documents");
    });
});
