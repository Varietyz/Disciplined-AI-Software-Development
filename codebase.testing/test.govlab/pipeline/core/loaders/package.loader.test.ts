import { describe, expect, it } from "vitest";
import { scopeFor, stepLabels } from "../factories/stage.fixture.ts";
import { selfGovernedSteps } from "@govlab/pipeline/core/loaders/package.loader.ts";
import { validationStage } from "@govlab/pipeline/core/factories/validation.factory.ts";

describe("selfGovernedSteps", () => {
    it("runs each declared script's own command inside its member, with no npm script between", () => {
        const steps = selfGovernedSteps();
        expect(steps.length).toBeGreaterThan(0);
        for (const step of steps) {
            expect(step.cwd).toBeDefined();
            expect(step.run?.startsWith("npm ")).toBe(false);
        }
    });

    it("joins the application's validation steps", () => {
        const labels = stepLabels(validationStage(scopeFor(["app"], false)));
        for (const step of selfGovernedSteps()) {
            expect(labels).toContain(step.label);
        }
    });
});
