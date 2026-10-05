import { describe, expect, it } from "vitest";
import { labelsOf, planUnits, stageLabels, stepCount } from "@govlab/pipeline/core/converters/stage.converter.ts";
import type { Stage } from "@govlab/pipeline/types/stage.types.ts";

const stage = function stage(slug: string, steps: Stage["steps"]): Stage {
    return { label: slug, slug, steps };
};

const GROUP = {
    label: "group",
    parallel: [
        { label: "a", run: "echo a" },
        { label: "b", run: "echo b" },
    ],
};

describe("stepCount", () => {
    it("counts a single command as one step", () => {
        expect(stepCount({ label: "one", run: "echo" })).toBe(1);
    });

    it("counts a parallel group by its members, so the run total reflects the work done", () => {
        expect(stepCount(GROUP)).toBe(2);
    });
});

describe("labelsOf", () => {
    it("names a parallel group by its members and a single step by its own label", () => {
        expect(labelsOf(GROUP)).toStrictEqual(["a", "b"]);
        expect(labelsOf({ label: "one", run: "echo" })).toStrictEqual(["one"]);
    });
});

describe("planUnits", () => {
    it("numbers units consecutively across stages", () => {
        const units = planUnits([
            stage("prepare", [{ label: "a", run: "echo a" }]),
            stage("linting", [{ label: "b", run: "echo b" }]),
        ]);
        expect(units.map((unit) => [unit.from, unit.to])).toStrictEqual([
            [1, 1],
            [2, 2],
        ]);
    });

    it("widens a parallel group's range to cover every member", () => {
        const units = planUnits([stage("linting", [GROUP, { label: "after", run: "echo after" }])]);
        expect(units.map((unit) => [unit.from, unit.to])).toStrictEqual([
            [1, 2],
            [3, 3],
        ]);
    });

    it("marks only the first step of each stage, so the heading prints once per stage", () => {
        const units = planUnits([
            stage("prepare", [
                { label: "a", run: "echo a" },
                { label: "b", run: "echo b" },
            ]),
            stage("linting", [{ label: "c", run: "echo c" }]),
        ]);
        expect(units.map((unit) => unit.firstInStage)).toStrictEqual([true, false, true]);
    });

    it("plans nothing for an empty stage list", () => {
        expect(planUnits([])).toStrictEqual([]);
    });
});

describe("stageLabels", () => {
    it("lists each stage label and slug before its step labels, with parallel groups flattened", () => {
        const labels = stageLabels({ skippedWide: [], stages: [stage("prepare", [GROUP, { run: "echo" }])] });
        expect(labels).toStrictEqual(["prepare", "prepare", "a", "b"]);
    });
});
