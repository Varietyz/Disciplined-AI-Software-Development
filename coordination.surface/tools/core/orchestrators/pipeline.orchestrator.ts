import type { RuleRun, RunOptions, RunResult } from "../types/pipeline.types.ts";
import type { StepOptions, StepOutcome } from "../types/rule.types.ts";
import { existsSync, statSync } from "node:fs";
import { selectedRules, walkRule } from "../coordinators/rule.coordinator.ts";
import { cleanStage } from "../steps/source.step.ts";
import { discoverRules } from "../registries/rule.registry.ts";
import { gateStage } from "../steps/gate.step.ts";
import { loadTaxonomy } from "../resolvers/taxonomy.resolver.ts";
import { qualityStage } from "../steps/quality.step.ts";
import { readSource } from "../iterators/file.iterator.ts";
import { resolve } from "node:path";
import { resolveScope } from "../resolvers/scope.resolver.ts";
import { snapshotStage } from "../steps/snapshot.step.ts";
import { typecheckStage } from "../steps/typecheck.step.ts";

const WHOLE_SCOPE = "whole";

const withinDeclaredScope = function withinDeclaredScope(
    path: string,
    scope: string,
    handed: readonly string[],
): boolean {
    if (scope === WHOLE_SCOPE) {
        return true;
    }
    return handed.includes(path);
};

const narrowingsOf = function narrowingsOf(options: RunOptions): string[] {
    return [
        options.scope === null ? null : `path=${options.scope}`,
        options.ruleId === null ? null : `rule=${options.ruleId}`,
        options.stage === null ? null : `stage=${options.stage}`,
        options.bypass.length > 0 ? `bypassed=${options.bypass.join("+")}` : null,
    ].filter((entry): entry is string => entry !== null);
};

const stampOf = function stampOf(absolute: string): number {
    return existsSync(absolute) ? statSync(absolute).mtimeMs : 0;
};

const createReader = function createReader(
    repoRoot: string,
    paths: readonly string[],
): { read: (path: string) => string; stamps: Map<string, number> } {
    const cache = new Map<string, string>();
    const stamps = new Map<string, number>();

    const read = (path: string): string => {
        const hit = cache.get(path);
        if (hit !== undefined) {
            return hit;
        }

        const absolute = resolve(repoRoot, path);
        const source = readSource(absolute);
        cache.set(path, source);
        stamps.set(path, stampOf(absolute));
        return source;
    };

    for (const path of paths) {
        stamps.set(path, stampOf(resolve(repoRoot, path)));
    }

    return { read, stamps };
};

const runSteps = function runSteps(
    steps: readonly ((options: StepOptions) => StepOutcome)[],
    stepOptions: StepOptions,
    paths: readonly string[],
): StepOutcome[] {
    return [...steps.map((step) => step(stepOptions)), snapshotStage(stepOptions, paths)];
};

const movements = function movements(
    repoRoot: string,
    stamps: ReadonlyMap<string, number>,
    written: readonly string[],
): { moved: string[]; movedByThisRun: string[] } {
    const changed = [...stamps]
        .filter(([path, stamp]) => stampOf(resolve(repoRoot, path)) !== stamp)
        .map(([path]) => path);
    return {
        moved: changed.filter((path) => !written.includes(path)),
        movedByThisRun: changed.filter((path) => written.includes(path)),
    };
};

const unresolvedRun = function unresolvedRun(
    authoritative: boolean,
    registered: number,
    scope: string,
    unresolvedScope: string,
): RunResult {
    return {
        authoritative,
        bypassedAny: false,
        escaped: [],
        findings: [],
        incomparable: [],
        moved: [],
        movedByThisRun: [],
        registered,
        scanned: 0,
        scope,
        stages: [],
        unfulfilled: [],
        unresolvedScope,
        written: [],
    };
};

export const runPipeline = async function runPipeline(options: RunOptions): Promise<RunResult> {
    const narrowings = narrowingsOf(options);
    const scope = narrowings.length === 0 ? WHOLE_SCOPE : narrowings.join(" · ");
    const authoritative = narrowings.length === 0;

    const taxonomy = loadTaxonomy();
    const registry = await discoverRules(options.repoRoot);
    const { byJurisdiction } = resolveScope(options.repoRoot, taxonomy, options.scope);
    const paths = byJurisdiction.all;

    if (options.scope !== null && paths.length === 0) {
        return unresolvedRun(authoritative, registry.rules.length, scope, options.scope);
    }

    const { read, stamps } = createReader(options.repoRoot, paths);
    const stepOptions = {
        authoritative,
        bypass: options.bypass,
        fix: options.fix,
        repoRoot: options.repoRoot,
        scanned: paths.length,
        scope,
    };

    const whole = options.ruleId === null && options.stage === null;
    const steps = whole ? [cleanStage, typecheckStage, qualityStage, gateStage] : [cleanStage];
    const outcomes = runSteps(steps, stepOptions, paths);

    const run: RuleRun = { authoritative, byJurisdiction, options, read, scope, taxonomy };
    const walked = selectedRules(registry.rules, options).map(({ registered, stage }) =>
        walkRule(registered, stage, run),
    );

    const written = walked.flatMap((outcome) => outcome.written);
    const { moved, movedByThisRun } = movements(options.repoRoot, stamps, written);

    return {
        authoritative,
        bypassedAny: outcomes.some((outcome) => outcome.stage.bypassed) || walked.some((outcome) => outcome.bypassed),
        escaped: written.filter((path) => !withinDeclaredScope(path, scope, paths)),
        findings: [
            ...registry.findings,
            ...outcomes.flatMap((outcome) => outcome.findings),
            ...walked.flatMap((outcome) => outcome.findings),
        ],
        incomparable: walked.filter((outcome) => outcome.incomparable).map((outcome) => outcome.stage.rule),
        moved,
        movedByThisRun,
        registered: registry.rules.length,
        scanned: paths.length,
        scope,
        stages: [...outcomes.map((outcome) => outcome.stage), ...walked.map((outcome) => outcome.stage)],
        unfulfilled: written.filter((path) => stamps.has(path) && !movedByThisRun.includes(path)),
        written,
    };
};
