import { DOMAIN_TIERS, TYPED_TIERS } from "#configuration/constants/algorithm.constants";
import { derivationMapDefectsOf, isKernelContract } from "#core/validators/algorithm.derivation.validator";
import type { Contract } from "#types/algorithm.types";
import type { ReasonNativeIssues } from "#types/validation.types";

interface NativeReasonFaces {
    algo: { all: () => readonly Contract[]; get: (id: string) => unknown };
    reason: {
        axis: (id: string) => unknown;
        derivationLoop: () => { stages: { axis: string; id: string }[] };
        mathType: (id: string) => { yieldsShape: string } | null;
    };
}

type NativeIssues = Omit<ReasonNativeIssues, "subtotal">;

const DERIVATION_LOOP_GROUND = "reasoning:derivation-loop";
const KERNEL_SUFFIX = "-kernel";
const SHAPE_SEPARATOR = "|";

const byName = function byName(a: string, b: string): number {
    return a.localeCompare(b);
};

const groundsDerivationLoop = function groundsDerivationLoop(contract: Contract): boolean {
    return (contract.grounds ?? []).includes(DERIVATION_LOOP_GROUND);
};

const duplicateLoopGroundingsOf = function duplicateLoopGroundingsOf(
    contracts: readonly Contract[],
): NativeIssues["duplicateLoopGroundings"] {
    const byDomain = new Map<string, string[]>();
    for (const contract of contracts.filter(groundsDerivationLoop)) {
        byDomain.set(contract.domain, [...(byDomain.get(contract.domain) ?? []), contract.id]);
    }
    return [...byDomain]
        .filter(([, records]) => records.length > 1)
        .map(([domain, records]) => ({ domain, records: records.toSorted(byName) }))
        .toSorted((left, right) => left.domain.localeCompare(right.domain));
};

const tokenizeShape = function tokenizeShape(value: string): Set<string> {
    return new Set(
        value
            .split(SHAPE_SEPARATOR)
            .map((part) => part.trim())
            .filter((token) => token.length > 0),
    );
};

const stageAxisMap = function stageAxisMap(faces: NativeReasonFaces): Map<string, string> {
    return new Map(faces.reason.derivationLoop().stages.map((stage) => [stage.id, stage.axis]));
};

const stageAxisMismatchOf = function stageAxisMismatchOf(
    contract: Contract,
    stages: Map<string, string>,
): NativeIssues["stageAxisMismatches"] {
    if (typeof contract.stage !== "string" || !stages.has(contract.stage) || typeof contract.axis !== "string") {
        return [];
    }
    const expected = stages.get(contract.stage) ?? "";
    return contract.axis === expected
        ? []
        : [{ axis: contract.axis, expected, id: contract.id, stage: contract.stage }];
};

const yieldsShapeMismatchOf = function yieldsShapeMismatchOf(
    contract: Contract,
    faces: NativeReasonFaces,
): NativeIssues["yieldsShapeMismatches"] {
    const mathType = faces.reason.mathType(contract.mathType ?? "");
    if (mathType === null || typeof contract.yields !== "string") {
        return [];
    }
    const allowed = tokenizeShape(mathType.yieldsShape);
    return [...tokenizeShape(contract.yields)].some((token) => !allowed.has(token))
        ? [
              {
                  allowed: mathType.yieldsShape,
                  id: contract.id,
                  mathType: contract.mathType ?? "",
                  yields: contract.yields,
              },
          ]
        : [];
};

const isUntyped = function isUntyped(contract: Contract): boolean {
    return (
        contract.meta !== true &&
        TYPED_TIERS.has(contract.tier) &&
        (typeof contract.mathType !== "string" || typeof contract.yields !== "string")
    );
};

const lacksStageOrAxis = function lacksStageOrAxis(contract: Contract): boolean {
    return typeof contract.stage !== "string" || typeof contract.axis !== "string";
};

const isStagedProcess = function isStagedProcess(contract: Contract): boolean {
    return contract.meta !== true && contract.tier === DOMAIN_TIERS.process && !isKernelContract(contract);
};

const isUnstaged = function isUnstaged(contract: Contract): boolean {
    return isStagedProcess(contract) && lacksStageOrAxis(contract);
};

const idsWhere = function idsWhere(
    contracts: readonly Contract[],
    predicate: (contract: Contract) => boolean,
): string[] {
    return contracts
        .filter(predicate)
        .map((contract) => contract.id)
        .toSorted(byName);
};

const gatherReasonNative = function gatherReasonNative(
    contracts: readonly Contract[],
    stages: Map<string, string>,
    faces: NativeReasonFaces,
): NativeIssues {
    return {
        derivationMapDefects: derivationMapDefectsOf(contracts, stages, faces),
        duplicateLoopGroundings: duplicateLoopGroundingsOf(contracts),
        invalidAxes: contracts.flatMap((c) =>
            typeof c.axis === "string" && faces.reason.axis(c.axis) === null ? [{ axis: c.axis, id: c.id }] : [],
        ),
        invalidMathTypes: contracts.flatMap((c) =>
            typeof c.mathType === "string" && faces.reason.mathType(c.mathType) === null
                ? [{ id: c.id, mathType: c.mathType }]
                : [],
        ),
        invalidStages: contracts.flatMap((c) =>
            typeof c.stage === "string" && !stages.has(c.stage) ? [{ id: c.id, stage: c.stage }] : [],
        ),
        metaKernelNaming: idsWhere(
            contracts,
            (contract) => contract.meta === true && contract.id.endsWith(KERNEL_SUFFIX),
        ),
        metaLoopGroundings: idsWhere(
            contracts,
            (contract) => contract.meta === true && groundsDerivationLoop(contract),
        ),
        stageAxisMismatches: contracts.flatMap((c) => stageAxisMismatchOf(c, stages)),
        unstagedProcessRecords: idsWhere(contracts, isUnstaged),
        untypedRecords: idsWhere(contracts, isUntyped),
        yieldsShapeMismatches: contracts.flatMap((c) => yieldsShapeMismatchOf(c, faces)),
    };
};

export const reasonNativeIssuesOf = function reasonNativeIssuesOf(faces: NativeReasonFaces): ReasonNativeIssues {
    const issues = gatherReasonNative(faces.algo.all(), stageAxisMap(faces), faces);
    const subtotal = Object.values(issues).reduce((sum, list) => sum + list.length, 0);
    return { ...issues, subtotal };
};
