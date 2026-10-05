import {
    CODEMOD_ENTRYPOINTS,
    ESLINT_GLOB,
    LOCKFILE_COMMAND,
    QUALITY_ENTRYPOINTS,
    RULE_ENTRYPOINTS,
    SCRIPT_ENTRYPOINTS,
    TSCONFIG,
    VITEST_COMMAND,
} from "#configuration/constants/stage.constants";
import type { ParallelStep, Stage, StageScope, Step } from "#types/stage.types";
import {
    STAGE_LABELS,
    STEP_LABELS,
    htmlhintLabel,
    lintLabel,
    removeCommentsLabel,
    stylelintLabel,
    typecheckLabel,
} from "#configuration/strings/step.strings";
import { relativePath } from "@ssot/paths";

const shortName = function shortName(target: string): string {
    return target.slice(target.lastIndexOf("/") + 1);
};

const group = function group(label: string, parallel: ParallelStep[]): Step[] {
    return parallel.length > 0 ? [{ label, parallel }] : [];
};

export const prepareStage = function prepareStage(scope: StageScope): Stage {
    return {
        bypass: false,
        label: STAGE_LABELS.prepare,
        slug: "prepare",
        steps: [
            ...scope.wide([
                { label: STEP_LABELS.taxonomy, run: `node ${RULE_ENTRYPOINTS}/taxonomy.entrypoint.ts` },
                { label: STEP_LABELS.validateLockfileIntegrity, run: LOCKFILE_COMMAND },
                {
                    label: STEP_LABELS.validateInstallScripts,
                    run: `node ${SCRIPT_ENTRYPOINTS}/dependency.entrypoint.ts`,
                },
            ]),
            ...group(
                STEP_LABELS.typecheck,
                scope.scoped.map((member) => ({
                    label: typecheckLabel(shortName(member.dir)),
                    run: `npx tsc --noEmit -p ${member.dir}/${TSCONFIG}`,
                })),
            ),
        ],
    };
};

export const unusedStage = function unusedStage(scope: StageScope): Stage {
    return {
        bypass: false,
        label: STAGE_LABELS.unused,
        slug: "unused",
        steps: scope.wide([
            { label: STEP_LABELS.pruneExtraneousPackages, run: "npm prune" },
            { label: STEP_LABELS.knip, run: "npx govlab unused" },
        ]),
    };
};

export const autoFixStage = function autoFixStage(scope: StageScope): Stage {
    const codemod = function codemod(label: string, script: string): ParallelStep {
        return { label, run: `node ${CODEMOD_ENTRYPOINTS}/${script}${scope.codemodScope}` };
    };
    return {
        bypass: false,
        label: STAGE_LABELS.autoFix,
        slug: "auto-fix",
        steps: [
            ...scope.scoped.map((member) => ({
                label: removeCommentsLabel(shortName(member.dir)),
                run: `node ${QUALITY_ENTRYPOINTS}/comment.entrypoint.ts ${member.dir} --ignore ${scope.options.cleanCommentsIgnore}`,
            })),
            ...scope.appOnly([
                { label: STEP_LABELS.syncClosureGraph, run: `node ${SCRIPT_ENTRYPOINTS}/closure.entrypoint.ts` },
            ]),
            ...group(STEP_LABELS.codemods, [
                codemod(STEP_LABELS.bindCallableFields, "binding.entrypoint.ts"),
                codemod(STEP_LABELS.preferCodePoint, "code-point.entrypoint.ts"),
                codemod(STEP_LABELS.compoundIncrements, "increment.entrypoint.ts"),
                codemod(STEP_LABELS.camelCaseConstNames, "identifier.entrypoint.ts"),
                codemod(STEP_LABELS.packageSpecifiers, "specifier.entrypoint.ts"),
                codemod(STEP_LABELS.relativeSpecifiers, "specifier.target.entrypoint.ts"),
                codemod(STEP_LABELS.ownerFileWrites, "sink.entrypoint.ts"),
            ]),
        ],
    };
};

export const formatStage = function formatStage(scope: StageScope): Stage {
    return {
        bypass: false,
        label: STAGE_LABELS.format,
        slug: "format",
        steps: [{ label: STEP_LABELS.formatting, run: `npx govlab format ${scope.scopedDirs.join(" ")}` }],
    };
};

const surfaceSteps = function surfaceSteps(scope: StageScope): ParallelStep[] {
    return [
        ...scope.scoped.flatMap((member) => [
            { label: htmlhintLabel(shortName(member.dir)), run: `npx govlab htmlhint "${member.dir}/**/*.html"` },
            { label: stylelintLabel(shortName(member.dir)), run: `npx govlab stylelint "${member.dir}/**/*.css"` },
        ]),
        ...scope.appOnly([
            {
                label: STEP_LABELS.crossFileQuality,
                run: `node ${QUALITY_ENTRYPOINTS}/validation.entrypoint.ts ${scope.options.qualityRoot}`,
            },
            { label: STEP_LABELS.duplication, run: `npx govlab duplication "${relativePath("app.member")}/**"` },
            { label: STEP_LABELS.locCap, run: `node ${SCRIPT_ENTRYPOINTS}/source.entrypoint.ts` },
            { label: STEP_LABELS.deadCss, run: `node ${SCRIPT_ENTRYPOINTS}/style.entrypoint.ts` },
        ]),
    ];
};

export const lintingStage = function lintingStage(scope: StageScope): Stage {
    return {
        bypass: false,
        label: STAGE_LABELS.linting,
        slug: "linting",
        steps: [
            { label: STEP_LABELS.oxlint, run: `npx govlab oxlint ${scope.scopedDirs.join(" ")}` },
            ...group(
                STEP_LABELS.lintWorkspaces,
                scope.scoped.map((member) => ({
                    label: lintLabel(shortName(member.dir)),
                    run: `npx govlab eslint "${member.dir}/${ESLINT_GLOB}"`,
                })),
            ),
            ...group(STEP_LABELS.lintSurfaces, surfaceSteps(scope)),
        ],
    };
};

export const testingStage = function testingStage(scope: StageScope): Stage {
    const targets = scope.testTargets;
    const tests =
        targets.length > 0 ? [{ label: STEP_LABELS.codebaseTests, run: `${VITEST_COMMAND} ${targets.join(" ")}` }] : [];
    return {
        bypass: false,
        label: STAGE_LABELS.testing,
        slug: "testing",
        steps: [
            ...tests,
            ...scope.wide([{ label: STEP_LABELS.testFloor, run: `node ${SCRIPT_ENTRYPOINTS}/coverage.entrypoint.ts` }]),
        ],
    };
};
