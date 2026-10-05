import { defineStep, registeredSteps } from "@govlab/quality/core/registries/step.registry.ts";
import { expect, test } from "vitest";

const run = async (): Promise<Record<string, never>> => {
    await Promise.resolve();
    return {};
};

test("defineStep registers each step once, and registeredSteps lists them by name", () => {
    defineStep({ gives: [], name: "second", needs: [], run });
    defineStep({ gives: [], name: "first", needs: [], run });
    expect(registeredSteps().map((step) => step.name)).toStrictEqual(["first", "second"]);
    expect(() => defineStep({ gives: [], name: "first", needs: [], run })).toThrow('"first"');
});
