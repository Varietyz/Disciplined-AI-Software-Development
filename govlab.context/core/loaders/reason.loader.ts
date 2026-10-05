import { CHECK_KEY, RECORDS_KEY } from "#configuration/constants/ontology.constants";
import {
    aliased,
    normalizeAxis,
    normalizeDerivationLoop,
    normalizeDimension,
    normalizeEdge,
    normalizeLayer,
    normalizeLens,
    normalizeMaps,
    normalizeMathDomain,
    normalizeMathType,
    normalizeMode,
    normalizeModel,
    normalizeNode,
    normalizePatternType,
    normalizeRepresentation,
    normalizeSubstrate,
    normalizeUniversalAxis,
    refused,
} from "#core/normalizers/reason.normalizer";
import {
    normalizeFailureShape,
    normalizeInvariant,
    normalizeTechnique,
    normalizeTestSurface,
} from "#core/normalizers/reason.surface.normalizer";
import type { CheckTable } from "#core/stores/check.store";
import { REASON_FILES } from "#configuration/constants/reason.constants";
import type { ReadAudit } from "#core/observers/record.observer";
import type { ReasonData } from "#types/reason.types";
import { absolutePath } from "@ssot/paths";
import { isObject } from "#core/predicates/record.predicate";
import { join } from "node:path";
import { readJsonFile } from "#core/loaders/ontology.loader";

interface ReasonLoad {
    audit: ReadAudit;
    checks: CheckTable;
    dir: string;
}

const readObject = function readObject(load: ReasonLoad, file: string): Record<string, unknown> {
    const parsed = readJsonFile(join(load.dir, file));
    if (isObject(parsed)) {
        return load.audit.track(parsed, file);
    }
    load.audit.reject(parsed, file);
    return {};
};

const declaredObject = function declaredObject(
    load: ReasonLoad,
    file: string,
    kinds: readonly string[],
): Record<string, unknown> {
    const object = readObject(load, file);
    for (const kind of kinds) {
        load.checks.forKind(kind, object[CHECK_KEY]);
    }
    return object;
};

const recordsOf = function recordsOf<T extends { aliases?: string[]; id: string }>(
    load: ReasonLoad,
    kind: string,
    file: string,
    normalize: (raw: Record<string, unknown>) => T,
): T[] {
    const checked = aliased(kind, normalize);
    return load.audit.records(declaredObject(load, file, [kind])[RECORDS_KEY], file).map((raw) => {
        const record = checked(raw);
        load.checks.forRecord(kind, record.id, raw[CHECK_KEY]);
        return record;
    });
};

export const loadBundledData = function loadBundledData(audit: ReadAudit, checks: CheckTable): ReasonData {
    const load: ReasonLoad = { audit, checks, dir: absolutePath("govlab.context.reasoning") };
    const files = REASON_FILES;
    return {
        axes: recordsOf(load, "axis", files.axes, normalizeAxis),
        derivationLoop: refused(
            "loop",
            normalizeDerivationLoop,
        )(declaredObject(load, files.derivationLoop, ["loop", "stage"])),
        dimensions: recordsOf(load, "dimension", files.dimensions, normalizeDimension),
        edges: audit
            .records(readObject(load, files.edges)[RECORDS_KEY], files.edges)
            .map(refused("edge", normalizeEdge)),
        failureShapes: recordsOf(load, "failure-shape", files.failureShapes, normalizeFailureShape),
        invariants: recordsOf(load, "invariant", files.invariants, normalizeInvariant),
        layers: recordsOf(load, "layer", files.layers, normalizeLayer),
        lenses: recordsOf(load, "lens", files.lenses, normalizeLens),
        maps: normalizeMaps(readObject(load, files.maps)),
        mathDomains: recordsOf(load, "math-domain", files.mathDomains, normalizeMathDomain),
        mathTypes: recordsOf(load, "math-type", files.mathTypes, normalizeMathType),
        models: recordsOf(load, "model", files.models, normalizeModel),
        modes: recordsOf(load, "mode", files.modes, normalizeMode),
        nodes: recordsOf(load, "node", files.nodes, normalizeNode),
        patternTypes: recordsOf(load, "pattern-type", files.patternTypes, normalizePatternType),
        representations: recordsOf(load, "representation", files.representations, normalizeRepresentation),
        substrate: normalizeSubstrate(declaredObject(load, files.substrate, ["substrate-node"])),
        techniques: recordsOf(load, "technique", files.techniques, normalizeTechnique),
        testSurfaces: recordsOf(load, "test-surface", files.testSurfaces, normalizeTestSurface),
        universalAxes: recordsOf(load, "universal-axis", files.universalAxes, normalizeUniversalAxis),
    };
};
