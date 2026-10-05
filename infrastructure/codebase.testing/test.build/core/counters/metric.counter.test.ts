import {
    countedGroups,
    countedRules,
    countedSteps,
    gateSteps,
} from "@banes-lab/build-scripts/core/counters/metric.counter.ts";
import { describe, expect, it } from "vitest";

describe("countedGroups", () => {
    it("sums the members each group holds and counts a group without them as none", () => {
        const groups = [{ principles: [1, 2] }, { principles: [3] }, { terms: [4] }];
        expect(countedGroups(groups, (group) => group.principles)).toBe(3);
    });
});

describe("countedSteps and gateSteps", () => {
    it("counts one per step and one per parallel branch, and the gate has steps", () => {
        const stages = [
            {
                label: "a",
                slug: "a",
                steps: [
                    { label: "x", run: "x" },
                    {
                        label: "y",
                        parallel: [
                            { label: "p", run: "p" },
                            { label: "q", run: "q" },
                        ],
                    },
                ],
            },
        ];
        expect(countedSteps(stages)).toBe(3);
        expect(gateSteps()).toBeGreaterThan(0);
    });
});

describe("countedRules", () => {
    it("counts the local rules and the plugin wrappers the index registers", () => {
        expect(countedRules()).toBeGreaterThan(0);
    });
});
