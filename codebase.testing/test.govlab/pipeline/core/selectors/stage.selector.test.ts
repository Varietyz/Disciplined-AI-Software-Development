import type { Stage, StageArgs } from "@govlab/pipeline/types/stage.types.ts";
import { argErrorsOf, isActive, selectSteps } from "@govlab/pipeline/core/selectors/stage.selector.ts";
import { describe, expect, it } from "vitest";

const args = function args(over: Partial<StageArgs> = {}): StageArgs {
    return {
        bypass: new Set(),
        members: new Set(),
        only: new Set(),
        report: false,
        run: new Set(),
        skipTags: new Set(),
        tags: new Set(),
        ...over,
    };
};

const DEFAULTS = args();
const BYPASS_LINTING = args({ bypass: new Set(["linting"]) });
const BYPASS_TYPO = args({ bypass: new Set(["lintnig"]) });
const RUN_LINTING = args({ run: new Set(["linting"]) });
const ONLY_STYLELINT = args({ only: new Set(["stylelint"]) });
const TAG_DOCS = args({ tags: new Set(["docs"]) });
const SKIP_DOCS = args({ skipTags: new Set(["docs"]) });

const LINTING: Stage = {
    label: "Linting",
    slug: "linting",
    steps: [
        { label: "oxlint", run: "oxlint", tags: ["lint"] },
        {
            label: "Lint surfaces",
            parallel: [
                { label: "HTMLHint web", run: "htmlhint" },
                { label: "Stylelint web", run: "stylelint" },
            ],
        },
        { label: "Validate documents", run: "docs", tags: ["docs"] },
    ],
};

const labelsUnder = function labelsUnder(selection: StageArgs): (string | undefined)[] {
    return selectSteps(LINTING, selection).steps.map((step) => step.label);
};

describe("isActive", () => {
    it("runs a stage by default and skips a bypassed one", () => {
        expect(isActive(LINTING, DEFAULTS)).toBe(true);
        expect(isActive(LINTING, BYPASS_LINTING)).toBe(false);
    });

    it("runs a stage that is bypassed by default only when named", () => {
        const optional = { ...LINTING, bypass: true };
        expect(isActive(optional, DEFAULTS)).toBe(false);
        expect(isActive(optional, RUN_LINTING)).toBe(true);
    });
});

describe("argErrorsOf", () => {
    it("names the unknown slug and the known ones", () => {
        expect(argErrorsOf("probe", [LINTING], BYPASS_TYPO)).toStrictEqual([
            "probe: unknown stage slug lintnig. Known slugs: linting.",
        ]);
    });

    it("reports nothing when every slug is known", () => {
        expect(argErrorsOf("probe", [LINTING], RUN_LINTING)).toStrictEqual([]);
    });
});

describe("selectSteps", () => {
    it("keeps only the steps whose label or member label contains a requested word", () => {
        expect(selectSteps(LINTING, ONLY_STYLELINT).steps).toStrictEqual([
            { label: "Lint surfaces", parallel: [{ label: "Stylelint web", run: "stylelint" }] },
        ]);
    });

    it("keeps only tagged steps under a tag filter and drops skipped tags", () => {
        expect(labelsUnder(TAG_DOCS)).toStrictEqual(["Validate documents"]);
        expect(labelsUnder(SKIP_DOCS)).toStrictEqual(["oxlint", "Lint surfaces"]);
    });
});
