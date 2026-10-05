import { describe, expect, it } from "vitest";
import { createStepStore } from "@govlab/pipeline/core/stores/step.store.ts";

const OUTPUT = { label: "Lint", ok: true, out: "", stage: "linting" };

describe("createStepStore", () => {
    it("returns the collected outputs in the order they arrived", () => {
        const store = createStepStore();
        store.collect(OUTPUT);
        store.collect({ ...OUTPUT, label: "Format" });
        expect(store.outputs().map((entry) => entry.label)).toStrictEqual(["Lint", "Format"]);
    });

    it("keeps each store apart, so two runs never share outputs", () => {
        const first = createStepStore();
        first.collect(OUTPUT);
        expect(createStepStore().outputs()).toStrictEqual([]);
    });
});
