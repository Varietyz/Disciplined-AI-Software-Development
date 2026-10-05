import {
    BUILD_ENTRYPOINTS,
    CODEMOD_ENTRYPOINTS,
    CODEMOD_VALIDATORS,
    CONTENT_ENTRYPOINTS,
    CONTEXT_ENTRYPOINTS,
    DOCS_ENTRYPOINTS,
    DOCUMENT_SPELLING_ROOTS,
    PATTERNS_ENTRYPOINTS,
    QUALITY_ENTRYPOINTS,
    RULE_ENTRYPOINTS,
    SCRIPT_ENTRYPOINTS,
    SOCIAL_ENTRYPOINTS,
    SPELLING_EXTENSIONS,
} from "#configuration/constants/stage.constants";
import type { ParallelStep, Stage, StageScope, Step } from "#types/stage.types";
import { STAGE_LABELS, STEP_LABELS } from "#configuration/strings/step.strings";
import { selfGovernedSteps } from "#core/loaders/package.loader";

const built = function built(label: string, run: string): Step {
    return { label, run, tags: ["build"] };
};

const appSteps = function appSteps(): Step[] {
    return [
        built(STEP_LABELS.validateDiscovery, `node ${BUILD_ENTRYPOINTS}/validation.entrypoint.ts`),
        { label: STEP_LABELS.validateTransport, run: `node ${SCRIPT_ENTRYPOINTS}/server.entrypoint.ts` },
        { label: STEP_LABELS.validateServerConfiguration, run: `node ${SCRIPT_ENTRYPOINTS}/nginx.entrypoint.ts` },
        built(STEP_LABELS.validateContentLeaks, `node ${CONTENT_ENTRYPOINTS}/leak.entrypoint.ts`),
        built(STEP_LABELS.validateContentGraph, `node ${CONTENT_ENTRYPOINTS}/coverage.entrypoint.ts`),
        {
            label: STEP_LABELS.validateCoordinationPackage,
            run: `node ${CONTENT_ENTRYPOINTS}/coordination.entrypoint.ts`,
        },
        { label: STEP_LABELS.validateTemplateReferences, run: `node ${CONTENT_ENTRYPOINTS}/template.entrypoint.ts` },
        ...selfGovernedSteps(),
        built(STEP_LABELS.validateReadingSignOffs, `node ${CONTENT_ENTRYPOINTS}/writing.entrypoint.ts`),
        built(STEP_LABELS.validateSocialCards, `node ${SOCIAL_ENTRYPOINTS}/validation.entrypoint.ts`),
    ];
};

const validatorSteps = function validatorSteps(hexIgnore: string): ParallelStep[] {
    return [
        { label: STEP_LABELS.validateTypescriptUse, run: `node ${QUALITY_ENTRYPOINTS}/source.entrypoint.ts` },
        { label: STEP_LABELS.validateEsnextUsage, run: `node ${QUALITY_ENTRYPOINTS}/target.entrypoint.ts` },
        { label: STEP_LABELS.validateConfig, run: `node ${QUALITY_ENTRYPOINTS}/config.entrypoint.ts` },
        { label: STEP_LABELS.validateCredentials, run: `node ${SCRIPT_ENTRYPOINTS}/credential.entrypoint.ts` },
        { label: STEP_LABELS.validatePathReferences, run: `node ${CODEMOD_VALIDATORS}/reference.validator.ts` },
        { label: STEP_LABELS.validateFieldReach, run: `node ${CODEMOD_VALIDATORS}/field.validator.ts` },
        { label: STEP_LABELS.validateClosedValues, run: `node ${CODEMOD_VALIDATORS}/field.vocabulary.validator.ts` },
        { label: STEP_LABELS.validateWritingCanon, run: `node ${RULE_ENTRYPOINTS}/writing.entrypoint.ts --check` },
        { label: STEP_LABELS.validateRuleDerivation, run: `node ${QUALITY_ENTRYPOINTS}/rule.entrypoint.ts` },
        { label: STEP_LABELS.validateRuleManifests, run: `node ${QUALITY_ENTRYPOINTS}/manifest.entrypoint.ts` },
        { label: STEP_LABELS.validateInstallRegistry, run: `node ${QUALITY_ENTRYPOINTS}/dependency.entrypoint.ts` },
        { label: STEP_LABELS.validatePolyglotCoverage, run: `node ${QUALITY_ENTRYPOINTS}/coverage.entrypoint.ts` },
        { label: STEP_LABELS.validateCanonVocabulary, run: `node ${QUALITY_ENTRYPOINTS}/canon.entrypoint.ts --strict` },
        {
            label: STEP_LABELS.validateOntologyResolution,
            run: `node ${CONTEXT_ENTRYPOINTS}/ontology.entrypoint.ts --strict`,
        },
        { label: STEP_LABELS.validatePagDocuments, run: `node ${CONTEXT_ENTRYPOINTS}/grammar.entrypoint.ts --strict` },
        {
            label: STEP_LABELS.validateSvg,
            run: `node ${PATTERNS_ENTRYPOINTS}/report.entrypoint.ts --all --check --ignore ${hexIgnore}`,
        },
    ];
};

const spellingStep = function spellingStep(label: string, dirs: readonly string[]): Step {
    const roots = dirs.map((dir) => `--root ${dir}`);
    const extensions = SPELLING_EXTENSIONS.map((extension) => `--ext ${extension}`);
    return {
        label,
        run: [`node ${CODEMOD_ENTRYPOINTS}/word.entrypoint.ts --check`, ...roots, ...extensions].join(" "),
    };
};

const spellingSteps = function spellingSteps(dirs: readonly string[]): Step[] {
    return dirs.length === 0 ? [] : [spellingStep(STEP_LABELS.validateSpelling, dirs)];
};

export const validationStage = function validationStage(scope: StageScope): Stage {
    return {
        bypass: false,
        label: STAGE_LABELS.validation,
        slug: "validation",
        steps: [
            ...spellingSteps(scope.scopedDirs),
            ...scope.appOnly(appSteps()),
            ...scope.wide([
                spellingStep(STEP_LABELS.validateDocumentSpelling, DOCUMENT_SPELLING_ROOTS),
                { label: STEP_LABELS.validators, parallel: validatorSteps(scope.options.hexIgnore) },
                {
                    label: STEP_LABELS.validateDocuments,
                    run: `node ${DOCS_ENTRYPOINTS}/invocation.entrypoint.ts --validate`,
                    tags: ["docs"],
                },
            ]),
        ],
    };
};
