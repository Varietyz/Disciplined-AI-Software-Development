import {
    CONTENT_ENTRYPOINTS,
    DOCS_ENTRYPOINTS,
    QUALITY_ENTRYPOINTS,
    STATS_ENTRYPOINTS,
} from "#configuration/constants/stage.constants";
import { STAGE_LABELS, STEP_LABELS } from "#configuration/strings/step.strings";
import type { Stage, StageScope, Step } from "#types/stage.types";
import { relativePath } from "@ssot/paths";

const derive = function derive(label: string, script: string): Step {
    return { label, run: `node ${CONTENT_ENTRYPOINTS}/${script}`, tags: ["generate"] };
};

const generate = function generate(label: string, run: string): Step {
    return { label, run, tags: ["generate"] };
};

export const buildStage = function buildStage(scope: StageScope): Stage {
    return {
        bypass: false,
        label: STAGE_LABELS.build,
        slug: "build",
        steps: [
            ...scope.appOnly([
                {
                    label: STEP_LABELS.buildSite,
                    run: `npx vite build --config ${relativePath("app.member")}/vite.config.ts`,
                    tags: ["build"],
                },
            ]),
            ...scope.wide([
                generate(STEP_LABELS.generateQualityCatalog, `node ${QUALITY_ENTRYPOINTS}/catalog.entrypoint.ts`),
                generate(STEP_LABELS.generateCodebaseCensus, `node ${STATS_ENTRYPOINTS}/metric.entrypoint.ts`),
                {
                    label: STEP_LABELS.generateDocuments,
                    run: `node ${DOCS_ENTRYPOINTS}/invocation.entrypoint.ts --generate`,
                    tags: ["docs", "generate"],
                },
            ]),
            ...scope.appOnly([
                derive(STEP_LABELS.deriveRuleInventory, "inventory.entrypoint.ts"),
                derive(STEP_LABELS.deriveLessonSeeds, "seed.entrypoint.ts"),
                derive(STEP_LABELS.deriveToneBaseline, "tone.entrypoint.ts"),
                derive(STEP_LABELS.deriveLeakSet, "leak.entrypoint.ts --derive"),
            ]),
        ],
    };
};
