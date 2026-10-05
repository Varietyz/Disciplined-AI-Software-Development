import {
    autoFixStage,
    formatStage,
    lintingStage,
    prepareStage,
    testingStage,
    unusedStage,
} from "@govlab/pipeline/core/factories/stage.factory.ts";
import { describe, expect, it } from "vitest";
import { scopeFor, stepLabels } from "./stage.fixture.ts";

describe("per-member stages", () => {
    it("types, strips, formats and lints each scoped member", () => {
        const scope = scopeFor(["stats"], false);
        expect(stepLabels(prepareStage(scope))).toContain("Typecheck govlab.stats");
        expect(stepLabels(autoFixStage(scope))).toContain("Remove comments govlab.stats");
        expect(stepLabels(formatStage(scope))).toStrictEqual(["Formatting"]);
        expect(stepLabels(lintingStage(scope))).toContain("Lint govlab.stats");
    });

    it("leaves the repo-wide steps to a full run", () => {
        const scoped = scopeFor(["stats"], false);
        const full = scopeFor(["stats"], true);
        const empty = scopeFor([], true);
        expect(unusedStage(scoped).steps).toStrictEqual([]);
        expect(stepLabels(unusedStage(full))).toStrictEqual(["Prune extraneous packages", "Knip"]);
        expect(stepLabels(testingStage(empty))).toStrictEqual(["Test floor"]);
    });
});
