import "@banes-lab/build-scripts/core/steps/chapter.step.ts";
import { describe, expect, it } from "vitest";
import { registeredSteps } from "@banes-lab/build-scripts/core/registries/step.registry.ts";

describe("the chapters step", () => {
    it("registers as a cached build-only close step that runs after the prune", () => {
        const [step] = registeredSteps();
        expect(step).toMatchObject({
            gives: ["chapters"],
            modes: ["build"],
            name: "chapters",
            needs: ["prune"],
            phase: "close",
        });
        expect(step?.cache?.outputs).toStrictEqual(["methodology", "methodology.wiki"]);
    });
});
