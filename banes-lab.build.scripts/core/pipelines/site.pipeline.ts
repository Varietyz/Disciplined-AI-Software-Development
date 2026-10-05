import type { CacheDecision, SiteMode, SiteOutcome, SitePhase, SiteState, SiteStep } from "#types/site.types";
import { cacheFile, createFingerprintIndex } from "@govlab/content-fingerprint";
import {
    cachedGive,
    duplicateGiver,
    missingNeed,
    skippedLine,
    stepLine,
    stuckSteps,
    undeclaredGive,
} from "#configuration/strings/site.strings";
import type { FingerprintIndex } from "@govlab/content-fingerprint";
import { absolutePath } from "@ssot/paths";
import { existsSync } from "node:fs";
import { importFolder } from "#core/loaders/folder.loader";
import { performance } from "node:perf_hooks";
import process from "node:process";
import { registeredSteps } from "#core/registries/step.registry";

const STEP_SUFFIX = ".step.ts";
const MEGABYTE = 1_048_576;
const START_PHASE: SitePhase = "start";
const LEDGER_NAME = "site-steps";

type Waves = readonly (readonly SiteStep[])[];

interface Finished {
    readonly milliseconds: number;
    readonly outcome: SiteOutcome;
    readonly step: SiteStep;
}

export const discoverSteps = async function discoverSteps(): Promise<readonly SiteStep[]> {
    await importFolder("app.buildSteps", STEP_SUFFIX);
    return registeredSteps();
};

const refuseDuplicateGivers = function refuseDuplicateGivers(steps: readonly SiteStep[]): void {
    const givers = new Map<string, string>();
    for (const step of steps) {
        for (const key of step.gives) {
            const first = givers.get(key);
            if (first !== undefined) {
                throw new Error(duplicateGiver(key, first, step.name));
            }
            givers.set(key, step.name);
        }
    }
};

const inMode = function inMode(steps: readonly SiteStep[], mode: SiteMode, phase: SitePhase): readonly SiteStep[] {
    return steps.filter((step) => step.phase === phase && step.modes.includes(mode));
};

const refuseMissing = function refuseMissing(steps: readonly SiteStep[], known: ReadonlySet<string>): void {
    const given = new Set([...known, ...steps.flatMap((step) => step.gives)]);
    for (const step of steps) {
        const missing = step.needs.find((key) => !given.has(key));
        if (missing !== undefined) {
            throw new Error(missingNeed(step.name, missing));
        }
    }
};

const wavesFrom = function wavesFrom(pending: readonly SiteStep[], available: ReadonlySet<string>): Waves {
    if (pending.length === 0) {
        return [];
    }
    const ready = pending.filter((step) => step.needs.every((key) => available.has(key)));
    if (ready.length === 0) {
        throw new Error(stuckSteps(pending.map((step) => step.name)));
    }
    const next = new Set([...available, ...ready.flatMap((step) => step.gives)]);
    const wave = ready.toSorted((left, right) => left.name.localeCompare(right.name));
    return [
        wave,
        ...wavesFrom(
            pending.filter((step) => !ready.includes(step)),
            next,
        ),
    ];
};

export const wavesOf = function wavesOf(steps: readonly SiteStep[], phase: SitePhase, mode: SiteMode): Waves {
    refuseDuplicateGivers(steps);
    const earlier = phase === START_PHASE ? [] : inMode(steps, mode, START_PHASE).flatMap((step) => step.gives);
    const known = new Set(earlier);
    const pending = inMode(steps, mode, phase);
    refuseMissing(pending, known);
    return wavesFrom(pending, known);
};

const refuseUndeclared = function refuseUndeclared(step: SiteStep, outcome: SiteOutcome): void {
    const declared = new Set(step.gives);
    const extra = Object.keys(outcome.gives).find((key) => !declared.has(key));
    if (extra !== undefined) {
        throw new Error(undeclaredGive(step.name, extra));
    }
};

const refuseCachedGives = function refuseCachedGives(step: SiteStep, outcome: SiteOutcome): void {
    const given = Object.keys(outcome.gives).at(0);
    if (step.cache !== null && given !== undefined) {
        throw new Error(cachedGive(step.name, given));
    }
};

export const cacheDecision = function cacheDecision(
    step: SiteStep,
    state: SiteState,
    ledger: FingerprintIndex,
): CacheDecision {
    if (step.cache === null) {
        return { key: null, skip: false };
    }
    const key = step.cache.key(state);
    const present = step.cache.outputs.every((output) => existsSync(absolutePath(output)));
    return { key, skip: present && ledger.unchanged(step.name, key) };
};

const finish = async function finish(step: SiteStep, state: SiteState, ledger: FingerprintIndex): Promise<Finished> {
    const started = performance.now();
    const decision = cacheDecision(step, state, ledger);
    if (decision.skip) {
        const skipped = { gives: {}, line: skippedLine(step.name) };
        return { milliseconds: performance.now() - started, outcome: skipped, step };
    }
    const outcome = await step.run(state);
    refuseUndeclared(step, outcome);
    refuseCachedGives(step, outcome);
    if (decision.key !== null) {
        ledger.update(step.name, decision.key);
    }
    return { milliseconds: performance.now() - started, outcome, step };
};

const runWave = async function runWave(
    wave: readonly SiteStep[],
    state: SiteState,
    write: (line: string) => void,
): Promise<SiteState> {
    const ledger = createFingerprintIndex({ file: cacheFile(LEDGER_NAME) });
    const finished = await Promise.all(wave.map(async (step) => finish(step, state, ledger)));
    if (wave.some((step) => step.cache !== null)) {
        ledger.flush();
    }
    finished.forEach((done) => {
        write(done.outcome.line + stepLine(done.step.name, done.milliseconds, process.memoryUsage().rss / MEGABYTE));
    });
    const given = Object.fromEntries(finished.flatMap((done) => Object.entries(done.outcome.gives)));
    return { ...state, ...given };
};

const runWaves = async function runWaves(
    waves: Waves,
    state: SiteState,
    write: (line: string) => void,
): Promise<SiteState> {
    return waves.reduce(async (previous, wave) => runWave(wave, await previous, write), Promise.resolve(state));
};

export const runPhase = async function runPhase(
    steps: readonly SiteStep[],
    phase: SitePhase,
    state: SiteState,
    write: (line: string) => void,
): Promise<SiteState> {
    return runWaves(wavesOf(steps, phase, state.mode), state, write);
};
