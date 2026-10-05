import { describe, expect, it } from "vitest";
import { scopeFor, stepLabels } from "./stage.fixture.ts";
import { STATS_ENTRYPOINTS } from "@govlab/pipeline/configuration/constants/stage.constants.ts";
import { buildStage } from "@govlab/pipeline/core/factories/build.factory.ts";

describe("buildStage", () => {
    it("builds the site and derives the content only when the application is in scope", () => {
        const withApp = buildStage(scopeFor(["app"], false));
        const without = buildStage(scopeFor(["content"], false));
        expect(stepLabels(withApp)).toContain("Build site");
        expect(stepLabels(without)).toStrictEqual([]);
    });

    it("runs the census from the statistics member's entry points", () => {
        const census = buildStage(scopeFor([], true)).steps.find((step) => step.label === "Generate codebase census");
        expect(census?.run).toContain(STATS_ENTRYPOINTS);
    });
});
