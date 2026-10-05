import type { CatalogKey, CatalogState, CatalogStep, CatalogWriter } from "#types/catalog.types";
import { duplicateGiver, missingNeed, stepLine, stuckSteps } from "#configuration/strings/catalog.strings";
import { importFolder } from "#core/loaders/folder.loader";
import { performance } from "node:perf_hooks";
import { registeredSteps } from "#core/registries/step.registry";

const STEP_SUFFIX = ".step.ts";

const refuseDuplicateGivers = function refuseDuplicateGivers(steps: readonly CatalogStep[]): void {
    const givers = new Map<CatalogKey, string>();
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

const refuseMissing = function refuseMissing(steps: readonly CatalogStep[]): void {
    const given = new Set(steps.flatMap((step) => step.gives));
    for (const step of steps) {
        const missing = step.needs.find((key) => !given.has(key));
        if (missing !== undefined) {
            throw new Error(missingNeed(step.name, missing));
        }
    }
};

const orderFrom = function orderFrom(
    pending: readonly CatalogStep[],
    available: ReadonlySet<CatalogKey>,
): CatalogStep[] {
    if (pending.length === 0) {
        return [];
    }
    const ready = pending.find((step) => step.needs.every((key) => available.has(key)));
    if (ready === undefined) {
        throw new Error(stuckSteps(pending.map((step) => step.name)));
    }
    return [
        ready,
        ...orderFrom(
            pending.filter((step) => step !== ready),
            new Set([...available, ...ready.gives]),
        ),
    ];
};

export const orderSteps = function orderSteps(steps: readonly CatalogStep[]): CatalogStep[] {
    refuseDuplicateGivers(steps);
    refuseMissing(steps);
    return orderFrom(steps, new Set());
};

export const discoverSteps = async function discoverSteps(): Promise<CatalogStep[]> {
    await importFolder("govlab.quality.steps", STEP_SUFFIX);
    return registeredSteps();
};

export const runSteps = async function runSteps(
    steps: readonly CatalogStep[],
    writer: CatalogWriter,
    write: (line: string) => void,
): Promise<CatalogState> {
    return orderSteps(steps).reduce(async (previous, step) => {
        const state = await previous;
        const started = performance.now();
        const given = await step.run(state, writer);
        write(stepLine(step.name, performance.now() - started));
        return { ...state, ...given };
    }, Promise.resolve<CatalogState>({}));
};
