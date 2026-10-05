import { describe, expect, it } from "vitest";
import { registerStep, registeredSteps } from "@banes-lab/build-scripts/core/registries/step.registry.ts";
import { defineStep } from "@banes-lab/build-scripts/core/factories/step.factory.ts";

const run = async function run(): Promise<{ gives: object; line: string }> {
    await Promise.resolve();
    return { gives: {}, line: "" };
};

describe("defineStep and the step registry", () => {
    it("gives a step its own name as its result, every mode and no needs by default, and registers it", () => {
        const defined = defineStep({ cache: null, name: "probe-defaults", phase: "start", run });
        expect(defined).toMatchObject({ cache: null, gives: ["probe-defaults"], modes: ["build", "serve"], needs: [] });
        expect(registeredSteps()).toContain(defined);
    });

    it("keeps the cache a step declares", () => {
        const cache = { key: () => "k", outputs: ["methodology"] };
        expect(defineStep({ cache, name: "probe-cached", phase: "close", run }).cache).toBe(cache);
    });

    it("refuses a second step with a name already registered", () => {
        const once = defineStep({ cache: null, name: "probe-once", phase: "close", run });
        expect(() => defineStep({ cache: null, name: "probe-once", phase: "close", run })).toThrow("probe-once");
        expect(() => {
            registerStep(once);
        }).toThrow("probe-once");
    });
});
