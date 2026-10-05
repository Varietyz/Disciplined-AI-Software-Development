import type { Contract, DerivationMapEntry } from "#types/algorithm.types";
import {
    derivationSelfMapped,
    derivationUnknownRecord,
    derivationUnknownStage,
    derivationUnstaged,
} from "#configuration/strings/algorithm.strings";

interface DerivationFaces {
    algo: { get: (id: string) => unknown };
}

interface MapCheck {
    stages: ReadonlyMap<string, string>;
    faces: DerivationFaces;
    contractId: string;
}

const MANDATORY_STAGES = ["verify"];

const entryDefect = function entryDefect(entry: DerivationMapEntry, check: MapCheck): string | null {
    if (!check.stages.has(entry.stage)) {
        return derivationUnknownStage(entry.stage);
    }
    if (entry.record === check.contractId) {
        return derivationSelfMapped(entry.stage);
    }
    return check.faces.algo.get(entry.record) === null ? derivationUnknownRecord(entry.record) : null;
};

const derivationMapDefect = function derivationMapDefect(
    contract: Contract,
    stages: ReadonlyMap<string, string>,
    faces: DerivationFaces,
): string | null {
    const map = contract.derivationMap ?? [];
    if (map.length === 0) {
        return null;
    }
    const check: MapCheck = { contractId: contract.id, faces, stages };
    const first = map.map((entry) => entryDefect(entry, check)).find((defect) => defect !== null);
    if (first !== undefined) {
        return first;
    }
    const covered = new Set(map.map((entry) => entry.stage));
    const missing = MANDATORY_STAGES.filter((stage) => !covered.has(stage));
    return missing.length > 0 ? derivationUnstaged(missing) : null;
};

export const isKernelContract = function isKernelContract(contract: Contract): boolean {
    return Array.isArray(contract.derivationMap) && contract.derivationMap.length > 0;
};

export const derivationMapDefectsOf = function derivationMapDefectsOf(
    contracts: readonly Contract[],
    stages: ReadonlyMap<string, string>,
    faces: DerivationFaces,
): { id: string; reason: string }[] {
    return contracts.flatMap((contract) => {
        const defect = derivationMapDefect(contract, stages, faces);
        return defect === null ? [] : [{ id: contract.id, reason: defect }];
    });
};
