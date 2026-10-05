import type {
    Axis,
    CycleRecursion,
    DerivationLoop,
    LoopStage,
    LoopTransition,
    MathType,
    ReasonEdge,
    ReasonLayer,
    ReasonNode,
    Substrate,
    SubstrateNode,
} from "#types/reason.node.types";
import type {
    Dimension,
    Lens,
    MathDomain,
    Mode,
    Model,
    PatternType,
    ReasonMaps,
    Representation,
    UniversalAxis,
} from "#types/reason.concept.types";
import { asString, asStringArray, optionalString, optionalStrings } from "#core/normalizers/field.normalizer";
import { REASON_SUBJECT } from "#configuration/constants/reason.constants";
import { isObject } from "#core/predicates/record.predicate";
import { refuseRecord } from "#core/validators/field.validator";
import { schemaOf } from "#core/selectors/reason.selector";

export const refused = function refused<T>(
    kind: string,
    normalize: (raw: Record<string, unknown>) => T,
): (raw: Record<string, unknown>) => T {
    return (raw) => {
        refuseRecord(REASON_SUBJECT, kind, schemaOf(kind), raw);
        return normalize(raw);
    };
};

export const aliased = function aliased<T extends { aliases?: string[] }>(
    kind: string,
    normalize: (raw: Record<string, unknown>) => T,
): (raw: Record<string, unknown>) => T {
    const checked = refused(kind, normalize);
    return (raw) => ({ ...checked(raw), ...optionalStrings(raw, "aliases") });
};

export const normalizeLayer = function normalizeLayer(raw: Record<string, unknown>): ReasonLayer {
    return { id: asString(raw["id"]), label: asString(raw["label"]), question: asString(raw["question"]) };
};

export const normalizeMathType = function normalizeMathType(raw: Record<string, unknown>): MathType {
    return {
        domains: asStringArray(raw["domains"]),
        id: asString(raw["id"]),
        predicateFamily: asString(raw["predicateFamily"]),
        question: asString(raw["question"]),
        yieldsShape: asString(raw["yieldsShape"]),
    };
};

export const normalizeAxis = function normalizeAxis(raw: Record<string, unknown>): Axis {
    return {
        id: asString(raw["id"]),
        layer: asString(raw["layer"]),
        mandatory: asString(raw["mandatory"]),
        primaryMathType: asString(raw["primaryMathType"]),
        question: asString(raw["question"]),
        selectable: raw["selectable"] === true,
    };
};

export const normalizeNode = function normalizeNode(raw: Record<string, unknown>): ReasonNode {
    return {
        axis: asString(raw["axis"]),
        id: asString(raw["id"]),
        mathType: asString(raw["mathType"]),
        name: asString(raw["name"]),
        ...optionalString(raw, "concept"),
        ...optionalString(raw, "question"),
        ...optionalString(raw, "answerShape"),
        ...optionalString(raw, "decisionTest"),
        ...optionalString(raw, "role"),
    };
};

const normalizeSubstrateNode = function normalizeSubstrateNode(raw: Record<string, unknown>): SubstrateNode {
    return {
        id: asString(raw["id"]),
        layer: asString(raw["layer"]),
        mathType: asString(raw["mathType"]),
        name: asString(raw["name"]),
    };
};

const normalizeRecursion = function normalizeRecursion(value: unknown): CycleRecursion {
    const raw = isObject(value) ? value : {};
    return { from: asString(raw["from"]), to: asString(raw["to"]) };
};

const normalizeStage = function normalizeStage(raw: Record<string, unknown>): LoopStage {
    return { axis: asString(raw["axis"]), id: asString(raw["id"]) };
};

const normalizeTransition = function normalizeTransition(raw: Record<string, unknown>): LoopTransition {
    return {
        from: asString(raw["from"]),
        kind: asString(raw["kind"]),
        to: asString(raw["to"]),
        ...optionalString(raw, "gate"),
        ...optionalString(raw, "onFail"),
        ...optionalString(raw, "onPass"),
    };
};

export const normalizeEdge = function normalizeEdge(raw: Record<string, unknown>): ReasonEdge {
    return { from: asString(raw["from"]), ...optionalString(raw, "to"), ...optionalString(raw, "label") };
};

export const normalizeDimension = function normalizeDimension(raw: Record<string, unknown>): Dimension {
    return {
        id: asString(raw["id"]),
        mathDomains: asStringArray(raw["mathDomains"]),
        mathNature: asString(raw["mathNature"]),
        question: asString(raw["question"]),
    };
};

export const normalizeLens = function normalizeLens(raw: Record<string, unknown>): Lens {
    return {
        id: asString(raw["id"]),
        mathDomains: asStringArray(raw["mathDomains"]),
        mathFields: asStringArray(raw["mathFields"]),
        nature: asString(raw["nature"]),
        question: asString(raw["question"]),
        universalAxis: asString(raw["universalAxis"]),
        ...optionalString(raw, "label"),
        ...optionalStrings(raw, "surfaces"),
        ...optionalStrings(raw, "detectedBy"),
    };
};

export const normalizeMode = function normalizeMode(raw: Record<string, unknown>): Mode {
    return { id: asString(raw["id"]), practice: asString(raw["practice"]), ...optionalString(raw, "question") };
};

export const normalizeRepresentation = function normalizeRepresentation(raw: Record<string, unknown>): Representation {
    return { expression: asString(raw["expression"]), id: asString(raw["id"]), ...optionalString(raw, "label") };
};

export const normalizeMathDomain = function normalizeMathDomain(raw: Record<string, unknown>): MathDomain {
    return { id: asString(raw["id"]), question: asString(raw["question"]), studies: asString(raw["studies"]) };
};

export const normalizePatternType = function normalizePatternType(raw: Record<string, unknown>): PatternType {
    return { id: asString(raw["id"]), viewpoint: asString(raw["viewpoint"]), ...optionalString(raw, "label") };
};

export const normalizeModel = function normalizeModel(raw: Record<string, unknown>): Model {
    const base: Model = {
        id: asString(raw["id"]),
        question: asString(raw["question"]),
        sequence: asStringArray(raw["sequence"]),
        stepKind: asString(raw["stepKind"]),
    };
    return isObject(raw["recursion"]) ? { ...base, recursion: normalizeRecursion(raw["recursion"]) } : base;
};

export const normalizeUniversalAxis = function normalizeUniversalAxis(raw: Record<string, unknown>): UniversalAxis {
    return { id: asString(raw["id"]), question: asString(raw["question"]), subsumes: asStringArray(raw["subsumes"]) };
};

export const normalizeSubstrate = function normalizeSubstrate(raw: Record<string, unknown>): Substrate {
    return {
        cycle: asStringArray(raw["cycle"]),
        nodes: (Array.isArray(raw["nodes"]) ? raw["nodes"] : [])
            .filter(isObject)
            .map(aliased("substrate-node", normalizeSubstrateNode)),
        recursion: normalizeRecursion(raw["recursion"]),
    };
};

export const normalizeDerivationLoop = function normalizeDerivationLoop(raw: Record<string, unknown>): DerivationLoop {
    return {
        id: asString(raw["id"]),
        stages: (Array.isArray(raw["stages"]) ? raw["stages"] : [])
            .filter(isObject)
            .map(refused("stage", normalizeStage)),
        transitions: (Array.isArray(raw["transitions"]) ? raw["transitions"] : [])
            .filter(isObject)
            .map(normalizeTransition),
    };
};

const stringListMap = function stringListMap(value: unknown): Record<string, string[]> {
    const raw = isObject(value) ? value : {};
    return Object.fromEntries(Object.keys(raw).map((key) => [key, asStringArray(raw[key])]));
};

export const normalizeMaps = function normalizeMaps(raw: Record<string, unknown>): ReasonMaps {
    const foundations = isObject(raw["foundations"]) ? raw["foundations"] : {};
    return {
        foundations: { layers: stringListMap(foundations["layers"]), sequence: asStringArray(foundations["sequence"]) },
        invariants: stringListMap(raw["invariants"]),
        patternOperations: asStringArray(raw["patternOperations"]),
    };
};
