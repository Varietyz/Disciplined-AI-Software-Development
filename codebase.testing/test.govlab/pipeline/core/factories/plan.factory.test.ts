import { describe, expect, it } from "vitest";
import { MEMBERS } from "@govlab/pipeline/configuration/configs/package.config.ts";
import type { StageOptions } from "@govlab/pipeline/types/stage.types.ts";
import { stageLabels } from "@govlab/pipeline/core/converters/stage.converter.ts";
import { stagesFor } from "@govlab/pipeline/core/factories/plan.factory.ts";

const optionsFor = function optionsFor(...members: string[]): StageOptions {
    return { cleanCommentsIgnore: "", hexIgnore: "", qualityRoot: "", scope: new Set(members) };
};

describe("MEMBERS", () => {
    it("gives every member a distinct id", () => {
        const ids = MEMBERS.map((member) => member.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe("stagesFor", () => {
    it("ranges a full run over the gated members only and skips no wide step", () => {
        const plan = stagesFor(optionsFor());
        const labels = stageLabels(plan);
        for (const member of MEMBERS) {
            expect(labels.some((label) => label.endsWith(member.dir.slice(member.dir.lastIndexOf("/") + 1)))).toBe(
                member.gated,
            );
        }
        expect(plan.skippedWide).toHaveLength(0);
    });

    it("narrows a scoped run to the named members and names every wide step it skipped", () => {
        const plan = stagesFor(optionsFor("pipeline"));
        const labels = stageLabels(plan);
        expect(labels).toContain("Typecheck govlab.pipeline");
        expect(labels).not.toContain("Knip");
        expect(plan.skippedWide).toContain("Knip");
        expect(plan.skippedWide).toContain("Validate documents");
    });

    it("drops a stage left with no steps", () => {
        const slugs = stagesFor(optionsFor("paths")).stages.map((stage) => stage.slug);
        expect(slugs).not.toContain("unused");
        expect(slugs).toContain("linting");
    });

    it("keeps the stage order the gate runs in", () => {
        expect(stagesFor(optionsFor()).stages.map((stage) => stage.slug)).toStrictEqual([
            "prepare",
            "unused",
            "auto-fix",
            "format",
            "linting",
            "testing",
            "build",
            "validation",
        ]);
    });
});
